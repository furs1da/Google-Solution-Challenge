import React from 'react';
import { Formik, Field, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from "react-router-dom";
import { authenticationService } from '../services';
import 'semantic-ui-css/semantic.min.css';
import { Button, Icon, Popup } from "semantic-ui-react";

class ChooseRegistration extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
        };
        // redirect to home if already logged in
        if (authenticationService.currentUserValue) {
            this.props.history.push('/');
        }
    }

    componentDidMount() {
    }
    onRedirectToParent() {
        this.props.history.push({
            pathname: '/registerParentCode',        
        });
    }
    onRedirectToChild() {
        this.props.history.push({
            pathname: '/registerPupil',
        });
    }

    render() {
        return (
            <div>
                <h2>Please select the role in which do you want to register:</h2>
            <Formik>
                {({ errors, status, touched, values, setFieldValue }) => (
                        <Form>
                            <div class="ui two column stackable center aligned grid segment">
                                <div class="column">
                                    <Button animated onClick={selectValue => this.onRedirectToChild()}>
                                        <Button.Content visible>Register as a student</Button.Content>
                                        <Button.Content hidden>
                                            <Icon name='graduation cap' />
                                        </Button.Content>
                                    </Button>  
                                </div>
                                <div class="ui vertical divider">OR</div>
                                <div class="column">
                                    <Button animated onClick={selectValue => this.onRedirectToParent()}>
                                        <Button.Content visible>Register as a Parent</Button.Content>
                                        <Button.Content hidden>
                                            <Icon name='handshake outline' />
                                        </Button.Content>
                                    </Button>   
                                </div>
                            </div>                  
                    </Form>
                )}
                </Formik>
                </div>
        )
    }
}

export { ChooseRegistration }; 