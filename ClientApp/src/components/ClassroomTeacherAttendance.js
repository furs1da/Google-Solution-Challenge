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

class WatchClassroomTeacherAttendance extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            zeroSelectGroup: [],
            zeroSelectGroupVisibility: false,
            firstSelectGroup: [],
            secondSelectGroup: [
                {
                    value: "1",
                    label: "Порахувати пропуски по обраному предмету"
                },
                {
                    value: "2",
                    label: "Порахувати пропуски по всім предметам"
                }],
            result: '',
            pageAccess: false,
            error: '',
            atttendances: [],
        }
    }

    componentDidMount() {
        userService.CheckTeacherForClassroomTeacher().then(pageAccess => this.setState({ pageAccess }));
        userService.GetStudentsClassroomTeacher().then(firstSelectGroup => this.setState({ firstSelectGroup }));
    }

    onChangeChild(selected, setFieldValue, values) {

        setFieldValue('firstSelect', selected.value)
        this.setState({
            zeroSelectGroupVisibility: true,
        });
        userService.GetAllSubjectsParent(selected.value).then(zeroSelectGroup => this.setState({ zeroSelectGroup })).catch(error => this.setState({ error }));
    }


    onChangeSubject(selected, setFieldValue, values) {
        setFieldValue('zeroSelect', selected.value)
        userService.GetAllAttendanceParent(selected.value, values.firstSelect).then(atttendances => this.setState({ atttendances })).catch(error => this.setState({ error }));
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

    onChangeSecondSelect(selected, setFieldValue, values) {
        setFieldValue('secondSelect', selected.value)
    }

    onSubmitAbsence(values) {
        if (values.secondSelect === "1") {
            userService.GetAllAbsenceSubject(values.firstSelect, values.zeroSelect, values.dateOfStart.toJSON(), values.dateOfEnd.toJSON()).then(result => this.setState({ result })).catch(error => this.setState({ error }));
            }
        else if (values.secondSelect === "2") {
            userService.GetAllAbsence(values.firstSelect, values.dateOfStart.toJSON(), values.dateOfEnd.toJSON()).then(result => this.setState({ result })).catch(error => this.setState({ error }));              
            }
    }


    render() {
        return (
            <Formik
                initialValues={{
                    zeroSelect: '',
                    firstSelect: '',
                    secondSelect: '', 
                    dateOfStart: new Date(),
                    dateOfEnd: new Date(),
                }}
            >
                {({ errors, status, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        {this.state.pageAccess === false &&
                            <h1>Ви не є класним керівником</h1>
                        }

                        {this.state.pageAccess === true &&
                            <div class="container">
                            <h1>Відвідуванність</h1>
                            <hr />
                            <h3>Оберіть учня та предмет</h3>
                            <div className="form-group col">
                                <label htmlFor="firstSelect">Виберіть одного з ваших дітей</label>
                                <Select
                                    placeholder="Оберіть дитину..."
                                    name="firstSelect"
                                    options={this.state.firstSelectGroup}
                                    className={'basic-multi-select' + (errors.firstSelect && touched.firstSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectSubject => this.onChangeChild(selectSubject, setFieldValue, values)} />
                                <ErrorMessage name="firstSelect" component="div" className="invalid-feedback" />
                            </div>
                        
                        {this.state.zeroSelectGroupVisibility === true &&
                            <div className="form-group col">
                                <label htmlFor="zeroSelect">Виберіть предмет</label>
                                <Select
                                    placeholder="Оберіть предмет..."
                                    name="zeroSelect"
                                    options={this.state.zeroSelectGroup}
                                    className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectSubject => this.onChangeSubject(selectSubject, setFieldValue, values)} />
                                <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                            </div>
                        }
                    
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
                                                    <td style={{ backgroundColor: attendanceEntity.backgroundColor }}><p > {attendanceEntity.attendanceCheck}</p></td>
                                                </tr>
                                            )}


                                        </tbody>
                                </Table>
                                }
                            </div>
                       
                      
                            <div>
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
                                    <br />
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
                                    <label htmlFor="secondSelect">Виберіть опцію</label>
                                    <Select
                                        placeholder="Оберіть опцію..."
                                        name="secondSelect"
                                        options={this.state.secondSelectGroup}
                                        className={'basic-multi-select' + (errors.secondSelect && touched.secondSelect ? ' is-invalid' : '')}
                                        classNamePrefix="select"
                                        onChange={selectSubject => this.onChangeSecondSelect(selectSubject, setFieldValue, values)} />
                                    <ErrorMessage name="secondSelect" component="div" className="invalid-feedback" />
                                    </div></div>
                                <div class="row" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em" }} className="justify-content-md-center">
                                    <div class="col">
                                <Button variant="outline-primary" onClick={selectValue => this.onSubmitAbsence(values)}> Розрахунок пропусків </Button>
                                        <div class="row"> <h3 style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>{this.state.result}</h3></div>      </div>
                                </div>
                            </div>
                            </div>
                        }
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                        }
                    </Form>
                )}
            </Formik>
        )
    }
}

export { WatchClassroomTeacherAttendance }; 