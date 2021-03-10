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
import { Button } from 'react-bootstrap';


class WatchStudentAttendance extends React.Component {

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
            >
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <div className="form-group col">
                            <label htmlFor="zeroSelect">Виберіть предмет</label>
                            <Select
                                placeholder="Оберіть предмет..."
                                name="zeroSelect"
                                options={this.state.zeroSelectGroup}
                                className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectSubject => this.onChangeSubject(selectSubject, setFieldValue)} />
                            <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                        </div>
                        <h3>Відвідуваність</h3>
                        <div>
                            {this.state.atttendances &&
                                <table id='gradesTable'>
                                    <thead>
                                        <th>Дата уроку</th>
                                        <th>Був чи ні</th>
                                    </thead>
                                    <tbody>
                                    {this.state.atttendances.map(attendanceEntity =>
                                            <tr>                                         
                                            <td key={attendanceEntity.idAttendance}><p> {new Date(attendanceEntity.dateOfLesson).toLocaleDateString()}</p></td>
                                            <td><p style={{ backgroundColor: attendanceEntity.backgroundColor }}> {attendanceEntity.attendanceCheck}</p></td>
                                            </tr>
                                        )}

                                    </tbody>
                                </table>
                            }
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

export { WatchStudentAttendance }; 