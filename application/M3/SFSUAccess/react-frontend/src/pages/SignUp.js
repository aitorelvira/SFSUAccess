import React, {useState, useEffect} from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form,Button, Container, Navbar} from 'react-bootstrap';
import { Link } from "react-router-dom";
import '../css/Sign.css';
import Notice from '../components/Notice';
import ReactGA from "react-ga";
var md5 = require('md5');

const SignUp = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [email_validation, setEmail_validation] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirm_password] = useState('');
  const [privelege_type, setPrivelege_type] = useState('');
  const [validated, setValidated] = useState(false);

  return (
    <Formik
        initialValues={{firstName: '', lastName: '', email: '', password: '', confirmPassword: '', privelegeType: ''}}
        validationSchema={Yup.object({
            firstName: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('First name is required'),
            lastName: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Last name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .max(30, 'Must be 25 characters or less')
                .matches(/^[a-zA-Z0-9]+@(mail.)?sfsu.edu/ig, 'Must use SFSU email: student@mail.sfsu.edu')
                .required('Email is required'),
            password: Yup.string()
                .min(8, 'Must be more than 8 characters')
                .required('Password is required'),
            confirmPassword: Yup.string()
                .min(8, 'Must be more than 8 characters')
                .required('Confirm Password is required')
                .oneOf([Yup.ref('password'), null], 'Passwords must match'),
            privelegeType: Yup.string()
                .oneOf(['Student', 'Faculty', 'Admin'])
                .required('Please indicate your account type'),
        })}
        onSubmit={(values, {setSubmitting, setErrors }) => {
            axios.post('/api/register',{
                email,
                first_name,
                last_name,
                password,
                privelege_type
            })
            .then(res => {
                if(res.status === 201){
                    setLoading(true);
                    setTimeout(function(){ window.location.href='/SignIn' },1000);
                }
             ReactGA.event({
                 category: 'SignUp',
                 action: 'User Signed Up',
                 transport: 'beacon'
             });
            })
            .catch(err => {
                setErrors({email: 'This email already exist. Please use a different email.'})
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
                <div className="greeting">Sign up</div><br/>
                <div className="message">{message}</div><br/>
                <form onSubmit={formik.handleSubmit}>
                    <Form.Group controlId="first_name">
                        <Form.Control
                            name="firstName"
                            type="text"
                            placeholder="First Name *"
                            onChange={(e) => {formik.setFieldValue("firstName", e.currentTarget.value); setFirst_name(e.currentTarget.value)}}
                        />
                        {formik.touched.firstName && formik.errors.firstName ? (<div className="error_message">{formik.errors.firstName}</div>) : null}
                     </Form.Group>

                    <Form.Group controlId="last_name">
                        <Form.Control
                            name="lastName"
                            type="text"
                            placeholder="Last Name *"
                            onChange={(e) => {formik.setFieldValue("lastName", e.currentTarget.value); setLast_name(e.currentTarget.value)}}
                        />
                        {formik.touched.lastName && formik.errors.lastName ? (<div className="error_message">{formik.errors.lastName}</div>) : null}
                    </Form.Group>

                    <Form.Group controlId="email">
                        <Form.Control
                            name="email"
                            type="email"
                            placeholder="Email Address *"
                            onChange={(e) => {formik.setFieldValue("email", e.currentTarget.value); setEmail(e.currentTarget.value)}}
                         />
                         {formik.touched.email && formik.errors.email ? (<div className="error_message">{formik.errors.email}</div>) : null}
                    </Form.Group>

                    <Form.Group controlId="password">
                        <Form.Control
                            name="password"
                            type="password"
                            placeholder="Password *"
                            onChange={(e) => {formik.setFieldValue("password", e.currentTarget.value); setPassword(md5(e.currentTarget.value))}}
                        />
                        {formik.touched.password && formik.errors.password ? (<div className="error_message">{formik.errors.password}</div>) : null}
                    </Form.Group>

                    <Form.Group controlId="confirm_password">
                        <Form.Control
                            name="confirmPassword"
                            type="password"
                            placeholder="Confirm Password *"
                            onChange={(e) => {formik.setFieldValue("confirmPassword", e.currentTarget.value); setConfirm_password(md5(e.currentTarget.value))}}
                        />
                        {formik.touched.confirmPassword && formik.errors.confirmPassword ? (<div className="error_message">{formik.errors.confirmPassword}</div>) : null}
                    </Form.Group>

                    <Form.Group>Please choose your account type&nbsp;&nbsp;&nbsp;&nbsp;
                        <select
                            name="privelegeType"
                            onChange={(e) => {formik.setFieldValue("privelegeType", e.currentTarget.value); setPrivelege_type(e.currentTarget.value)}}
                        >
                            <option value="Student">Student</option>
                            <option value="Faculty">Faculty</option>
                            <option value="Admin">Admin</option>
                        </select>
                        {formik.touched.privelegeType && formik.errors.privelegeType ? (<div className="error_message">{formik.errors.privelegeType}</div>) : null}
                    </Form.Group><br/>
                    <Form.Group>
                        <Button variant="warning" block type="submit">{isLoading ? 'Registered successfully, redirecting to sign in page...': 'SIGN UP'}</Button>
                        {!isLoading &&(
                            <Button variant="warning" block href="/">BACK TO HOMEPAGE</Button>
                        )}
                        <div className="rightlinks">
                            <Link  to = "/SignIn" >Already have an account? Sign in</Link>
                        </div>
                    </Form.Group>
                </form>
            </Container>
        </div>
    )}
  </Formik>
  );
};

export default SignUp;