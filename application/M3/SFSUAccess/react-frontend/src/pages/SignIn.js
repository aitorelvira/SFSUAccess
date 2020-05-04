//PURPOSE: This is the sign in page.
//AUTHOR: JunMin Li
import React, {useState} from 'react';
import { useCookies } from 'react-cookie';
import ReactGA from "react-ga";
import { connect } from 'react-redux';
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

  //cookies
  const [cookies, setCookies, removeCookies] = useCookies(['id', 'email','first_name','last_name','privelege_type', 'isLoggedin', 'itemID']);

  return (
    <Formik
        initialValues={{email: '', password: ''}}
        validationSchema={Yup.object({
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required')
                .matches(/^[a-zA-Z0-9]+@(mail.)?sfsu.edu/ig, 'Must use SFSU email: student@mail.sfsu.edu'),
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
                console.log(response.data[0])
                setCookies('id', res.id, { expires: 0});
                setCookies('email', res.email, { expires: 0});
                setCookies('first_name', res.first_name, { expires: 0});
                setCookies('last_name', res.last_name, { expires: 0});
                setCookies('privelege_type', res.privelege_type, { expires: 0});
                setCookies('isLoggedin', true, { expires: 0 });
                setLoading(true);
                ReactGA.initialize('UA-163580713-1', { // set new tracking id for logged in user
                    debug: true,
                    titleCase: false,
                    gaOptions: {
                        userId: res.id,
                        clientId: res.id
                    }
                });
                if(cookies.post_item)
                    setTimeout(function(){ window.location.href = '/Postitem'},1000);
                else if(cookies.itemID)
                    setTimeout(function(){ window.location.href = '/ItemDetail?itemId=' + cookies.itemID},1000);
                else
                    setTimeout(function(){ window.location.href = '/'},1000);

                //What's this?    
                // ReactGA.event({
                //  category: 'SignIn',
                //  action: 'User Signed In',
                //  transport: 'beacon'
                // });
            })
            .catch(err => {
                setErrors({password: 'Incorrect email or password'});
            });

            setSubmitting(false);
        }}
    >
        {formik => (
            <div>
                <Navbar bg="dark" variant="dark" className="navbar"><Notice/></Navbar>
                <Navbar bg="dark" variant="dark" className="navbar">
                <Navbar.Brand href="/">SFSUAccess</Navbar.Brand>
                </Navbar><br/>
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
                        <Row>
                        {!isLoading &&(
                        <Col>
                            <Button variant="danger" block href="/" block>Cancel</Button>
                        </Col>
                        )}
                        <Col>
                            <Button variant="warning" block type="submit">{isLoading ? 'Logging in, please wait...': 'Sign in'}</Button>
                        </Col>
                        </Row>
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


