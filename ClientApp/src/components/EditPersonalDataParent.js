import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { userService } from '../services';
import { Button, Icon, Popup, Input } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';


class EditPersonalDataParent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            genders: [],
            parent: '',
            dateOfBirthParentTemp: new Date(),
            showPassword: false,
        };
    }

    componentDidMount() {
        userService.GetAllGenders().then(genders => this.setState({ genders }));
        userService.GetAllInfoPersonalParent().then(parent => this.setState({
            parent: parent,
            dateOfBirthParentTemp: new Date(parent.dateOfBirth),
        }));
    }

    onTogglePassword = () =>
        this.setState(prevState => ({
            showPassword: !prevState.showPassword,
        }));


    render() {
        return (
            <Formik
                initialValues={{
                    nameParent: this.state.parent.name,
                    patronymicParent: this.state.parent.patronymic,
                    surnameParent: this.state.parent.surname,
                    emailParent: this.state.parent.email,
                    passwordParent: this.state.parent.password,
                    confirmPasswordParent: this.state.parent.password,
                    dateOfBirthParent: this.state.dateOfBirthParentTemp,
                    genderParent: this.state.parent.gender,
                    workOfPlaceParent: this.state.parent.workPlace,
                    phoneParent: this.state.parent.phone,
                    adressParent: this.state.parent.adress
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    emailParent: Yup.string()
                        .email('Wrong format of Email.')
                        .required("Email is required."),
                    passwordParent: Yup.string()
                        .min(6, 'Password must contain at least 6 characters!')
                        .required("Password is required."),
                    confirmPasswordParent: Yup.string()
                        .oneOf([Yup.ref('passwordParent'), null], 'Passwords do no match!')
                        .required('You must confirm the password!'),
                    phoneParent: Yup.string()
                        .required("Phone number is required."),
                    adressParent: Yup.string()
                        .required("Adress is required."),
                    workOfPlaceParent: Yup.string()
                        .required('Place of work is required.')

                })}
                onSubmit={({ emailParent, passwordParent, workOfPlaceParent, phoneParent, adressParent }, { setStatus, setSubmitting }) => {
                    setStatus();

                    userService.ChangePersonalParent(emailParent, passwordParent, phoneParent, adressParent, workOfPlaceParent)
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
                        <h1>Update personal information</h1>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label htmlFor="nameParent">Name</label>
                                <Field name="nameParent" type="text" disabled className={'form-control' + (errors.nameParent && touched.nameParent ? ' is-invalid' : '')} />
                                <ErrorMessage name="nameParent" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="patronymicParent">Patronymic</label>
                                <Field name="patronymicParent" type="text" disabled className={'form-control' + (errors.patronymicParent && touched.patronymicParent ? ' is-invalid' : '')} />
                                <ErrorMessage name="patronymicParent" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="surnameParent">Surname</label>
                                <Field name="surnameParent" type="text" disabled className={'form-control' + (errors.surnameParent && touched.surnameParent ? ' is-invalid' : '')} />
                                <ErrorMessage name="surnameParent" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="dateOfBirthParent">Date of birth</label>
                                <br />
                                <DatePicker
                                    disabled
                                    selected={values.dateOfBirthParent}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfBirthParent && touched.dateOfBirthParent ? ' is-invalid' : '')}
                                    name="dateOfBirthParent"
                                    onChange={date => setFieldValue('dateOfBirthParent', date)}
                                />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label htmlFor="genderParent">Gender</label>
                            <Field name="genderParent" as="select" disabled className={'form-control' + (errors.genderParent && touched.genderParent ? ' is-invalid' : '')}>
                                {this.state.genders.map((gender, i) => (
                                    <option key={gender.idGender} value={gender.idGender}>{gender.genderType}</option>
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
                            <label htmlFor="adressParent">Adress</label>
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
                                <Input name="passwordParent" type={this.state.showPassword ? 'text' : 'password'} value={values.passwordParent} className={'form-control' + (errors.passwordParent && touched.passwordParent ? ' is-invalid' : '')}
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
                                <Input name="confirmPasswordParent" type={this.state.showPassword ? 'text' : 'password'} value={values.confirmPasswordParent} className={'form-control' + (errors.confirmPasswordParent && touched.confirmPasswordParent ? ' is-invalid' : '')}
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
                            <button type="submit" className="btn btn-primary mr-2">Update personal information</button>
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

export { EditPersonalDataParent }; 