import React, {useState} from 'react';
import axios from 'axios';
import { Form,Button, Container } from 'react-bootstrap';
import { Link } from "react-router-dom";
import '../css/Sign.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
var md5 = require('md5');

const SignUp = () => {
  const [message, setMessage] = useState('');

  // User regiter function
  const register = ()=>{
    // get user inputs 
    let first_name = document.getElementById("first_name").value.trim();
    let last_name =  document.getElementById("last_name").value.trim();
    let email = document.getElementById("email").value.trim().toLowerCase();
    let password = md5(document.getElementById("password").value.trim().toLowerCase());
    let confirm_password = md5(document.getElementById("confirm_password").value.trim().toLowerCase());

    if(!first_name || !last_name || !email || !password || !confirm_password){
      setMessage("Oops ! Missing information, all fields are required.")
    }
    else if(password !== confirm_password){
      setMessage("Please confirm your password again.");
    }
    else{
      if(email.endsWith("@mail.sfsu.edu")){
        axios.post('/api/register',{
          email: email,
          first_name: first_name,
          last_name: last_name,
          password: password,
        })
        .then((response) =>{
          if(response.data){
            setMessage(email + 'has been registered.      Redirecting to Sign In page...');
            setTimeout(function(){ window.location.href='/SignIn' },5000);
          }
          else
            setMessage(email + 'is already registered,please check your email.');
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
        <div className="greeting">Sign up</div><br/>
        <div className="message">{message}</div><br/>
        <Form>
          <Form.Group controlId="first_name">
            <Form.Control type="text" placeholder="First Name *" />
          </Form.Group>

          <Form.Group controlId="last_name">
            <Form.Control type="text" placeholder="Last Name *" />
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
    
          <Button variant="warning" block  onClick ={register}>SIGN UP</Button>     
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