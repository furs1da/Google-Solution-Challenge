import React from 'react';
import { render } from "react-dom";
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { authenticationService } from '../services';
import { userService } from '../services';
import { SelectField } from "./SelectField";
import DataTable from "react-data-table-component";

const MyTextArea = ({ label, ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and alse replace ErrorMessage entirely.
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <textarea className="text-area" {...field} {...props} style={{ width: 100 + "%" }}/>
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};

class PostTeacher extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            firstSelectGroup: [],
            secondSelectGroup: [],         
            secondSelectText: 'Оберіть паралель',
            secondSelectDisable: true,
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllSubjectForTeacher().then(firstSelectGroup => this.setState({ firstSelectGroup }));
    }

    onChangeSubject(selected, setFieldValue) {
        setFieldValue('firstSelect', selected.value)
        setFieldValue('secondSelect', '')

        userService.GetAllFlowsBySubjectAndTeacher(selected.value).then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
        this.setState({
            secondSelectDisable: false,
        });
    }

    onChangeSecondSelect(selected, setFieldValue, values) {
        setFieldValue('secondSelect', selected.value)     
    }


    onChangeThirdSelect(selected, setFieldValue, values) {
        setFieldValue('thirdSelect', selected.value)       
    }

        render() {
            return (
                <Formik
                    initialValues={{
                        firstSelect: '',
                        secondSelect: '',
                        thirdSelect: '',
                        title: '',
                        content: '',
                        attachement: '',

                    }}

                    validationSchema={Yup.object().shape({
                        title: Yup.string()
                            .required('Заповніть будь ласка тему!'),
                        content: Yup.string()
                            .required('Заповніть будь ласка зміст!')
                    })}
                    onSubmit={({ firstSelect, secondSelect, title, content, attachement }, { setStatus, setSubmitting }) => {
                        setStatus();
                        userService.CreateTeacherPost(firstSelect, secondSelect, title, content, attachement)
                            .then(
                                user => {
                                    this.props.history.push({
                                        pathname: '/listOfTeachersPosts',
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
                            <h1>Опублікувати пост</h1>
                            <hr />
                            <div className="form-group col">
                                <label htmlFor="firstSelect">Оберіть предмет</label>
                                <Select
                                    placeholder="Оберіть предмет..."
                                    name="firstSelect"
                                    options={this.state.firstSelectGroup}
                                    className={'basic-multi-select' + (errors.firstSelect && touched.firstSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectAnnouncement => this.onChangeSubject(selectAnnouncement, setFieldValue)} />
                                <ErrorMessage name="firstSelect" component="div" className="invalid-feedback" />
                            </div>

                            <div className="form-group col">
                                <label htmlFor="secondSelect">{this.state.secondSelectText}</label>
                                <Select
                                    placeholder="Оберіть..."
                                    name="secondSelect"
                                    options={this.state.secondSelectGroup}
                                    className={'basic-multi-select' + (errors.secondSelect && touched.secondSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectValue => this.onChangeSecondSelect(selectValue, setFieldValue, values)}
                                    isDisabled={this.state.secondSelectDisable}
                                />
                                <ErrorMessage name="secondSelect" component="div" className="invalid-feedback" />
                            </div>


                            <div className="form-group col">
                                <label htmlFor="title">Тема</label>
                                <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                                <ErrorMessage name="title" component="div" className="invalid-feedback" />
                            </div>

                            <div className="form-group col">
                                <label>Зміст уроку</label>
                                <MyTextArea
                                    label=""
                                    name="content"
                                    rows="10"
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
                                <button type="submit" className="btn btn-primary mr-2">Опублікувати урок</button>
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


export { PostTeacher }; 