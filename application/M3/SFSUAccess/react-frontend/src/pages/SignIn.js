import React, {useState} from 'react';
import { useCookies } from 'react-cookie';
import ReactGA from "react-ga";
import axios from 'axios';
import { Form, Button, Container, Row, Col, Navbar } from 'react-bootstrap';
import { Link } from "react-router-dom";
import '../css/Sign.css';
import Notice from '../components/Notice';

var md5 = require('md5');

const SignIn = () => {
  const [message, setMessage] = useState('');               //Error message 
  const [isLoading, setLoading] = useState(false);          //Loading state for the login button
  const [email, setEmail] = useState('');               
  const [password, setPassword] = useState('');
  const [validated, setValidated] = useState(false);

  //cookies
  const [cookies, setCookies, removeCookies] = useCookies(['id', 'email','first_name','last_name','privelege_type']);  

  axios.interceptors.response.use((response) =>{
    if(response.status === 202){
      let res = response.data[0];
      setCookies('id', res.id, { expires: 0});
      setCookies('email', res.email, { expires: 0});
      setCookies('first_name', res.first_name, { expires: 0});
      setCookies('last_name', res.last_name, { expires: 0});
      setCookies('privelege_type', res.privelege_type, { expires: 0});
      setLoading(true);
      ReactGA.initialize('UA-163580713-1', { // set new tracking id for logged in user
            debug: true,
            titleCase: false,
            gaOptions: {
                userId: res.id,
                clientId: res.id
            }
        });
      setTimeout(function(){ window.location.href = '/'},1000);
    }
    return response;
  },error =>{
    if(error.response.status === 401){
      setMessage('User name not found, or incorrect password.');
    }
    return error;
  })

 const handleSubmit = (event) => {
    const form = event.currentTarget;
    if(form.checkValidity() == false) {
        event.preventDefault();
        event.stopPropagation();
    }
    setValidated(true);

    // user login function..
    setEmail(email.trim().toLowerCase());
    setPassword(password.trim().toLowerCase());

    if(!email || password.localeCompare('d41d8cd98f00b204e9800998ecf8427e') === 0){
        setMessage("Oops ! Email and password are required.")
    }else{
        if(email.endsWith("@mail.sfsu.edu")){
            axios.post('/api/login',{
                email, password
            })
            .catch(err => console.log(err));

            //prevents browser from reload after submission
            event.preventDefault();
        }else{
            setMessage('Invalid email format. Please enter a SFSU email.');
        }
    }
 }

  return (
    <div>
     <Navbar bg="dark" variant="dark" className="navbar">
      <Navbar.Brand>SFSUAccess</Navbar.Brand>          
      </Navbar><br/>
     <Notice/>
     <Container className="overAll">
        
        <div className="greeting">Sign in</div><br/>
        <div className="message">{message}</div><br/>
        <Form noValidate validated={validated} onSubmit={handleSubmit}>
          <Form.Group controlId="email">
            <Form.Control required type="text" placeholder="Email Address *" onChange = {e=> setEmail(e.target.value)}/>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Control required type="password" placeholder="Password *" onChange = {e=> setPassword(md5(e.target.value))}/>
          </Form.Group>
              <Button variant="warning" block type="submit">{isLoading ? 'logged in successfully...': 'SIGN IN'}</Button>
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
    </div>
  );
}



export default SignIn;
