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

class ChangeClass extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            availableTeachers: [],
            classEntity: ''
        };
    }

    componentDidMount() {
        userService.GetAllClassroomTeachersAdmin(this.props.location.state.idClassList).then(availableTeachers => this.setState({ availableTeachers }));
        userService.GetAllInfoClass(this.props.location.state.idClassList).then(classEntity => this.setState({ classEntity }));
    }

    render() {
        return (
            <Formik
                initialValues={{                
                    idClassroomTeacherLabel: this.state.availableTeachers[0],
                    idClassroomTeacher: this.state.classEntity.idClassroomTeacher,
                    accessCode: this.state.classEntity.accessCode,
                    adminCode: '',
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({                  
                    idClassroomTeacher: Yup.string()
                        .required('Оберіть будь ласка класного керівника'),
                    accessCode: Yup.string()
                        .required('Введіть будь ласка код доступу'),
                    adminCode: Yup.string()
                        .required('Введіть будь ласка код адміністратора')
                })}
                onSubmit={({ idClassroomTeacher, accessCode, adminCode }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.ChangeClass(idClassroomTeacher, accessCode, adminCode, this.props.location.state.idClassList)
                        .then(
                            user => {                             
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
                        <h1>Змінити дані про клас</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="idClassroomTeacher">Класний керівник</label>
                            <Select
                                placeholder="Оберіть класного керівника..."
                                name="idClassroomTeacher"
                                options={this.state.availableTeachers}
                                value={values.idClassroomTeacherLabel}
                                className={'basic-multi-select' + (errors.idClassroomTeacher && touched.idClassroomTeacher ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectTeacher => setFieldValue('idClassroomTeacher', selectTeacher)} />
                            <ErrorMessage name="idClassroomTeacher" component="div" className="invalid-feedback" />
                        </div>

                            <div className="form-group col">
                                <label htmlFor="accessCode">Код доступу</label>
                                <Field name="accessCode" type="text" className={'form-control' + (errors.accessCode && touched.accessCode ? ' is-invalid' : '')} />
                                <ErrorMessage name="accessCode" component="div" className="invalid-feedback" />
                            </div>

                        <div className="form-group">
                            <label htmlFor="adminCode">Код адміністратора</label>
                            <Field name="adminCode" type="text" className={'form-control' + (errors.adminCode && touched.adminCode ? ' is-invalid' : '')} />
                            <ErrorMessage name="adminCode" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Змінити дані класу</button>
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

export { ChangeClass }; 