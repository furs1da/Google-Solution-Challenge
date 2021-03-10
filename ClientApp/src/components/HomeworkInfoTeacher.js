import React from 'react';
import { render } from "react-dom";
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { authenticationService } from '../services';
import { userService } from '../services';
import { SelectField } from "./SelectField";
import DataTable from "react-data-table-component";
import uk from "date-fns/locale/uk";
registerLocale("uk", uk);

const MyTextArea = ({ label, ...props }) => {
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <textarea className="text-area" {...field} {...props} style={{ width: 100 + "%" }} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};

class HomeworkInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            firstSelectGroup: [],
            zeroSelectGroup: [],         
            firstSelectDisable: true,    
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllSubjectForTeacher().then(zeroSelectGroup => this.setState({ zeroSelectGroup }));
    }

    onChangeSubject(selected, setFieldValue) {
        setFieldValue('zeroSelect', selected.value)
        setFieldValue('firstSelect', '')


        userService.GetAllFlowsBySubjectAndTeacher(selected.value).then(firstSelectGroup => this.setState({ firstSelectGroup })).catch(error => this.setState({ error }));
        this.setState({
            firstSelectDisable: false,
        });
    }



    onChangeFlow(selected, setFieldValue) {
        setFieldValue('firstSelect', selected.value)
    }







    render() {
        return (
            <Formik
                initialValues={{
                    zeroSelect: '',
                    firstSelect: '',                   
                    title: '',
                    content: '',
                    attachement: '',
                    dueDate: new Date(),
                }}
                validationSchema={Yup.object().shape({
                    zeroSelect: Yup.string()
                        .required('Оберіть предмет'),
                    firstSelect: Yup.string()
                        .required('Оберіть паралель'),
                    title: Yup.string()
                        .required('Додайте тему домашнього завдання'),
                    content: Yup.string()
                        .required('Додайте зміст домашнього завдання'),
                    dueDate: Yup.date()
                        .required('Вкажіть дедлайн домашнього завдання')
                  
                })}
                onSubmit={({ zeroSelect, firstSelect, title, content, attachement, dueDate }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.CreateHomeworkInfo(zeroSelect, firstSelect, title, content, attachement, dueDate)
                        .then(
                            user => {
                                const { from } = this.props.location.state || { from: { pathname: "/" } };
                                this.props.history.push({
                                    pathname: '/listOfHomeworkInfos',
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
                        <h1>Задати домашне завдання</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="zeroSelect">Оберіть предмет</label>
                            <Select
                                placeholder="Оберіть предмет..."
                                name="zeroSelect"
                                options={this.state.zeroSelectGroup}
                                className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectAnnouncement => this.onChangeSubject(selectAnnouncement, setFieldValue)} />
                            <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="firstSelect">Оберіть паралель</label>
                            <Select
                                placeholder="Оберіть паралель..."
                                name="firstSelect"
                                options={this.state.firstSelectGroup}
                                className={'basic-multi-select' + (errors.firstSelect && touched.firstSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectRole => this.onChangeFlow(selectRole, setFieldValue)}
                                isDisabled={this.state.firstSelectDisable} />
                            <ErrorMessage name="firstSelect" component="div" className="invalid-feedback" />
                        </div> 
                        <div className="form-group col">
                            <label htmlFor="dueDate">Оберіть дедлайн</label>
                            <br />
                            <DatePicker
                                selected={values.dueDate}
                                dateFormat="MMMM d, yyyy"
                                className={'form-control' + (errors.dueDate && touched.dueDate ? ' is-invalid' : '')}
                                name="dueDate"
                                onChange={date => setFieldValue('dueDate', date)}
                                locale="uk"
                            />
                        </div>  

                        <div className="form-group col">
                            <label htmlFor="title">Тема домашьного завдання</label>
                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label>Опис домашнього задання</label>
                            <MyTextArea
                                label=""
                                name="content"
                                rows="15"
                                placeholder="Напишіть зміст домашньго завдання..."
                            />
                        </div>

                        <div className="form-group col">
                            <label for="attachement">Прикріпити файл</label>
                            <br />
                            <input
                                id="attachement"
                                type="file"
                                name="attachement"
                                onChange={(event) => {
                                    setFieldValue("attachement", event.currentTarget.files[0]);
                                }}
                            />
                        </div>
                      


                        <div className="form-group col">
                            <button type="submit" className="btn btn-primary mr-2">Опублікувати домашнє завдання</button>
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

export { HomeworkInfo }; 