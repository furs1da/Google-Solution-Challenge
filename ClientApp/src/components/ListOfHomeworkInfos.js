import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
import { saveAs } from 'file-saver';
import { Button } from 'react-bootstrap';



class ListOfHomeworksInfoAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            homeworkInfoList: [],
            subjectsList: [],
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllSubjectForTeacher().then(subjectsList => this.setState({ subjectsList }));
    }

    onChangeSubject(selectValue, setFieldValue, values) {

        userService.GetAllHomeworkInfoTeacher(selectValue.value).then(homeworkInfoList => this.setState({ homeworkInfoList })).catch(error => this.setState({ error }));

    }

    onRedirectToChange(homeworkInfoId) {
        this.props.history.push({
            pathname: '/changeHomeworkInfo',
            state: { idHomeworkInfoList: homeworkInfoId }
        });
    }
    onDownload(id, name) {
        name = name.split('.')[0];
        userService.GetHomeworkFilePupil(id).then(blob => saveAs(blob, name)).catch(error => this.setState({ error }));
    }


    render() {
        return (
            <Formik
                initialValues={{
                    subjectSelect: '',
                }}>
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form className="justify-content-md-center" class="container-fluid">
                        <div class="container-fluid">
                            <div class="row">
                                <h1 style={{ marginLeft: -0.5 + "em" }}>All homeworks assignments from you</h1></div>
                            <hr /> 
                        <div className="form-group col">
                            <label htmlFor="subjectSelect">Select subject</label>
                            <Select
                                placeholder="Select subject..."
                                name="subjectSelect"
                                options={this.state.subjectsList}
                                className={'basic-multi-select' + (errors.subjectSelect && touched.subjectSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectValue => this.onChangeSubject(selectValue, setFieldValue, values)}

                            />
                            <ErrorMessage name="subjectSelect" component="div" className="invalid-feedback" />
                        </div>
                        <h1>All homeworks</h1>
                            {this.state.homeworkInfoList.map(hwInfoEntity =>
                                <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                    <div class="card-header">
                                        Topic: {hwInfoEntity.title}
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">For grade: {hwInfoEntity.flowNumber}</h5>
                                        <h5 class="card-title">Deadline: {new Date(hwInfoEntity.dueDate).toLocaleDateString()}</h5>
                                        <br />                                       
                                        <h6 class="card-subtitle mb-2 text-muted">Content:</h6>
                                        <p class="card-text"> {hwInfoEntity.description}</p>
                                        {hwInfoEntity.attechement !== 'nodata' &&
                                            <Button variant="outline-primary" onClick={selectValue => this.onDownload(hwInfoEntity.idHomeworkInfo, hwInfoEntity.attechement)}> {hwInfoEntity.attechement} </Button>
                                        }
                                        <br />
                                        <Button variant="outline-primary" block onClick={selectValue => this.onRedirectToChange(hwInfoEntity.idHomeworkInfo)} style={{ marginTop: 0.5 + "em" }}> Edit homework's data </Button>                                    
                            </div>
                                        </div>  
                        )}
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                            }
                        </div>
                    </Form>
                )}
            </Formik>
        )
    }
}

export { ListOfHomeworksInfoAdmin }; 