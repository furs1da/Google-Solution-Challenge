import React from 'react';
import { render } from "react-dom";
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { authenticationService } from '../services';
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
            <textarea className="text-area" {...field} {...props} style={{ width: 100 + "%" }} />
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};

class ChangeAnnouncementInfo extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            announcementEntity: '',
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllInfoAnnouncementAdmin(this.props.location.state.idAnnouncementList).then(announcementEntity => this.setState({
            announcementEntity: announcementEntity,
        }));
    }

    onDownload(id, name) {
        name = name.split('.')[0];
        userService.GetFileAdminAnnouncement(id).then(blob => saveAs(blob, name)).catch(error => this.setState({ error }));
    }
    DeleteRecordConfirmed() {
        userService.DeleteRecordAnnouncementAdmin(this.props.location.state.idAnnouncementList).then(response => {
            this.props.history.push({
                pathname: '/listOfAnnouncements',
            });
        }).catch(error => this.setState({ error }));
    }
    DeleteRecord() {
        confirmAlert({
            title: "Підтвердіть дію",
            message: "Ви впевнені, що хочете видалити цей обліковий запис?",
            buttons: [
                {
                    label: "Так",
                    onClick: () => { this.DeleteRecordConfirmed() }
                },
                {
                    label: "Ні"
                }
            ]
        });
    };


    render() {
        return (
            <Formik
                initialValues={{
                    title: this.state.announcementEntity.titleAnnouncement,
                    content: this.state.announcementEntity.announcementContent,
                    attachement: '',
                    actual: this.state.announcementEntity.actual,
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string()
                        .required('Додайте тему оголошення'),
                    content: Yup.string()
                        .required('Додайте зміст оголошення'),
                })}
                enableReinitialize
                onSubmit={({ title, content, attachement, actual }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.ChangeAnnouncement(title, content, attachement, actual, this.props.location.state.idAnnouncementList)
                        .then(
                            user => {
                                const { from } = this.props.location.state || { from: { pathname: "/" } };
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
                        <h1>Змінити оголошення</h1>
                        <hr />
                        <div className="form-group">
                            <label htmlFor="title">Змінити тему оголошення</label>
                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group">
                            <label>Опис оголошення</label>
                            <MyTextArea
                                label=""
                                name="content"
                                rows="15"
                            />
                        </div>
                        <label htmlFor="actual">Чи є оголошення актуальним?</label>
                        <Field type="checkbox" name="actual" style={{ marginLeft: 1 + "em" }} id="actual" className={'form-check-input ' +
                            (errors.actual && touched.actual ? ' is-invalid' : '')} /><br />

                        <div className="form-group">
                            <label>Прикріплений файл</label>
                            <br/>
                            {this.state.announcementEntity.filename !== 'no data' &&
                                <Button type="button" variant="outline-primary" onClick={selectValue => this.onDownload(this.state.announcementEntity.idAnnouncement, this.state.announcementEntity.filename)}> {this.state.announcementEntity.filename} </Button>
                            }
                            <br />
                            <br />
                            <label for="attachement"><b>Якщо хочете змінити прикріплений файл, оберіть інший файл</b></label>
                          
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
                            <div class="col" class="pull-left">  <button type="submit" className="btn btn-primary mr-2" style={{ marginTop: 0.5 + "em" }}>Змінити оголошення</button> </div>
                         
                            <div class="col" class="pull-left">  <button type="reset" className="btn btn-secondary" style={{ marginTop: 0.5 + "em" }}>Повернути попередні дані</button> </div>
                         
                            <div class="col" class="pull-left">    <Button type="button" animated basic color='red' style={{ marginTop: 0.5 + "em",marginLeft: 0.5 + "em", marginBottom: 1 + "em" }} onClick={selectValue => this.DeleteRecord()}>
                                <Button.Content visible>Видалити оголошення</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='trash' />
                                </Button.Content>
                    </Button> 
                        </div></div>
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

export { ChangeAnnouncementInfo }; 