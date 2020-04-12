import React from 'react';
import { Switch, Route } from "react-router-dom";
import { Nav, Container} from 'reactstrap';
import { Navbar, Button} from 'react-bootstrap';
import Footer from '../components/Footer';
import JunMinLi from './JunMinLi';
import KevinLuong from './KevinLuong';
import Aitor from './Aitor';
import CodyXu from './CodyXu';
import DavidLin from './DavidLin';
import YanruiXu from './YanruiXu';
import Ourteam from '../components/Ourteam'
import Notice from '../components/Notice'
import '../css/About.css'


const About = () => {

    return (
      <div>
         <Navbar bg="dark" variant="dark">
            <Navbar.Brand>SFSUAccess</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Nav className="page">
                <Button href = "/About" className ="navButton">Ouer-Team</Button>&nbsp;&nbsp;
                <Button href = "/About/KevinLuong" className ="navButton">Kevin Luong</Button>&nbsp;&nbsp;
                <Button href = "/About/JunMinLi" className ="navButton">JunMinLi</Button>&nbsp;&nbsp;
                <Button href ="/About/Aitor" className ="navButton">Aitor</Button>&nbsp;&nbsp;
                <Button href="/About/CodyXu" className ="navButton">CodyXu</Button>&nbsp;&nbsp;
                <Button href ="/About/DavidLin" className ="navButton">DavidLin</Button>&nbsp;&nbsp;
                <Button href ="/About/YanruiXu" className ="navButton">YanruiXu</Button>&nbsp;&nbsp;
            </Nav>
                         
             <Navbar.Collapse className="justify-content-end"> 
             {/* {'Welcome, '+ cookies.username + '   '}&nbsp;&nbsp; */}
                <Button variant="warning" href="/">Home Page</Button>&nbsp;&nbsp;
            </Navbar.Collapse>
            </Navbar><br/>
            <Notice/>

          <Container className = "page">
             <Switch>
                <Route exact path ="/About/JunMinLi" component = {JunMinLi}/>
                <Route exact path ="/About/KevinLuong" component = {KevinLuong}/>
                <Route exact path ="/About/Aitor" component = {Aitor}/>
                <Route exact path ="/About/CodyXu" component = {CodyXu}/>
                <Route exact path ="/About/DavidLin" component = {DavidLin}/>
                <Route exact path ="/About/YanruiXu" component = {YanruiXu}/> 
                <Route path = "/About" component = {Ourteam}/>
             </Switch>
          </Container>
         <Footer/>
       </div>
    );
    }
export default About;