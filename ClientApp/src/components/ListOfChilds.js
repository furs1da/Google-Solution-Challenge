import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import { userService } from '../services';
import 'semantic-ui-css/semantic.min.css';
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { Button, Icon, Popup } from "semantic-ui-react";



class ListOfChildsParent extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
           childrenList: [],
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllChildrenParent().then(childrenList => this.setState({ childrenList }));
    }

    DeleteRecordConfirmed(idChild) {
        console.log(idChild);
        userService.DeleteRecordChildParent(idChild).then(response => {    
            userService.GetAllChildrenParent().then(childrenList => this.setState({ childrenList }));
        }).catch(error => this.setState({ error }));     
    }

    DeleteRecord(idChild) {
        confirmAlert({
            title: "Confirm the action",
            message: "Are you sure that you want to delete the link of this child from your account?",
            buttons: [
                {
                    label: "Yes",
                    onClick: () => { this.DeleteRecordConfirmed(idChild) }
                },
                {
                    label: "No"
                }
            ]
        });
    };

    onRedirectToChange() {
        this.props.history.push({
            pathname: '/addChild'    
        });
    }

    render() {
        return (
            <Formik>
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>                       
                        <h1>Your children</h1>
                        <hr />
                        {this.state.childrenList.map(studentEntity =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    Full name: {studentEntity.fio}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Date of birth: {new Date(studentEntity.dateOfBirth).toLocaleDateString()}</h5>
                                    <h5 class="card-title">Email: {studentEntity.mail}</h5>
                                    <h5 class="card-title">Phone number: {studentEntity.phone}</h5>
                                    <h5 class="card-title">Home address: {studentEntity.adress}</h5>
                                    <h5 class="card-title">Moto: {studentEntity.moto}</h5>
                                    <h5 class="card-title">Class: {studentEntity.classInfo}</h5>
                                    <h5 class="card-title">Photo:</h5>
                                    <img class="img-fluid" style={{ maxHeight: 250 + "px", marginBottom: 1 + "em" }} src={'data:image/png;base64,' + studentEntity.imageOfStudent} />
                                    <br />
                                    <Button type="button" animated basic color='red' onClick={selectValue => this.DeleteRecord(studentEntity.idStudent)}>
                                        <Button.Content visible>Delete link</Button.Content>
                                        <Button.Content hidden>
                                            <Icon name='trash' />
                                        </Button.Content>
                                    </Button>       
                                </div>
                            </div>                
                        )}
                        <div class="row">
                            <div class="col">
                                <Button color="primary" style={{marginBottom: 1 + "em", width: 100 + "%" }} onClick={selectValue => this.onRedirectToChange()}> Add a child </Button>
                            </div>
                        </div>
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                        }
                    </Form>
                )}
            </Formik>
        )
    }
}

export { ListOfChildsParent }; 