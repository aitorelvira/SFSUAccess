import React from 'react';
import { Nav, Navbar, Form, FormControl,Button, Container, Row, Col, InputGroup } from 'react-bootstrap';
import { Switch, Route, Link } from "react-router-dom";
import '../css/Sign.css';


import Header from '../components/Header';
import Footer from '../components/Footer';

const SignUp = () => {

  return (
    <div>
     <Header/>
    <Container className="overAll">
        <div className="greeting">Sign up</div><br/>
          <Form>
        <Form.Group controlId="username">
          <Form.Control type="text" placeholder="User Name *" />
        </Form.Group>

        <Form.Group controlId="email">
          <Form.Control type="email" placeholder="Email Address *" />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Control type="password" placeholder="Password *" />
        </Form.Group>

        <Form.Group controlId="confirm_password">
          <Form.Control type="password" placeholder="Confirm Password *" />
        </Form.Group>
  
            <Button variant="warning" block  href="/SignUp">SIGN UP</Button>
      
            <Button variant="warning" block href="/">BACK TO HOMEPAGE</Button>
    
       
        <div className="rightlinks">
          <Link  to = "/SignIn" >Already have an account? Sign in</Link> 
        </div>
      </Form>
    </Container>
    <Footer/>
    </div>
  );
}

export default SignUp;