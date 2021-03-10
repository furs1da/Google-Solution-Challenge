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
import { saveAs } from 'file-saver';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';


class ListOfAnnouncementsAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            announcementsList: [],
        };
    }

    componentDidMount() {
        userService.GetAllAnnouncementsForAdmin().then(announcementsList => this.setState({ announcementsList }));
    }

    onRedirectToChange(announcementId) {
        this.props.history.push({
            pathname: '/changeAnnouncementInfo',
            state: { idAnnouncementList: announcementId }
        });
    }

    onDownload(id, name) {
        console.log(id);
        name = name.split('.')[0];
        userService.GetFileAdminAnnouncement(id).then(blob => saveAs(blob, name));
    }


    render() {
        return (
            <Formik
                initialValues={{
                    subjectSelect: '',
                }}>
                {({ errors, status, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form className="justify-content-md-center" class="container-fluid">
                        <div class="container-fluid">
                            <div class="row">
                                <h1 style={{ marginLeft: -0.5 + "em" }}>Усі оголошення зроблені вами</h1></div>
                            <hr />   
                                {this.state.announcementsList.map(ancmnt =>
                                    <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                        <div class="card-header">
                                            Аудиторія: {ancmnt.audience}
                                        </div>
                                        <div class="card-body">
                                            <h5 class="card-title">Тема: {ancmnt.title}</h5>
                                            <h5 class="card-title">Актуальність: {ancmnt.actual}</h5>
                                            <br />
                                            <h6 class="card-subtitle mb-2 text-muted">Дата оголошення: {new Date(ancmnt.dateOfAnnouncement).toLocaleDateString()}</h6>
                                            <br />
                                            <h6 class="card-subtitle mb-2 text-muted">Наповнення:</h6>
                                            <p class="card-text">{ancmnt.content}</p>
                                            {ancmnt.filename !== 'nodata' &&
                                                <Button variant="outline-primary"   onClick={selectValue => this.onDownload(ancmnt.idAnnouncement, ancmnt.filename)}> {ancmnt.filename} </Button>
                                            }
                                            <br/>
                                            <Button variant="outline-secondary" block onClick={selectValue => this.onRedirectToChange(ancmnt.idAnnouncement)} style={{ marginTop: 0.5 + "em" }}> Редагувати оголошення </Button>
                                        </div>
                                    </div>  
                                )} 
                        {status &&
                            <div className={'alert alert-danger'}>{status}</div>
                            }       </div>
                    </Form>
                )}
            </Formik>
        )
    }
}

export { ListOfAnnouncementsAdmin }; 