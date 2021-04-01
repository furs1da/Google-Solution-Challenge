import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
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
                        .required('Please, select the subject.'),                   

                })}
            >
                {({ errors, status, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Homework assignments</h1>
                        <hr />
                        <h3>Select subject</h3>
                        <div className="form-group col">
                            <label htmlFor="zeroSelect">Select the subject</label>
                            <Select
                                placeholder="Please, select the subject..."
                                name="zeroSelect"
                                options={this.state.zeroSelectGroup}
                                className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectAnnouncement => this.onChangeSubject(selectAnnouncement, setFieldValue)} />
                            <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                        </div>
                        <h2>All homeworks on selected subject "{this.state.subjectLabel}"</h2>
                        {this.state.homeworks.map(hw =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    Topic: {hw.title}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Teacher: {hw.teacherName}</h5>
                                    <h5 class="card-title">Deadline: {new Date(hw.dueDate).toLocaleDateString()}</h5>
                                    <h5 class="card-title">Status of submission: {hw.doneFlag}</h5>
                                    <br />
                                    <h6 class="card-subtitle mb-2 text-muted">Description:</h6>
                                    <p class="card-text">{hw.description}</p>
                                    {hw.attechement !== 'nodata' &&
                                        <Button variant="outline-primary" style={{ marginLeft: 1 + "em", marginTop: 1 + "em" }} onClick={selectValue => this.onDownload(hw.idHomework, hw.attechement)}> {hw.attechement} </Button>
                                    }
                                    <Button variant="outline-success" style={{marginLeft: 1 + "em", marginTop: 1 + "em"}} onClick={selectValue => this.onSubmitHomework(hw)}> Submit homework </Button>
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