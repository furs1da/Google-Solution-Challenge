import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
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
class FeedBackTeacher extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            error: '',
            secondSelectGroup: [],
            thirdSelectGroup: [],
            fourthSelectGroup: [],
            fifthSelectGroup: [],
            receiver: 'Select receiver',
            secondSelectText: 'Select administrator',
            thirdSelectText: 'Select...',
            fourthSelectText: 'Select...',
            fifthSelectText: 'Select...',
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
                    label: "Administrator"
                },
                {
                    value: "2",
                    label: "Teacher"
                },
                {
                    value: "3",
                    label: "Classroom Teacher"
                },
                {
                    value: "4",
                    label: "Student"
                },
                {
                    value: "5",
                    label: "Parents"
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
            fourthSelectVisibility: false,
            fifthelectVisibility: false,
            receiver: 'Select receiver',
        });

        setFieldValue('secondSelect', '')
        setFieldValue('thirdSelect', '')
        setFieldValue('fourthSelect', '')
        setFieldValue('fifthSelect', '')


        if (selected.value === "1") {
            userService.GetAllAdmins().then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                secondSelectDisable: false,
                secondSelectText: 'Select administrator',
            });
        }
        else if (selected.value === "2") {
            userService.GetAllSubjects().then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                secondSelectDisable: false,
                secondSelectText: 'Select subject',
            });
        }
        else {
            userService.GetAllFlowsTeacher().then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                secondSelectDisable: false,
                secondSelectText: 'Select grade',
            });
        }
    }

    onChangeSecondSelect(selected, setFieldValue, values) {
        setFieldValue('secondSelect', selected.value)

        this.setState({
            thirdSelectVisibility: false,
            fourthSelectVisibility: false,
            fifthelectVisibility: false,
            receiver: 'Select receiver',
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
                thirdSelectText: 'Select teacher',
                thirdSelectVisibility: true,
            });
        }
        else {
            userService.GetFlowClassLettersTeacher(selected.value).then(thirdSelectGroup => this.setState({ thirdSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                thirdSelectDisable: false,
                thirdSelectText: 'Select grade',
                thirdSelectVisibility: true,
            });
        }
    }


    onChangeThirdSelect(selected, setFieldValue, values) {

        setFieldValue('thirdSelect', selected.value)

        this.setState({
            fourthSelectVisibility: false,
            fifthelectVisibility: false,
            receiver: 'Select receiver',
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
                fourthSelectText: 'Select student',
                fourthSelectVisibility: true,
            });
        }
    }


    onChangeFourthSelect(selected, setFieldValue, values) {

        setFieldValue('fourthSelect', selected.value)
        this.setState({
            receiver: 'Select receiver',
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
                fourthSelectText: "Select student",
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
                        .required('Select topic!'),
                    content: Yup.string()
                        .required('Add content!')
                })}
                onSubmit={({ firstSelect, secondSelect, thirdSelect, fourthSelect, fifthSelect, title, content, attachement }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.CreateTeacherFeedBack(firstSelect, secondSelect, thirdSelect, fourthSelect, fifthSelect, title, content, attachement)
                        .then(
                            user => {
                            this.props.history.push({
                                pathname: '/watchFeedbackTeacher',
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
                            <h1>Send mail</h1>
                            <hr />
                            <h3>{this.state.receiver}</h3>
                        <div className="form-group col">
                            <label htmlFor="firstSelect">Select type of person</label>
                            <Select
                                    placeholder="Select type of person..."
                                name="firstSelect"
                                options={this.state.roles}
                                className={'basic-multi-select' + (errors.firstSelect && touched.firstSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectRole => this.onChangeRole(selectRole, setFieldValue)} />
                            <ErrorMessage name="firstSelect" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="secondSelect">{this.state.secondSelectText}</label>
                            <Select
                                placeholder="Select..."
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
                                placeholder="Select..."
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

                        {this.state.fourthSelectVisibility === true &&
                            <div className="form-group col">
                                <label htmlFor="fourthSelect">{this.state.fourthSelectText}</label>
                            <Select
                                placeholder="Select..."
                                    name="fourthSelect"
                                    options={this.state.fourthSelectGroup}
                                    className={'basic-multi-select' + (errors.fourthSelect && touched.fourthSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectValue => this.onChangeFourthSelect(selectValue, setFieldValue, values)}
                                    isDisabled={this.state.fourthSelectDisable}
                                />
                                <ErrorMessage name="fourthSelect" component="div" className="invalid-feedback" />
                            </div>
                        }
                        {this.state.fifthelectVisibility === true &&
                            <div className="form-group col">
                                <label htmlFor="fifthSelect">{this.state.fifthSelectText}</label>
                            <Select
                                placeholder="Select parent..."
                                    name="fifthSelect"
                                    options={this.state.fifthSelectGroup}
                                    className={'basic-multi-select' + (errors.fifthSelect && touched.fifthSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectValue => this.onChangeFifthSelect(selectValue, setFieldValue)}
                                    isDisabled={this.state.fifthelectDisable}

                                />
                                <ErrorMessage name="flow" component="div" className="invalid-feedback" />
                            </div>
                        }
                        <div className="form-group col">
                            <label htmlFor="title">Topic</label>
                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <MyTextArea
                                label="Content"
                                name="content"
                                rows="10"
                                    placeholder="Add content..."
                            />
                        </div>

                        <div className="form-group col">
                                <label for="attachement">Attach a file</label>
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


                            <div class="col" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <Button type="submit" block variant="primary">Send</Button>
                                <Button type="reset" block variant="secondary">Reset data</Button>
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

export { FeedBackTeacher }; 