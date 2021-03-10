import React from 'react';
import { render } from "react-dom";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { userService } from '../services';
import { Button, Icon, Popup, Input } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import uk from "date-fns/locale/uk";
registerLocale("uk", uk);


class CreateAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            genders: [],
            showPassword: false,
        };
    }

    componentDidMount() {
        userService.GetAllGenders().then(genders => this.setState({ genders }));   
    }

    onTogglePassword = () =>
        this.setState(prevState => ({
            showPassword: !prevState.showPassword,
        }));

    render() {
        return (
            <Formik
                initialValues={{
                    nameAdmin: '',
                    patronymicAdmin: '',
                    surnameAdmin: '',
                    emailAdmin: '',
                    passwordAdmin: '',
                    confirmPasswordAdmin: '',
                    dateOfBirthAdmin: new Date(),
                    genderAdmin: '1',
                    phoneAdmin: '',
                    descriptionAdmin: '',
                    adminCode: ''            
                }}

                validationSchema={Yup.object().shape({
                    nameAdmin: Yup.string()
                        .required("Ім'я  обов'язкове."),
                    patronymicAdmin: Yup.string()
                        .required("По батькові обов'язкове."),
                    surnameAdmin: Yup.string()
                        .required("Прізвище обов'язкове."),
                    emailAdmin: Yup.string()
                        .email('Неправильний формат пошти.')
                        .required("Пошта обов'язкова."),
                    passwordAdmin: Yup.string()
                        .min(6, 'Пароль повинен містити хоча б 6 символів!')
                        .required("Пароль обов'язковий."),
                    confirmPasswordAdmin: Yup.string()
                        .oneOf([Yup.ref('passwordAdmin'), null], 'Паролі не співпадають!')
                        .required('Треба підтвердити пароль!'),
                    dateOfBirthAdmin: Yup.date()
                        .required("Дата народження обов'язкова!"),                   
                    genderAdmin: Yup.string()
                        .required('Оберіть гендер!'),
                    phoneAdmin: Yup.string()
                        .required("Номер телефону обов'язковий!"),              
                    descriptionAdmin: Yup.string()
                        .required('Треба написати коротке резюме про адміністратора'),
                    adminCode: Yup.string()
                        .required('Введіть спеціальний код для створення облікового запису админістратора')
                })}
                onSubmit={({ nameAdmin, patronymicAdmin, surnameAdmin, emailAdmin, passwordAdmin, dateOfBirthAdmin, genderAdmin, phoneAdmin, descriptionAdmin, adminCode}, { setStatus, setSubmitting }) => {
                    setStatus();
                 
                    userService.CreateAdmin(nameAdmin, patronymicAdmin, surnameAdmin, emailAdmin, passwordAdmin, dateOfBirthAdmin, genderAdmin, phoneAdmin, descriptionAdmin, adminCode)
                        .then(
                            user => {
                                const { from } = this.props.location.state || { from: { pathname: "/" } };
                                this.props.history.push({
                                    pathname: '/listOfAdmins',
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
                        <h1>Створити адміністратора</h1>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label htmlFor="nameAdmin">Ім'я</label>
                                <Field name="nameAdmin" type="text" className={'form-control' + (errors.nameAdmin && touched.nameAdmin ? ' is-invalid' : '')} />
                                <ErrorMessage name="nameAdmin" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="patronymicAdmin">По батькові</label>
                                <Field name="patronymicAdmin" type="text" className={'form-control' + (errors.patronymicAdmin && touched.patronymicAdmin ? ' is-invalid' : '')} />
                                <ErrorMessage name="patronymicAdmin" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="surnameAdmin">Прізвище</label>
                                <Field name="surnameAdmin" type="text" className={'form-control' + (errors.surnameAdmin && touched.surnameAdmin ? ' is-invalid' : '')} />
                                <ErrorMessage name="surnameAdmin" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="dateOfBirthAdmin">Дата народження</label>
                                <br />
                                <DatePicker
                                    selected={values.dateOfBirthAdmin}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfBirthAdmin && touched.dateOfBirthAdmin ? ' is-invalid' : '')}
                                    name="dateOfBirthAdmin"
                                    onChange={date => setFieldValue('dateOfBirthAdmin', date)}
                                    showMonthDropdown
                                    showYearDropdown
                                    adjustDateOnChange
                                    dropdownMode="select"
                                    locale="uk"
                                />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label htmlFor="genderAdmin">Гендер</label>
                            <Field name="genderAdmin" as="select" placeholder="Оберіть гендер..." className={'form-control' + (errors.genderAdmin && touched.genderAdmin ? ' is-invalid' : '')}>
                                {this.state.genders.map((gender, i) => (
                                    <option key={gender.idGender} value={gender.idGender}>{gender.genderType}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailAdmin">Електронна пошта</label>
                            <Field name="emailAdmin" type="text" className={'form-control' + (errors.emailAdmin && touched.emailAdmin ? ' is-invalid' : '')} />
                            <ErrorMessage name="emailAdmin" component="div" className="invalid-feedback" />
                        </div>
         
                        <div className="form-group">
                            <label htmlFor="phoneAdmin">Номер телефону</label>
                            <Field name="phoneAdmin" type="text" className={'form-control' + (errors.phoneAdmin && touched.phoneAdmin ? ' is-invalid' : '')} />
                            <ErrorMessage name="phoneAdmin" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="descriptionAdmin">Коротке резюме</label>
                            <Field name="descriptionAdmin" type="text" className={'form-control' + (errors.descriptionAdmin && touched.descriptionAdmin ? ' is-invalid' : '')} />
                            <ErrorMessage name="descriptionAdmin" component="div" className="invalid-feedback" />
                        </div>
                      

                        <div className="form-row">
                            <div className="form-group col">
                                <label htmlFor="passwordAdmin">Пароль</label>
                                <Input name="passwordAdmin" type={this.state.showPassword ? 'text' : 'password'} className={'form-control' + (errors.passwordAdmin && touched.passwordAdmin ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('passwordAdmin', password.target.value)}
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />} />
                                <ErrorMessage name="passwordAdmin" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="confirmPasswordAdmin">Підтвердити пароль</label>
                                <Input name="confirmPasswordAdmin" type={this.state.showPassword ? 'text' : 'password'} className={'form-control' + (errors.confirmPasswordAdmin && touched.confirmPasswordAdmin ? ' is-invalid' : '')}
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
                            <label htmlFor="adminCode">Код доступу</label>
                            <Field name="adminCode" type="text" className={'form-control' + (errors.adminCode && touched.adminCode ? ' is-invalid' : '')} />
                            <ErrorMessage name="adminCode" component="div" className="invalid-feedback" />
                        </div>


                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Додати обліковий запис адміністратора</button>
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

export { CreateAdmin }; 