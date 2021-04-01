import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';


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
            secondSelectText: 'Select grade',
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
                            .required('Add topic!'),
                        content: Yup.string()
                            .required('Add content!')
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
                            <h1>Publish post</h1>
                            <hr />
                            <div className="form-group col">
                                <label htmlFor="firstSelect">Select subject</label>
                                <Select
                                    placeholder="Select subject..."
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


                            <div className="form-group col">
                                <label htmlFor="title">Topic</label>
                                <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                                <ErrorMessage name="title" component="div" className="invalid-feedback" />
                            </div>

                            <div className="form-group col">
                                <label>Content</label>
                                <MyTextArea
                                    label=""
                                    name="content"
                                    rows="10"
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


                            <div className="form-group col">
                                <button type="submit" className="btn btn-primary mr-2">Publish post</button>
                                <button type="reset" className="btn btn-secondary">Reset data</button>
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