import React, {useState, useEffect}from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { Container, Row, Col, Figure, Button, Form } from 'react-bootstrap';
import '../css/ItemDetail.css'

const ItemDetail = () => {
    
    const [text, setText] = useState('');
    const [cookies, setCookies] = useCookies(['username']);
    const [username, setUsername] = useState('');
    const [item_detail, setItemDetail] = useState([]);
    const [id, setId] = useState('')
  

    
    useEffect (()=>{
        if(typeof cookies.username !== 'undefined')
        setUsername(cookies.username);
        setId(window.location.search.substr(8));

        if(id){
        axios.get('/api/product/' + id)
            .then(response => {   
                setItemDetail(response.data);    
                console.log(response.data);   
         });}
       },[cookies.username, id, username]);


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
            {item_detail.map((detail, index) => {
                return(
                    <div key = {index}>
                <div>
                    <b>{detail.product_name}</b>
                </div>
                <div>
                    by: &nbsp;&nbsp;{detail.product_author}
                </div>
                <div>
                    Price: null
                </div>
                <div>
                    product_description: &nbsp;&nbsp;{detail.product_description}
                </div>
                <div>
                    license: &nbsp;&nbsp;{detail.product_license}
                </div>
                </div>
                )
            })}
            </Col>
            </Row>
           
            <Row><Col md={{ span: 8, offset: 1 }}><hr/><b>Leave a message.</b>
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
            <Footer/>
    </Container>
    </div>
  );
};

export default ItemDetail;