import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';


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
                        .required('Please select the grade.'),
                    letter: Yup.string()
                        .required('Please select letter of the class.'),
                    idClassroomTeacher: Yup.string()
                        .required('Please select a classroom teacher.'),
                    accessCode: Yup.string()
                        .required("Please enter admin's code.")
                   
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
                            <label htmlFor="flow">Grade</label>
                            <Select
                                placeholder="Select grade..."
                                name="flow"
                                options={this.state.flows}
                                className={'basic-select' + (errors.flow && touched.flow ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectLessons => setFieldValue('flow', selectLessons.value)} />                        
                            <ErrorMessage name="flow" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group col">
                            <label htmlFor="letter">Letter of the grade</label>
                            <Field name="letter" as="select" className={'form-control' + (errors.letter && touched.letter ? ' is-invalid' : '')}>
                                {this.state.classLetters.map((letterSelected, i) => (
                                    <option key={letterSelected.idLetter} value={letterSelected.idLetter}>{letterSelected.classLetter}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group col">
                            <label htmlFor="idClassroomTeacher">Classroom teacher</label>
                            <Field name="idClassroomTeacher" as="select" className={'form-control' + (errors.idClassroomTeacher && touched.idClassroomTeacher ? ' is-invalid' : '')}>
                                {this.state.availableTeachers.map((teacher, i) => (
                                    <option key={teacher.idTeacher} value={teacher.idTeacher}>{teacher.name + ' ' + teacher.patronymic + ' ' + teacher.surname}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>                     
                        <div className="form-group col">
  
                                <label htmlFor="accessCode">Class code</label>
                                <Field name="accessCode" type="text" className={'form-control' + (errors.accessCode && touched.accessCode ? ' is-invalid' : '')} />
                                <ErrorMessage name="accessCode" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group col">
                            <button type="submit" className="btn btn-primary mr-2">Add the class to the system</button>
                            <button type="reset" className="btn btn-secondary">Reset data</button>
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