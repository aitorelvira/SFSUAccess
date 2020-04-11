import React from 'react';
import { Button, Container, Row, Col } from 'react-bootstrap';
import {
  Card, CardText, CardBody,
  CardTitle, CardSubtitle
} from 'reactstrap';
import { connect } from 'react-redux';
import Pagination from './Pagination';
import '../css/Content.css';


const Content = ({ searchinfo, notes_perpage, show_numberOfitems }) => {
  
  const toggle =(id) => {
    console.log("id " + id)
    window.open("/ItemDetail?itemId=" + id);
  };

  const display =  notes_perpage.map((x,item_number) => {  
    if(item_number < 4){ // initialized how many items per page. 
    return(
      <Col  sm="3" key={item_number}>
      <div className = "carddiv">
      <Card id = {item_number}>
      <div className="thumbnails"><img  src={x.product_image_link} alt ="img"/></div>
          <CardBody>
          <CardTitle className="descriptionFormat"><b> {x.product_name}</b></CardTitle>
            <CardSubtitle>Author: {x.product_author}</CardSubtitle>
            <CardText >Description: {x.product_description}</CardText>
            <Button className="cardButton" variant="warning" onClick={e => toggle(x.id)} id = {x.id}>See details</Button>
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
         {!searchinfo && <p> Updates.<br/>
           4/05 Basic iogIn and SignUp pages are implemented. Maybe missing some details, verification is needed.<br/>
           4/06 Basic pagination is implemented. Showing 4 items per page.<br/>
           4/09 Added individual about pages, changed sign in/up to from data.<br/>
           Need to do.<br/>
           A default home content page.<br/>
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




