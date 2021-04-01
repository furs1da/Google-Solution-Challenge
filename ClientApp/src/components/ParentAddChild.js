import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import { authenticationService, userService } from '../services';
import { Button } from 'react-bootstrap';

class AddChildParent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            students: [],
            classId: '',
            error: '',
        };
       
    }

    componentDidMount() {
    }


    ShowChildren(classCode) {
        authenticationService.codeCheck(classCode).then(classId => userService.GetAllStudentsFromClassRegisteredParent(classId).then(students => this.setState({ students }))).catch(error => this.setState({ error }));   
    }

    render() {
        return (
            <Formik
                initialValues={{
                    classCode: '',
                    idPupil: ''
                }}
                enableReinitialize={true}
                validationSchema={Yup.object().shape({
                    classCode: Yup.string()
                        .required('Enter class code'),
                })}
                onSubmit={({ idPupil }, { setStatus, setSubmitting }) => {
                    setStatus();
                    userService.AddChild(idPupil)
                        .then(
                            classId => {
                                this.props.history.push({
                                    pathname: '/listOfChilds',                   
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
                        <h1>Add a child to account</h1>
                        <hr />
                        <div className="form-row">
                            <div className="form-group col">
                                <label htmlFor="classCode">Please enter the code of the class</label>
                                <Field name="classCode" type="text" className={'form-control' + (errors.classCode && touched.classCode ? ' is-invalid' : '')} />
                                <ErrorMessage name="classCode" component="div" className="invalid-feedback" />
                            </div>
                        </div>
                        <Button variant="outline-primary" block onClick={selectValue => this.ShowChildren(values.classCode)} style={{marginBottom: 1 + "em" }}> Показати дітей в обранному класі </Button>
                        <div className="form-row">
                        <div className="form-group col">
                            <label htmlFor="idPupil">Select your child</label>
                            <Field name="idPupil" as="select" placeholder="Select child..." className={'form-control' + (errors.idPupil && touched.idPupil ? ' is-invalid' : '')}>
                                {this.state.students.map((student, i) => (
                                    <option key={student.idPupil} value={student.idPupil}> {student.surname} {student.name} {student.patronymic}</option>
                                ))}
                            </Field>
                            <ErrorMessage name="title" component="div" className="invalid-feedback" />
                        </div></div>
                        <div className="form-group col">
                            <Button type="submit" block className="btn btn-primary mr-2">Add a child to the account</Button>
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

export { AddChildParent }; 