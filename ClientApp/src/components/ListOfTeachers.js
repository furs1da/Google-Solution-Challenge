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
import {Input, Grid, Segment } from 'semantic-ui-react'
import "react-confirm-alert/src/react-confirm-alert.css";

class ListOfTeachersAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            teachersList: [],
            subjectsList: [],
            error: '',
        };
    }

    componentDidMount() {   
        userService.GetAllSubjectsAdmin().then(subjectsList => this.setState({ subjectsList }));
    }

    onChangeSubject(selectValue, setFieldValue, values) {

        userService.GetAllTeachersAdminList(selectValue.value).then(teachersList => this.setState({ teachersList })).catch(error => this.setState({ error }));

    }

    onRedirectToChange(teacherId) {
        this.props.history.push({
            pathname: '/changeTeacherInfo',
            state: { idTeacherList: teacherId }
        });
    }


    render() {
        return (
            <Formik
                initialValues={{
                    subjectSelect: '',
                }}>
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Оберіть певний предмет</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="subjectSelect">Оберіть предмет</label>
                            <Select
                                placeholder="Оберіть предмет..."
                                name="subjectSelect"
                                options={this.state.subjectsList}
                                className={'basic-multi-select' + (errors.subjectSelect && touched.subjectSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectValue => this.onChangeSubject(selectValue, setFieldValue, values)}
                               
                            />
                            <ErrorMessage name="subjectSelect" component="div" className="invalid-feedback" />
                        </div>
                        <h1>Вчителі відповідні вашому вибору</h1>
                        {this.state.teachersList.map(teacherEntity =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    ПІБ: {teacherEntity.fio}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Дата народження: {new Date(teacherEntity.dateOfBirth).toLocaleDateString()}</h5>
                                    <h5 class="card-title">Електронна пошта: {teacherEntity.mail}</h5>
                                    <h5 class="card-title">Телефон: {teacherEntity.phone}</h5>
                                    <h5 class="card-title">Домашня адресса: {teacherEntity.adress}</h5>

                                    <h5 class="card-title">Навчає такі предмети: {teacherEntity.subjects}</h5>

                                    <h5 class="card-title">Фото:</h5>
                                    <br />
                                    <img class="img-fluid" style={{ maxHeight: 250 + "px", marginBottom: 1 + "em" }} src={'data:image/png;base64,' + teacherEntity.imageOfTeacher} />
                                    <br />
                                    <Button variant="outline-primary" onClick={selectValue => this.onRedirectToChange(teacherEntity.idTeacher)}> Редагувати дані </Button>
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

export { ListOfTeachersAdmin }; 