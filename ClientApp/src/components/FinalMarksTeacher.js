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
import { Button, Table } from 'react-bootstrap';


class FinalGrades extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            secondSelectGroup: [],
            firstSelectGroup: [],
            zeroSelectGroup: [],
            receiver: 'Виберіть клас',
            secondSelectText: 'Виберіть клас',
            secondSelectVisibility: false,          
            firstSelectDisable: true,
            secondSelectDisable: true,
            pupils: [],
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllSubjectForTeacher().then(zeroSelectGroup => this.setState({ zeroSelectGroup }));
    }

    onChangeSubject(selected, setFieldValue) {
        setFieldValue('zeroSelect', selected.value)
        setFieldValue('firstSelect', '')
        setFieldValue('secondSelect', '')

        userService.GetAllFlowsBySubjectAndTeacher(selected.value).then(firstSelectGroup => this.setState({ firstSelectGroup }));
        this.setState({
            firstSelectDisable: false,         
        });
    }



    onChangeFlow(selected, setFieldValue) {
        setFieldValue('firstSelect', selected.value)
        setFieldValue('secondSelect', '')

        userService.GetFlowClassLettersTeacher(selected.value).then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));
        this.setState({
            secondSelectGroup: false,
            secondSelectText: 'Оберіть клас',
            secondSelectDisable: false,
            secondSelectVisibility: true,          
            pupils: [],
        });
    }


    onChangeSecondSelect(selected, setFieldValue, values) {
        setFieldValue('secondSelect', selected.value)
        this.setState({
            secondSelectText: values.firstSelect + '-' + selected.label,
            datepickerVisibility: true,
        });
        userService.GetAllPupilsForFinalGrade(values.zeroSelect, values.firstSelect, selected.value).then(pupils => this.setState({ pupils })).catch(error => this.setState({ error }));
    }


    onChangeGrade(selected, setFieldValue, index) {
        setFieldValue('grade', selected.target.value)


        const elementsIndex = this.state.pupils.findIndex(element => element.idStudent == index)
        let newArray = [...this.state.pupils]



        if (selected.target.value === '') {
            newArray[elementsIndex] = { ...newArray[elementsIndex], grade: -1 }
        }
        else if (selected.target.value > 12)
            selected.target.value = 12;

        else if (selected.target.value < 1)
            selected.target.value = 1;

        else {
            newArray[elementsIndex] = { ...newArray[elementsIndex], grade: selected.target.value }
        }
        this.setState({
            pupils: newArray,
        });
    }






    render() {
        return (
            <Formik
                initialValues={{
                    zeroSelect: '',
                    firstSelect: '',
                    secondSelect: '',
                    grade: '',
                  
                }}
                validationSchema={Yup.object().shape({
                    zeroSelect: Yup.string()
                        .required('Оберіть предмет'),
                    firstSelect: Yup.string()
                        .required('Оберіть паралель'),
                    secondSelect: Yup.string()
                        .required('Оберіть клас'),
                    
                })}
                onSubmit={({ zeroSelect, firstSelect, secondSelect }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.CreateFinal(zeroSelect, firstSelect, secondSelect, this.state.pupils)
                        .then(
                            user => {
                                this.props.history.push({
                                    pathname: '/',
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
                        <h1>Виставити семестрові оцінки</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="zeroSelect">Виберіть предмет</label>
                            <Select
                                placeholder="Оберіть предмет..."
                                name="zeroSelect"
                                options={this.state.zeroSelectGroup}
                                className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectAnnouncement => this.onChangeSubject(selectAnnouncement, setFieldValue)} />
                            <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="firstSelect">Виберіть паралель</label>
                            <Select
                                placeholder="Оберіть паралель..."
                                name="firstSelect"
                                options={this.state.firstSelectGroup}
                                className={'basic-multi-select' + (errors.firstSelect && touched.firstSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectRole => this.onChangeFlow(selectRole, setFieldValue)}
                                isDisabled={this.state.firstSelectDisable} />
                            <ErrorMessage name="firstSelect" component="div" className="invalid-feedback" />
                        </div>

                        <div className="form-group col">
                            <label htmlFor="secondSelect">{this.state.secondSelectText}</label>
                            <Select
                                placeholder="Оберіть..."
                                name="secondSelect"
                                options={this.state.secondSelectGroup}
                                className={'basic-multi-select' + (errors.secondSelect && touched.secondSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectValue => this.onChangeSecondSelect(selectValue, setFieldValue, values)}
                                isDisabled={this.state.secondSelectDisable}
                            />
                            <ErrorMessage name="secondSelect" component="div" className="invalid-feedback" />
                        </div>
                        <h1>{this.state.secondSelectText} клас</h1>                      
                    
                        <div>
                            {this.state.pupils &&
                                <Table responsive bordered hover>
                                 <thead class="thead-dark">
                                        <th>ПІБ</th>
                                        <th>Семестрова оцінка</th>
                                        <th>Тематичні оцінки за семестр</th>
                                    </thead>
                                    <tbody>
                                        {this.state.pupils.map(pupil =>
                                            <tr>
                                                <td key={pupil.idPupil}><p> {pupil.fio}</p> </td>
                                                <td> <Field name="gradeStudent" type="number" max="12" min="0" onChange={selectValue => this.onChangeGrade(selectValue, setFieldValue, pupil.idStudent)} /> </td>
                                                <td> {pupil.gradesPeriod}</td>
                                            </tr>
                                        )}

                                    </tbody>
                            </Table>
                            }
                        </div>


                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Поставити семестрові оцінки</button>
                            <button type="reset" className="btn btn-secondary">Скинути дані</button>
                        </div>
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

export { FinalGrades }; 