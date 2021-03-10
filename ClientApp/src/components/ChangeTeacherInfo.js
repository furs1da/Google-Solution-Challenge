import React from 'react';
import { render } from "react-dom";
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Button, Icon, Popup, Input } from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';
import uk from "date-fns/locale/uk";
registerLocale("uk", uk);

class EditTeacher extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            genders: [],
            subjects: [], 
            teacher: '',
            subjectsSelected: [],
            dateOfBirthTeacherTemp: new Date(),
            showPassword: false,
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllGenders().then(genders => this.setState({ genders }));
        userService.GetAllSubjects().then(subjects => this.setState({ subjects }));
        userService.GetAllInfoTeacher(this.props.location.state.idTeacherList).then(teacher => this.setState({
            teacher: teacher,
            dateOfBirthTeacherTemp: new Date(teacher.dateOfBirth),
        })); 
        userService.GetAllSubjectsTeacher(this.props.location.state.idTeacherList).then(subjectsSelected => this.setState({ subjectsSelected }));
    }

    DeleteRecordConfirmed(setFieldValue, values) {
        userService.DeleteRecordTeacherAdmin(this.props.location.state.idTeacherList, values.adminCode).then(response => {
            console.log(response)
            setFieldValue("messageServer", response)
            if (response === "Доступ дозволений!") {
                this.props.history.push({
                    pathname: '/listOfTeachers',
                });
            }
        }).catch(error => this.setState({ error }));
    }
    ReturnRecord(setFieldValue) {
        userService.GetAllGenders().then(genders => this.setState({ genders })).catch(error => this.setState({ error }));
        userService.GetAllSubjects().then(subjects => this.setState({ subjects })).catch(error => this.setState({ error }));
        userService.GetAllInfoTeacher(this.props.location.state.idTeacherList).then(teacher => this.setState({
            teacher: teacher,
            dateOfBirthTeacherTemp: new Date(teacher.dateOfBirth),
        })).catch(error => this.setState({ error }));
        userService.GetAllSubjectsTeacher(this.props.location.state.idTeacherList).then(subjectsSelected => this.setState({ subjectsSelected })).catch(error => this.setState({ error }));


        setFieldValue("nameTeacher", this.state.teacher.name)
        setFieldValue("patronymicTeacher", this.state.teacher.patronymic)
        setFieldValue("surnameTeacher", this.state.teacher.surname)
        setFieldValue("emailTeacher", this.state.teacher.email)
        setFieldValue("passwordTeacher", this.state.teacher.password)
        setFieldValue("confirmPasswordTeacher", this.state.teacher.password)
        setFieldValue("dateOfBirthTeacher", this.state.dateOfBirthTeacherTemp)
        setFieldValue("genderTeacher", this.state.teacher.gender)
        setFieldValue("phoneTeacher", this.state.teacher.phone)
        setFieldValue("adressTeacher", this.state.teacher.adress)
        setFieldValue("selectedOption", this.state.subjectsSelected)
    }
    DeleteRecord(setFieldValue, values)  {
        confirmAlert({
            title: "Підтвердіть дію",
            message: "Ви впевнені, що хочете видалити цей обліковий запис?",
            buttons: [
                {
                    label: "Так",
                    onClick: () => { this.DeleteRecordConfirmed(setFieldValue, values) }
                },
                {
                    label: "Ні"
                }
            ]
        });
    };
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
                    adminCode: '',
                    messageServer: ''
                }}
           
                validationSchema={Yup.object().shape({
                    nameTeacher: Yup.string()
                        .required("Ім'я  обов'язкове."),
                    patronymicTeacher: Yup.string()
                        .required("По батькові обов'язкове."),
                    surnameTeacher: Yup.string()
                        .required("Прізвище обов'язкове."),
                    emailTeacher: Yup.string()
                        .email('Неправильний формат пошти.')
                        .required("Пошта обов'язкова."),
                    passwordTeacher: Yup.string()
                        .min(6, 'Пароль повинен містити хоча б 6 символів!')
                        .required("Пароль обов'язковий"),
                    confirmPasswordTeacher: Yup.string()
                        .oneOf([Yup.ref('passwordTeacher'), null], 'Паролі не співпадають!')
                        .required('Треба підтвердити пароль!'),
                    phoneTeacher: Yup.string()
                        .required("Номер телефону обов'язковий"),
                    genderTeacher: Yup.string()
                        .required("Оберіть гендер"),
                    adressTeacher: Yup.string()
                        .required("Адреса обов'язкова"),
                    dateOfBirthTeacher: Yup.date()
                        .required("Дата народження обов'язкова!"),
                    selectedOption: Yup.array()
                        .min(1, "Оберіть будь ласка хоча б один предмет").nullable().required("1 предмет обов'язковий")
                        .of(
                            Yup.object()
                                .shape({
                                    label: Yup.string(),
                                    value: Yup.string()
                                })

                    ),
                    adminCode: Yup.string()
                        .required('Введіть спеціальний код для створення облікового запису админістратора')
                })}
                enableReinitialize
                onSubmit={({ nameTeacher, patronymicTeacher, surnameTeacher, emailTeacher, passwordTeacher, dateOfBirthTeacher, genderTeacher, phoneTeacher, adressTeacher, imageOfTeacher, selectedOption, adminCode}, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.changeTeacher(nameTeacher, patronymicTeacher, surnameTeacher, emailTeacher, passwordTeacher, dateOfBirthTeacher, genderTeacher, phoneTeacher, adressTeacher, imageOfTeacher, selectedOption, this.props.location.state.idTeacherList, adminCode)
                        .then(
                            user => {
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
                        <h1>Змінити дані про вчителя</h1>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label htmlFor="nameTeacher">Ім'я</label>
                                <Field name="nameTeacher" type="text" className={'form-control' + (errors.nameTeacher && touched.nameTeacher ? ' is-invalid' : '')}/>
                                <ErrorMessage name="nameTeacher" component="div" className="invalid-feedback" />
                            </div>                
                            <div className="form-group col-5">
                                <label htmlFor="patronymicTeacher">По батькові</label>
                                <Field name="patronymicTeacher" type="text" className={'form-control' + (errors.patronymicTeacher && touched.patronymicTeacher ? ' is-invalid' : '')}  />
                                <ErrorMessage name="patronymicTeacher" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col-5">
                                <label htmlFor="surnameTeacher">Прізвище</label>
                                <Field name="surnameTeacher" type="text" className={'form-control' + (errors.surnameTeacher && touched.surnameTeacher ? ' is-invalid' : '')} />
                                <ErrorMessage name="surnameTeacher" component="div" className="invalid-feedback" />
                            </div>
                            <div className="form-group col">
                                <label htmlFor="dateOfBirthTeacher">Дата народження</label>
                                <br />
                                <DatePicker
                                    selected={values.dateOfBirthTeacher}
                                    dateFormat="MMMM d, yyyy"
                                    className={'form-control' + (errors.dateOfBirthTeacher && touched.dateOfBirthTeacher ? ' is-invalid' : '')}
                                    name="dateOfBirthTeacher"
                                    defaultValue={this.state.teacher.dateOfBirth }
                                    onChange={date => setFieldValue('dateOfBirthTeacher', date)}
                                    showMonthDropdown
                                    showYearDropdown
                                    adjustDateOnChange
                                    dropdownMode="select"
                                    locale="uk"
                                />
                            </div>
                        </div>
                        <div className="form-group col">
                            <label htmlFor="genderTeacher">Гендер</label>
                            <Field name="genderTeacher" as="select" placeholder="Оберіть гендер..." className={'form-control' + (errors.genderTeacher && touched.genderTeacher ? ' is-invalid' : '')} >
                                {this.state.genders.map((gender, i) => (
                                    <option key={gender.idGender} value={gender.idGender}>{gender.genderType}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="emailTeacher">Електронна пошта</label>
                            <Field name="emailTeacher" type="text" className={'form-control' + (errors.emailTeacher && touched.emailTeacher ? ' is-invalid' : '')} autoComplete="off"/>
                            <ErrorMessage name="emailTeacher" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adressTeacher">Адреса</label>
                            <Field name="adressTeacher" type="text" className={'form-control' + (errors.adressTeacher && touched.adressTeacher ? ' is-invalid' : '')} />
                            <ErrorMessage name="adressTeacher" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="phoneTeacher">Номер телефону</label>
                            <Field name="phoneTeacher" type="text" className={'form-control' + (errors.phoneTeacher && touched.phoneTeacher ? ' is-invalid' : '')}  />
                            <ErrorMessage name="phoneTeacher" component="div" className="invalid-feedback" />
                        </div>
                        <div>
                        <h4>Фото вчителя</h4>
                            <img class="img-fluid" style={{ maxHeight: 250 + "px", marginBottom: 1 + "em" }} src={'data:image/png;base64,' + this.state.teacher.imageOfTeacher} /> 
                        </div>
                        <div className="form-group">
                            <label for="imageOfTeacher">Загрузити фото вчителя, якщо ви хочете змінити фото вчителя</label>
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
                                <label htmlFor="passwordTeacher">Пароль</label>
                                <Input name="passwordTeacher" type={this.state.showPassword ? 'text' : 'password'} value={values.passwordTeacher} className={'form-control' + (errors.passwordTeacher && touched.passwordTeacher ? ' is-invalid' : '')}
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
                                <label htmlFor="confirmPasswordTeacher">Підтвердити пароль</label>
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
                            <label htmlFor="selectedOption">Оберіть предмети, які буде вести вчитель</label>
                            <Select
                                placeholder="Оберіть предмети..."
                                isMulti
                                name="selectedOption"
                                menuPlacement="top"
                                options={this.state.subjects}
                                value={values.selectedOption}
                                className={'basic-multi-select' + (errors.selectedOption && touched.selectedOption ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectLessons => setFieldValue('selectedOption', selectLessons)} />
                            <ErrorMessage name="selectedOption" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label htmlFor="adminCode">Код доступу</label>
                            <Field name="adminCode" type="text" className={'form-control' + (errors.adminCode && touched.adminCode ? ' is-invalid' : '')} />
                            <ErrorMessage name="adminCode" component="div" className="invalid-feedback" />
                        </div>       
                        <div class="row" >
                            <div class="col" class="pull-left">  <button type="submit" className="btn btn-primary mr-2" style={{ marginTop: 0.5 + "em" }}>Змінити  обліковий запис адміністратора</button> </div>

                            <div class="col" class="pull-left">   <button type="button" className="btn btn-secondary" style={{ marginTop: 0.5 + "em" }} onClick={selectValue => this.ReturnRecord(setFieldValue)}>Повернути попередні дані</button> </div>

                            <div class="col" class="pull-left">    <Button type="button" animated basic color='red' style={{ marginTop: 0.5 + "em", marginLeft: 0.5 + "em", marginBottom: 1 + "em" }} onClick={selectValue => this.DeleteRecord(setFieldValue, values)}>
                                <Button.Content visible>Видалити обліковий запис</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='trash' />
                                </Button.Content>
                            </Button>
                            </div></div>
                        {values.messageServer &&
                            <div className={'alert alert-danger'}>{values.messageServer}</div>
                        }
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                        }
                        {status &&
                            <div className={'alert alert-danger'}>{status}</div>
                        }
                    </Form>
                )}
            </Formik>
        )
    }
}

export { EditTeacher }; 