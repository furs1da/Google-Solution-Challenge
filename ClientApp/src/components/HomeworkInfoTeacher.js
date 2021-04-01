import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';


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
                        .required('Select subject'),
                    firstSelect: Yup.string()
                        .required('Select grade'),
                    title: Yup.string()
                        .required('Add topic'),
                    content: Yup.string()
                        .required('Add content'),
                    dueDate: Yup.date()
                        .required('Add deadline')
                  
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
                        <h1>Post homework assignment</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="zeroSelect">Select subject</label>
                            <Select
                                placeholder="Select subject..."
                                name="zeroSelect"
                                options={this.state.zeroSelectGroup}
                                className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectAnnouncement => this.onChangeSubject(selectAnnouncement, setFieldValue)} />
                            <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="firstSelect">Select grade</label>
                            <Select
                                placeholder="Select grade..."
                                name="firstSelect"
                                options={this.state.firstSelectGroup}
                                className={'basic-multi-select' + (errors.firstSelect && touched.firstSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectRole => this.onChangeFlow(selectRole, setFieldValue)}
                                isDisabled={this.state.firstSelectDisable} />
                            <ErrorMessage name="firstSelect" component="div" className="invalid-feedback" />
                        </div> 
                        <div className="form-group col">
                            <label htmlFor="dueDate">Add deadline</label>
                            <br />
                            <DatePicker
                                selected={values.dueDate}
                                dateFormat="MMMM d, yyyy"
                                className={'form-control' + (errors.dueDate && touched.dueDate ? ' is-invalid' : '')}
                                name="dueDate"
                                onChange={date => setFieldValue('dueDate', date)}
                            />
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
                                rows="15"
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
                      


                        <div className="form-group col">
                            <button type="submit" className="btn btn-primary mr-2">Post homework assignment</button>
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

export { HomeworkInfo }; 