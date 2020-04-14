import React, {useState, useEffect}from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
// import Footer from '../components/Footer';
import Header from '../components/Header';
import { Container, Row, Col, Figure, Button, Form } from 'react-bootstrap';
import '../css/ItemDetail.css'

const ItemDetail = () => {
    
    const [text, setText] = useState('');
    const [cookies, setCookies] = useCookies(['first_name']);
    const [username, setUsername] = useState('');
    const [id, setId] = useState('')

    const[product_name, setName] = useState('');
    const[product_author, setAuthor] = useState('');
    const[product_description, setDescription] = useState('');
    const[product_license, setLicense] = useState('');
    const[product_category, setCategory] = useState('');
    
  
    
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


    const sendMessage = () =>{
        console.log(text);
    }

  return (
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
            </Col>
            <Col>
                <div><b>{product_name}</b></div>
                <div>by: &nbsp;&nbsp;{product_author}</div>
                <div>{product_category}</div>
                <div>{product_license}</div>
            </Col>
            </Row>
            <Row><Col md={{ span: 8, offset: 1 }}><div>Description: &nbsp;&nbsp;{product_description}</div></Col></Row><br/>
           
            <Row><Col md={{ span: 8, offset: 1 }}>
            <div contentEditable ="true" className="textarea" onInput = {e=> setText(e.target.innerText)} id ="textarea"></div>
            </Col></Row>
            <br/>
            <Row><Col md={{ span: 4, offset: 1 }}>
            <Form.Group controlId="username">
                <Form.Control  placeholder="username*"/>
            </Form.Group>
            </Col>
            </Row>

            <Row>
            <Col md= {{ span: 4, offset: 1 }}>
            <Form.Group controlId="email">
                <Form.Control  placeholder="email*"/>
            </Form.Group>
            </Col>
            <Col md={{ span: 3 , offset: 2 }}>
                <Button variant="warning" onClick = {sendMessage}>  &nbsp;&nbsp;Send a message&nbsp;&nbsp;</Button>
            </Col>
            </Row>
            
            <br/><br/><br/><br/><br/>
    </Container>
    {/* <Footer/> */}
    </div>
  );
};

export default ItemDetail;