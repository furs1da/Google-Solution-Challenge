import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
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
                        <h1 style={{ marginLeft: -0.5 + "em" }}>All your posts</h1></div>
                    <hr /> 
                        <div className="form-group col">
                            <label htmlFor="subjectSelect">Select subject</label>
                            <Select
                                placeholder="Select subject..."
                                name="subjectSelect"
                                options={this.state.subjectsList}
                                className={'basic-multi-select' + (errors.subjectSelect && touched.subjectSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectValue => this.onChangeSubject(selectValue, setFieldValue, values)}

                            />
                            <ErrorMessage name="subjectSelect" component="div" className="invalid-feedback" />
                        </div>
                        <h1>All posts</h1>
                            {this.state.postsList.map(post =>
                                <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                    <div class="card-header">
                                        Тема: {post.title}
                                        { console.log(post)}
                                    </div>
                                    <div class="card-body">
                                        <h5 class="card-title">Grade : {post.flowNumber}</h5>
                                        <h5 class="card-title">Date of post: {new Date(post.dateOfPost).toLocaleDateString()}</h5>
                                        <br />                                       
                                        <h6 class="card-subtitle mb-2 text-muted">Content:</h6>
                                        <p class="card-text">{post.content}</p>
                                        {post.filename !== 'nodata' &&
                                            <Button variant="outline-primary" onClick={selectValue => this.onDownload(post.idPost, post.filename)}> {post.filename} </Button>
                                        }     
                                        <br />
                                        <Button variant="outline-secondary" block onClick={selectValue => this.onRedirectToChange(post.idPost)} style={{ marginTop: 0.5 + "em" }}> Edit post's data </Button>
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