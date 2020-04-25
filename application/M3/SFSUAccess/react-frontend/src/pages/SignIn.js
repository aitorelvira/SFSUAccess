import React, {useState} from 'react';
import { useCookies } from 'react-cookie';
import ReactGA from "react-ga";
import axios from 'axios';
import { Form, Button, Container, Row, Col, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";
import { Formik } from 'formik';
import * as Yup from 'yup';
import '../css/Sign.css';
import Notice from '../components/Notice';
var md5 = require('md5');

const SignIn = () => {
  const [message, setMessage] = useState('');               //Error message
  const [isLoading, setLoading] = useState(false);          //Loading state for the login button
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);

  //cookies
  const [cookies, setCookies, removeCookies] = useCookies(['id', 'email','first_name','last_name','privelege_type']);

  return (
    <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required')
                .matches(/^[a-zA-Z0-9]+@+[mail]+.+[sfsu]+.+[edu]/, 'Must use SFSU email: student@mail.sfsu.edu'),
            password: Yup.string()
                .required('Password is required'),
        })}
        onSubmit={(values, {setSubmitting, setErrors }) => {

            setEmail(email.trim().toLowerCase());
            setPassword(password.trim().toLowerCase());

            axios.post('/api/login',{
                email, password
            })
            .then(response => {
                let res = response.data[0];
                setCookies('id', res.id, { expires: 0});
                setCookies('email', res.email, { expires: 0});
                setCookies('first_name', res.first_name, { expires: 0});
                setCookies('last_name', res.last_name, { expires: 0});
                setCookies('privelege_type', res.privelege_type, { expires: 0});
                setLoading(true);
                ReactGA.initialize('UA-163580713-1', { // set new tracking id for logged in user
                    debug: true,
                    titleCase: false,
                    gaOptions: {
                        userId: res.id,
                        clientId: res.id
                    }
                });
                setTimeout(function(){ window.location.href = '/'},1000);

            })
            .catch(err => {
                setErrors({password: 'Incorrect email or password'});
            });

            setSubmitting(false);
        }}
    >
        {formik => (
            <div>
                <Navbar bg="dark" variant="dark" className="navbar">
                <Navbar.Brand>SFSUAccess</Navbar.Brand>
                </Navbar><br/>
                <Notice/>
                <Container className="overAll">
                    <div className="greeting">Sign in</div><br/>
                    <div className="message">{message}</div><br/>
                    <form onSubmit={formik.handleSubmit}>
                        <Form.Group controlId="email">
                            <Form.Control
                                type="text"
                                name="email"
                                placeholder="Email Address *"
                                onChange={(e) => {formik.setFieldValue("email", e.currentTarget.value); setEmail(e.currentTarget.value)}}
                            />
                            {formik.touched.email && formik.errors.email ? (<div className="error_message">{formik.errors.email}</div>) : null}
                        </Form.Group>

                        <Form.Group controlId="password">
                            <Form.Control
                                type="password"
                                name="password"
                                placeholder="Password *"
                                onChange={(e) => {formik.setFieldValue("password", e.currentTarget.value); setPassword(md5(e.currentTarget.value))}}
                            />
                            {formik.touched.password && formik.errors.password ? (<div className="error_message">{formik.errors.password}</div>) : null}
                        </Form.Group>

                        <Button variant="warning" block type="submit">{isLoading ? 'logged in successfully...': 'SIGN IN'}</Button>
                        {!isLoading &&(
                            <Button variant="warning" block href="/">BACK TO HOMEPAGE</Button>
                        )}
                        <Row>
                            <Col>
                                <Link className="leftlinks" to ="">Forgot password</Link>
                            </Col>
                            <Col>
                                <Link className="rightlinks" to = "/SignUp" >Don't have an account? Sign Up</Link>
                            </Col>
                        </Row>
                    </form>
                </Container>
            </div>
        )}
    </Formik>
   );
};

export default SignIn;

