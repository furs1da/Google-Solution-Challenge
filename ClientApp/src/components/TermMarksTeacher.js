import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
import { Button, Table } from 'react-bootstrap';

class ThematicalGrades extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            secondSelectGroup: [],
            firstSelectGroup: [],
            zeroSelectGroup: [],
            receiver: 'Select grade',
            secondSelectText: 'Select class',
            secondSelectVisibility: false,
            datepickerVisibility: false,
            firstSelectDisable: true,
            secondSelectDisable: true,
            pupils: [],
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllSubjectForTeacher().then(zeroSelectGroup => this.setState({ zeroSelectGroup }));
    }

    onChangeSubject(selected, setFieldValue) {
        setFieldValue('zeroSelect', selected.value)
        setFieldValue('firstSelect', '')
        setFieldValue('secondSelect', '')

        userService.GetAllFlowsBySubjectAndTeacher(selected.value).then(firstSelectGroup => this.setState({ firstSelectGroup })).catch(error => this.setState({ error }));
        this.setState({
            firstSelectDisable: false,
            datepickerVisibility: false,
        });
    }



    onChangeFlow(selected, setFieldValue) {
        setFieldValue('firstSelect', selected.value)
        setFieldValue('secondSelect', '')

        userService.GetFlowClassLettersTeacher(selected.value).then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
        this.setState({
            secondSelectGroup: false,
            secondSelectText: 'Select class',
            secondSelectDisable: false,
            secondSelectVisibility: true,
            datepickerVisibility: false,
            pupils: [],
        });
    }


    onChangeSecondSelect(selected, setFieldValue, values) {
        setFieldValue('secondSelect', selected.value)
        this.setState({
            secondSelectText: values.firstSelect + '-' + selected.label,
            datepickerVisibility: true,
        });       
    }



    onChangeStartDate(selected, setFieldValue, values) {
        if (selected.getTime() > values.dateOfEnd.getTime())
        {
            selected = values.dateOfEnd;
        }
        setFieldValue('dateOfStart', selected)
       
    }


    onChangeEndDate(selected, setFieldValue, values) {    
        console.log(selected.toJSON());
        console.log(values.dateOfStart.toJSON());
        if (selected.getTime() < values.dateOfStart.getTime()) {
            selected = values.dateOfStart;
        }
        setFieldValue('dateOfEnd', selected)
       
    }


    onSubmitDate(values) {    
        userService.GetAllPupilsForThematicalGrade(values.dateOfStart.toJSON(), values.dateOfEnd.toJSON(), values.zeroSelect, values.firstSelect, values.secondSelect).then(pupils => this.setState({ pupils })).catch(error => this.setState({ error }));
    }


    onChangeGrade(selected, setFieldValue, index) {
        setFieldValue('grade', selected.target.value)


        const elementsIndex = this.state.pupils.findIndex(element => element.idStudent == index)
        let newArray = [...this.state.pupils]



        if (selected.target.value === '') {
            newArray[elementsIndex] = { ...newArray[elementsIndex], grade: -1 }
        }
        else if (selected.target.value > 100)
            selected.target.value = 100;

        else if (selected.target.value < 1)
            selected.target.value = 1;

        else {
            newArray[elementsIndex] = { ...newArray[elementsIndex], grade: selected.target.value }
        }
        this.setState({
            pupils: newArray,
        });
    }
 





    render() {
        return (
            <Formik
                initialValues={{
                    zeroSelect: '',
                    firstSelect: '',
                    secondSelect: '',                   
                    grade: '',
                    dateOfStart: new Date(),
                    dateOfEnd: new Date(),
                }}
                validationSchema={Yup.object().shape({
                    zeroSelect: Yup.string()
                        .required('Select subject'),
                    firstSelect: Yup.string()
                        .required('Select grade'),
                    secondSelect: Yup.string()
                        .required('Select class'),
                    dateOfStart: Yup.date()
                        .required('Select the start of the theme'),
                    dateOfEnd: Yup.date()
                        .required('Select the end of the theme'),
                })}
                onSubmit={({ zeroSelect, firstSelect, secondSelect, dateOfStart, dateOfEnd }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.CreateThematical(zeroSelect, firstSelect, secondSelect, dateOfStart.toJSON(), dateOfEnd.toJSON(), this.state.pupils)
                        .then(
                            user => {
                                this.props.history.push({
                                    pathname: '/',
                                });
                            },
                            error => {
                                setSubmitting(false);
                                setStatus(error);
                            }
                        );
                }}
            >
                {({ errors, status, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Give thematic marks</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="zeroSelect">Select subject</label>
                            <Select
                                placeholder="Select subject..."
                                name="zeroSelect"
                                options={this.state.zeroSelectGroup}
                                className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectAnnouncement => this.onChangeSubject(selectAnnouncement, setFieldValue)} />
                            <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="firstSelect">Select grade</label>
                            <Select
                                placeholder="Select grade..."
                                name="firstSelect"
                                options={this.state.firstSelectGroup}
                                className={'basic-multi-select' + (errors.firstSelect && touched.firstSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectRole => this.onChangeFlow(selectRole, setFieldValue)}
                                isDisabled={this.state.firstSelectDisable} />
                            <ErrorMessage name="firstSelect" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="secondSelect">{this.state.secondSelectText}</label>
                            <Select
                                placeholder="Select..."
                                name="secondSelect"
                                options={this.state.secondSelectGroup}
                                className={'basic-multi-select' + (errors.secondSelect && touched.secondSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectValue => this.onChangeSecondSelect(selectValue, setFieldValue, values)}
                                isDisabled={this.state.secondSelectDisable}
                            />
                            <ErrorMessage name="secondSelect" component="div" className="invalid-feedback" />
                        </div>
                        <h1>{this.state.secondSelectText} class</h1>

                        {this.state.datepickerVisibility === true &&
                            <div class="row">
                            <div className="form-group col">
                                <label htmlFor="dateOfStart">The start of the theme</label>
                                <br />
                            <DatePicker
                 
                                    selected={values.dateOfStart}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfStart && touched.dateOfStart ? ' is-invalid' : '')}
                                    name="dateOfStart"
                                    onChange={date => this.onChangeStartDate(date, setFieldValue, values)}
                                />
                            </div>
                       
                            <div className="form-group col">
                                <label htmlFor="dateOfEnd">The end of the theme</label>
                                <br />
                            <DatePicker
                     
                                    selected={values.dateOfEnd}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfEnd && touched.dateOfEnd ? ' is-invalid' : '')}
                                    name="dateOfEnd"
                                    onChange={date => this.onChangeEndDate(date, setFieldValue, values)}
                                />
                            </div>
                            </div>
                        }
                        {this.state.datepickerVisibility === true &&
                            <Button variant="outline-secondary" onClick={selectValue => this.onSubmitDate(values)} style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}> Show grades received in the selected period </Button>
                        }
                        <div>
                            {this.state.pupils &&
                                <Table responsive bordered hover>
                                <thead class="thead-dark">
                                        <th>Full Name</th>
                                        <th>Thematic mark</th>
                                        <th>Marks for the selected period of time</th>               
                                    </thead>
                                    <tbody>
                                        {this.state.pupils.map(pupil =>
                                            <tr>
                                                <td key={pupil.idPupil}><p> {pupil.fio}</p> </td>
                                                <td> <Field name="gradeStudent" type="number" max="100" min="0" onChange={selectValue => this.onChangeGrade(selectValue, setFieldValue, pupil.idStudent)} style={{ width: 100 + "%", lineHeight: 2.0 + "em", fontSize: 1.5 + "em" }}/> </td>                                               
                                                <td> {pupil.gradesPeriod}</td>
                                            </tr>
                                        )}

                                    </tbody>
                            </Table>
                            }
                        </div>


                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Give thematic marks</button>
                            <button type="reset" className="btn btn-secondary">Reset data</button>
                        </div>
                        {status &&
                            <div className={'alert alert-danger'}>{status}</div>
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

export { ThematicalGrades }; 