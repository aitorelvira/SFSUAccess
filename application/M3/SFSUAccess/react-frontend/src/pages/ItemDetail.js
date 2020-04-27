import React, {useState, useEffect}from 'react';
import { useCookies } from 'react-cookie';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
// import Footer from '../components/Footer';
import Header from '../components/Header';
import { Container, Row, Col, Figure, Button, Form } from 'react-bootstrap';
import '../css/ItemDetail.css'

const ItemDetail = () => {

    const [cookies, setCookies] = useCookies(['first_name']);
    const [username, setUsername] = useState('');
    const [id, setId] = useState('')

    const [product_name, setName] = useState('');
    const [product_author, setAuthor] = useState('');
    const [product_description, setDescription] = useState('');
    const [product_license, setLicense] = useState('');
    const [product_category, setCategory] = useState('');

    const [message, setMessage] = useState('');
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    
    useEffect (()=>{
        if(typeof cookies.first_name !== 'undefined')
        setUsername(cookies.first_name);
        setId(window.location.search.substr(8));

        if(id){
        axios.get('/api/product/' + id)
            .then(response => {   
                setName(response.data[0].product_name); 
                setAuthor(response.data[0].product_author);  
                setDescription(response.data[0].product_description); 
                setCategory(response.data[0].product_category); 
                setLicense(response.data[0].product_license);     
         });}
       },[cookies.first_name, id, username]);

  return (
    <Formik
        initialValues={{message: '', userName: '', email: ''}}
        validationSchema={Yup.object({
            message: Yup.string()
                .max(120, 'Must be 120 character or less')
                .required('Message is required'),
            userName: Yup.string()
                .matches(/^[a-zA-Z0-9]*$/gm, 'Please close the whitespace')
                .max(15, 'Must be 15 character or less')
                .required('Name is required'),
            email: Yup.string()
                .email('Invalid email address')
                .max(30, 'Must be 25 characters or less')
                .matches(/^[a-zA-Z0-9]+@(mail.)?sfsu.edu/ig, 'Must use SFSU email: student@mail.sfsu.edu')
                .required('Email is required'),
        })}
        onSubmit={(values, {setSubmitting}) => {
            setTimeout(() => {
                alert(JSON.stringify(values, null, 2));
            }, 1000);

            setSubmitting(false);
        }}
    >
    {formik => (
        <div>
            <Header/>
            <Container>
                {/* product_name, product_category, product_author, product_description, registered_user_id, product_license
                product_status */}
                <Row>
                    <Col md={{ span: 5, offset: 1 }}>
                        <Figure className="image">
                        <Figure.Image
                            alt="171x180"
                            src="https://www.w3schools.com/html/img_chania.jpg"
                        />
                        </Figure>
                        <Figure.Caption>
                            <div><b>{product_name}</b></div>
                            <div>by: &nbsp;&nbsp;{product_author}</div>
                            <div>{product_category}</div>
                            <div>{product_license}</div>
                            <div>Description: &nbsp;&nbsp;{product_description}</div>
                        </Figure.Caption>
                    </Col>
                </Row>
                <Row>
                    <Col md={{ span: 8, offset: 1 }}>
                        <div>Description: &nbsp;&nbsp;{product_description}</div>
                    </Col>
                </Row>
                <br/>

                <form className="message_form" onSubmit={formik.handleSubmit}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Message</Form.Label>
                                <Form.Control
                                    name="message"
                                    as="textarea"
                                    placeholder="Enter message here..."
                                    onChange={(e) => {formik.setFieldValue("message", e.currentTarget.value); setMessage(e.currentTarget.value)}}
                             />
                            {formik.touched.message && formik.errors.message ? (<div className="error_message">{formik.errors.message}</div>) : null}
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Name</Form.Label>
                                <Form.Control
                                    name="userName"
                                    type="text"
                                    placeholder="Name"
                                    onChange={(e) => {formik.setFieldValue("userName", e.currentTarget.value); setUserName(e.currentTarget.value)}}
                             />
                             {formik.touched.userName && formik.errors.userName ? (<div className="error_message">{formik.errors.userName}</div>) : null}
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Email</Form.Label>
                                <Form.Control
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    onChange={(e) => {formik.setFieldValue("email", e.currentTarget.value); setEmail(e.currentTarget.value)}}
                             />
                             {formik.touched.email && formik.errors.email ? (<div className="error_message">{formik.errors.email}</div>) : null}
                        </Form.Group>
                    </Form.Row>
                    <Form.Row>
                        <Button variant="warning" type="submit">  &nbsp;&nbsp;Send a message&nbsp;&nbsp;</Button>
                    </Form.Row>
                </form>
                <br/><br/><br/><br/><br/>
            </Container>
        {/* <Footer/> */}
        </div>
    )}
   </Formik>
  );
};

export default ItemDetail;