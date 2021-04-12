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
            <textarea className="text-area" {...field} {...props} style={{ width: 100 + "%" }} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};
class FeedBackClassRoomTeacher extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            error: '',
            secondSelectGroup: [],
            thirdSelectGroup: [],
            receiver: 'Select receiver',
            secondSelectText: 'Select student',
            thirdSelectText: 'Select parent',
            secondSelectVisibility: false,
            thirdSelectVisibility: false,
            secondSelectDisable: true,
            thirdSelectDisable: true,
            pageAccess: false,
            roles: [
                {
                    value: "1",
                    label: "Student"
                },
                {
                    value: "2",
                    label: "Parent"
                }
            ]
        };
    }

    componentDidMount() {
        userService.CheckTeacherForClassroomTeacher().then(pageAccess => this.setState({ pageAccess }));
    }

    onChangeRole(selected, setFieldValue) {
        setFieldValue('firstSelect', selected.value)

        this.setState({
            secondSelectVisibility: true,
            secondSelectDisable: false,
            thirdSelectVisibility: false,
            receiver: 'Select receiver',
        });

        setFieldValue('secondSelect', '')
        setFieldValue('thirdSelect', '')
        userService.GetStudentsClassroomTeacher().then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
    }

    onChangeSecondSelect(selected, setFieldValue, values) {
        setFieldValue('secondSelect', selected.value)

        this.setState({
            thirdSelectVisibility: false,

            receiver: 'Select receiver',
        });

        setFieldValue('thirdSelect', '')


        if (values.firstSelect === "1") {
            this.setState({
                receiver: selected.label,
            });
        }
        else if (values.firstSelect === "2") {
            userService.GetAllParentsForPupil(selected.value).then(thirdSelectGroup => this.setState({ thirdSelectGroup })).catch(error => this.setState({ error }));
            this.setState({
                thirdSelectDisable: false,
                thirdSelectText: 'Select parent',
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
                        .required('Add topic!'),
                    content: Yup.string()
                        .required('Add content!')
                })}
                onSubmit={({ firstSelect, secondSelect, thirdSelect, title, content, attachement }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.CreateClassRoomTeacherFeedBack(firstSelect, secondSelect, thirdSelect, title, content, attachement)
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
                    <Form>
                        {this.state.pageAccess === false &&
                            <h1>You are not a classroom teacher</h1>
                        }
                        {this.state.pageAccess === true &&
                            <div>
                            <h1>Send message</h1>
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
                                {this.state.secondSelectVisibility === true &&
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
                                }
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
                                <label for="attachement">Attach file</label>
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
                            </div>}
                        

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

export { FeedBackClassRoomTeacher }; 