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
import { saveAs  } from 'file-saver';
import { Button } from 'react-bootstrap';



class HomeworkStudent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            homeworks: [],
            zeroSelectGroup: [],
            error: '',
            subjectLabel: '',
        };
    }

    componentDidMount() {
        userService.GetAllSubjectsPupil().then(zeroSelectGroup => this.setState({ zeroSelectGroup }));
    }

    onChangeSubject(selected, setFieldValue) {
        setFieldValue('zeroSelect', selected.value)
        userService.GetAllHomeworkBySubjectPupil(selected.value).then(homeworks => this.setState({ homeworks })).catch(error => this.setState({ error }));
        this.setState({
            subjectLabel: selected.label,
        });
        
    }

    onDownload(id, name) {
        console.log(id);
        userService.GetHomeworkFilePupil(id).then(blob => saveAs(blob, name)).catch(error => this.setState({ error }));
    }


    onSubmitHomework(hw) {
        this.props.history.push({
            pathname: '/uploadHomework',
            state: { homework: hw }
        });
    }

    render() {
        return (
            <Formik
                initialValues={{
                    zeroSelect: '',                           
                }}
                validationSchema={Yup.object().shape({
                    zeroSelect: Yup.string()
                        .required('Будь ласка оберіть предмет'),                   

                })}
            >
                {({ errors, status, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Домашні завдання</h1>
                        <hr />
                        <h3>Оберіть предмет</h3>
                        <div className="form-group col">
                            <label htmlFor="zeroSelect">Оберіть предмет</label>
                            <Select
                                placeholder="Оберіть предмет..."
                                name="zeroSelect"
                                options={this.state.zeroSelectGroup}
                                className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectAnnouncement => this.onChangeSubject(selectAnnouncement, setFieldValue)} />
                            <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                        </div>
                        <h2>Усі домашні завдання по предмету "{this.state.subjectLabel}"</h2>
                        {this.state.homeworks.map(hw =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    Тема: {hw.title}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Вчитель: {hw.teacherName}</h5>
                                    <h5 class="card-title">Дедлайн: {new Date(hw.dueDate).toLocaleDateString()}</h5>
                                    <h5 class="card-title">Статус завантаження: {hw.doneFlag}</h5>
                                    <br />
                                    <h6 class="card-subtitle mb-2 text-muted">Зміст доманього завдання:</h6>
                                    <p class="card-text">{hw.description}</p>
                                    {hw.attechement !== 'nodata' &&
                                        <Button variant="outline-primary" style={{ marginLeft: 1 + "em", marginTop: 1 + "em" }} onClick={selectValue => this.onDownload(hw.idHomework, hw.attechement)}> {hw.attechement} </Button>
                                    }
                                    <Button variant="outline-success" style={{marginLeft: 1 + "em", marginTop: 1 + "em"}} onClick={selectValue => this.onSubmitHomework(hw)}> Завантажити домашнє завдання </Button>
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

export { HomeworkStudent }; 