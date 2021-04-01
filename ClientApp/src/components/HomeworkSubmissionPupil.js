import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import { userService } from '../services';

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
class submitHomework extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            hwObject: '',           
        };
    }

    componentDidMount() {
       

        this.setState({
            hwObject: this.props.location.state.homework,          
        });
    }

  

    render() {
        return (
            <Formik
                initialValues={{                
                    comment: '',
                    attachement: '',
                }}
                validationSchema={Yup.object().shape({
                    attachement: Yup.mixed().required('Attach the file!')
                })}
                onSubmit={({ comment, attachement }, { setStatus, setSubmitting }) => {
                    setStatus();                
                    userService.SubmitHomeworkPupil(this.state.hwObject.idHomework, comment, attachement)
                        .then(
                            user => {                            
                            this.props.history.push({
                                pathname: '/Homeworks',
                            });
                        },
                            error => {
                                setSubmitting(false);
                                setStatus(error);
                            }
                        );
                }}
            >
                {({ errors, status, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>  
                        <h1>Upload homework</h1>
                        <hr />
                        <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                            <div class="card-header">
                                Тема: {this.state.hwObject.title}
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Teacher: {this.state.hwObject.teacherName}</h5>
                                <h5 class="card-title">Deadline: {new Date(this.state.hwObject.dueDate).toLocaleDateString()}</h5>
                                <h5 class="card-title">Submission status: {this.state.hwObject.doneFlag}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Content:</h6>
                                <p class="card-text">  {this.state.hwObject.description}</p>                   
                            </div>
                        </div>  
                        


                        <div className="form-group col">
                            <MyTextArea
                                label="Comments:"
                                name="comment"
                                rows="10"
                                placeholder="Write comments about your homework that you want to tell your teacher..."
                            />
                        </div>
                        <div className="form-group col">
                            <label for="attachement">Upload homework file</label>
                            <br/>
                            <input
                                id="attachement"
                                type="file"
                                name="attachement"
                                class="form-control-file"
                                onChange={(event) => {
                                    setFieldValue("attachement", event.currentTarget.files[0]);
                                }}
                            />
                        </div>
                        <ErrorMessage name="attachement" component="div" className="invalid-feedback" />

                        <div className="form-group col">
                            <button type="submit" className="btn btn-primary mr-2">Upload homework</button>
                            <button type="reset" className="btn btn-secondary">Reset</button>
                        </div>
                        {status &&
                            <div className={'alert alert-danger'}>{status}</div>
                        }
                    </Form>
                )}
            </Formik>
        )
    }
}

export { submitHomework }; 