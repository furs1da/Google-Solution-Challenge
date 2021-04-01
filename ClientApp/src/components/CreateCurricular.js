import React from 'react';
import { Formik, Field, Form, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
import DataTable from "react-data-table-component";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Button, Icon, Popup } from "semantic-ui-react";
/* eslint-disable */


class CreateCurricular extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            subjects: [],
            teachers: [],
            flow: '',
            letter: '',
            error:'',
            flows: [],
            classLetters: [],
            mondayTable: [{
                id: 1,
                lessonOrder: "No data",
                subject: "No data",
                teacher: "No data",
                day: 1,
            }],
            tuesdayTable: [{
                id: 1,
                lessonOrder: "No data",
                subject: "No data",
                teacher: "No data",
                day: 2,
            }],
            wednesdayTable: [{
                id: 1,
                lessonOrder: "No data",
                subject: "No data",
                teacher: "No data",
                day: 3,
            }],
            thursdayTable: [{
                id: 1,
                lessonOrder: "No data",
                subject: "No data",
                teacher: "No data",
                day: 4,
            }],
            fridayTable: [{
                id: 1,
                lessonOrder: "No data",
                subject: "No data",
                teacher: "No data",
                day: 5,
            }],
            saturdayTable: [{
                id: 1,
                lessonOrder: "No data",
                subject: "No data",
                teacher: "No data",
                day: 6,
            }]
        };
    }
    columns = [
        {
            name: "Lesson Sequencing",
            selector: "lessonOrder",
            sortable: true
        },
        {
            name: "Subject",
            selector: "subject",
            sortable: false
        },
        {
            name: "Teacher",
            selector: "teacher",
            sortable: false
        },
        {
            name: "Day of the week",
            selector: "day",
            omit: true
        },
        {
            name: "Delete the lesson",
            cell: row => <Button type="button" basic color='red' onClick={selectValue => this.DeleteRecord(row.day, row.lessonOrder)}>
                <Button.Content visible> <Icon name='trash' /></Button.Content>
            </Button>,
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        }
    ];
    componentDidMount() {
        userService.GetAllFlows().then(flows => this.setState({ flows }));
        userService.GetAllSubjects().then(subjects => this.setState({ subjects }));

    }



    DeleteRecord(idDay, order) {
        confirmAlert({
            title: "Confirm the action",
            message: "Are you sure you want to delete this lesson?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => { this.DeleteRecordConfirmed(idDay, order) }
                },
                {
                    label: "No"
                }
            ]
        });
    };

    DeleteRecordConfirmed(idDay, order) {

        userService.DeleteRecordLessonAdmin(idDay, order, this.state.flow, this.state.letter).then(response => {
            console.log(response),
                userService.GetDayCurricular(1, this.state.flow, this.state.letter).then(mondayTable => this.setState({ mondayTable: mondayTable })),
                userService.GetDayCurricular(2, this.state.flow, this.state.letter).then(tuesdayTable => this.setState({ tuesdayTable })),
                userService.GetDayCurricular(3, this.state.flow, this.state.letter).then(wednesdayTable => this.setState({ wednesdayTable })),
                userService.GetDayCurricular(4, this.state.flow, this.state.letter).then(thursdayTable => this.setState({ thursdayTable })),
                userService.GetDayCurricular(5, this.state.flow, this.state.letter).then(fridayTable => this.setState({ fridayTable })),
                userService.GetDayCurricular(6, this.state.flow, this.state.letter).then(saturdayTable => this.setState({ saturdayTable: saturdayTable }))
        }).catch(error => this.setState({ error }));         
    }

    onChangeFlow(selected, setFieldValue) {
        this.setState({
            flow: selected.value,
            letter: ''
        })
        setFieldValue('flow', selected.value)
        setFieldValue('letter', null)
        userService.GetFlowClassLetters(selected.value).then(classLetters => this.setState({ classLetters })).catch(error => this.setState({ error }));
    }

    onChangeClassLetter(selected, setFieldValue, flowId) {
        this.setState({
            letter: selected.value
        })
        setFieldValue('letter', selected.value)
        userService.GetDayCurricular(1, flowId, selected.value).then(mondayTable => this.setState({ mondayTable }));
        userService.GetDayCurricular(2, flowId, selected.value).then(tuesdayTable => this.setState({ tuesdayTable }));
        userService.GetDayCurricular(3, flowId, selected.value).then(wednesdayTable => this.setState({ wednesdayTable }));
        userService.GetDayCurricular(4, flowId, selected.value).then(thursdayTable => this.setState({ thursdayTable }));
        userService.GetDayCurricular(5, flowId, selected.value).then(fridayTable => this.setState({ fridayTable }));
        userService.GetDayCurricular(6, flowId, selected.value).then(saturdayTable => this.setState({ saturdayTable }));
    }

    SubmitLesson(values) {
        userService.CreateLesson(values.flow, values.letter, values.dayId, values.subjectId, values.teacherId, values.lessonOrder).then(response => {
            console.log(response),
            userService.GetDayCurricular(1, values.flow, values.letter).then(mondayTable => this.setState({ mondayTable: mondayTable })),
            userService.GetDayCurricular(2, values.flow, values.letter).then(tuesdayTable => this.setState({ tuesdayTable })),
            userService.GetDayCurricular(3, values.flow, values.letter).then(wednesdayTable => this.setState({ wednesdayTable })),
            userService.GetDayCurricular(4, values.flow, values.letter).then(thursdayTable => this.setState({ thursdayTable })),
            userService.GetDayCurricular(5, values.flow, values.letter).then(fridayTable => this.setState({ fridayTable })),
                userService.GetDayCurricular(6, values.flow, values.letter).then(saturdayTable => this.setState({ saturdayTable: saturdayTable }))
        }).catch(error => this.setState({ error }));      
    }
   

    onChangeSubject(selected, setFieldValue) {
        setFieldValue('subjectId', selected.value)
        userService.GetSubjectTeachers(selected.value).then(teachers => this.setState({ teachers })).catch(error => this.setState({ error }));
    }

    render() {
        return (
            <Formik
                initialValues={{
                    flow: this.state.flow,
                    letter: this.state.letter,
                    dayId: '1',
                    subjectId: '',
                    teacherId: '',
                    lessonOrder: '1',        
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    flow: Yup.string()
                        .required('Please select the grade.'),
                    letter: Yup.string()
                        .required('Please select the letter of the class.'),
                    dayId: Yup.string()
                        .required('Please select the day of the week.'),
                    subjectId: Yup.string()
                        .required('Please select the subject.'),
                    teacherId: Yup.string()
                        .required('Please select the teacher.'),
                    lessonOrder: Yup.string()
                        .required('Please select order of the lesson.')

                })}
            >
                {({ errors, status, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Change timetable</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="flow">Select the grade</label>
                            <Select
                                placeholder="Select the grade"
                                name="flow"
                                options={this.state.flows}
                                className={'basic-multi-select' + (errors.flow && touched.flow ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectFlow => this.onChangeFlow(selectFlow, setFieldValue)} />
                            <ErrorMessage name="flow" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="letter">Select the letter of class</label>
                            <Select
                                placeholder="Select the letter of class"
                                name="letter"
                                options={this.state.classLetters}
                                className={'basic-multi-select' + (errors.letter && touched.letter ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectLetter => this.onChangeClassLetter(selectLetter, setFieldValue, values.flow)} />
                            <ErrorMessage name="letter" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group row">
                        <div className="form-group col">
                            <DataTable
                                title="Monday"
                                columns={this.columns}
                                data={this.state.mondayTable}
                                defaultSortField="lessonOrder"
                            />
                        </div>

                        <div className="form-group col">
                            <DataTable
                                title="Tuesday"
                                columns={this.columns}
                                data={this.state.tuesdayTable}
                                defaultSortField="lessonOrder"
                            />
                        </div>
                            </div><div className="form-group row">
                        <div className="form-group col">
                            <DataTable
                                title="Wednesday"
                                columns={this.columns}
                                data={this.state.wednesdayTable}
                                defaultSortField="lessonOrder"
                            />
                        </div>
                      
                        <div className="form-group col">
                            <DataTable
                                title="Thursday"
                                columns={this.columns}
                                data={this.state.thursdayTable}
                                defaultSortField="lessonOrder"
                            />
                            </div>
                        </div>
                        <div className="form-group row">
                        <div className="form-group col">
                            <DataTable
                                title="Friday"
                                columns={this.columns}
                                data={this.state.fridayTable}
                                defaultSortField="lessonOrder"
                            />
                        </div>

                        <div className="form-group col">
                            <DataTable
                                title="Saturday"
                                columns={this.columns}
                                data={this.state.saturdayTable}
                                defaultSortField="lessonOrder"
                            />
                        </div>
                            </div>



                        <div className="form-group row">
                            <label htmlFor="dayId">Day of the Week</label>
                            <Field name="dayId" as="select" className={'form-control' + (errors.dayId && touched.dayId ? ' is-invalid' : '')}>
                                <option value={1}>Monday</option>
                                <option value={2}>Tuesday</option>
                                <option value={3}>Wednesday</option>
                                <option value={4}>Thursday</option>
                                <option value={5}>Friday</option>
                                <option value={6}>Saturday</option>
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />


                            <div className="form-group col-lg-3 col-sm-3 col-md-3">
                                <label htmlFor="subjectId">Select the subject</label>
                                <Select
                                    placeholder="Select the subject"
                                    menuPlacement="top"
                                    name="subjectId"
                                    options={this.state.subjects}
                                    className={'basic-multi-select' + (errors.subjectId && touched.subjectId ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectLessons => this.onChangeSubject(selectLessons, setFieldValue)} />
                                <ErrorMessage name="subjectId" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-lg-5 col-sm-3 col-md-3">
                                <label htmlFor="teacherId">Select the teacher</label>
                                <Select
                                    placeholder="Select the teacher"
                                    menuPlacement="top"
                                    name="teacherId"
                                    options={this.state.teachers}
                                    className={'basic-multi-select' + (errors.teacherId && touched.teacherId ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectTeacher => setFieldValue('teacherId', selectTeacher.value)}   />
                                <ErrorMessage name="teacherId" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-lg-3 col-sm-3 col-md-3">
                                <label htmlFor="lessonOrder">Enter the lesson's order</label>
                                <Field name="lessonOrder" as="select" className={'form-control' + (errors.lessonOrder && touched.lessonOrder ? ' is-invalid' : '')}>
                                    <option value={1}>1</option>
                                    <option value={2}>2</option>
                                    <option value={3}>3</option>
                                    <option value={4}>4</option>
                                    <option value={5}>5</option>
                                    <option value={6}>6</option>
                                    <option value={7}>7</option>
                                    <option value={8}>8</option>
                                </Field>
                                <ErrorMessage name="lessonOrder" component="div" className="invalid-feedback" />
                            </div>
                        </div>

                        <div className="form-group col">
                            <button type="button" className="btn btn-primary mr-2" onClick={selectValue => this.SubmitLesson(values)}>Add the lesson to your timetable</button>
                            <button type="reset" className="btn btn-secondary">Reset data</button>
                        </div>
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                        }
                    </Form>
                )}
            </Formik>
        )
    }
}

export { CreateCurricular }; 