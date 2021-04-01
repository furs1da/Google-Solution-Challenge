import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';


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
                        <h3>Attendance</h3>
                        <div>
                            {this.state.atttendances &&
                                <table id='gradesTable'>
                                    <thead>
                                        <th>Date of the lesson</th>
                                        <th>Present</th>
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