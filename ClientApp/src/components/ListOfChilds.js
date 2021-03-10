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
            title: "Підтвердіть дію",
            message: "Ви впевнені, що хочете видалити з вашого аккаунта привязку до цієї дитини?",
            buttons: [
                {
                    label: "Так",
                    onClick: () => { this.DeleteRecordConfirmed(idChild) }
                },
                {
                    label: "Ні"
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
                        <h1>Ваші діти</h1>
                        <hr />
                        {this.state.childrenList.map(studentEntity =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    ПІБ: {studentEntity.fio}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Дата народження: {new Date(studentEntity.dateOfBirth).toLocaleDateString()}</h5>
                                    <h5 class="card-title">Електронна пошта: {studentEntity.mail}</h5>
                                    <h5 class="card-title">Телефон: {studentEntity.phone}</h5>
                                    <h5 class="card-title">Домашня адресса: {studentEntity.adress}</h5>
                                    <h5 class="card-title">Девіз: {studentEntity.moto}</h5>
                                    <h5 class="card-title">Навчається у класі: {studentEntity.classInfo}</h5>
                                    <h5 class="card-title">Фото:</h5>
                                    <img class="img-fluid" style={{ maxHeight: 250 + "px", marginBottom: 1 + "em" }} src={'data:image/png;base64,' + studentEntity.imageOfStudent} />
                                    <br />
                                    <Button type="button" animated basic color='red' onClick={selectValue => this.DeleteRecord(studentEntity.idStudent)}>
                                        <Button.Content visible>Видалити зв'язок</Button.Content>
                                        <Button.Content hidden>
                                            <Icon name='trash' />
                                        </Button.Content>
                                    </Button>       
                                </div>
                            </div>                
                        )}
                        <div class="row">
                            <div class="col">
                                <Button color="primary" style={{marginBottom: 1 + "em", width: 100 + "%" }} onClick={selectValue => this.onRedirectToChange()}> Додати дитину </Button>
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