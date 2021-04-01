import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
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
            receiver: 'Select student',
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
            receiver: 'Select student',
        });

        setFieldValue('classLetterSelect', '')
        setFieldValue('studentSelect', '')
        userService.GetFlowClassLetters(selectValue.value).then(classLettersList => this.setState({ classLettersList })).catch(error => this.setState({ error }));

    }

    onChangeClassLetter(selectValue, setFieldValue, values) {
        setFieldValue('classLetterSelect', selectValue.value)

        this.setState({
            thirdSelectDisable: false,
            receiver: 'Select student',         
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
            title: "Confirm the action",
            message: "Are you sure that you want to delete this account?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => { this.DeleteRecordConfirmed(idParent, values) }
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
                    flowSelect: '',
                    classLetterSelect: '',
                    studentSelect: '',
                }}>
                {({ errors, status, touched, values, setFieldValue, setFieldTouched, setStatus }) => (
                    <Form>
                        <h1>Select class</h1>
                        <div className="form-group col">
                            <label htmlFor="flowSelect">Select grade</label>
                            <Select
                                placeholder="Select grade..."
                                name="flowSelect"
                                options={this.state.flowsList}
                                className={'basic-multi-select' + (errors.flowSelect && touched.flowSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectValue => this.onChangeFlow(selectValue, setFieldValue, values)}

                            />
                            <ErrorMessage name="secondSelect" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="classLetterSelect">Select class</label>
                            <Select
                                placeholder="Select class..."
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
                            <label htmlFor="studentSelect">Select student</label>
                            <Select
                                placeholder="Select student..."
                                name="studentSelect"
                                options={this.state.studentsList}
                                className={'basic-multi-select' + (errors.studentSelect && touched.studentSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectValue => this.onChangeChild(selectValue, setFieldValue, values, setStatus)}
                                isDisabled={this.state.thirdSelectDisable}
                            />
                            <ErrorMessage name="studentSelect" component="div" className="invalid-feedback" />
                        </div>

                        <h1>Student's parent {this.state.receiver}</h1>
                        {this.state.parentsList.map(parentEntity =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    ПІБ: {parentEntity.fio}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Date of birth: {new Date(parentEntity.dateOfBirth).toLocaleDateString()}</h5>
                                    <h5 class="card-title">Email: {parentEntity.mail}</h5>
                                    <br />
                                    <h5 class="card-title">Mobile phone: {parentEntity.phone}</h5>
                                    <br />
                                    <h5 class="card-title">Home address: {parentEntity.adress}</h5>
                                    <br />
                                    <h5 class="card-title">Place of work: {parentEntity.workPlace}</h5>
                                    <br />
                                    <Button animated basic color='red' onClick={selectValue => this.DeleteRecord(parentEntity.idParent, values)}>
                                        <Button.Content visible>Delete account</Button.Content>
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