import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { userService } from '../services';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Button, Icon, Popup } from "semantic-ui-react";
import { saveAs } from 'file-saver';


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

class ChangeHomeworkInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hwInfoEntity: '',
            dateOfDeadLineTemp: new Date(),
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllInfoHomeworkTeacher(this.props.location.state.idHomeworkInfoList).then(hwInfoEntity => this.setState({
            hwInfoEntity: hwInfoEntity,
            dateOfDeadLineTemp: new Date(hwInfoEntity.dueDate),
        }));
    }

    onDownload(id, name) {
        name = name.split('.')[0];
        userService.GetHomeworkFilePupil(id).then(blob => saveAs(blob, name)).catch(error => this.setState({ error }));
    }
    DeleteRecordConfirmed() {
        userService.DeleteRecordHomeworkTeacher(this.props.location.state.idHomeworkInfoList).then(response => { 
                this.props.history.push({
                    pathname: '/listOfHomeworkInfos',
                });        
        }).catch(error => this.setState({ error }));
    }
    DeleteRecord() {
        confirmAlert({
            title: "Confirm the action",
            message: "Are you sure you want to delete this homework?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => { this.DeleteRecordConfirmed() }
                },
                {
                    label: "No"
                }
            ]
        });
    };


    render() {
        return (
            <Formik
                initialValues={{
                    title: this.state.hwInfoEntity.title,
                    content: this.state.hwInfoEntity.description,
                    attachement: '',
                    dueDate: this.state.dateOfDeadLineTemp,
                }}
                validationSchema={Yup.object().shape({   
                    title: Yup.string()
                        .required('Add a topic of homework'),
                    content: Yup.string()
                        .required('Add a content of homework'),
                    dueDate: Yup.date()
                        .required('Set the homework deadline')
                })}
                enableReinitialize
                onSubmit={({title, content, attachement, dueDate }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.ChangeHomeworkInfo(title, content, attachement, dueDate, this.props.location.state.idHomeworkInfoList)
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
                        <h1>Update homework's information</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="dueDate">Update deadline</label>
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
                            <label htmlFor="title">Update the topic of homework</label>
                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label>Homework's content</label>
                            <MyTextArea
                                label=""
                                name="content"
                                rows="15"
                            />
                        </div>
                        <div className="form-group col">
                            <label>Atteched file</label>
                            {this.state.hwInfoEntity.attechement !== 'nodata' &&
                                <Button type="button" variant="outline-primary" onClick={selectValue => this.onDownload(this.state.hwInfoEntity.idHomeworkInfo, this.state.hwInfoEntity.attechement)}> {this.state.hwInfoEntity.attechement} </Button>
                            }
                            <br />
                            <br/>
                            <label for="attachement">If you want to change the attached file, select another one</label>
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

                        <div class="row" >
                            <div class="col" class="pull-left">  <button type="submit" className="btn btn-primary mr-2" style={{ marginTop: 0.5 + "em" }}>Update homework's information</button> </div>

                            <div class="col" class="pull-left">  <button type="reset" className="btn btn-secondary" style={{ marginTop: 0.5 + "em" }}>Reset data</button> </div>

                            <div class="col" class="pull-left">    <Button type="button" animated basic color='red' style={{ marginTop: 0.5 + "em", marginLeft: 0.5 + "em", marginBottom: 1 + "em" }} onClick={selectValue => this.DeleteRecord()}>
                                <Button.Content visible>Delete homework</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='trash' />
                                </Button.Content>
                            </Button>
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

export { ChangeHomeworkInfo }; 