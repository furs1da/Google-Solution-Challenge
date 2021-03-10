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


class WatchClassroomTeacherGrades extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            zeroSelectGroup: [],
            zeroSelectGroupVisibility: false,
            firstSelectGroup: [],
            grades: [],
            themGrades: [],
            finalGrade: '',
            pageAccess: false,
            error: '',
        };
    }

    componentDidMount() {
        userService.CheckTeacherForClassroomTeacher().then(pageAccess => this.setState({ pageAccess }));
        userService.GetStudentsClassroomTeacher().then(firstSelectGroup => this.setState({ firstSelectGroup }));
    }

    onChangeChild(selected, setFieldValue, values) {

        setFieldValue('firstSelect', selected.value)
        this.setState({
            zeroSelectGroupVisibility: true,
        });
        userService.GetAllSubjectsParent(selected.value).then(zeroSelectGroup => this.setState({ zeroSelectGroup })).catch(error => this.setState({ error }));
    }


    onChangeSubject(selected, setFieldValue, values) {
        setFieldValue('zeroSelect', selected.value)
        userService.GetAllGradesPupilParent(selected.value, values.firstSelect).then(grades => this.setState({ grades })).catch(error => this.setState({ error }));
        userService.GetAllThemGradesPupilParent(selected.value, values.firstSelect).then(themGrades => this.setState({ themGrades })).catch(error => this.setState({ error }));
        userService.GetAllFinalGradePupilParent(selected.value, values.firstSelect).then(finalGrade => this.setState({ finalGrade })).catch(error => this.setState({ error }));
    }

    render() {
        return (
            <Formik
                initialValues={{
                    zeroSelect: '',
                    firstSelect: '',
                    grade: '',
                    dateOfStart: new Date(),
                    dateOfEnd: new Date(),
                }}
            >
                {({ errors, status, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        {this.state.pageAccess === false &&
                            <h1>Ви не є класним керівником</h1>
                        }
                        {this.state.pageAccess === true &&
                            <div>
                            <h1>Успішність</h1>
                            <hr />
                                <div className="form-group col">
                                    <label htmlFor="firstSelect">Виберіть одного з ваших дітей</label>
                                <Select
                                    placeholder="Оберіть дитину..."
                                        name="firstSelect"
                                        options={this.state.firstSelectGroup}
                                        className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                        classNamePrefix="select"
                                        onChange={selectSubject => this.onChangeChild(selectSubject, setFieldValue, values)} />
                                    <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                                </div>
                                {this.state.zeroSelectGroupVisibility === true &&
                                    <div className="form-group col">
                                        <label htmlFor="zeroSelect">Виберіть предмет</label>
                                <Select
                                    placeholder="Оберіть предмет..."
                                            name="zeroSelect"
                                            options={this.state.zeroSelectGroup}
                                            className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                            classNamePrefix="select"
                                            onChange={selectSubject => this.onChangeSubject(selectSubject, setFieldValue, values)} />
                                        <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                                    </div>
                                }
                                <h3>Поточні оцінки</h3>
                         
                        
                    
                            <div>
                                <div>
                                    {this.state.grades &&
                                        <Table responsive bordered hover>
                                        <thead class="thead-dark">
                                                <th>ПІБ Вчителя</th>
                                                <th>Оцінка</th>
                                                <th>Тип оцінки</th>
                                                <th>Дата оцінки</th>
                                                <th>Фідбек</th>
                                            </thead>
                                            <tbody>
                                                {this.state.grades.map(gradeEntity =>
                                                    <tr>
                                                        <td key={gradeEntity.idGrade}><p> {gradeEntity.fioTeacher}</p></td>
                                                        <td><p> {gradeEntity.grade}</p></td>
                                                        <td><p> {gradeEntity.typeGrade}</p></td>
                                                        <td><p> {new Date(gradeEntity.dateGrade).toLocaleDateString()}</p></td>
                                                        <td><p> {gradeEntity.feedbackGrade}</p></td>
                                                    </tr>
                                                )}

                                            </tbody>
                                    </Table>
                                    }
                                </div>

                                <h3>Тематичні оцінки</h3>
                                <div>
                                    {this.state.themGrades &&
                                        <Table responsive bordered hover>
                                            <thead class="thead-dark">
                                                <th>Оцінка</th>
                                                <th>Період теми</th>
                                            </thead>
                                            <tbody>
                                                {this.state.themGrades.map(gradeEntity =>
                                                    <tr>
                                                        <td key={gradeEntity.idGrade}><p> {gradeEntity.grade}</p> </td>
                                                        <td><p>Від {new Date(gradeEntity.fromDate).toLocaleDateString()} до {new Date(gradeEntity.toDate).toLocaleDateString()}</p> </td>
                                                    </tr>
                                                )}

                                            </tbody>
                                    </Table>
                                    }
                                </div>

                                <h3>Семестрова оцінка</h3>
                                <div class="row">
                                    <h3 style={{  marginBottom: 1 + "em", marginLeft: 1 + "em" }}>{this.state.finalGrade}</h3>
                                </div>
                            </div>
                        </div>
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

export { WatchClassroomTeacherGrades }; 