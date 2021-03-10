import React from 'react';
import { render } from "react-dom";
import { Formik, Field, Form, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { authenticationService } from '../services';
import { userService } from '../services';
import { SelectField } from "./SelectField";
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
                lessonOrder: "Немає інформації",
                subject: "Немає інформації",
                teacher: "Немає інформації",
                day: 1,
            }],
            tuesdayTable: [{
                id: 1,
                lessonOrder: "Немає інформації",
                subject: "Немає інформації",
                teacher: "Немає інформації",
                day: 2,
            }],
            wednesdayTable: [{
                id: 1,
                lessonOrder: "Немає інформації",
                subject: "Немає інформації",
                teacher: "Немає інформації",
                day: 3,
            }],
            thursdayTable: [{
                id: 1,
                lessonOrder: "Немає інформації",
                subject: "Немає інформації",
                teacher: "Немає інформації",
                day: 4,
            }],
            fridayTable: [{
                id: 1,
                lessonOrder: "Немає інформації",
                subject: "Немає інформації",
                teacher: "Немає інформації",
                day: 5,
            }],
            saturdayTable: [{
                id: 1,
                lessonOrder: "Немає інформації",
                subject: "Немає інформації",
                teacher: "Немає інформації",
                day: 6,
            }]
        };
    }
    columns = [
        {
            name: "Номер уроку",
            selector: "lessonOrder",
            sortable: true
        },
        {
            name: "Предмет",
            selector: "subject",
            sortable: false
        },
        {
            name: "Вчитель",
            selector: "teacher",
            sortable: false
        },
        {
            name: "День тижня",
            selector: "day",
            omit: true
        },
        {
            name: "Видалити урок",
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
            title: "Підтвердіть дію",
            message: "Ви впевнені, що хочете видалити цей урок?",
            buttons: [
                {
                    label: "Так",
                    onClick: () => { this.DeleteRecordConfirmed(idDay, order) }
                },
                {
                    label: "Ні"
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
                        .required('Оберіть будь ласка паралель'),
                    letter: Yup.string()
                        .required('Оберіть будь ласка букву класу'),
                    dayId: Yup.string()
                        .required('Оберіть будь ласка день тижня'),
                    subjectId: Yup.string()
                        .required('Оберіть будь ласка предмет'),
                    teacherId: Yup.string()
                        .required('Оберіть будь ласка вчителя'),
                    lessonOrder: Yup.string()
                        .required('Оберіть будь ласка номер уроку')

                })}
            >
                {({ errors, status, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Змінити розклад</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="flow">Оберіть паралель</label>
                            <Select
                                placeholder="Оберіть паралель"
                                name="flow"
                                options={this.state.flows}
                                className={'basic-multi-select' + (errors.flow && touched.flow ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectFlow => this.onChangeFlow(selectFlow, setFieldValue)} />
                            <ErrorMessage name="flow" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="letter">Оберіть букву класу</label>
                            <Select
                                placeholder="Оберіть букву класу"
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
                                title="Понеділок"
                                columns={this.columns}
                                data={this.state.mondayTable}
                                defaultSortField="lessonOrder"
                            />
                        </div>

                        <div className="form-group col">
                            <DataTable
                                title="Вівторок"
                                columns={this.columns}
                                data={this.state.tuesdayTable}
                                defaultSortField="lessonOrder"
                            />
                        </div>
                            </div><div className="form-group row">
                        <div className="form-group col">
                            <DataTable
                                title="Середа"
                                columns={this.columns}
                                data={this.state.wednesdayTable}
                                defaultSortField="lessonOrder"
                            />
                        </div>
                      
                        <div className="form-group col">
                            <DataTable
                                title="Четверг"
                                columns={this.columns}
                                data={this.state.thursdayTable}
                                defaultSortField="lessonOrder"
                  
                            />
                            </div>
                        </div>
                        <div className="form-group row">
                        <div className="form-group col">
                            <DataTable
                                title="П'ятница"
                                columns={this.columns}
                                data={this.state.fridayTable}
                                defaultSortField="lessonOrder"
                            />
                        </div>

                        <div className="form-group col">
                            <DataTable
                                title="Субота"
                                columns={this.columns}
                                data={this.state.saturdayTable}
                                defaultSortField="lessonOrder"
                            />
                        </div>
                            </div>



                        <div className="form-group row">
                            <label htmlFor="dayId">День тижня</label>
                            <Field name="dayId" as="select" className={'form-control' + (errors.dayId && touched.dayId ? ' is-invalid' : '')}>
                                <option value={1}>Понеділок</option>
                                <option value={2}>Вівторок</option>
                                <option value={3}>Середа</option>
                                <option value={4}>Четверг</option>
                                <option value={5}>П'ятница</option>
                                <option value={6}>Субота</option>
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />


                            <div className="form-group col-lg-3 col-sm-3 col-md-3">
                                <label htmlFor="subjectId">Оберіть предмет</label>
                                <Select
                                    placeholder="Оберіть предмет"
                                    menuPlacement="top"
                                    name="subjectId"
                                    options={this.state.subjects}
                                    className={'basic-multi-select' + (errors.subjectId && touched.subjectId ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectLessons => this.onChangeSubject(selectLessons, setFieldValue)} />
                                <ErrorMessage name="subjectId" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-lg-5 col-sm-3 col-md-3">
                                <label htmlFor="teacherId">Оберіть вчителя</label>
                                <Select
                                    placeholder="Оберіть вчителя"
                                    menuPlacement="top"
                                    name="teacherId"
                                    options={this.state.teachers}
                                    className={'basic-multi-select' + (errors.teacherId && touched.teacherId ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectTeacher => setFieldValue('teacherId', selectTeacher.value)}   />
                                <ErrorMessage name="teacherId" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-lg-3 col-sm-3 col-md-3">
                                <label htmlFor="lessonOrder">Вкажіть номер уроку</label>
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
                            <button type="button" className="btn btn-primary mr-2" onClick={selectValue => this.SubmitLesson(values)}>Додати урок до розкладу</button>
                            <button type="reset" className="btn btn-secondary">Скинути дані</button>
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