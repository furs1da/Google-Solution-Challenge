import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
import { saveAs } from 'file-saver';
import { Button } from 'react-bootstrap';


class HomeworkStudentSubmissionsTeacher extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            zeroSelectGroup: [],
            firstSelectGroup: [],
            secondSelectGroup: [],
            thirdSelectGroup: [],
            fourthSelectGroup: [],
            firstSelectGroupVisibility: false,
            secondSelectGroupVisibility: false,
            thirdSelectGroupVisibility: false,
            fourthSelectGroupVisibility: false,
            subjectLabel: '',
            hwSubmissions: [],
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllSubjectForTeacher().then(zeroSelectGroup => this.setState({ zeroSelectGroup }));
    }

    onChangeSubject(selected, setFieldValue) {
        setFieldValue('zeroSelect', selected.value)
        userService.GetAllFlowsBySubjectAndTeacher(selected.value).then(firstSelectGroup => this.setState({ firstSelectGroup })).catch(error => this.setState({ error }));
        this.setState({
            subjectLabel: selected.label,
            firstSelectGroupVisibility: true,
            secondSelectGroupVisibility: false,
            thirdSelectGroupVisibility: false,
            fourthSelectGroupVisibility: false,
        });

    }
    onChangeFlow(selected, setFieldValue, values) {
        setFieldValue('firstSelect', selected.value)
        userService.GetAllClassLettersBySubjectAndTeacherAndFlow(selected.value, values.zeroSelect).then(secondSelectGroup => this.setState({ secondSelectGroup })).catch(error => this.setState({ error }));   
        this.setState({
            secondSelectGroupVisibility: true,
            thirdSelectGroupVisibility: false,
            fourthSelectGroupVisibility: false,
        }); 
    }

    onChangeClassLetter(selected, setFieldValue, values) {
        setFieldValue('secondSelect', selected.value)
        userService.GetAllHomeworkSubmissionBySubjectAndTeacherAndClass(selected.value, values.firstSelect, values.zeroSelect).then(hwSubmissions => this.setState({ hwSubmissions })).catch(error => this.setState({ error }));

        this.setState({
            thirdSelectGroup: [{
                value: "-1",
                label: " "
            }],
        })
        userService.GetAllPupilsForClass(values.firstSelect, selected.value).then(respone => this.setState({ thirdSelectGroup: [...this.state.thirdSelectGroup, ...respone] })).catch(error => this.setState({ error }));
        userService.GetAllHomeworkTitlesBySubjectAndTeacherAndClass(values.firstSelect, values.zeroSelect).then(fourthSelectGroup => this.setState({ fourthSelectGroup })).catch(error => this.setState({ error }));
        this.setState({
            thirdSelectGroupVisibility: true,
            fourthSelectGroupVisibility: true,
        });
    }

    onChangeStudent(selected, setFieldValue, values) {
        setFieldValue('thirdSelect', selected.value)
        userService.GetAllHomeworkSubmissionBySubjectAndTeacherAndClassAndStudentAndTitle(values.zeroSelect, values.firstSelect, values.secondSelect, selected.value, values.fourthSelect).then(hwSubmissions => this.setState({ hwSubmissions })).catch(error => this.setState({ error }));      
    }

    onChangeHwTitle(selected, setFieldValue, values) {
        setFieldValue('fourthSelect', selected.value)
        userService.GetAllHomeworkSubmissionBySubjectAndTeacherAndClassAndStudentAndTitle(values.zeroSelect, values.firstSelect, values.secondSelect, values.thirdSelect, selected.value).then(hwSubmissions => this.setState({ hwSubmissions })).catch(error => this.setState({ error }));       
    }


    onDownload(id, name) {
        name = name.split('.')[0];
        userService.GetHomeworkFileTeacher(id).then(blob => saveAs(blob, name, blob.type)).catch(error => this.setState({ error }));    
     }

    onCheckHomework(hw) {
        this.props.history.push({
            pathname: '/checkHomework',
            state: {
                homework: hw, 
            }
        });
    }

    render() {
        return (
            <Formik
                initialValues={{
                    zeroSelect: '',
                    firstSelect: '',
                    secondSelect: '',
                    thirdSelect: '-1',
                    fourthSelect: '-1',
                }}              
            >
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>All homework submissions</h1>
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
                        {this.state.firstSelectGroupVisibility === true &&
                            <div className="form-group col">
                                <label htmlFor="firstSelect">Select grade</label>
                            <Select
                                placeholder="Select grade..."
                                    name="firstSelect"
                                    options={this.state.firstSelectGroup}
                                    className={'basic-multi-select' + (errors.firstSelect && touched.firstSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectFlow => this.onChangeFlow(selectFlow, setFieldValue, values)} />
                                <ErrorMessage name="firstSelect" component="div" className="invalid-feedback" />
                            </div>
                        }

                        {this.state.secondSelectGroupVisibility === true &&
                            <div className="form-group col">
                                <label htmlFor="secondSelect">Select class</label>
                            <Select
                                placeholder="Select class..."
                                    name="secondSelect"
                                    options={this.state.secondSelectGroup}
                                    className={'basic-multi-select' + (errors.secondSelect && touched.secondSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectLetter => this.onChangeClassLetter(selectLetter, setFieldValue, values)} />
                                <ErrorMessage name="secondSelect" component="div" className="invalid-feedback" />
                            </div>
                        }
                        {this.state.thirdSelectGroupVisibility === true &&
                            <div className="form-group col">
                                <label htmlFor="thirdSelect">Select homework submissions from selected student</label>
                            <Select
                                placeholder="Select student..."
                                    name="thirdSelect"
                                    options={this.state.thirdSelectGroup}
                                    className={'basic-multi-select' + (errors.thirdSelect && touched.thirdSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectStudent => this.onChangeStudent(selectStudent, setFieldValue, values)} />
                                <ErrorMessage name="thirdSelect" component="div" className="invalid-feedback" />
                            </div>
                        }
                        {this.state.fourthSelectGroupVisibility === true &&
                            <div className="form-group col">
                                <label htmlFor="fourthSelect">Select homework assignment</label>
                            <Select
                                placeholder="Select homework..."
                                    name="fourthSelect"
                                    options={this.state.fourthSelectGroup}
                                    className={'basic-multi-select' + (errors.fourthSelect && touched.fourthSelect ? ' is-invalid' : '')}
                                    classNamePrefix="select"
                                    onChange={selectWH => this.onChangeHwTitle(selectWH, setFieldValue, values)} />
                                <ErrorMessage name="fourthSelect" component="div" className="invalid-feedback" />
                            </div>
                        }


                        <h1>All submissions from "{this.state.subjectLabel}"</h1>
                        {this.state.hwSubmissions.map(hw =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    Тема: {hw.title}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Student: {hw.studentName}</h5>
                                    <h5 class="card-title">Date of the submission: {new Date(hw.dateSubmission).toLocaleDateString()}</h5>
                                    <h5 class="card-title">Deadline: {hw.dueFlag}</h5>
                                    <h6 class="card-subtitle mb-2 text-muted">Comments from the student:</h6>
                                    <p class="card-text">  {hw.comments}</p>

                                    <Button variant="outline-primary" onClick={selectValue => this.onDownload(hw.idSubmission, hw.attechement)}> {hw.attechement} </Button>
                                    <br />
                                    <Button variant="outline-success" block onClick={selectValue => this.onCheckHomework(hw)} style={{ marginTop: 0.5 + "em" }}> Give a mark </Button>                    
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

export { HomeworkStudentSubmissionsTeacher }; 