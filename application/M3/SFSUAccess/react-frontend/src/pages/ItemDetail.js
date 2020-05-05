//PURPOSE: This page is used to show an selected item detail information, after
//         user clicked its thumbnail.
//AUTHOR: JunMin Li
import React, {useState, useEffect}from 'react';
import { useCookies } from 'react-cookie';
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
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
               
                <hr/>
                <Row><Col md={{ span: 5, offset: 1 }}>
                <form className="message_form" onSubmit={formik.handleSubmit}>
                    <Form.Row>
                        <Form.Group as={Col}>
                            <Form.Label>Message</Form.Label>
                                <Form.Control
                                    name="message"
                                    as="textarea"
                                    className="textarea"
                                    placeholder="Enter message here..."
                                    onFocus={(e) => {e.currentTarget.placeholder=""}}
                                    onBlur={(e) => {e.currentTarget.placeholder="Enter message here..."}}
                                    onChange={(e) => {formik.setFieldValue("message", e.currentTarget.value); setMessage(e.currentTarget.value)}}
                             />
                            {formik.touched.message && formik.errors.message ? (<div className="error_message">{formik.errors.message}</div>) : null}
                        </Form.Group>
                    </Form.Row>

                    <Form.Row>
                        <Button variant="warning" type="submit">  &nbsp;&nbsp;Send a message&nbsp;&nbsp;</Button>
                    </Form.Row>
                </form>
                </Col></Row>
                <br/><br/><br/><br/><br/>
            </Container>
        </div>
    )}
   </Formik>
  );
};

export default ItemDetail;