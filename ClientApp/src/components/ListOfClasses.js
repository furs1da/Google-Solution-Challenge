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



class ListOfClassesAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            classesList: [],
            flowsList: [],
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllFlows().then(flowsList => this.setState({ flowsList }));
    }

    onChangeFlow(selectValue, setFieldValue, values) {

        userService.GetAllClassesByFlowAdmin(selectValue.value).then(classesList => this.setState({ classesList })).catch(error => this.setState({ error }));

    }

    onRedirectToChange(classId) {
        this.props.history.push({
            pathname: '/changeClassInfo',
            state: { idClassList: classId }
        });
    }


    render() {
        return (
            <Formik
                initialValues={{
                    flowSelect: '',
                }}>
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Оберіть паралель</h1>
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
                        <h1>Відповідні класи</h1>
                        {this.state.classesList.map(ClassEntity =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    Клас: {ClassEntity.name}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Класний керівник: {ClassEntity.classroomTeacher}</h5>
                                    <br />
                                    <h5 class="card-title">Кількість учнів: {ClassEntity.amountOfStudents}</h5>
                                    <br />
                                    <h5 class="card-title">Код доступу: {ClassEntity.accessCode}</h5>
                                    <br />
                                    <Button variant="outline-primary" onClick={selectValue => this.onRedirectToChange(ClassEntity.idClass)}> Редагувати дані </Button>
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

export { ListOfClassesAdmin }; 