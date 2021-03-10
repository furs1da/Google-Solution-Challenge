import React from 'react';
import { render } from "react-dom";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { authenticationService } from '../services';
import { userService } from '../services';
import { SelectField } from "./SelectField";

class CreateClass extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            classLetters: [],
            availableTeachers: [],
            flows: []
        };
    }

    componentDidMount() {
        userService.GetAllClassroomTeachers().then(availableTeachers => this.setState({ availableTeachers }));
        userService.GetAllClassLetters().then(classLetters => this.setState({ classLetters }));
        userService.GetAllFlows().then(flows => this.setState({ flows }));
    }

    render() {
        return (
            <Formik
                initialValues={{
                    flow: '',
                    letter: '1',
                    idClassroomTeacher: '',
                    accessCode: ''                 
                }}

                validationSchema={Yup.object().shape({
                    flow: Yup.string()
                        .required('Оберіть будь ласка паралель'),
                    letter: Yup.string()
                        .required('Оберіть будь ласка букву класу'),
                    idClassroomTeacher: Yup.string()
                        .required('Оберіть будь ласка класного керівника'),
                    accessCode: Yup.string()
                        .required('Введіть будь ласка код доступу')
                   
                })}
                onSubmit={({ flow, letter, idClassroomTeacher, accessCode}, { setStatus, setSubmitting }) => {
                    setStatus();                 
                    userService.CreateClass(flow, letter, idClassroomTeacher, accessCode)
                        .then(
                            user => {
                                const { from } = this.props.location.state || { from: { pathname: "/" } };
                                this.props.history.push({
                                    pathname: '/listOfClasses',
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
                        <h1>Створити клас</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="flow">Паралель</label>
                            <Select
                                placeholder="Оберіть паралель..."
                                name="flow"
                                options={this.state.flows}
                                className={'basic-select' + (errors.flow && touched.flow ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectLessons => setFieldValue('flow', selectLessons.value)} />                        
                            <ErrorMessage name="flow" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group col">
                            <label htmlFor="letter">Буква класу</label>
                            <Field name="letter" as="select" className={'form-control' + (errors.letter && touched.letter ? ' is-invalid' : '')}>
                                {this.state.classLetters.map((letterSelected, i) => (
                                    <option key={letterSelected.idLetter} value={letterSelected.idLetter}>{letterSelected.classLetter}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group col">
                            <label htmlFor="idClassroomTeacher">Класний керівник</label>
                            <Field name="idClassroomTeacher" as="select" className={'form-control' + (errors.idClassroomTeacher && touched.idClassroomTeacher ? ' is-invalid' : '')}>
                                {this.state.availableTeachers.map((teacher, i) => (
                                    <option key={teacher.idTeacher} value={teacher.idTeacher}>{teacher.name + ' ' + teacher.patronymic + ' ' + teacher.surname}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>                     
                        <div className="form-group col">
  
                                <label htmlFor="accessCode">Код доступу</label>
                                <Field name="accessCode" type="text" className={'form-control' + (errors.accessCode && touched.accessCode ? ' is-invalid' : '')} />
                                <ErrorMessage name="accessCode" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group col">
                            <button type="submit" className="btn btn-primary mr-2">Додати клас у систему</button>
                            <button type="reset" className="btn btn-secondary">Скинути дані</button>
                        </div>
                        {status &&
                            <div className={'alert alert-danger'}>{status}</div>
                        }
                    </Form>
                )}
            </Formik>
        )
    }
}

export { CreateClass }; 