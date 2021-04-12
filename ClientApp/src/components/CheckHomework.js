import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import { userService } from '../services';
import { saveAs } from 'file-saver';
import { Button } from 'react-bootstrap';

const MyTextArea = ({ label, ...props }) => {  
    const [field, meta] = useField(props);
    return (
        <>
            <label htmlFor={props.id || props.name}>{label}</label>
            <textarea className="text-area" {...field} {...props} style={{ width: 100 + "%" }}/>
            {meta.touched && meta.error ? (
                <div className="error">{meta.error}</div>
            ) : null}
        </>
    );
};
class checkHomework extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hwObject: '',
            error: '',
        };
    }

    componentDidMount() {


        this.setState({
            hwObject: this.props.location.state.homework,
        });
    }

    onDownload(id, name) {
        name = name.split('.')[0];
        userService.GetHomeworkFileTeacher(id).then(blob => saveAs(blob, name, blob.type)).catch(error => this.setState({ error }));
    }


    render() {
        return (
            <Formik
                initialValues={{
                    comment: '',
                    gradeStudent: '',
                }}
                validationSchema={Yup.object().shape({
                    
                })}
                onSubmit={({ comment, gradeStudent }, { setStatus}) => {
                    setStatus();
                    userService.SubmitHomeworkGradeTeacher(this.state.hwObject.idSubmission, comment, gradeStudent)
                        .then(
                            user => {
                                this.props.history.push({
                                    pathname: '/allHWSubmissions',
                                });
                            },
                            error => {
                   
                                setStatus(error);
                            }
                        );
                }}
            >
                {({ errors, status, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Marking</h1>
                        <hr />
                        <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                            <div class="card-header">
                                Student: {this.state.hwObject.studentName}
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Title: {this.state.hwObject.title}</h5>
                                <h5 class="card-title">Date of submission: {new Date(this.state.hwObject.dateSubmission).toLocaleDateString()}</h5>
                                <h5 class="card-title">Deadline: {this.state.hwObject.dueFlag}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Student's comments:</h6>
                                <p class="card-text">{this.state.hwObject.comments}</p>
                                <Button variant="outline-primary" onClick={selectValue => this.onDownload(this.state.hwObject.idSubmission, this.state.hwObject.attechement)}> {this.state.hwObject.attechement} </Button>                               
                            </div>
                        </div>  
                      
                        <div className="form-group col">
                            <label for="gradeStudent">Mark</label>
                            <Field name="gradeStudent" type="number" max="100" min="0" style={{marginLeft: 1 + "em"}}/>
                        </div>
                        <ErrorMessage name="gradeStudent" component="div" className="invalid-feedback" />

                        <div className="form-group col">
                            <MyTextArea
                                label="Comments"
                                name="comment"
                                rows="10"
                                placeholder="It is necessary to write why you give this mark..."
                            />
                        </div>
                        <ErrorMessage name="comment" component="div" className="invalid-feedback" />

                        <div className="form-group col">
                            <button type="submit" className="btn btn-primary mr-2">Give the mark</button>
                            <button type="reset" className="btn btn-secondary">Reset data</button>
                        </div>
                        {status &&
                            <div className={'alert alert-danger'}>{status}</div>
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

export { checkHomework }; 