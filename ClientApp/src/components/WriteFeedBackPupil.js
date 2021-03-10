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
import { Button, Table } from 'react-bootstrap';

const MyTextArea = ({ label, ...props }) => {
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
class FeedBackPupil extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            secondSelectGroup: [],
            thirdSelectGroup: [],
            receiver: 'Оберіть отримувача',
            secondSelectText: 'Оберіть адмністратора',
            thirdSelectText: 'Оберіть клас',
            secondSelectVisibility: false,
            thirdSelectVisibility: false,
            secondSelectDisable: true,
            thirdSelectDisable: true,
            error: '',
            roles: [
                {
                    value: "1",
                    label: "Адміністратор"
                },
                {
                    value: "2",
                    label: "Вчитель"
                },
                {
                    value: "3",
                    label: "Класний керівник"
                }
            ]
        };
    }

    componentDidMount() {

    }

    onChangeRole(selected, setFieldValue) {
        setFieldValue('firstSelect', selected.value)

        this.setState({
            thirdSelectVisibility: false,
            receiver: 'Оберіть отримувача',
        });

        setFieldValue('secondSelect', '')
        setFieldValue('thirdSelect', '')


        if (selected.value === "1") {
            userService.GetAllAdmins().then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                secondSelectVisibility: true,
                secondSelectDisable: false,
                secondSelectText: 'Оберіть адмністратора',
            });
        }
        else if (selected.value === "2") {
            userService.GetAllSubjectsPupil().then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                secondSelectVisibility: true,
                secondSelectDisable: false,
                secondSelectText: 'Оберіть предмет',
            });
        }
        else {
            userService.GetClassRoomTeacherForClassPupil().then(receiverLabel => this.setState({ receiver: receiverLabel, })).catch(error => this.setState({ error }));
            this.setState({
                secondSelectVisibility: false,
            });
        }
    }

    onChangeSecondSelect(selected, setFieldValue, values) {
        setFieldValue('secondSelect', selected.value)

        this.setState({
            thirdSelectVisibility: false,
            receiver: 'Оберіть отримувача',
        });

        setFieldValue('thirdSelect', '')




        if (values.firstSelect === "1") {
            this.setState({
                receiver: selected.label,
            });
        }
        else if (values.firstSelect === "2") {
            userService.GetSubjectTeachersPupil(selected.value).then(thirdSelectGroup => this.setState({ thirdSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                thirdSelectDisable: false,
                thirdSelectText: 'Оберіть вчителя',
                thirdSelectVisibility: true,
            });
        }
    }


    onChangeThirdSelect(selected, setFieldValue, values) {
        setFieldValue('thirdSelect', selected.value)

        this.setState({
            receiver: selected.label,
        });
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
                        .required('Вкажіть тему!'),
                    content: Yup.string()
                        .required('Додайте зміст!')
                })}
                onSubmit={({ firstSelect, secondSelect, thirdSelect, title, content, attachement }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.CreatePupilFeedBack(firstSelect, secondSelect, thirdSelect, title, content, attachement)
                        .then(
                            user => {
                                this.props.history.push({
                                    pathname: '/watchFeedbackPupil',
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
                    <Form className="justify-content-md-center">
                        <div class="container">
                            <h1>Написати повідомлення</h1>
                            <hr />
                            <h3>{this.state.receiver}</h3>
                        <div className="form-group col">
                            <label htmlFor="firstSelect">Оберіть тип людини</label>
                            <Select
                                placeholder="Оберіть тип людини..."
                                name="firstSelect"
                                options={this.state.roles}
                                className={'basic-multi-select' + (errors.firstSelect && touched.firstSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectRole => this.onChangeRole(selectRole, setFieldValue)} />
                            <ErrorMessage name="firstSelect" component="div" className="invalid-feedback" />
                        </div>
                        {this.state.secondSelectVisibility === true &&
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
                        }
                        {this.state.thirdSelectVisibility === true &&
                            <div className="form-group col">
                                <label htmlFor="thirdSelect">{this.state.thirdSelectText}</label>
                            <Select
                                placeholder="Оберіть..."
                                    name="thirdSelect"
                                    options={this.state.thirdSelectGroup}
                                    className={'basic-multi-select' + (errors.thirdSelect && touched.thirdSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectValue => this.onChangeThirdSelect(selectValue, setFieldValue, values)}
                                    isDisabled={this.state.thirdSelectDisable}
                                />
                                <ErrorMessage name="thirdSelect" component="div" className="invalid-feedback" />
                            </div>
                        }
                        <div className="form-group col">
                            <label htmlFor="title">Тема</label>
                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <MyTextArea
                                label="Content"
                                name="content"
                                rows="10"
                                placeholder="Напишіть зміст повідомлення..."
                            />
                        </div>

                            <div className="form-group col">
                                <label for="attachement">Прикріпити файл</label>
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


                            <div class="col" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <Button type="submit" block variant="primary">Надіслати</Button>
                                <Button type="reset" block variant="secondary">Скинути дані</Button>
                            </div>
                        {status &&
                            <div className={'alert alert-danger'}>{status}</div>
                        }
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                            }
                            </div>
                    </Form>
                )}
            </Formik>
        )
    }
}

export { FeedBackPupil }; 