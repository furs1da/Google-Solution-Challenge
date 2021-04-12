import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
import { Button, Icon, Popup, Input } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';


class EditPersonalDataTeacher extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            genders: [],
            subjects: [],
            teacher: '',
            subjectsSelected: [],
            dateOfBirthTeacherTemp: new Date(),
            showPassword: false,
        };
    }

    componentDidMount() {
        userService.GetAllGenders().then(genders => this.setState({ genders }));
        userService.GetAllSubjects().then(subjects => this.setState({ subjects }));

        userService.GetAllInfoPersonalTeacher().then(teacher =>
            this.setState({
                teacher: teacher,
                dateOfBirthTeacherTemp: new Date(teacher.dateOfBirth),
            })).then(() => userService.GetAllSubjectsTeacher(this.state.teacher.idTeacher).then(subjectsSelected => this.setState({ subjectsSelected })));
    }
    onTogglePassword = () =>
        this.setState(prevState => ({
            showPassword: !prevState.showPassword,
        }));
    

    render() {
        return (
            <Formik

                initialValues={{
                    nameTeacher: this.state.teacher.name,
                    patronymicTeacher: this.state.teacher.patronymic,
                    surnameTeacher: this.state.teacher.surname,
                    emailTeacher: this.state.teacher.email,
                    passwordTeacher: this.state.teacher.password,
                    confirmPasswordTeacher: this.state.teacher.password,
                    dateOfBirthTeacher: this.state.dateOfBirthTeacherTemp,
                    genderTeacher: this.state.teacher.gender,
                    phoneTeacher: this.state.teacher.phone,
                    adressTeacher: this.state.teacher.adress,
                    imageOfTeacher: null,
                    selectedOption: this.state.subjectsSelected,
                }}

                validationSchema={Yup.object().shape({              
                    emailTeacher: Yup.string()
                        .email('Wrong format of Email.')
                        .required("Email is required."),
                    passwordTeacher: Yup.string()
                        .min(6, 'Password must contain at least 6 characters!')
                        .required("Password is required."),
                    confirmPasswordTeacher: Yup.string()
                        .oneOf([Yup.ref('passwordTeacher'), null], 'Passwords do not match!')
                        .required('You must confirm the password!'),
                    phoneTeacher: Yup.string()
                        .required("Phone number is required."),                  
                    adressTeacher: Yup.string()
                        .required("Address is required.")
                })}
                enableReinitialize
                onSubmit={({ emailTeacher, passwordTeacher, phoneTeacher, adressTeacher, imageOfTeacher,  }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.ChangePersonalTeacher(emailTeacher, passwordTeacher, phoneTeacher, adressTeacher, imageOfTeacher)
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
                        <h1>Update personal information</h1>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label htmlFor="nameTeacher">Name</label>
                                <Field name="nameTeacher" type="text" disabled className={'form-control' + (errors.nameTeacher && touched.nameTeacher ? ' is-invalid' : '')} />
                                <ErrorMessage name="nameTeacher" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="patronymicTeacher">Patronymic</label>
                                <Field name="patronymicTeacher" type="text" disabled className={'form-control' + (errors.patronymicTeacher && touched.patronymicTeacher ? ' is-invalid' : '')} />
                                <ErrorMessage name="patronymicTeacher" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="surnameTeacher">Surname</label>
                                <Field name="surnameTeacher" type="text" disabled className={'form-control' + (errors.surnameTeacher && touched.surnameTeacher ? ' is-invalid' : '')} />
                                <ErrorMessage name="surnameTeacher" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="dateOfBirthTeacher">Date of Birth</label>
                                <br />
                                <DatePicker
                                    disabled
                                    selected={values.dateOfBirthTeacher}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfBirthTeacher && touched.dateOfBirthTeacher ? ' is-invalid' : '')}
                                    name="dateOfBirthTeacher"
                                    defaultValue={this.state.teacher.dateOfBirth}                                  
                                    onChange={date => setFieldValue('dateOfBirthTeacher', date)}
                                />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label htmlFor="genderTeacher">Gender</label>
                            <Field name="genderTeacher" as="select" disabled className={'form-control' + (errors.genderTeacher && touched.genderTeacher ? ' is-invalid' : '')} >
                                {this.state.genders.map((gender, i) => (
                                    <option key={gender.idGender} value={gender.idGender}>{gender.genderType}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailTeacher">Email</label>
                            <Field name="emailTeacher" type="text" className={'form-control' + (errors.emailTeacher && touched.emailTeacher ? ' is-invalid' : '')} autoComplete="off" />
                            <ErrorMessage name="emailTeacher" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adressTeacher">Adress</label>
                            <Field name="adressTeacher" type="text" className={'form-control' + (errors.adressTeacher && touched.adressTeacher ? ' is-invalid' : '')} />
                            <ErrorMessage name="adressTeacher" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneTeacher">Phone number</label>
                            <Field name="phoneTeacher" type="text" className={'form-control' + (errors.phoneTeacher && touched.phoneTeacher ? ' is-invalid' : '')} />
                            <ErrorMessage name="phoneTeacher" component="div" className="invalid-feedback" />
                        </div>
                        <div>
                            <h4>Teacher's photo</h4>
                            <img class="img-fluid" style={{ maxHeight: 250 + "px", marginBottom: 1 + "em" }} src={'data:image/png;base64,' + this.state.teacher.imageOfTeacher}  />
                        </div>
                        <div className="form-group">
                            <label for="imageOfTeacher">Upload another photo if you want to change teacher's photo</label>
                            <br/>
                            <input
                                id="imageOfTeacher"
                                type="file"
                                name="imageOfTeacher"
                                onChange={(event) => {
                                    setFieldValue("imageOfTeacher", event.currentTarget.files[0]);
                                }}

                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group col">
                                <label htmlFor="passwordTeacher">Password</label>
                                <Input name="passwordTeacher" type={this.state.showPassword ? 'text' : 'password'} autoComplete="off" value={values.passwordTeacher} className={'form-control' + (errors.passwordTeacher && touched.passwordTeacher ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('passwordTeacher', password.target.value)}
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />} />
                                <ErrorMessage name="passwordTeacher" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="confirmPasswordTeacher">Confirm password</label>
                                <Input name="confirmPasswordTeacher" type={this.state.showPassword ? 'text' : 'password'} value={values.confirmPasswordTeacher} className={'form-control' + (errors.confirmPasswordTeacher && touched.confirmPasswordTeacher ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('confirmPasswordTeacher', password.target.value)}
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />} />
                                <ErrorMessage name="confirmPasswordTeacher" component="div" className="invalid-feedback" />
                            </div>     
                        </div>


                        <div className="form-group col">
                            <label htmlFor="selectedOption">Your subjects</label>
                            <Select
                                isMulti
                                isDisabled={ true}
                                name="selectedOption"
                                options={this.state.subjects}
                                value={values.selectedOption}
                                className={'basic-multi-select' + (errors.selectedOption && touched.selectedOption ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectLessons => setFieldValue('selectedOption', selectLessons)} />
                            <ErrorMessage name="selectedOption" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Update your personal information</button>
                            <button type="reset" className="btn btn-secondary" >Reset data</button>
                          
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

export { EditPersonalDataTeacher }; 