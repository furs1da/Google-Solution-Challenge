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

class AnnouncementAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            secondSelectGroup: [],
            thirdSelectGroup: [],         
            secondSelectText: 'Оберіть одного з адміністраторів',
            thirdSelectText: 'Оберіть клас',
            thirdSelectVisibility: false,
            secondSelectDisable: true,
            thirdSelectDisable: true,
            error: '',
            announcements: [
                {
                    value: "1",
                    label: "Оголошення для вчителів певного предмету"
                },
                {
                    value: "2",
                    label: "Оголошення для певної паралелі"
                },
                {
                    value: "3",
                    label: "Оголошення для певного типу людей"
                },
                {
                    value: "4",
                    label: "Оголошення для певного класу"
                }
            ]
        };
    }

    componentDidMount() {

    }

    onChangeType(selected, setFieldValue) {
        setFieldValue('firstSelect', selected.value)

        this.setState({
            thirdSelectVisibility: false,
            fourthSelectVisibility: false,         
        });

        setFieldValue('secondSelect', '')
        setFieldValue('thirdSelect', '')

        if (selected.value === "1") {
            userService.GetAllSubjects().then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                secondSelectDisable: false,
                secondSelectText: 'Оберіть предмет',
            });
        }
        else if (selected.value === "3") {
            userService.GetAllRoles().then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                secondSelectDisable: false,
                secondSelectText: 'Оберіть тип людей',
            });
        }
        else {
            userService.GetAllFlows().then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                secondSelectDisable: false,
                secondSelectText: 'Оберіть паралель',
            });
        }
    }

    onChangeSecondSelect(selected, setFieldValue, values) {
        setFieldValue('secondSelect', selected.value)

        this.setState({
            thirdSelectVisibility: false,
            fourthSelectVisibility: false,         
        });

        setFieldValue('thirdSelect', '')
        setFieldValue('fourthSelect', '')


        if (values.firstSelect === "4") {
            userService.GetFlowClassLetters(selected.value).then(thirdSelectGroup => this.setState({ thirdSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                thirdSelectDisable: false,
                thirdSelectText: 'Оберіть клас',
                thirdSelectVisibility: true,
            });   
        }
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
                        .required('Необхідно написати тему оголошення!'),
                    content: Yup.string()
                        .required('Необхідно написати зміст оголошення!')
                })}
                onSubmit={({ firstSelect, secondSelect, thirdSelect, title, content, attachement }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.CreateAdminAnnouncement(firstSelect, secondSelect, thirdSelect, title, content, attachement)
                        .then(
                            user => {
                                this.props.history.push({
                                    pathname: '/listOfAnnouncements',
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
                        <h1>Зробити оголошення</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="firstSelect">Оберіть тип людини</label>
                            <Select
                                placeholder="Оберіть тип людини..."
                                name="firstSelect"
                                options={this.state.announcements}
                                className={'basic-multi-select' + (errors.firstSelect && touched.firstSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectAnnouncement => this.onChangeType(selectAnnouncement, setFieldValue)} />
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

                        {this.state.thirdSelectVisibility === true &&
                            <div className="form-group col">
                                <label htmlFor="thirdSelect">{this.state.thirdSelectText}</label>
                            <Select
                                    placeholder="Оберіть..."
                                    name="thirdSelect"
                                    options={this.state.thirdSelectGroup}
                                    className={'basic-multi-select' + (errors.thirdSelect && touched.thirdSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectValue => setFieldValue('thirdSelect', selectValue.value) }
                                    isDisabled={this.state.thirdSelectDisable}
                                />
                                <ErrorMessage name="thirdSelect" component="div" className="invalid-feedback" />
                            </div>
                        }


                        <div className="form-group col">
                            <label htmlFor="title">Title</label>
                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <MyTextArea
                                label="Content"
                                name="content"
                                rows="10"
                                placeholder="Напишіть зміст оголошення..."
                            />
                        </div>

                        <div className="form-group col">
                            <label for="attachement">Додати файл</label>
                            <br/>
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
                            <button type="submit" className="btn btn-primary mr-2">Зробити оголошення</button>
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

export { AnnouncementAdmin }; 