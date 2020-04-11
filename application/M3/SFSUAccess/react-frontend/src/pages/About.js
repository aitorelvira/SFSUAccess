import React, {useEffect}from 'react';
import { useCookies } from 'react-cookie';
import { Container, Row, ButtonToolbar } from 'reactstrap';
import { Switch, Route } from "react-router-dom";
import {setUsername} from '../redux/actions/userActions.js';
import {Button}  from 'react-bootstrap';
import { connect } from 'react-redux';
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


const About = ({ dispatch, username }) => {
   const [cookies, setCookies] = useCookies(['username']);
  
   useEffect (()=>{
      if(typeof cookies.username !== 'undefined')
      dispatch(setUsername(cookies.username));
   },[dispatch, cookies.username]);



    return (
       <div>
      <div className="navBar">  
      <div className="navLogo">SFSUAccess</div>
      <Container>
         <Row>
            <ButtonToolbar>
               <Button variant="warning" href = "/About">ABOUT OUR TEAM</Button>&nbsp;&nbsp;
               <Button variant="warning" href = "/About/KevinLuong">Kevin Luong</Button>&nbsp;&nbsp;
               <Button variant="warning" href = "/About/JunMinLi">JunMinLi</Button>&nbsp;&nbsp;
               <Button variant="warning" href ="/About/Aitor">Aitor</Button>&nbsp;&nbsp;
               <Button variant="warning" href="/About/CodyXu">CodyXu</Button>&nbsp;&nbsp;
               <Button variant="warning" href ="/About/DavidLin">DavidLin</Button>&nbsp;&nbsp;
               <Button variant="warning" href ="/About/YanruiXu">YanruiXu</Button>&nbsp;&nbsp;
            </ButtonToolbar>
         </Row>
      </Container>
      <div className="loginSection"> 
        {'Welcome '+ username + '   '}&nbsp;&nbsp;
         <Button variant="warning" href="/">Home Page</Button>&nbsp;&nbsp;
      </div>
      </div>
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


    const mapStateToProps = state => ({
      isLoggedIn: state.userReducer.isLoggedIn,
      username: state.userReducer.username,
      list: state.userReducer.list,
      notes: state.notesReducer.notes,
      searchinfo: state.notesReducer.searchinfo,
      
      })
      export default connect(mapStateToProps)(About);