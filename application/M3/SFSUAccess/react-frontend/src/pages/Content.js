import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
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
        <Image src="https://www.w3schools.com/html/img_chania.jpg" thumbnail/>
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




