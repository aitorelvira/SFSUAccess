import React,{ useState }from 'react';
// import axios from 'axios';
// import Alert from 'react-bootstrap/Alert'
import { Button, Container, Row, Col } from 'react-bootstrap';
import {
  Card, CardText, CardBody,
  CardTitle, CardSubtitle
} from 'reactstrap';
import { connect } from 'react-redux';
import Pagination from './Pagination';
import '../css/Content.css';


const Content = ({ searchinfo, notes_perpage, show_numberOfitems }) => {
  const[modal, setModal] = useState(false);
  
  const toggle =() => setModal(!modal);

  const display =  notes_perpage.map((x,item_number) => {  
    if(item_number < 4){ // initialized how many items per page. 
    return(
      <Col  sm="3" key={item_number}>
      <div className = "carddiv">
      <Card>
      <div className="thumbnails"><img  src={x.product_image_link} alt ="img"/></div>
          <CardBody>
          <CardTitle className="descriptionFormat"><b> {x.product_name}</b></CardTitle>
            <CardSubtitle>Author: {x.product_author}</CardSubtitle>
            <CardText>File Size: {x.product_file_size}</CardText>
            <CardText >Description: {x.product_description}</CardText>
            <Button className="cardButton" variant="warning" onClick={toggle}>See details</Button>
          </CardBody>
     </Card>
     </div>
     </Col> 
    )}
    else
      return('');
  }) 
  

  return (
    <div className="content">
       <Container>
          {/* { modal && (
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
    )} */}
         {!searchinfo && <p> Updates.<br/>
           4/05 Basic LogIn and SignUp pages are implemented. Maybe missing some details, verification is needed.<br/>
           4/06 Basic pagination is implemented. Showing 4 items per page.<br/><br/>
           Need to do.<br/>
           A default home content page.<br/>
           Individual about pages.<br/> 
           </p>}
         <Row>{searchinfo}{show_numberOfitems}</Row><br/>
        <Row>
          {display}
        </Row>
         <Row>
           <Pagination/>
        </Row>
         <br/><br/><br/><br/><br/>
         </Container>
  </div>
  );
}


const mapStateToProps = state => ({
  username: state.userReducer.username,
  notes: state.notesReducer.notes,
  searchinfo: state.notesReducer.searchinfo,
  notes_perpage: state.notesReducer.notes_perpage, 
  show_numberOfitems:state.notesReducer.show_numberOfitems,
  })
  export default connect(mapStateToProps)(Content);




