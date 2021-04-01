import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
import { Button, Icon, Popup, Input } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';


class CreateTeacher extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            genders: [],
            subjects: [],
            showPassword: false,
        };
    }

    componentDidMount() {
        userService.GetAllGenders().then(genders => this.setState({ genders }));
        userService.GetAllSubjects().then(subjects => this.setState({ subjects }));      
    }

    onTogglePassword = () =>
        this.setState(prevState => ({
            showPassword: !prevState.showPassword,
        }));

    render() {
        return (
            <Formik
                initialValues={{
                    nameTeacher: '',
                    patronymicTeacher: '',
                    surnameTeacher: '',
                    emailTeacher: '',
                    passwordTeacher: '',
                    confirmPasswordTeacher: '',
                    dateOfBirthTeacher: new Date(),
                    genderTeacher: '1',                  
                    phoneTeacher: '',
                    adressTeacher: '',                 
                    imageOfTeacher: null,
                    selectedOption: null
                }}
             
                validationSchema={Yup.object().shape({
                    nameTeacher: Yup.string()
                        .required("Name is required."),
                    patronymicTeacher: Yup.string()
                        .required("Patronymic is required."),
                    surnameTeacher: Yup.string()
                        .required("Surname is required."),
                    emailTeacher: Yup.string()
                        .email('Wrong format of Email.')
                        .required("Email is required."),
                    passwordTeacher: Yup.string()
                        .min(6, 'Password must contain at least 6 characters!')
                        .required("Password is required."),
                    confirmPasswordTeacher: Yup.string()
                        .oneOf([Yup.ref('passwordTeacher'), null], 'Passwords do not match!')
                        .required('You must confirm your password!'),
                    phoneTeacher: Yup.string()
                        .required("Phone number is required."),
                    genderTeacher: Yup.string()
                        .required('Gender is required.'),
                    adressTeacher: Yup.string()
                        .required("Adress is required."),
                    dateOfBirthTeacher: Yup.date()
                        .required("Date of Birth is required."),
                    selectedOption: Yup.array()
                        .min(1, "Please select at least one subject.").nullable().required("Please select at least one subject.")
                        .of(
                            Yup.object()
                                .shape({
                                    label: Yup.string(),
                                    value: Yup.string()
                                })
                              
                    )
                })}
                onSubmit={({ nameTeacher, patronymicTeacher, surnameTeacher, emailTeacher, passwordTeacher, dateOfBirthTeacher, genderTeacher, phoneTeacher, adressTeacher, imageOfTeacher, selectedOption }, { setStatus, setSubmitting }) => {
                    setStatus();
                    console.log(nameTeacher, patronymicTeacher, surnameTeacher, emailTeacher, passwordTeacher, dateOfBirthTeacher, genderTeacher, phoneTeacher, adressTeacher, imageOfTeacher, selectedOption);
                    userService.CreateTeacher(nameTeacher, patronymicTeacher, surnameTeacher, emailTeacher, passwordTeacher, dateOfBirthTeacher, genderTeacher, phoneTeacher, adressTeacher, imageOfTeacher, selectedOption)
                        .then(
                            user => {
                                const { from } = this.props.location.state || { from: { pathname: "/" } };
                                this.props.history.push({
                                    pathname: '/listOfTeachers',
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
                        <h1>Create teacher's account</h1>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label htmlFor="nameTeacher">Name</label>
                                <Field name="nameTeacher" type="text" className={'form-control' + (errors.nameTeacher && touched.nameTeacher ? ' is-invalid' : '')} />
                                <ErrorMessage name="nameTeacher" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="patronymicTeacher">Patronymic</label>
                                <Field name="patronymicTeacher" type="text" className={'form-control' + (errors.patronymicTeacher && touched.patronymicTeacher ? ' is-invalid' : '')} />
                                <ErrorMessage name="patronymicTeacher" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="surnameTeacher">Surname</label>
                                <Field name="surnameTeacher" type="text" className={'form-control' + (errors.surnameTeacher && touched.surnameTeacher ? ' is-invalid' : '')} />
                                <ErrorMessage name="surnameTeacher" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="dateOfBirthTeacher">Date of Birth</label>
                                <br />
                                <DatePicker
                                    selected={values.dateOfBirthTeacher}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfBirthTeacher && touched.dateOfBirthTeacher ? ' is-invalid' : '')}
                                    name="dateOfBirthTeacher"
                                    onChange={date => setFieldValue('dateOfBirthTeacher', date)}
                                    showMonthDropdown
                                    showYearDropdown
                                    adjustDateOnChange
                                    dropdownMode="select"
                                />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label htmlFor="genderTeacher">Gender</label>
                            <Field name="genderTeacher" as="select" placeholder="Select gender..." className={'form-control' + (errors.genderTeacher && touched.genderTeacher ? ' is-invalid' : '')}>
                                {this.state.genders.map((gender, i) => (
                                    <option key={gender.idGender} value={gender.idGender}>{gender.genderType}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailTeacher">Email</label>
                            <Field name="emailTeacher" type="text" className={'form-control' + (errors.emailTeacher && touched.emailTeacher ? ' is-invalid' : '')} />
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
                     
                        <div className="form-group">
                            <label for="imageOfTeacher">Upload photo</label>
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
                                <Input name="passwordTeacher" type={this.state.showPassword ? 'text' : 'password'} className={'form-control' + (errors.passwordTeacher && touched.passwordTeacher ? ' is-invalid' : '')}
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
                                <Input name="confirmPasswordTeacher" type={this.state.showPassword ? 'text' : 'password'} className={'form-control' + (errors.confirmPasswordTeacher && touched.confirmPasswordTeacher ? ' is-invalid' : '')}
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
                            <label htmlFor="selectedOption">Subjects</label>                               
                            <Select 
                                placeholder="Select subject..."
                                isMulti
                                name="selectedOption"
                                options={this.state.subjects}
                                className={'basic-multi-select' + (errors.selectedOption && touched.selectedOption ? ' is-invalid' : '')}
                                classNamePrefix="select" menuPlacement="top"
                                onChange={selectLessons => setFieldValue('selectedOption', selectLessons)}/>
                            <ErrorMessage name="selectedOption" component="div" className="invalid-feedback" />
                        </div>
                                                  
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Add a teacher account</button>
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

export { CreateTeacher }; 