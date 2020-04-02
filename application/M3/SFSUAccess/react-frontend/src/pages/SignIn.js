import React from 'react';
import { Nav, Navbar, Form, FormControl,Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { Switch, Route, Link } from "react-router-dom";
import '../css/Sign.css';


import Header from '../components/Header';
import Footer from '../components/Footer';

const SignIn = () => {

  return (
    <div>
     <Header/>
    <Container className="overAll">
        <div className="greeting">Sign in</div><br/>
          <Form>
        <Form.Group controlId="username">
          <Form.Control type="text" placeholder="User Name *" />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Control type="password" placeholder="Password *" />
        </Form.Group>
  
            <Button variant="warning" block  href="/SignIn">SIGN IN</Button>
      
            <Button variant="warning" block href="/">BACK TO HOMEPAGE</Button>
    
       
        <Row>
          <Col>
          <Link className="leftlinks">Forgot password</Link>  
          </Col>

          
          <Col >
          <Link className="rightlinks" to = "/SignUp" >Don't have an account? Sign Up</Link> 
          </Col>
        </Row>
        
       
        


      </Form>
     
    </Container>
    <Footer/>
    </div>
  );
}

export default SignIn;