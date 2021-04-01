import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
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
            title: "Confirm the action",
            message: "Are you sure that you want to delete this post?",
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
                    title: this.state.postEntity.title,
                    content: this.state.postEntity.content,
                    attachement: '',              
                }}
                validationSchema={Yup.object().shape({
                    title: Yup.string()
                        .required('Add topic'),
                    content: Yup.string()
                        .required('Add content'),
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
                        <h1>Change the post</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="title">Change topic of the post</label>
                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label>Post's content</label>
                            <MyTextArea
                                label=""
                                name="content"
                                rows="15"
                            />
                        </div>
                        <div className="form-group col">
                            <label>Attached file</label>
                            <br />
                            {this.state.postEntity.attechement !== 'nodata' &&               
                                <Button type="button" variant="outline-primary" onClick={selectValue => this.onDownload(this.state.postEntity.idPost, this.state.postEntity.filename)}> {this.state.postEntity.filename} </Button>
                            }  
                            <br />
                            <br />
                            <label for="attachement">If you want to change the attached file, attach another file</label>
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
                            <div class="col" class="pull-left">  <button type="submit" className="btn btn-primary mr-2" style={{ marginTop: 0.5 + "em" }}>Change post's information</button> </div>

                            <div class="col" class="pull-left">  <button type="reset" className="btn btn-secondary" style={{ marginTop: 0.5 + "em" }}>Reset data</button> </div>

                            <div class="col" class="pull-left">    <Button type="button" animated basic color='red' style={{ marginTop: 0.5 + "em", marginLeft: 0.5 + "em", marginBottom: 1 + "em" }} onClick={selectValue => this.DeleteRecord()}>
                                <Button.Content visible>Delete post</Button.Content>
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