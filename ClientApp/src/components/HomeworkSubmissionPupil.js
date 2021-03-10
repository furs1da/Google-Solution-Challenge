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
                    attachement: Yup.mixed().required('Треба прикріпити файл!')
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
                        <h1>Завантажити домашнє завдання</h1>
                        <hr />
                        <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                            <div class="card-header">
                                Тема: {this.state.hwObject.title}
                            </div>
                            <div class="card-body">
                                <h5 class="card-title">Вчитель: {this.state.hwObject.teacherName}</h5>
                                <h5 class="card-title">Дедлайн: {new Date(this.state.hwObject.dueDate).toLocaleDateString()}</h5>
                                <h5 class="card-title">Статус завантаження: {this.state.hwObject.doneFlag}</h5>
                                <h6 class="card-subtitle mb-2 text-muted">Зміст:</h6>
                                <p class="card-text">  {this.state.hwObject.description}</p>                   
                            </div>
                        </div>  
                        


                        <div className="form-group col">
                            <MyTextArea
                                label="Коментарі"
                                name="comment"
                                rows="10"
                                placeholder="Напишіть коментарі щодо вашого домашнього завдання, які хочете повідомити своєму вчителю..."
                            />
                        </div>
                        <div className="form-group col">
                            <label for="attachement">Завантажити файл з домашнім завданням</label>
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
                            <button type="submit" className="btn btn-primary mr-2">Завантажити домашнє завдання</button>
                            <button type="reset" className="btn btn-secondary">Очистити поля</button>
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