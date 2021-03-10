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


class WatchParentAttendance extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            zeroSelectGroup: [],
            atttendances: [],
            zeroSelectGroupVisibility: false,
            firstSelectGroup: [],
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllChildsParent().then(firstSelectGroup => this.setState({ firstSelectGroup }));
    }

    onChangeChild(selected, setFieldValue) {
        setFieldValue('firstSelect', selected.value)
        this.setState({
            zeroSelectGroupVisibility: true,
        });
        userService.GetAllSubjectsParent(selected.value).then(zeroSelectGroup => this.setState({ zeroSelectGroup })).catch(error => this.setState({ error }));
    }


    onChangeSubject(selected, setFieldValue, values) {
        setFieldValue('zeroSelect', selected.value)
        userService.GetAllAttendanceParent(selected.value, values.firstSelect).then(atttendances => this.setState({ atttendances })).catch(error => this.setState({ error }));
    }


    render() {
        return (
            <Formik
                initialValues={{
                    zeroSelect: '',
                    firstSelect: '',                   
                }}
            >
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <div class="container">
                            <h1>Відвідуванність</h1>
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
                            }   </div>
                    </Form>
                )}
            </Formik>
        )
    }
}

export { WatchParentAttendance }; 