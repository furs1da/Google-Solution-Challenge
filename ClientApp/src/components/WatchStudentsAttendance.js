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


class WatchStudentAttendance extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            zeroSelectGroup: [],
            atttendances: [],
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllSubjectsPupil().then(zeroSelectGroup => this.setState({ zeroSelectGroup }));
    }

    onChangeSubject(selected, setFieldValue) {
        userService.GetAllAttendancePupil(selected.value).then(atttendances => this.setState({ atttendances })).catch(error => this.setState({ error }));     
    }

    render() {
        return (
            <Formik>
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Відвідуванність</h1>
                        <hr />
                        <h3>Оберіть предмет</h3>
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
                        <h3 style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em" }}>Відвідуванність</h3>
                        <div>
                            {this.state.atttendances &&
                                <Table responsive bordered hover>
                                    <thead class="thead-dark">                                   
                                        <th>Дата уроку</th>
                                        <th>Присутній(-ня)</th>
                                    </thead>
                                    <tbody>
                                    {this.state.atttendances.map(attendanceEntity =>
                                        <tr>
                                            <td key={attendanceEntity.idAttendance}><p> {new Date(attendanceEntity.dateOfLesson).toLocaleDateString()}</p></td>
                                            <td style={{ backgroundColor: attendanceEntity.backgroundColor }}><p > {attendanceEntity.attendanceCheck}</p></td>
                                        </tr>
                                    )}


                                    </tbody>
                            </Table>
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