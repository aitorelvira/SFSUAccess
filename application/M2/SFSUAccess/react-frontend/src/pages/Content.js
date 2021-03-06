import React,{useState, useEffect}from 'react';
import axios from 'axios';
import Alert from 'react-bootstrap/Alert'
import { Switch, Route, Link } from "react-router-dom";
import { Nav, Navbar, Form, FormControl,Button, Container, Row, Col } from 'react-bootstrap';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Modal, ModalHeader, ModalBody, ModalFooter
} from 'reactstrap';
import { connect } from 'react-redux';
import '../css/Content.css';


const Content = ({dispatch, searchinfo, notes}) => {
  const[modal, setModal] = useState(false);

  // useEffect (()=>{
  //   // axios.get('/api/search')
  //   //     .then(response => {         
  //   //      setList(response.data);  
  //   //  });
  //   setSearchInfo('This is content page.')
  // },[]);

  const toggle =() => setModal(!modal);

  return (

       <Container>
          { modal && (
      <div>
      <Modal isOpen={modal} toggle={toggle} >
        <ModalHeader toggle={toggle}>Computer Basics Absolute Beginner's Guide, Windows 10 Edition</ModalHeader>
        <ModalBody>
        <CardImg src="https://www.w3schools.com/css/lights600x400.jpg" alt="image" />
          ISBN-13: 978-0136498810
         <p>Whatever detail of this item.</p>
          <hr/>
          <FormControl as="textarea" aria-label="With textarea" placeholder="Sent a message.."/>
        </ModalBody>
        
        <ModalFooter>
          <Button color="primary" onClick={toggle}>contact the Seller</Button>{' '}
          <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    </div>
    )}

         {!searchinfo && <p className="greeting"> The search functions are implemented. <br/>
           One dropdown menu on the up left corner - Search items in specify categories.<br/> 
           One free text entry field up right corner - Free text searching.<br/>
           </p>}
        <Row><h5>{searchinfo}</h5></Row><br/>
        <Row>
        {notes.map((x) => {   
          return(
            <Col  sm="3" key={x.product_description}>
            <Card>
            <div className="thumbnails"><img  src={x.product_image_link} alt ="img"/></div>
                <CardBody>
                <CardTitle className="descriptionFormat"><b> {x.product_name}</b></CardTitle>
                  <CardSubtitle>Author: {x.product_author}</CardSubtitle>
                  <CardText>File Size: {x.product_file_size}</CardText>
                  <CardText >Description: {x.product_description}</CardText>
                  <Button className="cardButton" variant="warning" >See details</Button>
                </CardBody>
           </Card>
           </Col>
          )
        })}
         </Row>
         <br/><br/><br/><br/><br/>
         </Container>
    

  );
}


const mapStateToProps = state => ({

  // isLoggedIn: state.userReducer.isLoggedIn,
  // username: state.userReducer.username,
  // list: state.userReducer.list,
  notes: state.notesReducer.notes,
  searchinfo: state.notesReducer.searchinfo,
  
  })
  export default connect(mapStateToProps)(Content);
// export default Content;




