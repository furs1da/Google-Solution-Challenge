import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
import { Button } from 'react-bootstrap';



class ListOfStudentsAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            studentsList: [],
            flowsList: [],
            classLettersList: [],
            secondSelectDisable: true,
            receiver: 'Select class',
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
            receiver: 'Select class',
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
                        <h1>Select class</h1>
                        <hr />
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
                   
                        <h1>All students in {this.state.receiver}</h1>
                        {this.state.studentsList.map(studentEntity =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    ПІБ: {studentEntity.fio}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Date of birth: {new Date(studentEntity.dateOfBirth).toLocaleDateString()}</h5>
                                    <h5 class="card-title">Email: {studentEntity.mail}</h5>
                         
                                    <h5 class="card-title">Phone number: {studentEntity.phone}</h5>
                                   
                                    <h5 class="card-title">Home address: {studentEntity.adress}</h5>
                                   
                                    <h5 class="card-title">Moto: {studentEntity.moto}</h5>
                                 
                                    <h5 class="card-title">Class info: {studentEntity.classInfo}</h5>
                                    <h5 class="card-title">Photo:</h5>
                                    <img class="img-fluid" style={{ maxHeight: 250 + "px", marginBottom: 1 + "em" }} src={'data:image/png;base64,' + studentEntity.imageOfStudent} />
                                    <br />
                                    <Button variant="outline-primary" onClick={selectValue => this.onRedirectToChange(studentEntity.idStudent)}> Edit student's data </Button>
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