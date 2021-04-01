import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import { userService } from '../services';
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
                                <h1 style={{ marginLeft: -0.5 + "em" }}>All administrators</h1></div>
                            <hr />   <div class="row">
                                {this.state.adminsList.map(adminEntity =>
                                <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                    <div class="card-header">
                                        Full Name:  {adminEntity.fio}
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">Date of birth: {new Date(adminEntity.dateOfBirth).toLocaleDateString()}</h5>
                                        <h5 class="card-title">Email: {adminEntity.mail}</h5>
                                        <br />
                                        <h5 class="card-title">Phone number: {adminEntity.phone}</h5>
                                        <br />
                                        <h6 class="card-subtitle mb-2 text-muted">Biography:</h6>
                                        <p class="card-text"> {adminEntity.description}</p>                                     
                                        <br />
                                        <Button variant="outline-primary" onClick={selectValue => this.onRedirectToChange(adminEntity.idAdmin)}> Edit administrator's data </Button>
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