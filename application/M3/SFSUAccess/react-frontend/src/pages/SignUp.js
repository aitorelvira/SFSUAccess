import React, {useState} from 'react';
import axios from 'axios';
import { Form,Button, Container} from 'react-bootstrap';
import { Link } from "react-router-dom";
import '../css/Sign.css';
import Header from '../components/Header';
import Footer from '../components/Footer';
var md5 = require('md5');

const SignUp = () => {
  const [message, setMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const [first_name, setFirst_name] = useState('');
  const [last_name, setLast_name] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm_password, setConfirm_password] = useState('');
  const [privelege_type, setPriveliege_type] = useState('');


  axios.interceptors.response.use((response) =>{
      if(response.status === 201){
        setLoading(true);
        setTimeout(function(){ window.location.href='/SignIn' },1000);
      }
      return response;
  },error =>{
    if(error.response.status === 409){
      setMessage('This email account is already registered,please check your email.');
    }
    return error;
  })
  // User regiter function
  const register = ()=>{
    // get user inputs 
    setFirst_name(first_name.trim().toLowerCase());
    setLast_name(last_name.trim().toLowerCase());
    setEmail(email.trim().toLowerCase());
    setPassword(password.trim().toLowerCase());
    setConfirm_password(confirm_password.trim().toLowerCase());
    setPriveliege_type(privelege_type.trim().toLowerCase());

    if(!first_name || !last_name || !email || !password || password.localeCompare('d41d8cd98f00b204e9800998ecf8427e') === 0 || 
    confirm_password.localeCompare('d41d8cd98f00b204e9800998ecf8427e') === 0){
      setMessage("Oops ! Missing information, all fields are required.")
    }
    else if(password !== confirm_password){
      setMessage("Passwords don't match, please confirm your password again.");
    }
    else{
      if(email.endsWith("@mail.sfsu.edu")){
        axios.post('/api/register',{
          email,
          first_name,
          last_name,
          password,
          privelege_type,
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
            <Form.Control type="text" placeholder="First Name *" onChange = {e=> setFirst_name(e.target.value)}/>
          </Form.Group>

          <Form.Group controlId="last_name">
            <Form.Control type="text" placeholder="Last Name *" onChange = {e=> setLast_name(e.target.value)}/>
          </Form.Group>

          <Form.Group controlId="email">
            <Form.Control type="email" placeholder="Email Address *" onChange = {e=> setEmail(e.target.value)}/>
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Control type="password" placeholder="Password *" onChange = {e=> setPassword(md5(e.target.value))}/>
          </Form.Group>

          <Form.Group controlId="confirm_password">
            <Form.Control type="password" placeholder="Confirm Password *" onChange = {e=> setConfirm_password(md5(e.target.value))}/>
          </Form.Group>

          <Form.Group>Please choose your account type&nbsp;&nbsp;&nbsp;&nbsp;
          <select id="privelege_type">
            <option value="2">Student</option>
            <option value="3">Faculty</option>
            <option value="1">Admin</option>
          </select>
          </Form.Group><br/>
          <Form.Group>
            <Button variant="warning" block onClick={register} disabled = {isLoading? true : false}>{isLoading ? 'Registered successfully...': 'SIGN UP'}</Button>
          {!isLoading &&(     
            <Button variant="warning" block href="/">BACK TO HOMEPAGE</Button>
          )}
          <div className="rightlinks">
            <Link  to = "/SignIn" >Already have an account? Sign in</Link> 
          </div>     
          </Form.Group>
      </Form>
    </Container>
    <Footer/>
    </div>
  );
}

export default SignUp;