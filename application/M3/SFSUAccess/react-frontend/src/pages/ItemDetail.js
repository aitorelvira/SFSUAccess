import React, {useState}from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Notice from '../components/Notice';
import { Container, Row, Col, Figure, Button, Form } from 'react-bootstrap';

import '../css/ItemDetail.css'

const ItemDetail = () => {
    
    const[text, setText] = useState('');
    let id = window.location.search.substr(8);

    const sendMessage = () =>{
        console.log(text);
    }

  return (
    <div>
        <Header/>
        <Container>
            <Notice/>
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
                <div>
                    product_name:
                </div>
                <div>
                    by user_name:
                </div>
                <div>
                    Price:
                </div>
                <div>
                    product_description:
                </div>
                <div>
                    product_name:
                </div>
            </Col>
            </Row>
           
            <Row><Col md={{ span: 8, offset: 1 }}><hr/>
            {text}
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