import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
import { Button, Table } from 'react-bootstrap';


class WatchStudentGrades extends React.Component {

    constructor(props) {
        super(props);

        this.state = {     
            zeroSelectGroup: [],
            grades: [],
            themGrades: [],
            finalGrade: '',
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllSubjectsPupil().then(zeroSelectGroup => this.setState({ zeroSelectGroup }));
    }

    onChangeSubject(selected, setFieldValue) {
        setFieldValue('zeroSelect', selected.value)

        userService.GetAllGradesPupil(selected.value).then(grades => this.setState({ grades })).catch(error => this.setState({ error }));
        userService.GetAllThemGradesPupil(selected.value).then(themGrades => this.setState({ themGrades })).catch(error => this.setState({ error }));
        userService.GetAllFinalGradePupil(selected.value).then(finalGrade => this.setState({ finalGrade })).catch(error => this.setState({ error }));
    }

    render() {
        return (
            <Formik
                initialValues={{
                    zeroSelect: '',
                    firstSelect: '',                   
                }}              
            >
                {({ errors, message, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Progress</h1>
                        <hr />
                        <div className="form-group col">
                            <label htmlFor="zeroSelect">Select subject</label>
                            <Select
                                placeholder="Select subject..."
                                name="zeroSelect"
                                options={this.state.zeroSelectGroup}
                                className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectSubject => this.onChangeSubject(selectSubject, setFieldValue)} />
                            <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                        </div>
                        <h3>Current marks</h3>
                        <div>
                            {this.state.grades &&
                                <Table responsive bordered hover>
                                    <thead class="thead-dark">
                                        <th>Teacher</th>
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

                        <h3>Thematic evaluations</h3>
                        <div>
                            {this.state.themGrades &&
                                <Table responsive bordered hover>
                                    <thead class="thead-dark">                                    
                                        <th>Mark</th>                                 
                                        <th>Period of theme</th>
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

                        <h3>Semester grade</h3>
                        <div class="row">
                            <h3 style={{ marginBottom: 1 + "em", marginLeft: 1 + "em" }}>{this.state.finalGrade}</h3>
                        </div>


                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                        }

                    </Form>
                )}
            </Formik>
        )
    }
}

export { WatchStudentGrades }; 