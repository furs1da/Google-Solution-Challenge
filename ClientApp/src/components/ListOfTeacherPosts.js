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



class ListOfTeachersPostAdmin extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            postsList: [],
            subjectsList: [],
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllSubjectForTeacher().then(subjectsList => this.setState({ subjectsList }));
    }

    onChangeSubject(selectValue, setFieldValue, values) {

        userService.GetAllPostsInfoTeacher(selectValue.value).then(postsList => this.setState({ postsList })).catch(error => this.setState({ error }));

    }

    onRedirectToChange(postId) {
        this.props.history.push({
            pathname: '/changePostInfo',
            state: { idPostList: postId }
        });
    }

    onDownload(id, name) {
        name = name.split('.')[0];
        userService.GetHomeworkFilePupilPost(id).then(blob => saveAs(blob, name)).catch(error => this.setState({ error }));
    }


    render() {
        return (
            <Formik
                initialValues={{
                    subjectSelect: '',
                }}>
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form className= "justify-content-md-center" class="container-fluid">
                   <div class="container-fluid">
                    <div class="row">
                        <h1 style={{ marginLeft: -0.5 + "em" }}>Усі пости зроблені вами</h1></div>
                    <hr /> 
                        <div className="form-group col">
                            <label htmlFor="subjectSelect">Оберіть предмет</label>
                            <Select
                                placeholder="Оберіть предмет..."
                                name="subjectSelect"
                                options={this.state.subjectsList}
                                className={'basic-multi-select' + (errors.subjectSelect && touched.subjectSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectValue => this.onChangeSubject(selectValue, setFieldValue, values)}

                            />
                            <ErrorMessage name="subjectSelect" component="div" className="invalid-feedback" />
                        </div>
                        <h1>Усі пости</h1>
                            {this.state.postsList.map(post =>
                                <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                    <div class="card-header">
                                        Тема: {post.title}
                                        { console.log(post)}
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">Для паралелі : {post.flowNumber}</h5>
                                        <h5 class="card-title">Дата посту: {new Date(post.dateOfPost).toLocaleDateString()}</h5>
                                        <br />                                       
                                        <h6 class="card-subtitle mb-2 text-muted">Наповнення:</h6>
                                        <p class="card-text">{post.content}</p>
                                        {post.filename !== 'nodata' &&
                                            <Button variant="outline-primary" onClick={selectValue => this.onDownload(post.idPost, post.filename)}> {post.filename} </Button>
                                        }     
                                        <br />
                                        <Button variant="outline-secondary" block onClick={selectValue => this.onRedirectToChange(post.idPost)} style={{ marginTop: 0.5 + "em" }}> Редагувати дані </Button>
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

export { ListOfTeachersPostAdmin }; 