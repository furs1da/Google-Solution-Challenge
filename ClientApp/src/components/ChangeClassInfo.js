import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';

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
                        .required('Please select the classroom teacher'),
                    accessCode: Yup.string()
                        .required('Please enter access code'),
                    adminCode: Yup.string()
                        .required('Please enter administrator code')
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
                        <h1>Changer info about the class</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="idClassroomTeacher">Classroom teacher</label>
                            <Select
                                placeholder="Select classsroom teacher..."
                                name="idClassroomTeacher"
                                options={this.state.availableTeachers}
                                value={values.idClassroomTeacherLabel}
                                className={'basic-multi-select' + (errors.idClassroomTeacher && touched.idClassroomTeacher ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectTeacher => setFieldValue('idClassroomTeacher', selectTeacher)} />
                            <ErrorMessage name="idClassroomTeacher" component="div" className="invalid-feedback" />
                        </div>

                            <div className="form-group col">
                                <label htmlFor="accessCode">Access code</label>
                                <Field name="accessCode" type="text" className={'form-control' + (errors.accessCode && touched.accessCode ? ' is-invalid' : '')} />
                                <ErrorMessage name="accessCode" component="div" className="invalid-feedback" />
                            </div>

                        <div className="form-group">
                            <label htmlFor="adminCode">Administrator code</label>
                            <Field name="adminCode" type="text" className={'form-control' + (errors.adminCode && touched.adminCode ? ' is-invalid' : '')} />
                            <ErrorMessage name="adminCode" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Change the class info</button>
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

export { ChangeClass }; 