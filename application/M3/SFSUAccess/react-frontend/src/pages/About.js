import React, {useEffect}from 'react';
import { Container, Row, ButtonToolbar } from 'reactstrap';
import {setUsername} from '../redux/actions/userActions.js';
import {Button}  from 'react-bootstrap';
import { connect } from 'react-redux';
import Header from '../components/Header';
import Footer from '../components/Footer';

import '../css/About.css'


const About = ({ dispatch, username }) => {
   useEffect (()=>{
      dispatch(setUsername(window.location.search.substr(1)));
   },[]);

   const goHomepage = () =>{
      window.location.href = '/user_name?' + username;
  }



    return (
       <div>
           <div className="navBar">  
      <div className="navLogo">SFSUAccess</div>
      <div className="loginSection"> 
        {'Welcome '+ username + '   '}&nbsp;&nbsp;
         <Button variant="warning" onClick = {goHomepage}>Home Page</Button>&nbsp;&nbsp;
      </div>
      </div>
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
               </ButtonToolbar>
            </Row><br/>
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