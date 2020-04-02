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
          <div className="greeting">Our Team</div>   
            <hr/>
               <Row>
               <ButtonToolbar>
                  <Button variant="warning" href = "/About/KevinLuong">Kevin Luong</Button>&nbsp;&nbsp;
                  <Button variant="warning" href = "/About/JunMinLi">JunMinLi</Button>&nbsp;&nbsp;
                  <Button variant="warning" href ="/About/Aitor">Aitor</Button>&nbsp;&nbsp;
                  <Button variant="warning" href="/About/CodyXu">CodyXu</Button>&nbsp;&nbsp;
                  <Button variant="warning" href ="/About/DavidLin">DavidLin</Button>&nbsp;&nbsp;
                  <Button variant="warning" href ="/About/YanruiXu">YanruiXu</Button>&nbsp;&nbsp;
                  <Button variant = "secondary" href ="/">Home Page</Button>
               </ButtonToolbar>
            </Row><br/>
    </Container>
          <Footer/>
       </div>
    );
    }

export default About;