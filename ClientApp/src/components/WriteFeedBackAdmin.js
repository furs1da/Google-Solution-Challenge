import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
import { Button, Table } from 'react-bootstrap';

const MyTextArea = ({ label, ...props }) => {
    // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
    // which we can spread on <input> and alse replace ErrorMessage entirely.
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <textarea className="text-area" {...field} {...props} style={{ width: 100+"%"}} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};
class FeedBackAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            secondSelectGroup: [],
            thirdSelectGroup: [],
            fourthSelectGroup: [],
            fifthSelectGroup: [],
            receiver: 'Оберіть отримувача',
            secondSelectText: 'Оберіть адмністратора',
            thirdSelectText: 'Оберіть клас',
            fourthSelectText: 'Оберіть учня',
            fifthSelectText: 'Оберіть одного з батьків',
            thirdSelectVisibility: false,
            fourthSelectVisibility: false,
            fifthelectVisibility: false,
            secondSelectDisable: true,
            thirdSelectDisable: true,
            fourthSelectDisable: true,
            fifthelectDisable: true,
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
                },
                {
                    value: "4",
                    label: "Учень"
                },
                {
                    value: "5",
                    label: "Батьки"
                }
            ],
             error: '',
        };
    }

    componentDidMount() {

    }

    onChangeRole(selected, setFieldValue) {
        setFieldValue('firstSelect', selected.value)

        this.setState({
            thirdSelectVisibility: false,
            fourthSelectVisibility: false,
            fifthelectVisibility: false,
            receiver: 'Оберіть отримувача',
        });

        setFieldValue('secondSelect', '')
        setFieldValue('thirdSelect', '')
        setFieldValue('fourthSelect', '')
        setFieldValue('fifthSelect', '')


        if (selected.value === "1") {
            userService.GetAllAdmins().then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                secondSelectDisable: false,
                secondSelectText: 'Оберіть адмністратора',
            });
        }
        else if (selected.value === "2") {
            userService.GetAllSubjects().then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                secondSelectDisable: false,
                secondSelectText: 'Оберіть предмет',
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
            fifthelectVisibility: false,
            receiver: 'Оберіть отримувача',
        });

        setFieldValue('thirdSelect', '')
        setFieldValue('fourthSelect', '')
        setFieldValue('fifthSelect', '')



        if (values.firstSelect === "1") {
            this.setState({
                receiver: selected.label,
            });
        }
        else if (values.firstSelect === "2") {
            userService.GetSubjectTeachers(selected.value).then(thirdSelectGroup => this.setState({ thirdSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                thirdSelectDisable: false,
                thirdSelectText: 'Оберіть вчителя',
                thirdSelectVisibility: true,
            });
        }
        else {
            userService.GetFlowClassLetters(selected.value).then(thirdSelectGroup => this.setState({ thirdSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                thirdSelectDisable: false,
                thirdSelectText: 'Оберіть клас',
                thirdSelectVisibility: true,
            });
        }
    }


    onChangeThirdSelect(selected, setFieldValue, values) {

        setFieldValue('thirdSelect', selected.value)

        this.setState({
            fourthSelectVisibility: false,
            fifthelectVisibility: false,
            receiver: 'Оберіть отримувача',
        });

        setFieldValue('fourthSelect', '')
        setFieldValue('fifthSelect', '')

        if (values.firstSelect === "2") {
            this.setState({
                receiver: selected.label,
            });
        }
        else if (values.firstSelect === "3") {
            userService.GetClassRoomTeacherForClass(values.secondSelect, selected.value).then(receiverLabel => this.setState({ receiver: receiverLabel, })).catch(error => this.setState({ error }));
        }
        else {
            userService.GetAllPupilsForClass(values.secondSelect, selected.value).then(fourthSelectGroup => this.setState({ fourthSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                fourthSelectDisable: false,
                fourthSelectText: 'Оберіть учня',
                fourthSelectVisibility: true,
            });
        }
    }


    onChangeFourthSelect(selected, setFieldValue, values) {

        setFieldValue('fourthSelect', selected.value)
        this.setState({
            receiver: 'Оберіть отримувача',
            fifthelectVisibility: false,
        });

        setFieldValue('fifthSelect', '')


        if (values.firstSelect === "4") {
            this.setState({
                receiver: selected.label,
            });
        }
        else {
            userService.GetAllParentsForPupil(selected.value).then(fifthSelectGroup => this.setState({ fifthSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                fifthelectVisibility: true,
                fourthSelectText: 'Оберіть одного з батьків',
                fifthelectDisable: false,
            });
        }
    }

    onChangeFifthSelect(selected, setFieldValue) {

        setFieldValue('fifthSelect', selected.value)
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
                    fourthSelect: '',
                    fifthSelect: '',
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
                onSubmit={({ firstSelect, secondSelect, thirdSelect, fourthSelect, fifthSelect, title, content, attachement }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.CreateAdminFeedBack(firstSelect, secondSelect, thirdSelect, fourthSelect, fifthSelect, title, content, attachement)
                        .then(
                            user => {
                                this.props.history.push({
                                    pathname: '/watchFeedbackAdmin',
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
                            <div class="row">
                        <div class="col">
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

                        <div className="col">
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
                            </div> <div class="row">
                        {this.state.thirdSelectVisibility === true &&
                            <div className="col">
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
                                }   </div><div class="row">

                        {this.state.fourthSelectVisibility === true &&
                            <div className="form-group col">
                                <label htmlFor="fourthSelect">{this.state.fourthSelectText}</label>
                            <Select
                                placeholder="Оберіть..."
                                    name="fourthSelect"
                                    options={this.state.fourthSelectGroup}
                                    className={'basic-multi-select' + (errors.fourthSelect && touched.fourthSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectValue => this.onChangeFourthSelect(selectValue, setFieldValue, values)}
                                    isDisabled={this.state.fourthSelectDisable}
                                />
                                <ErrorMessage name="fourthSelect" component="div" className="invalid-feedback" />
                            </div>
                            }   </div><div class="row">
                        {this.state.fifthelectVisibility === true &&
                            <div className="col">
                                <label htmlFor="fifthSelect">{this.state.fifthSelectText}</label>
                            <Select
                                placeholder="Оберіть..."
                                    name="fifthSelect"
                                    options={this.state.fifthSelectGroup}
                                    className={'basic-multi-select' + (errors.fifthSelect && touched.fifthSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectValue => this.onChangeFifthSelect(selectValue, setFieldValue)}
                                    isDisabled={this.state.fifthelectDisable}

                                />
                                <ErrorMessage name="flow" component="div" className="invalid-feedback" />
                            </div>
                                }   </div>
                            <div class="row">
                        <div className="col">
                            <label htmlFor="title">Тема</label>
                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>
                            </div>
                            <div class="row">
                                <div className="col">
                             <label htmlFor="content">Зміст</label>
                            <MyTextArea                              
                                name="content"
                                rows="10"
                                placeholder="Напишіть зміст повідомлення..."
                            />
                        </div>
                            </div>
                            <div class="row">
                        <div class ="col">
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

export { FeedBackAdmin }; 