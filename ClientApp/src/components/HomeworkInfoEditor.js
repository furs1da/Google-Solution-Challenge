import React from 'react';
import { render } from "react-dom";
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { authenticationService } from '../services';
import { userService } from '../services';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Button, Icon, Popup } from "semantic-ui-react";
import { saveAs } from 'file-saver';
import uk from "date-fns/locale/uk";
registerLocale("uk", uk);

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
                    title: this.state.hwInfoEntity.title,
                    content: this.state.hwInfoEntity.description,
                    attachement: '',
                    dueDate: this.state.dateOfDeadLineTemp,
                }}
                validationSchema={Yup.object().shape({   
                    title: Yup.string()
                        .required('Додайте тему домашнього завдання'),
                    content: Yup.string()
                        .required('Додайте зміст домашнього завдання'),
                    dueDate: Yup.date()
                        .required('Вкажіть дедлайн домашнього завдання')
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
                        <h1>Змінити домашне завдання</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="dueDate">Змінити дедлайн</label>
                            <br />
                            <DatePicker
                                selected={values.dueDate}
                                dateFormat="MMMM d, yyyy"
                                className={'form-control' + (errors.dueDate && touched.dueDate ? ' is-invalid' : '')}
                                name="dueDate"
                                onChange={date => setFieldValue('dueDate', date)}
                                locale="uk"
                            />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="title">Змінити тему домашьного завдання</label>
                            <Field name="title" type="text" className={'form-control' + (errors.title && touched.title ? ' is-invalid' : '')} />
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label>Опис домашнього задання</label>
                            <MyTextArea
                                label=""
                                name="content"
                                rows="15"
                            />
                        </div>
                        <div className="form-group col">
                            <label>Прикріплений файл</label>
                            {this.state.hwInfoEntity.attechement !== 'nodata' &&
                                <Button type="button" variant="outline-primary" onClick={selectValue => this.onDownload(this.state.hwInfoEntity.idHomeworkInfo, this.state.hwInfoEntity.attechement)}> {this.state.hwInfoEntity.attechement} </Button>
                            }
                            <br />
                            <br/>
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
                            <div class="col" class="pull-left">  <button type="submit" className="btn btn-primary mr-2" style={{ marginTop: 0.5 + "em" }}>Змінити домашнє завдання</button> </div>

                            <div class="col" class="pull-left">  <button type="reset" className="btn btn-secondary" style={{ marginTop: 0.5 + "em" }}>Повернути попередні дані</button> </div>

                            <div class="col" class="pull-left">    <Button type="button" animated basic color='red' style={{ marginTop: 0.5 + "em", marginLeft: 0.5 + "em", marginBottom: 1 + "em" }} onClick={selectValue => this.DeleteRecord()}>
                                <Button.Content visible>Видалити оголошення</Button.Content>
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