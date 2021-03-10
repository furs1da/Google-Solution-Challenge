import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { authenticationService } from '../services';
import { userService } from '../services';
import { Button, Icon, Popup, Input } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import uk from "date-fns/locale/uk";
registerLocale("uk", uk);
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
                        .required("Ім'я  обов'язкове."),
                    patronymicParent: Yup.string()
                        .required("По батькові обов'язкове."),
                    surnameParent: Yup.string()
                        .required("Прізвище обов'язкове."),
                    emailParent: Yup.string()
                        .email('Неправильний формат пошти.')
                        .required("Пошта обов'язкова."),
                    passwordParent: Yup.string()
                        .min(6, 'Пароль повинен містити хоча б 6 символів!')
                        .required("Пароль обов'язковий"),
                    confirmPasswordParent: Yup.string()
                        .oneOf([Yup.ref('passwordParent'), null], 'Паролі не співпадають!')
                        .required('Треба підтвердити пароль!'),
                    phoneParent: Yup.string()
                        .required("Номер телефону обов'язковий"),
                    genderParent: Yup.string()
                        .required("Оберіть гендер"),
                    adressParent: Yup.string()
                        .required("Адреса обов'язкова"),
                    dateOfBirthParent: Yup.date()
                        .required("Дата народження обов'язкова!"),
                    workOfPlaceParent: Yup.string()
                        .required('Введіть будь ласка місце роботи'),
                    idPupil: Yup.string()
                        .required('Оберіть будь ласка свою дитину')

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
                        <h1>Реєстрація у ролі батьків</h1>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label htmlFor="nameParent">Ім'я</label>
                                <Field name="nameParent" type="text" className={'form-control' + (errors.nameParent && touched.nameParent ? ' is-invalid' : '')} />
                                <ErrorMessage name="nameParent" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="patronymicParent">По батькові</label>
                                <Field name="patronymicParent" type="text" className={'form-control' + (errors.patronymicParent && touched.patronymicParent ? ' is-invalid' : '')} />
                                <ErrorMessage name="patronymicParent" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="surnameParent">Прізвище</label>
                                <Field name="surnameParent" type="text" className={'form-control' + (errors.surnameParent && touched.surnameParent ? ' is-invalid' : '')} />
                                <ErrorMessage name="surnameParent" component="div" className="invalid-feedback" />
                            </div> 
                            <div className="form-group col">
                                <label htmlFor="dateOfBirthParent">День народження</label>
                                <br />
                                <DatePicker
                                    locale= "uk"
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
                            <label htmlFor="genderParent">Гендер</label>
                            <Field name="genderParent" as="select" placeholder="Оберіть гендер..." className={'form-control' + (errors.genderParent && touched.genderParent ? ' is-invalid' : '')}>
                                {this.state.genders.map((gender, i) => (
                                    <option key={gender.idGender} value={gender.idGender}>{gender.genderType}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>



                        <div className="form-group col">
                            <label htmlFor="idPupil">Оберіть дитину</label>
                            <Field name="idPupil" as="select" placeholder="Оберіть дитину..." className={'form-control' + (errors.idPupil && touched.idPupil ? ' is-invalid' : '')}>
                                {this.state.students.map((student, i) => (
                                    <option key={student.idPupil} value={student.idPupil}> {student.surname} {student.name} {student.patronymic}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>






                        <div className="form-group">
                            <label htmlFor="emailParent">Електронна пошта</label>
                            <Field name="emailParent" type="text" className={'form-control' + (errors.emailParent && touched.emailParent ? ' is-invalid' : '')} />
                            <ErrorMessage name="emailParent" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adressParent">Адреса</label>
                            <Field name="adressParent" type="text" className={'form-control' + (errors.adressParent && touched.adressParent ? ' is-invalid' : '')} />
                            <ErrorMessage name="adressParent" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneParent">Номер телефону</label>
                            <Field name="phoneParent" type="text" className={'form-control' + (errors.phoneParent && touched.phoneParent ? ' is-invalid' : '')} />
                            <ErrorMessage name="phoneParent" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="workOfPlaceParent">Місце роботи</label>
                            <Field name="workOfPlaceParent" type="text" className={'form-control' + (errors.workOfPlaceParent && touched.workOfPlaceParent ? ' is-invalid' : '')} />
                            <ErrorMessage name="workOfPlaceParent" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-row">
                            <div className="form-group col">
                                <label htmlFor="passwordParent">Пароль</label>
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
                                <label htmlFor="confirmPasswordParent">Підтвердити пароль</label>
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
                            <button type="submit" className="btn btn-primary mr-2">Зареєструватися</button>
                            <button type="reset" className="btn btn-secondary">Скинути дані</button>
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