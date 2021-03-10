import React from 'react';
import { render } from "react-dom";
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { authenticationService } from '../services';
import { userService } from '../services';
import { SelectField } from "./SelectField";
import DataTable from "react-data-table-component";
import { Button, Table } from 'react-bootstrap';
import uk from "date-fns/locale/uk";
registerLocale("uk", uk);



class WatchAdminAttendance extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            atttendances: [],
            firstSelectGroup: [],
            secondSelectGroup: [],
            thirdSelectGroup: [],
            fourthSelectGroup: [],
            secondSelectVisibility: false,
            thirdSelectVisibility: false,
            fourthSelectVisibility: false,
            error: '',
            result: '',
            fifthSelectGroup: [
                {
                    value: "1",
                    label: "Порахувати пропуски по обраному предмету"
                },
                {
                    value: "2",
                    label: "Порахувати пропуски по всім предметам"
                }],
        };
    }

    componentDidMount() {
        userService.GetAllFlows().then(firstSelectGroup => this.setState({ firstSelectGroup }));
    }

    onChangeFlow(selected, setFieldValue) {

        setFieldValue('firstSelect', selected.value)
        userService.GetFlowClassLetters(selected.value).then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
        this.setState({
            secondSelectVisibility: true,
            thirdSelectVisibility: false,
            fourthSelectVisibility: false,
        });    
    }
    onChangeClassLetter(selected, setFieldValue, values) {
        setFieldValue('secondSelect', selected.value)
        userService.GetAllPupilsForClass(values.firstSelect, selected.value).then(thirdSelectGroup => this.setState({ thirdSelectGroup })).catch(error => this.setState({ error }));
        this.setState({
            thirdSelectVisibility: true,
            fourthSelectVisibility: false,
        });
    }
    onChangeStudent(selected, setFieldValue, values) {
        setFieldValue('thirdSelect', selected.value)
        userService.GetAllSubjectsParent(selected.value).then(fourthSelectGroup => this.setState({ fourthSelectGroup })).catch(error => this.setState({ error }));
        this.setState({
            fourthSelectVisibility: true,
        });   
    }
    onChangeSubject(selected, setFieldValue, values) {
        setFieldValue('fourthSelect', selected.value)
        userService.GetAllAttendanceParent(selected.value, values.thirdSelect).then(atttendances => this.setState({ atttendances })).catch(error => this.setState({ error }));
    }

    onChangeStartDate(selected, setFieldValue, values) {
        if (selected.getTime() > values.dateOfEnd.getTime()) {
            selected = values.dateOfEnd;
        }
        setFieldValue('dateOfStart', selected)

    }
    onChangeEndDate(selected, setFieldValue, values) {
        if (selected.getTime() < values.dateOfStart.getTime()) {
            selected = values.dateOfStart;
        }
        setFieldValue('dateOfEnd', selected)

    }
    onChangeFifthSelect(selected, setFieldValue, values) {
        setFieldValue('fifthSelect', selected.value)
    }

    onSubmitAbsence(values) {
       
        if (values.fifthSelect === "1") {
            userService.GetAllAbsenceSubject(values.thirdSelect, values.fourthSelect, values.dateOfStart.toJSON(), values.dateOfEnd.toJSON()).then(result => this.setState({ result })).catch(error => this.setState({ error }));
        }
        else if (values.fifthSelect === "2") {
            userService.GetAllAbsence(values.thirdSelect, values.dateOfStart.toJSON(), values.dateOfEnd.toJSON()).then(result => this.setState({ result })).catch(error => this.setState({ error }));
        }
        else if (values.thirdSelect === "" || values.fourthSelect === "") {
            this.setState({
                error: "Будь ласка введіть дані",
            });
        }
    }



    render() {
        return (
            <Formik
                initialValues={{                 
                    firstSelect: '',
                    secondSelect: '',
                    thirdSelect: '',
                    fourthSelect: '',
                    dateOfStart: new Date(),
                    dateOfEnd: new Date(),
                    fifthSelect:'',
                }}
            >
                {({ errors, status, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form className="justify-content-md-center">
                    
                        <div class="container">
                            <h1>Відвідуванність</h1>
                            <hr />
                            <h3>Оберіть учня та предмет</h3>
                            <div class="row">
                                <div class="col">
                            <label htmlFor="firstSelect">Виберіть паралель</label>
                            <Select
                                placeholder="Оберіть паралель..."
                                name="firstSelect"
                                options={this.state.firstSelectGroup}
                                className={'basic-multi-select' + (errors.firstSelect && touched.firstSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectFlow => this.onChangeFlow(selectFlow, setFieldValue, values)} />
                            <ErrorMessage name="firstSelect" component="div" className="invalid-feedback" />
                                    </div>
                        {this.state.secondSelectVisibility === true &&
                                        <div class="col">
                            <label htmlFor="secondSelect">Виберіть клас</label>
                            <Select
                                placeholder="Оберіть клас..."
                                    name="secondSelect"
                                    options={this.state.secondSelectGroup}
                                    className={'basic-multi-select' + (errors.secondSelect && touched.secondSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                onChange={selectSubject => this.onChangeClassLetter(selectSubject, setFieldValue, values)} />
                                        <ErrorMessage name="secondSelect" component="div" className="invalid-feedback" />
                                    </div>
                                    }
                                </div>      <div class="row">
                        {this.state.thirdSelectVisibility === true &&
                                        <div class="col">
                            <label htmlFor="thirdSelect">Виберіть учня</label>
                            <Select
                                placeholder="Оберіть учня..."
                                name="thirdSelect"
                                options={this.state.thirdSelectGroup}
                                className={'basic-multi-select' + (errors.thirdSelect && touched.thirdSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                onChange={selectSubject => this.onChangeStudent(selectSubject, setFieldValue, values)} />
                            <ErrorMessage name="thirdSelect" component="div" className="invalid-feedback" />
                                </div>
                                }
                            </div>              <div class="row">
                        {this.state.fourthSelectVisibility === true &&
                                        <div class="col">
                            <label htmlFor="fourthSelect">Виберіть предмет</label>
                            <Select
                                placeholder="Оберіть предмет..."
                                name="fourthSelect"
                                options={this.state.fourthSelectGroup}
                                className={'basic-multi-select' + (errors.fourthSelect && touched.fourthSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectSubject => this.onChangeSubject(selectSubject, setFieldValue, values)} />
                            <ErrorMessage name="fourthSelect" component="div" className="invalid-feedback" />
                                </div>
                                } 
                                </div>


                                <h3 style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em" }}>Відвідуванність</h3>
                            <div> 
                            {this.state.atttendances &&
                                    <Table responsive bordered hover>
                                    <thead class="thead-dark">
                                        <th>Дата уроку</th>
                                        <th>Присутній(-ня)</th>
                                    </thead>
                                    <tbody>
                                        {this.state.atttendances.map(attendanceEntity =>
                                            <tr>
                                                <td key={attendanceEntity.idAttendance}><p> {new Date(attendanceEntity.dateOfLesson).toLocaleDateString()}</p></td>
                                                <td style={{ backgroundColor: attendanceEntity.backgroundColor }}><p><b> {attendanceEntity.attendanceCheck}</b></p></td>
                                            </tr>
                                        )}


                                    </tbody>
                                </Table>
                            }
                                </div> 

                            <h3>Розрахунок пропусків</h3>
                            <div class="row">
                                <div class="col-4">
                                <label htmlFor="dateOfStart">Дата початку</label>
                                <br />
                                <DatePicker
                                    selected={values.dateOfStart}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfStart && touched.dateOfStart ? ' is-invalid' : '')}
                                    name="dateOfStart"
                                    onChange={date => this.onChangeStartDate(date, setFieldValue, values)}
                                    locale="uk"
                                />
                            </div>

                                <div class="col-4 ml-auto">
                                    <label htmlFor="dateOfEnd">Кінцева дата</label>  
                                    <br/>
                                <DatePicker
                                    selected={values.dateOfEnd}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfEnd && touched.dateOfEnd ? ' is-invalid' : '')}
                                    name="dateOfEnd"
                                    onChange={date => this.onChangeEndDate(date, setFieldValue, values)}
                                    locale="uk"
                                />
                                </div>                                 
                            </div>
                          
                            <div class="row">
                                <div class="col">
                                <label htmlFor="fifthSelect">Виберіть опцію</label>
                                <Select
                                    placeholder="Оберіть опцію..."
                                    name="fifthSelect"
                                    options={this.state.fifthSelectGroup}
                                    className={'basic-multi-select' + (errors.fifthSelect && touched.fifthSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectSubject => this.onChangeFifthSelect(selectSubject, setFieldValue, values)} />
                                <ErrorMessage name="fifthSelect" component="div" className="invalid-feedback" />
                                </div> </div>
                            <div class="row" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em" }} className="justify-content-md-center">
                                <div class="col">
                                    <Button variant="secondary" block onClick={selectValue => this.onSubmitAbsence(values)}> Розрахунок пропусків </Button>
                                    <div class="row"> <h3 style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>{this.state.result}</h3></div>      </div>
                                </div>
                          

                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                            }
                            </div>
                    </Form>
                )}
            </Formik>
        )
    }
}

export { WatchAdminAttendance }; 