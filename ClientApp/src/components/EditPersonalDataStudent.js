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

class EditPersonalDataPupil extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            genders: [],
            student: '',
            dateOfBirthStudentTemp: new Date(),
            showPassword: false,
        };
    }

    componentDidMount() {
        userService.GetAllGenders().then(genders => this.setState({ genders }));
        userService.GetAllInfoPersonalPupil().then(student => this.setState({
            student: student,
            dateOfBirthStudentTemp: new Date(student.dateOfBirth),
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
                    namePupil: this.state.student.name,
                    patronymicPupil: this.state.student.patronymic,
                    surnamePupil: this.state.student.surname,
                    emailPupil: this.state.student.email,
                    passwordPupil: this.state.student.password,
                    confirmPasswordPupil: this.state.student.password,
                    dateOfBirthPupil: this.state.dateOfBirthStudentTemp,
                    genderPupil: this.state.student.gender,
                    motoPupil: this.state.student.moto,
                    phonePupil: this.state.student.phone,
                    adressPupil: this.state.student.adress,
                    imageOfPupil: null
                }}
                enableReinitialize
                validationSchema={Yup.object().shape({
                    namePupil: Yup.string()
                        .required("Ім'я  обов'язкове."),
                    patronymicPupil: Yup.string()
                        .required("По батькові обов'язкове."),
                    surnamePupil: Yup.string()
                        .required("Прізвище обов'язкове."),
                    emailPupil: Yup.string()
                        .email('Неправильний формат пошти.')
                        .required("Пошта обов'язкова."),
                    passwordPupil: Yup.string()
                        .min(6, 'Пароль повинен містити хоча б 6 символів!')
                        .required("Пароль обов'язковий"),
                    confirmPasswordPupil: Yup.string()
                        .oneOf([Yup.ref('passwordPupil'), null], 'Паролі не співпадають!')
                        .required('Треба підтвердити пароль!'),
                    phonePupil: Yup.string()
                        .required("Номер телефону обов'язковий"),
                    genderPupil: Yup.string()
                        .required("Оберіть гендер"),
                    adressPupil: Yup.string()
                        .required("Адреса обов'язкова"),
                    dateOfBirthPupil: Yup.date()
                        .required("Дата народження обов'язкова!")
                })}
                onSubmit={({ emailPupil, passwordPupil, motoPupil, phonePupil, adressPupil, imageOfPupil }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.ChangePersonalPupil(emailPupil, passwordPupil, phonePupil, adressPupil, imageOfPupil, motoPupil)
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
                        <h1>Змінити власні дані</h1>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label htmlFor="namePupil">Ім'я</label>
                                <Field name="namePupil" type="text" disabled className={'form-control' + (errors.namePupil && touched.namePupil ? ' is-invalid' : '')} />
                                <ErrorMessage name="namePupil" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="patronymicPupil">По батькові</label>
                                <Field name="patronymicPupil" type="text" disabled className={'form-control' + (errors.patronymicPupil && touched.patronymicPupil ? ' is-invalid' : '')} />
                                <ErrorMessage name="patronymicPupil" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="surnamePupil">Прізвище</label>
                                <Field name="surnamePupil" type="text" disabled className={'form-control' + (errors.surnamePupil && touched.surnamePupil ? ' is-invalid' : '')} />
                                <ErrorMessage name="surnamePupil" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="dateOfBirthPupil">Дата народження</label>
                                <br />
                                <DatePicker
                                    disabled
                                    selected={values.dateOfBirthPupil}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfBirthPupil && touched.dateOfBirthPupil ? ' is-invalid' : '')}
                                    name="dateOfBirthPupil"
                                    locale="uk"
                                    onChange={date => setFieldValue('dateOfBirthPupil', date)}
                                />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label htmlFor="genderPupil">Гендер</label>
                            <Field name="genderPupil" as="select" disabled className={'form-control' + (errors.genderPupil && touched.genderPupil ? ' is-invalid' : '')}>
                                {this.state.genders.map((gender, i) => (
                                    <option key={gender.idGender} value={gender.idGender}>{gender.genderType}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailPupil">Електронна пошта</label>
                            <Field name="emailPupil" type="text"  className={'form-control' + (errors.emailPupil && touched.emailPupil ? ' is-invalid' : '')} />
                            <ErrorMessage name="emailPupil" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adressPupil">Адреса</label>
                            <Field name="adressPupil" type="text" className={'form-control' + (errors.adressPupil && touched.adressPupil ? ' is-invalid' : '')} />
                            <ErrorMessage name="adressPupil" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phonePupil">Номер телефону</label>
                            <Field name="phonePupil" type="text" className={'form-control' + (errors.phonePupil && touched.phonePupil ? ' is-invalid' : '')} />
                            <ErrorMessage name="phonePupil" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="motoPupil">Девіз</label>
                            <Field name="motoPupil" type="text" className={'form-control' + (errors.motoPupil && touched.motoPupil ? ' is-invalid' : '')} />
                            <ErrorMessage name="motoPupil" component="div" className="invalid-feedback" />
                        </div>
                        <div>
                            <h4>Фото учня</h4>
                            <img class="img-fluid" style={{ maxHeight: 250 + "px", marginBottom: 1 + "em" }} src={'data:image/png;base64,' + this.state.student.imageOfPupil}  />
                        </div>
                        <div className="form-group">
                            <label for="imageOfTeacher">Загрузити фото учня, якщо ви хочете змінити фото учня</label>
                            <br/>
                            <input
                                id="imageOfPupil"
                                type="file"
                                name="imageOfPupil"
                                onChange={(event) => {
                                    setFieldValue("imageOfPupil", event.currentTarget.files[0]);
                                }}
                            />
                        </div>

                        <div className="form-row">
                            <div className="form-group col">
                                <label htmlFor="passwordPupil">Пароль</label>
                                <Input name="passwordPupil" type={this.state.showPassword ? 'text' : 'password'} value={values.passwordPupil} className={'form-control' + (errors.passwordPupil && touched.passwordPupil ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('passwordPupil', password.target.value)}
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />} />
                                <ErrorMessage name="passwordPupil" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="confirmPasswordPupil">Підтвердити пароль</label>
                                <Input name="confirmPasswordPupil" type={this.state.showPassword ? 'text' : 'password'} value={values.confirmPasswordPupil} className={'form-control' + (errors.confirmPasswordPupil && touched.confirmPasswordPupil ? ' is-invalid' : '')}
                                    onChange={password => setFieldValue('confirmPasswordPupil', password.target.value)}
                                    icon={
                                        <Icon
                                            name={this.state.showPassword ? 'eye slash' : 'eye'}
                                            link
                                            onClick={this.onTogglePassword}
                                        />} />
                                <ErrorMessage name="confirmPasswordPupil" component="div" className="invalid-feedback" />
                            </div>                      
                        </div>
                   
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Змінити власні дані</button>
                            <button type="reset" className="btn btn-secondary">Повернути попередні дані</button>
                           
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

export { EditPersonalDataPupil }; 