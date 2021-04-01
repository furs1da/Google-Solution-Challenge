import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
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
                            <h1>You are not a classroom teacher.</h1>
                        }
                        {this.state.pageAccess === true &&
                            <div>
                            <h1>Marks</h1>
                            <hr />
                                <div className="form-group col">
                                    <label htmlFor="firstSelect">Select one of your students</label>
                                <Select
                                    placeholder="Select one of your students..."
                                        name="firstSelect"
                                        options={this.state.firstSelectGroup}
                                        className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                        classNamePrefix="select"
                                        onChange={selectSubject => this.onChangeChild(selectSubject, setFieldValue, values)} />
                                    <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                                </div>
                                {this.state.zeroSelectGroupVisibility === true &&
                                    <div className="form-group col">
                                        <label htmlFor="zeroSelect">Select subject</label>
                                <Select
                                    placeholder="Select subject..."
                                            name="zeroSelect"
                                            options={this.state.zeroSelectGroup}
                                            className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                            classNamePrefix="select"
                                            onChange={selectSubject => this.onChangeSubject(selectSubject, setFieldValue, values)} />
                                        <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                                    </div>
                                }
                                <h3>Recent marks</h3>
                            <div>
                                <div>
                                    {this.state.grades &&
                                        <Table responsive bordered hover>
                                        <thead class="thead-dark">
                                                <th>Teacher's Full Name</th>
                                                <th>Mark</th>
                                                <th>Type of mark</th>
                                                <th>Date of mark</th>
                                                <th>Feedback</th>
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

                                <h3>Marks for certain topics</h3>
                                <div>
                                    {this.state.themGrades &&
                                        <Table responsive bordered hover>
                                            <thead class="thead-dark">
                                                <th>Mark</th>
                                                <th>Period of the topic</th>
                                            </thead>
                                            <tbody>
                                                {this.state.themGrades.map(gradeEntity =>
                                                    <tr>
                                                        <td key={gradeEntity.idGrade}><p> {gradeEntity.grade}</p> </td>
                                                        <td><p>From {new Date(gradeEntity.fromDate).toLocaleDateString()} to {new Date(gradeEntity.toDate).toLocaleDateString()}</p> </td>
                                                    </tr>
                                                )}

                                            </tbody>
                                    </Table>
                                    }
                                </div>

                                <h3>Semester mark</h3>
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