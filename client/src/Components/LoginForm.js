// see SignupForm.js for comments
import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useMutation } from "@apollo/client";
import Auth from '../utils/auth';
import { LOGIN_USER } from '../utils/mutations';
import Card from 'react-bootstrap/Card';


const LoginForm = () => {
    const [userFormData, setUserFormData] = useState({ username: '', password: '' });
    const [validated] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

    const [loginUser, { error }] = useMutation(LOGIN_USER);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setUserFormData({ ...userFormData, [name]: value });
    };

    const handleFormSubmit = async (event) => {
        event.preventDefault();

        // check if form has everything (as per react-bootstrap docs)
        const form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.preventDefault();
            event.stopPropagation();
        }

        try {
            const { data } = await loginUser({
                variables: { ...userFormData }
            });

            // if (!response.ok) {
            //     console.log(response)
            //     throw new Error('something went wrong!');
            // }

            Auth.login(data.loginUser.token);
        } catch (err) {
            console.error(err);
            setShowAlert(true);
        }

        setUserFormData({
            username: '',
            email: '',
            password: '',
        });
    };

    return (
        <>
            <div className='center-box'>
                <Card style={{ width: '18rem' }}>
                    <Card.Body>
                        {/* This is needed for the validation functionality above */}
                        <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                            {/* show alert if server response is bad */}
                            {/* <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
                            Something went wrong with your signup!
                        </Alert> */}
                            <h1> Login </h1>
                            <Form.Group>
                                <Form.Label htmlFor='username'>Username</Form.Label>
                                <Form.Control
                                    type='text'
                                    className='form-field'
                                    placeholder='Your username'
                                    name='username'
                                    onChange={handleInputChange}
                                    value={userFormData.username}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
                            </Form.Group>


                            <Form.Group>
                                <Form.Label htmlFor='password'>Password</Form.Label>
                                <Form.Control
                                    type='password'
                                    className='form-field'
                                    placeholder='Your password'
                                    name='password'
                                    onChange={handleInputChange}
                                    value={userFormData.password}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
                            </Form.Group>
                            <button class='btn-one'
                                disabled={!(userFormData.username && userFormData.password)}
                                type='submit'
                                variant='success'>
                                Login
                            </button>
                        </Form>
                    </Card.Body>
                </Card>
            </div>
        </>
    );
};

export default LoginForm;
