import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { userService } from '../services';
import { Button, Icon, Popup, Input } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
class ChangeAdminPersonal extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            genders: [],
            admin: '',
            dateOfBirthAdminTemp: new Date(),
            showPassword: false,
        };
    }

    componentDidMount() {
        userService.GetAllGenders().then(genders => this.setState({ genders }));
        userService.GetAllInfoPersonalAdmin().then(admin => this.setState({
            admin: admin,
            dateOfBirthAdminTemp: new Date(admin.dateOfBirth),
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
                    nameAdmin: this.state.admin.name,
                    patronymicAdmin: this.state.admin.patronymic,
                    surnameAdmin: this.state.admin.surname,
                    emailAdmin: this.state.admin.email,
                    passwordAdmin: this.state.admin.password,
                    confirmPasswordAdmin: this.state.admin.password,
                    dateOfBirthAdmin: this.state.dateOfBirthAdminTemp,
                    genderAdmin: this.state.admin.gender,
                    phoneAdmin: this.state.admin.phone,
                    descriptionAdmin: this.state.admin.description,            
                }}

                validationSchema={Yup.object().shape({
                    emailAdmin: Yup.string()
                        .email('Wrong format of Email.')
                        .required("Email is required."),
                    passwordAdmin: Yup.string()
                        .min(6, 'Password must contain at least 6 characters!')
                        .required("Password is required."),
                    confirmPasswordAdmin: Yup.string()
                        .oneOf([Yup.ref('passwordAdmin'), null], 'Passwords do not match!')
                        .required('You must confirm the password.'),           
                    phoneAdmin: Yup.string()
                        .required("Phone number is required."),
                    descriptionAdmin: Yup.string()
                        .required('You need to write a short description of the administrator.'),           
                })}
                enableReinitialize
                onSubmit={({ emailAdmin, passwordAdmin, phoneAdmin, descriptionAdmin }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.ChangePersonalAdmin(emailAdmin, passwordAdmin, phoneAdmin, descriptionAdmin)
                        .then(
                            user => {
                                const { from } = this.props.location.state || { from: { pathname: "/" } };
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
                        <h1>Update personal information</h1>
                        <hr />
                        <div className="form-row">                
                            <div className="form-group col-5">
                                <label htmlFor="nameAdmin">Name</label>
                                <Field name="nameAdmin" type="text" disabled className={'form-control' + (errors.nameAdmin && touched.nameAdmin ? ' is-invalid' : '')} />
                                <ErrorMessage name="nameAdmin" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="patronymicAdmin">Patronymic</label>
                                <Field name="patronymicAdmin" type="text" disabled className={'form-control' + (errors.patronymicAdmin && touched.patronymicAdmin ? ' is-invalid' : '')} />
                                <ErrorMessage name="patronymicAdmin" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="surnameAdmin">Surname</label>
                                <Field name="surnameAdmin" type="text" disabled className={'form-control' + (errors.surnameAdmin && touched.surnameAdmin ? ' is-invalid' : '')} />
                                <ErrorMessage name="surnameAdmin" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="dateOfBirthAdmin">Date of Birth</label>
                                <br />
                                <DatePicker
                                    selected={values.dateOfBirthAdmin}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfBirthAdmin && touched.dateOfBirthAdmin ? ' is-invalid' : '')}
                                    name="dateOfBirthAdmin"
                                    disabled
                                    onChange={date => setFieldValue('dateOfBirthAdmin', date)}
                                />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label htmlFor="genderAdmin">Gender</label>
                            <Field name="genderAdmin" as="select" disabled className={'form-control' + (errors.genderAdmin && touched.genderAdmin ? ' is-invalid' : '')}>
                                {this.state.genders.map((gender, i) => (
                                    <option key={gender.idGender} value={gender.idGender}>{gender.genderType}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailAdmin">Email</label>
                            <Field name="emailAdmin" type="text" className={'form-control' + (errors.emailAdmin && touched.emailAdmin ? ' is-invalid' : '')} />
                            <ErrorMessage name="emailAdmin" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneAdmin">Phone number</label>
                            <Field name="phoneAdmin" type="text" className={'form-control' + (errors.phoneAdmin && touched.phoneAdmin ? ' is-invalid' : '')} />
                            <ErrorMessage name="phoneAdmin" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="descriptionAdmin">Description</label>
                            <Field name="descriptionAdmin" type="text" className={'form-control' + (errors.descriptionAdmin && touched.descriptionAdmin ? ' is-invalid' : '')} />
                            <ErrorMessage name="descriptionAdmin" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-row">
                            <div className="form-group col">
                                <label htmlFor="passwordAdmin">Password</label>
                                <Input name="passwordAdmin" type={this.state.showPassword ? 'text' : 'password'} value={values.passwordAdmin} className={'form-control' + (errors.passwordAdmin && touched.passwordAdmin ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('passwordAdmin', password.target.value) }
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />}/>
                                <ErrorMessage name="passwordAdmin" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="confirmPasswordAdmin">Confirm password</label>
                                <Input name="confirmPasswordAdmin" type={this.state.showPassword ? 'text' : 'password'} value={values.confirmPasswordAdmin} className={'form-control' + (errors.confirmPasswordAdmin && touched.confirmPasswordAdmin ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('confirmPasswordAdmin', password.target.value)}
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />} />
                                <ErrorMessage name="confirmPasswordAdmin" component="div" className="invalid-feedback" />
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

export { ChangeAdminPersonal }; 