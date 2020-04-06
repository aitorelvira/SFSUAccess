import React, {useState} from 'react';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import '../css/Sign.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

var md5 = require('md5');

const SignIn = () => {

  const [message, setMessage] = useState(''); //Error message


  // user login function..
  const login = () =>{
     let email = document.getElementById("email").value.trim().toLowerCase();
     let password = md5(document.getElementById("password").value.trim().toLowerCase());

    if(!email || !password){
      setMessage("Oops ! Email and password are required.")
    }
    else{
      if(email.endsWith("@mail.sfsu.edu")){
        axios.post('/api/login',{
          email: email,
          password: password
        })
        .then((response) =>{
          if(response.data){     
            setMessage(email + ' logged in successfully. Redirecting to home page...');      
            setTimeout(function(){ window.location.href = '/user_name?' + response.data[0].first_name },5000);
          }
          else
            setMessage('User name not found, or incorrect password.');
        })
        .catch(err => console.log(err));
        console.log("login request sent..")
      }
      else
        setMessage('Invalid email format. Please enter a SFSU email.');
    }
  }


  return (
    <div>
     <Header/>
     <Container className="overAll">
        <div className="greeting">Sign in</div><br/>
        <div className="message">{message}</div><br/>
          <Form>
        <Form.Group controlId="email">
          <Form.Control type="text" placeholder="Email Address *" />
        </Form.Group>

        <Form.Group controlId="password">
          <Form.Control type="password" placeholder="Password *" />
        </Form.Group>
  
            <Button variant="warning" block  onClick = {login}>SIGN IN</Button>    
            <Button variant="warning" block href="/">BACK TO HOMEPAGE</Button>     
        <Row>
          <Col>
          <Link className="leftlinks" to ="">Forgot password</Link>  
          </Col>          
          <Col>
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
