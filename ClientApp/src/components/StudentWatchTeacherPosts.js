import React from 'react';
import { Formik, Field, Form, ErrorMessage, useField } from 'formik';
import "react-datepicker/dist/react-datepicker.css";
import Select from 'react-select';
import { userService } from '../services';
import { saveAs } from 'file-saver';
import { Button } from 'react-bootstrap';



class WatchTeacherPosts extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            teacherPosts: [],
            zeroSelectGroup: [],
            subjectLabel: '',
            error: '',
        };
    }

    componentDidMount() {
        userService.GetAllSubjectsPupil().then(zeroSelectGroup => this.setState({ zeroSelectGroup }));
    }

    onChangeSubject(selected, setFieldValue) {
        setFieldValue('zeroSelect', selected.value)
        userService.GetAllPostsBySubjectPupil(selected.value).then(teacherPosts => this.setState({ teacherPosts })).catch(error => this.setState({ error }));
        this.setState({
            subjectLabel: selected.label,
        });

    }

    onDownload(id, name) {
        console.log(id);
        name = name.split('.')[0];
        userService.GetHomeworkFilePupilPost(id).then(blob => saveAs(blob, name)).catch(error => this.setState({ error }));
    }



    render() {
        return (
            <Formik
                initialValues={{
                    zeroSelect: '',
                }}
             >
                {({ errors, touched, values, setFieldValue, setFieldTouched }) => (
                    <Form>
                        <h1>Posts from teachers</h1>
                        <hr />
                        <h3>Select subject</h3>
                        <div className="form-group col">
                            <label htmlFor="zeroSelect">Select subject</label>
                            <Select
                                placeholder="Select subject..."
                                name="zeroSelect"
                                options={this.state.zeroSelectGroup}
                                className={'basic-multi-select' + (errors.zeroSelect && touched.zeroSelect ? ' is-invalid' : '')}
                                classNamePrefix="select"
                                onChange={selectSubject => this.onChangeSubject(selectSubject, setFieldValue)} />
                            <ErrorMessage name="zeroSelect" component="div" className="invalid-feedback" />
                        </div>
                        <h2>All posts on selected subject "{this.state.subjectLabel}"</h2>
                        {this.state.teacherPosts.map(post =>
                            <div class="card" style={{ marginTop: 1.5 + "em", marginBottom: 1 + "em", marginLeft: 1 + "em" }}>
                                <div class="card-header">
                                    Topic: {post.title}
                                </div>
                                <div class="card-body">
                                    <h5 class="card-title">Teacher: {post.teacherName}</h5>
                                    <h5 class="card-title">Date of the post: {new Date(post.dateOfPost).toLocaleDateString()}</h5>
                                    <br />
                                    <h6 class="card-subtitle mb-2 text-muted">Content:</h6>
                                    <p class="card-text">{post.content}</p>
                                    {post.filename !== 'nodata' &&
                                        <Button variant="outline-primary" onClick={selectValue => this.onDownload(post.idPost, post.filename)}> {post.filename} </Button>
                                    }                                     
                                </div>
                            </div>                          
                        )}
                        {this.state.error &&
                            <div className={'alert alert-danger'}>{this.state.error}</div>
                        }
                    </Form>
                )}
            </Formik>
        )
    }
}

export { WatchTeacherPosts }; 