import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import {
  Card, CardBody,
  CardTitle, CardSubtitle
} from 'reactstrap';
import { connect } from 'react-redux';
import Pagination from './Pagination';
import '../css/Content.css';


const Content = ({ searchinfo, notes_perpage, show_numberOfitems }) => {
  
  const goItemDetail =(id) => {
    window.open("/ItemDetail?itemId=" + id);
  };

  const display =  notes_perpage.map((x,item_number) => {  
    if(item_number < 4){ // initialized how many items per page. 
    return(
      <Col  sm="3" key={item_number} className = "carddiv">
      <Card id = {x.id} onClick = {e => goItemDetail(x.id)}  border="light">
        <img  src="https://www.w3schools.com/html/img_chania.jpg" alt ="img" className="thumbnails"/>
          <CardBody>
          <CardTitle className="title">{x.product_name}</CardTitle>
          <CardSubtitle>{x.product_author}</CardSubtitle><br/>
            {/* <CardText >Description: {x.product_description}</CardText> */}
          </CardBody>
     </Card>
     </Col> 
    )}
    else
      return('');
  }) 
  

  return (
       <Container>
         {!searchinfo && <p> Updates.<br/>
           4/05 Basic iogIn and SignUp pages are implemented. Maybe missing some details, verification is needed.<br/>
           4/06 Basic pagination is implemented. Showing 4 items per page.<br/>
           4/09 Added individual about pages, changed sign in/up to from data.<br/>
           4/10 Added itemDetail page.<br/><br/>
           Need to do.<br/>
           A default home content page?<br/>
           </p>}
          <Row><Col>{searchinfo}{show_numberOfitems}</Col></Row><br/>
          <Row>
            {display}
          </Row>
          <Row>
            <Col>
              <Pagination/>
            </Col>
          </Row>
         <br/><br/><br/><br/><br/>
         </Container>
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




