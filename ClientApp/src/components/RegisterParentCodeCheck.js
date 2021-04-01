import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import { authenticationService } from '../services';


class RegisterPageParentCode extends React.Component {

    constructor(props) {
        super(props);

        this.state = {           
        };
        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }
    }

    componentDidMount() {   
    }

    render() {
        return (
            <Formik
                initialValues={{
                    classCode: ''               
                }}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                    classCode: Yup.string()
                        .required('Enter class code!'),                
                })}
                onSubmit={({ classCode }, { setStatus, setSubmitting }) => {
                    setStatus();             
                    authenticationService.codeCheck(classCode)
                        .then(
                            classId => {                           
                                this.props.history.push({
                                    pathname: '/registerParent',                                 
                                    state: { classIdState: classId}
                                });
                            },
                            error => {
                                setSubmitting(false);
                                setStatus(error);
                            }
                        );
                }}
            >
                {({ errors, status, touched, values, setFieldValue }) => (
                    <Form>
                        <h1>Please enter class code</h1>
                        <hr/>
                        <div className="form-row">
                            <div className="form-group col-5">
                                <label htmlFor="classCode">Please enter class code</label>
                                <Field name="classCode" type="text" className={'form-control' + (errors.classCode && touched.classCode ? ' is-invalid' : '')} />
                                <ErrorMessage name="classCode" component="div" className="invalid-feedback" />
                            </div>                 
                        </div>                      
                        <div className="form-group">
                            <button type="submit" className="btn btn-primary mr-2">Continue</button>                       
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

export { RegisterPageParentCode }; 