import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { authenticationService } from '../services';
import { userService } from '../services';
import { Button, Icon, Popup, Input } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
/* eslint-disable */

class RegisterPageParent extends React.Component {

    constructor(props) {
        super(props);
      
        this.state = {
            genders: [],
            students: [],
            error: '',
            showPassword: false,
            studentDefaultValue: ''
        };
      


        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }
    }

    componentDidMount() {
        userService.GetAllStudentsFromClass(this.props.location.state.classIdState).then(students => this.setState({ students })).catch(error => this.setState({ error }));
        userService.GetAllGenders().then(genders => this.setState({ genders }));
        userService.GetAllStudentsFromClass(this.props.location.state.classIdState).then(students => this.setState({ studentDefaultValue: students[0].idPupil })).catch(error => this.setState({ error }));
    }

    onTogglePassword = () =>
        this.setState(prevState => ({
            showPassword: !prevState.showPassword,
        }));

    render() {
        return (
            <Formik
                initialValues={{
                    nameParent: '',
                    patronymicParent: '',
                    surnameParent: '',
                    emailParent: '',
                    passwordParent: '',
                    confirmPasswordParent: '',
                    dateOfBirthParent: new Date(),
                    genderParent: '1',
                    workOfPlaceParent: '',
                    phoneParent: '',
                    adressParent: '',
                    idPupil: this.state.studentDefaultValue,
                }}
                validationSchema={Yup.object().shape({                  
                    nameParent: Yup.string()
                        .required("Name is required."),
                    patronymicParent: Yup.string()
                        .required("Patronymic is required."),
                    surnameParent: Yup.string()
                        .required("Surname is required."),
                    emailParent: Yup.string()
                        .email('Wrogn format of email.')
                        .required("Email is required."),
                    passwordParent: Yup.string()
                        .min(6, 'Password must contain at least 6 symbols!')
                        .required("Password is required."),
                    confirmPasswordParent: Yup.string()
                        .oneOf([Yup.ref('passwordParent'), null], 'Password do not match!')
                        .required('You must confirm the password!'),
                    phoneParent: Yup.string()
                        .required("Phone number is required."),
                    genderParent: Yup.string()
                        .required("Gender is required."),
                    adressParent: Yup.string()
                        .required("Address is required."),
                    dateOfBirthParent: Yup.date()
                        .required("Date of birth is required."),
                    workOfPlaceParent: Yup.string()
                        .required('Place of work is required.'),
                    idPupil: Yup.string()
                        .required('Please select your child.')

                })}
                onSubmit={({ nameParent, patronymicParent, surnameParent, emailParent, passwordParent, dateOfBirthParent, genderParent, workOfPlaceParent, phoneParent, adressParent, idPupil }, { setStatus, setSubmitting }) => {
                    setStatus();
                   
                    authenticationService.registerParent(nameParent, patronymicParent, surnameParent, emailParent, passwordParent, dateOfBirthParent, genderParent, workOfPlaceParent, phoneParent, adressParent, idPupil)
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
                {({ errors, status, touched, values, setFieldValue }) => (
                    <Form>
                        <h1>Register as a parent</h1>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label htmlFor="nameParent">Name</label>
                                <Field name="nameParent" type="text" className={'form-control' + (errors.nameParent && touched.nameParent ? ' is-invalid' : '')} />
                                <ErrorMessage name="nameParent" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="patronymicParent">Patronymic</label>
                                <Field name="patronymicParent" type="text" className={'form-control' + (errors.patronymicParent && touched.patronymicParent ? ' is-invalid' : '')} />
                                <ErrorMessage name="patronymicParent" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="surnameParent">Surname</label>
                                <Field name="surnameParent" type="text" className={'form-control' + (errors.surnameParent && touched.surnameParent ? ' is-invalid' : '')} />
                                <ErrorMessage name="surnameParent" component="div" className="invalid-feedback" />
                            </div> 
                            <div className="form-group col">
                                <label htmlFor="dateOfBirthParent">Date of birth</label>
                                <br />
                                <DatePicker
                                    selected={values.dateOfBirthParent}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfBirthParent && touched.dateOfBirthParent ? ' is-invalid' : '')}
                                    name="dateOfBirthParent"
                                    onChange={date => setFieldValue('dateOfBirthParent', date)}
                                    showMonthDropdown
                                    showYearDropdown
                                    adjustDateOnChange
                                    dropdownMode="select"
                                />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label htmlFor="genderParent">Gender</label>
                            <Field name="genderParent" as="select" placeholder="Select gender..." className={'form-control' + (errors.genderParent && touched.genderParent ? ' is-invalid' : '')}>
                                {this.state.genders.map((gender, i) => (
                                    <option key={gender.idGender} value={gender.idGender}>{gender.genderType}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>



                        <div className="form-group col">
                            <label htmlFor="idPupil">Select your child</label>
                            <Field name="idPupil" as="select" placeholder="Select child..." className={'form-control' + (errors.idPupil && touched.idPupil ? ' is-invalid' : '')}>
                                {this.state.students.map((student, i) => (
                                    <option key={student.idPupil} value={student.idPupil}> {student.surname} {student.name} {student.patronymic}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>






                        <div className="form-group">
                            <label htmlFor="emailParent">Email</label>
                            <Field name="emailParent" type="text" className={'form-control' + (errors.emailParent && touched.emailParent ? ' is-invalid' : '')} />
                            <ErrorMessage name="emailParent" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adressParent">Address</label>
                            <Field name="adressParent" type="text" className={'form-control' + (errors.adressParent && touched.adressParent ? ' is-invalid' : '')} />
                            <ErrorMessage name="adressParent" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneParent">Phone number</label>
                            <Field name="phoneParent" type="text" className={'form-control' + (errors.phoneParent && touched.phoneParent ? ' is-invalid' : '')} />
                            <ErrorMessage name="phoneParent" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="workOfPlaceParent">Place of work</label>
                            <Field name="workOfPlaceParent" type="text" className={'form-control' + (errors.workOfPlaceParent && touched.workOfPlaceParent ? ' is-invalid' : '')} />
                            <ErrorMessage name="workOfPlaceParent" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-row">
                            <div className="form-group col">
                                <label htmlFor="passwordParent">Password</label>
                                <Input name="passwordParent" type={this.state.showPassword ? 'text' : 'password'} className={'form-control' + (errors.passwordParent && touched.passwordParent ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('passwordParent', password.target.value)}
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />} />
                                <ErrorMessage name="passwordParent" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="confirmPasswordParent">Confirm password</label>
                                <Input name="confirmPasswordParent" type={this.state.showPassword ? 'text' : 'password'} className={'form-control' + (errors.confirmPasswordParent && touched.confirmPasswordParent ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('confirmPasswordParent', password.target.value)}
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />} />
                                <ErrorMessage name="confirmPasswordParent" component="div" className="invalid-feedback" />
                            </div>
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Register</button>
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

export { RegisterPageParent }; 