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

class ChangePostInfo extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            postEntity: '',       
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllInfoPostTeacher(this.props.location.state.idPostList).then(postEntity => this.setState({
            postEntity: postEntity, 
        }));
    }

    onDownload(id, name) {
        name = name.split('.')[0];
        userService.GetHomeworkFilePupilPost(id).then(blob => saveAs(blob, name)).catch(error => this.setState({ error }));
    }
    DeleteRecordConfirmed() {
        userService.DeleteRecordPostTeacher(this.props.location.state.idPostList).then(response => {
            this.props.history.push({
                pathname: '/listOfTeachersPosts',
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
                    title: this.state.postEntity.title,
                    content: this.state.postEntity.content,
                    attachement: '',              
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string()
                        .required('Додайте тему поста'),
                    content: Yup.string()
                        .required('Додайте зміст поста'),
                })}
                enableReinitialize
                onSubmit={({ title, content, attachement }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.ChangePost(title, content, attachement, this.props.location.state.idPostList)
                        .then(
                            user => {
                                const { from } = this.props.location.state || { from: { pathname: "/" } };
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
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form> 
                        <h1>Змінити пост</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="title">Змінити тему поста</label>
                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label>Опис поста</label>
                            <MyTextArea
                                label=""
                                name="content"
                                rows="15"
                            />
                        </div>
                        <div className="form-group col">
                            <label>Прикріплений файл</label>
                            <br />
                            {this.state.postEntity.attechement !== 'nodata' &&               
                                <Button type="button" variant="outline-primary" onClick={selectValue => this.onDownload(this.state.postEntity.idPost, this.state.postEntity.filename)}> {this.state.postEntity.filename} </Button>
                            }  
                            <br />
                            <br />
                            <label for="attachement">Якщо хочете змінити прикріплений файл, оберіть інший файл</label>
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
                            <div class="col" class="pull-left">  <button type="submit" className="btn btn-primary mr-2" style={{ marginTop: 0.5 + "em" }}>Змінити пост</button> </div>

                            <div class="col" class="pull-left">  <button type="reset" className="btn btn-secondary" style={{ marginTop: 0.5 + "em" }}>Повернути попередні дані</button> </div>

                            <div class="col" class="pull-left">    <Button type="button" animated basic color='red' style={{ marginTop: 0.5 + "em", marginLeft: 0.5 + "em", marginBottom: 1 + "em" }} onClick={selectValue => this.DeleteRecord()}>
                                <Button.Content visible>Видалити оголошення</Button.Content>
                                <Button.Content hidden>
                                    <Icon name='trash' />
                                </Button.Content>
                            </Button>
                            </div></div>
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                        }
                    </Form>
                )}
            </Formik>
        )
    }
}

export { ChangePostInfo }; 