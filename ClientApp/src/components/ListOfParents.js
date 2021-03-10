import React from 'react';
import { render } from "react-dom";
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { authenticationService } from '../services';
import { userService } from '../services';
import { SelectField } from "./SelectField";
import DataTable from "react-data-table-component";
import { saveAs } from 'file-saver';
import 'semantic-ui-css/semantic.min.css';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Button, Icon, Popup } from "semantic-ui-react";

class ListOfParentsAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            studentsList: [],
            flowsList: [],
            classLettersList: [],
            parentsList: [],
            secondSelectDisable: true,
            thirdSelectDisable: true,
            receiver: 'Оберіть учня',
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllFlows().then(flowsList => this.setState({ flowsList }));
    }

    onChangeFlow(selectValue, setFieldValue, values) {
        setFieldValue('flowSelect', selectValue.value)

        this.setState({
            secondSelectDisable: false,
            thirdSelectDisable: true,
            receiver: 'Оберіть учня',
        });

        setFieldValue('classLetterSelect', '')
        setFieldValue('studentSelect', '')
        userService.GetFlowClassLetters(selectValue.value).then(classLettersList => this.setState({ classLettersList })).catch(error => this.setState({ error }));

    }

    onChangeClassLetter(selectValue, setFieldValue, values) {
        setFieldValue('classLetterSelect', selectValue.value)

        this.setState({
            thirdSelectDisable: false,
            receiver: 'Оберіть учня',         
        });
        setFieldValue('studentSelect', '')
        userService.GetAllPupilsForClass(values.flowSelect, selectValue.value).then(studentsList => this.setState({ studentsList })).catch(error => this.setState({ error }));

    }


    onChangeChild(selectValue, setFieldValue, values, setStatus) {
        setFieldValue('studentSelect', selectValue.value)

        this.setState({
            secondSelectDisable: false,
            receiver: selectValue.label,
        });
        userService.GetAllParentsAdmin(selectValue.value).then(parentsList => this.setState({ parentsList }),
            error => {             
                setStatus(error);
            });

    }

    DeleteRecordConfirmed(idParent, values) {
        userService.DeleteRecordParentAdmin(idParent).then(response => {
            userService.GetAllParentsAdmin(values.studentSelect).then(parentsList => this.setState({ parentsList })).catch(error => this.setState({ error }));
        });
  }

    DeleteRecord(idParent, values) {
        confirmAlert({
            title: "Підтвердіть дію",
            message: "Ви впевнені, що хочете видалити цей обліковий запис?",
            buttons: [
                {
                    label: "Так",
                    onClick: () => { this.DeleteRecordConfirmed(idParent, values) }
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
                    flowSelect: '',
                    classLetterSelect: '',
                    studentSelect: '',
                }}>
                {({ errors, status, touched, values, setFieldValue, setFieldTouched, setStatus }) => (
                    <Form>
                        <div className="form-group col">
                            <label htmlFor="flowSelect">Оберіть паралель</label>
                            <Select
                                placeholder="Оберіть паралель..."
                                name="flowSelect"
                                options={this.state.flowsList}
                                className={'basic-multi-select' + (errors.flowSelect && touched.flowSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectValue => this.onChangeFlow(selectValue, setFieldValue, values)}

                            />
                            <ErrorMessage name="secondSelect" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="classLetterSelect">Оберіть клас</label>
                            <Select
                                placeholder="Оберіть клас..."
                                name="classLetterSelect"
                                options={this.state.classLettersList}
                                className={'basic-multi-select' + (errors.classLetterSelect && touched.classLetterSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectValue => this.onChangeClassLetter(selectValue, setFieldValue, values)}
                                isDisabled={this.state.secondSelectDisable}
                            />
                            <ErrorMessage name="secondSelect" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="studentSelect">Оберіть учня</label>
                            <Select
                                placeholder="Оберіть учня..."
                                name="studentSelect"
                                options={this.state.studentsList}
                                className={'basic-multi-select' + (errors.studentSelect && touched.studentSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectValue => this.onChangeChild(selectValue, setFieldValue, values, setStatus)}
                                isDisabled={this.state.thirdSelectDisable}
                            />
                            <ErrorMessage name="studentSelect" component="div" className="invalid-feedback" />
                        </div>

                        <h1>Усі батьки у {this.state.receiver}</h1>
                        {this.state.parentsList.map(parentEntity =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    ПІБ: {parentEntity.fio}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Дата народження: {new Date(parentEntity.dateOfBirth).toLocaleDateString()}</h5>
                                    <h5 class="card-title">Електронна пошта: {parentEntity.mail}</h5>
                                    <br />
                                    <h5 class="card-title">Телефон: {parentEntity.phone}</h5>
                                    <br />
                                    <h5 class="card-title">Домашня адресса: {parentEntity.adress}</h5>
                                    <br />
                                    <h5 class="card-title">Місце роботи: {parentEntity.workPlace}</h5>
                                    <br />
                                    <Button animated basic color='red' onClick={selectValue => this.DeleteRecord(parentEntity.idParent, values)}>
                                        <Button.Content visible>Видалити дані</Button.Content>
                                        <Button.Content hidden>
                                            <Icon name='trash' />
                                        </Button.Content>
                                    </Button>      
                                </div>
                            </div>
                        )}
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

export { ListOfParentsAdmin }; 