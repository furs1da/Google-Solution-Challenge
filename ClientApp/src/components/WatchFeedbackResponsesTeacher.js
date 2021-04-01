import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import { userService } from '../services';
import { saveAs } from 'file-saver';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class WatchFeedbackResponseTeacher extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            feedbackList: [],         
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllFeedbackTeacher().then(feedbackList => this.setState({ feedbackList }));
    }

    onDownload(id, name) {
        console.log(id);
        name = name.split('.')[0];
        userService.GetFileTeacherFeedback(id).then(blob => saveAs(blob, name)).catch(error => this.setState({ error }));
    }
    onRedirectToFeedback() {
        this.props.history.push({
            pathname: '/feedbackTeacher',           
        });
    }


    render() {
        return (
            <Formik>
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form className="justify-content-md-center" class="container-fluid">
                        <div class="container-fluid">
                            <div class="row">
                                <h1 style={{ marginLeft: -0.5 + "em" }}>All mails</h1> </div>
                            <hr />
                            {this.state.feedbackList.map(feedbackEntity =>
                                <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                    <div class="card-header">
                                        {feedbackEntity.senderName}
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">{feedbackEntity.title}</h5>
                                        <br />
                                        <h6 class="card-subtitle mb-2 text-muted">Date of mail: {new Date(feedbackEntity.dateOfFeedback).toLocaleDateString()}</h6>
                                        <br />
                                        <h6 class="card-subtitle mb-2 text-muted">Content:</h6>
                                        <p class="card-text">{feedbackEntity.content}</p>
                                        {feedbackEntity.filename !== 'nodata' &&
                                            <Button variant="outline-primary" block onClick={selectValue => this.onDownload(feedbackEntity.idFeedback, feedbackEntity.filename)}> {feedbackEntity.filename} </Button>
                                        }
                                        <br /> <Link to="/feedbackTeacher" style={{ fontSize: '.9em', marginLeft: '0.5em' }}>Open mailing tab</Link>
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

export { WatchFeedbackResponseTeacher }; 