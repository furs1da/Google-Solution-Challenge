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



class ListOfAdminsAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
           adminsList: [],
        };
    }

    componentDidMount() {
        userService.GetAllAdminsForAdmin().then(adminsList => this.setState({ adminsList }));
    }

    onRedirectToChange(adminId) {
        this.props.history.push({
            pathname: '/changeAdminInfo',
            state: { idAdminList: adminId }
        });
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
                                <h1 style={{ marginLeft: -0.5 + "em" }}>Усі адміністратори</h1></div>
                            <hr />   <div class="row">
                                {this.state.adminsList.map(adminEntity =>
                                <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                    <div class="card-header">
                                        ПІБ:  {adminEntity.fio}
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">Дата народження: {new Date(adminEntity.dateOfBirth).toLocaleDateString()}</h5>
                                        <h5 class="card-title">Електронна пошта: {adminEntity.mail}</h5>
                                        <br />
                                        <h5 class="card-title">Телефон: {adminEntity.phone}</h5>
                                        <br />
                                        <h6 class="card-subtitle mb-2 text-muted">Біографія:</h6>
                                        <p class="card-text"> {adminEntity.description}</p>                                     
                                        <br />
                                        <Button variant="outline-primary" onClick={selectValue => this.onRedirectToChange(adminEntity.idAdmin)}> Редагувати дані </Button>
                                    </div>
                                </div>  
                                 )}</div>                               
                        {status &&
                            <div className={'alert alert-danger'}>{status}</div>
                        }</div>
                    </Form>
                )}
            </Formik>
        )
    }
}

export { ListOfAdminsAdmin }; 