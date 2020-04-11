import React, {useState} from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Form, Button, Container, Row, Col } from 'react-bootstrap';
import { Link } from "react-router-dom";
import '../css/Sign.css';

import Header from '../components/Header';
import Footer from '../components/Footer';

var md5 = require('md5');

const SignIn = () => {
  const [message, setMessage] = useState('');               //Error message
  const [cookies, setCookies] = useCookies(['username']);  
  const [isLoading, setLoading] = useState(false);          //Loading state for the login button
  const [email, setEmail] = useState('');               
  const [password, setPassword] = useState('');


  axios.interceptors.response.use((response) =>{
    if(response.status === 202){
      setCookies('username', response.data[0].first_name);
      setLoading(true);
      setTimeout(function(){ window.location.href = '/'},1000);
    }
    return response;
  },error =>{
    if(error.response.status === 401){
      setMessage('User name not found, or incorrect password.');
    }
    return error;
  })
  

 // user login function..
 const login = () =>{
    setEmail(email.trim().toLowerCase());
    setPassword(password.trim().toLowerCase());

  if(!email || password.localeCompare('d41d8cd98f00b204e9800998ecf8427e') === 0){
    setMessage("Oops ! Email and password are required.")
  }
  else{
    if(email.endsWith("@mail.sfsu.edu")){
      axios.post('/api/login',{
        email, password
      })
      .catch(err => console.log(err));
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
          <Form.Group controlId="email">{email}
            <Form.Control type="text" placeholder="Email Address *" onChange = {e=> setEmail(e.target.value)}/>
          </Form.Group>

          <Form.Group controlId="password">{password}
            <Form.Control type="password" placeholder="Password *" onChange = {e=> setPassword(md5(e.target.value))}/>
          </Form.Group>
              <Button variant="warning" block onClick={login} disabled = {isLoading? true : false}>{isLoading ? 'logged in successfully...': 'SIGN IN'}</Button>    
          {!isLoading &&(    
              <Button variant="warning" block href="/">BACK TO HOMEPAGE</Button> 
          )}        
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
