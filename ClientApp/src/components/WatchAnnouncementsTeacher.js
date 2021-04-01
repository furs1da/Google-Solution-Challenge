import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import { userService } from '../services';
import { saveAs } from 'file-saver';
import { Button } from 'react-bootstrap';



class WatchTeacherAnnouncements extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            announcements: [],
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllAnnouncementTeacher().then(announcements => this.setState({ announcements }));
    }

    onDownload(id, name) {
        console.log(id);
        name = name.split('.')[0];
        userService.GetFileTeacherAnnouncement(id).then(blob => saveAs(blob, name)).catch(error => this.setState({ error }));
    }



    render() {
        return (
            <Formik>
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form className="justify-content-md-center" class="container-fluid">
                        <div class="container-fluid">
                            <div class="row">
                                <h1 style={{ marginLeft: -0.5 + "em" }}>All announcements for you</h1></div>
                            <hr /> 
                        {this.state.announcements.map(ancmnt =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    Administrator: {ancmnt.senderName}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Topic: {ancmnt.title}</h5>
                                    <br />
                                    <h6 class="card-subtitle mb-2 text-muted">Date of the announcement: {new Date(ancmnt.dateOfAnnouncement).toLocaleDateString()}</h6>
                                    <br />
                                    <h6 class="card-subtitle mb-2 text-muted">Content:</h6>
                                    <p class="card-text">{ancmnt.content}</p>
                                    {ancmnt.filename !== 'nodata' &&
                                        <Button variant="outline-primary" onClick={selectValue => this.onDownload(ancmnt.idAnnouncement, ancmnt.filename)}> {ancmnt.filename} </Button>
                                    }

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

export { WatchTeacherAnnouncements }; 