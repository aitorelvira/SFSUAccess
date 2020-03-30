import React from 'react';
import { Container, Row, Col, Label, ButtonToolbar } from 'reactstrap';
import {Button}  from 'react-bootstrap';
import { Switch, Route, Link } from "react-router-dom";
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/About.css'


const About = () => {
    return (
     
   
       <div>
          <Header/>
         
          <Container className = "page">
          <b>Our Team</b>   
            <Row><Col>Team lead:</Col><Link to="/About/YanruiXu"><Button variant="warning">YanruiXu</Button></Link></Row>
            <br/><Row><Col>Back end lead & Github Master:</Col><Link to="/About/KevinLuong"><Button variant="warning">Kevin Luong</Button></Link></Row>
            <br/><Row><Col>Front end lead: </Col> <Link to="/About/JunMinLi"><Button variant="warning">JunMinLi</Button></Link></Row>
            <br/><Row><Col>Team members:</Col> 
               <Link to="/About/CodyXu"><Button variant="warning">CodyXu</Button></Link>&nbsp;&nbsp;
               <Link to="/About/Aitor"><Button variant="warning">Aitor</Button></Link>&nbsp;&nbsp;
               <Link to="/About/DavidLin"><Button variant="warning">DavidLin</Button></Link>&nbsp;&nbsp;
            </Row>
            <hr/>
               <Row>
               <ButtonToolbar>
                  <Link to="/About/KevinLuong"><Button variant="warning">Kevin Luong</Button></Link> &nbsp;&nbsp;
                  <Link to="/About/JunMinLi"><Button variant="warning">JunMinLi</Button></Link>&nbsp;&nbsp;
                  <Link to="/About/Aitor"><Button variant="warning">Aitor</Button></Link>&nbsp;&nbsp;
                  <Link to="/About/CodyXu"><Button variant="warning">CodyXu</Button></Link>&nbsp;&nbsp;
                  <Link to="/About/DavidLin"><Button variant="warning">DavidLin</Button></Link>&nbsp;&nbsp;
                  <Link to="/About/YanruiXu"><Button variant="warning">YanruiXu</Button></Link>&nbsp;&nbsp;
                  <Link to="/"><Button variant = "secondary">Home Page</Button></Link>
               </ButtonToolbar>
            </Row><br/>
    </Container>
          <Footer/>
       </div>
    );
    }

export default About;