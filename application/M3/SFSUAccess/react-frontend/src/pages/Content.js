//PURPOSE: This page is used to list items after user used any search functions
//         on the home page. Including free-text search, nav bar selection.
//AUTHOR: JunMin Li
import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Image from 'react-bootstrap/Image';
import { Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { connect } from 'react-redux';
import Pagination from './Pagination';
import '../css/Content.css';


const Content = ({ searchinfo, notes_perpage, show_numberOfitems }) => {
  const item_perpage = 8;
  const goItemDetail =(id) => {
    window.open("/ItemDetail?itemId=" + id);
  };

  //Formatting the MySQL date on the card
  const formatDate =(dateString)=>{
    return dateString.replace('GMT','')
  }

  const get_thumbnails = (item_id) => {
    return '/api/thumbnails/' + item_id + '-0';
  }
 
  const searchResult =  notes_perpage.map((x,item_number) => {  
    if(item_number < item_perpage){ // initialized how many items per page. 
    return(
      <Col  sm="3" key={item_number} >
        <Card id = {x.id} onClick = {e => goItemDetail(x.id)}  border="light" className = "card_div">
          <Image src = {get_thumbnails(x.id)} className="thumbnails"/>
            <CardBody>
            <CardTitle className="card_text">{x.product_name}</CardTitle>
            <CardText className="card_user">by&nbsp;{x.product_author}</CardText>
            <CardText className="card_date">{formatDate(x.date_time_added)}</CardText>
            </CardBody>
        </Card><br/>
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




