import React , {useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { Form, Button, Container, Col } from 'react-bootstrap';
import { connect } from 'react-redux';
import {setUsername} from '../redux/actions/userActions.js';
import '../css/Dashboard.css';

import Footer from '../components/Footer';
import Header from '../components/Header';


const Postitem = ({ dispatch, username }) => {
  const [cookies, setCookies] = useCookies(['username']);
  
   useEffect (()=>{
      if(typeof cookies.username !== 'undefined')
      dispatch(setUsername(cookies.username));
   },[dispatch, cookies.username]);



  return (
    <div>


    <Header/>
    {/* Dash content   */}
    <Container>
      <h3>Post an item</h3><hr/><Col md={{ offset: 2 }}>
        <Form className="postItem">
            <Form.Row>
              <Form.Group as={Col} controlId="">
                <Form.Label>Item Name</Form.Label>
                <Form.Control placeholder="Enter item name" />
              </Form.Group>
            </Form.Row>

            <Form.Row>            
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" value="Choose...">
                  <option>Choose...</option>
                  <option>...</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group  as={Col} controlId="formGridAddress1">
            <Form.Label>Upload item image</Form.Label>
            <div className="input-group">
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="inputGroupFile01"
                  aria-describedby="inputGroupFileAddon01"
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  Choose file
                </label>
              </div>
            </div>
            </Form.Group>
            </Form.Row>

            <Form.Row>
              
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Price</Form.Label>
                <Form.Control placeholder="Enter item price" />
              </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>License</Form.Label>
                <Form.Control placeholder="Enter item price" />
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Item Description</Form.Label>
              <Form.Control as="textarea" rows="3" />
            </Form.Group>

            <Form.Row >
              <Col>
              <Button variant="warning" type="submit" block>Cancel</Button> 
              </Col>
              <Col>
              <Button variant="warning" type="submit" block>Post Item</Button>
              </Col>
                      
           
            </Form.Row>           
        </Form>
        </Col>
    </Container>
    <br/><br/><br/><br/><br/>
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
  export default connect(mapStateToProps)(Postitem);




