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
import { Button } from 'react-bootstrap';



class ListOfStudentsAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            studentsList: [],
            flowsList: [],
            classLettersList: [],
            secondSelectDisable: true,
            receiver: 'Оберіть клас',
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
            receiver: 'Оберіть клас',
        });

        setFieldValue('classLetterSelect', '')
        userService.GetFlowClassLetters(selectValue.value).then(classLettersList => this.setState({ classLettersList })).catch(error => this.setState({ error }));

    }

    onChangeClassLetter(selectValue, setFieldValue, values) {
        setFieldValue('classLetterSelect', selectValue.value)

        this.setState({
            secondSelectDisable: false,
            receiver: values.flowSelect + ' - ' + selectValue.label,
        });

        userService.GetAllStudentsAdmin(values.flowSelect, selectValue.value).then(studentsList => this.setState({ studentsList })).catch(error => this.setState({ error }));

    }


    onRedirectToChange(studentId) {
        this.props.history.push({
            pathname: '/changeStudentInfo',
            state: { idStudentList: studentId }
        });
    }


    render() {
        return (
            <Formik
                initialValues={{
                    flowSelect: '',
                    classLetterSelect: '',
                }}>
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Оберіть певний клас</h1>
                        <hr />
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
                   
                        <h1>Усі учні у {this.state.receiver}</h1>
                        {this.state.studentsList.map(studentEntity =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    ПІБ: {studentEntity.fio}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Дата народження: {new Date(studentEntity.dateOfBirth).toLocaleDateString()}</h5>
                                    <h5 class="card-title">Електронна пошта: {studentEntity.mail}</h5>
                         
                                    <h5 class="card-title">Телефон: {studentEntity.phone}</h5>
                                   
                                    <h5 class="card-title">Домашня адресса: {studentEntity.adress}</h5>
                                   
                                    <h5 class="card-title">Девіз: {studentEntity.moto}</h5>
                                 
                                    <h5 class="card-title">Навчається у класі: {studentEntity.classInfo}</h5>
                                    <h5 class="card-title">Фото:</h5>
                                    <img class="img-fluid" style={{ maxHeight: 250 + "px", marginBottom: 1 + "em" }} src={'data:image/png;base64,' + studentEntity.imageOfStudent} />
                                    <br />
                                    <Button variant="outline-primary" onClick={selectValue => this.onRedirectToChange(studentEntity.idStudent)}> Редагувати дані </Button>
                                </div>
                            </div>                
                        )}
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                        }
                    </Form>
                )}
            </Formik>
        )
    }
}

export { ListOfStudentsAdmin }; 