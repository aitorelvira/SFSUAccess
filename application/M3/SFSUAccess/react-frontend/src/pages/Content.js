import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { connect } from 'react-redux';
import Pagination from './Pagination';
import '../css/Content.css';


const Content = ({ searchinfo, notes_perpage, show_numberOfitems }) => {
  
  const goItemDetail =(id) => {
    window.open("/ItemDetail?itemId=" + id);
  };
 

  const searchResult =  notes_perpage.map((x,item_number) => {  
    if(item_number < 8){ // initialized how many items per page. 
    return(
      <Col  sm="3" key={item_number} className = "card_div">
      <Card id = {x.id} onClick = {e => goItemDetail(x.id)}  border="light" >
        <img  src="https://www.w3schools.com/html/img_chania.jpg" alt ="img" className="thumbnails"/>
          <CardBody>
          <CardTitle className="card_text">{x.product_name}__Here is the product_name section. Added more chars to test the css.</CardTitle>
          <CardText className="card_user">by&nbsp;{x.product_author}</CardText>
          <CardText className="card_date">04/14/20</CardText>
          </CardBody>
     </Card>
     </Col> 
    )}
    else
      return('');
  }) 
  

  return (
       <Container>
         {!searchinfo && <div>
           {/* <p> Updates.<br/>
           4/05 Basic iogIn and SignUp pages are implemented. Maybe missing some details, verification is needed.<br/>
           4/06 Basic pagination is implemented. Showing 4 items per page.<br/>
           4/09 Added individual about pages, changed sign in/up to from data.<br/>
           4/10 Added itemDetail page.<br/>
           4/11 Added api to itemDetail page. New UI.<br/>
           4/12 Added default home page.<br/><br/>
           </p> */}
      
          </div>
           }
          <Row><Col>{searchinfo}&nbsp;&nbsp;{show_numberOfitems}</Col></Row><br/>
          <Row>
            {searchResult}
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




