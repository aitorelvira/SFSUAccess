import React, {useEffect} from 'react';
import { Form, Button, Container, Col } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { Table } from 'reactstrap';
import { connect } from 'react-redux';
import {setUsername} from '../redux/actions/userActions.js';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import '../css/Dashboard.css';
import Header from '../components/Header';


const Dashboard = ({dispatch, username}) => {
  const [cookies, setCookies] = useCookies(['first_name']);
  

  useEffect (()=>{
    const fetchData = async() =>{
      // const category = await axios.get('/api/search');
      // const video = await axios.get('/api/search/video');
      // const music = await axios.get('/api/search/music');
      // const note  = await axios.get('/api/search/notes');
           
      // set_notes_list(note.data);
      // set_video_list(video.data);
      // set_music_list(music.data);
      // setList(category.data);  
    }
    dispatch(setUsername(cookies.first_name));
    //fetchData();
  },[dispatch, cookies.first_name]);  



  return (
    <div>
     <Header/>
    {/* Dash content   */}
    <Container className="dashboard">
      <h3>Dashboard</h3><br/>
    
      <Tabs defaultActiveKey="postedItem" id="uncontrolled-tab-example">
        <Tab eventKey="postedItem" title="Items"> 
          <Table responsive>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Approve/Deny item</th>
                </tr>
              </thead>
              <tbody>
                
                <tr>
                  <td>1</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td> <Button variant="warning">Remove item</Button>  &nbsp; &nbsp;
                  </td>
                </tr>
              </tbody>
          </Table>
        </Tab>

        <Tab eventKey="post" title="Post an item">
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
        <br/><br/><br/><br/><br/>
        </Tab>
        <Tab eventKey="unapproved" title="Unapproved items">
        <Table responsive>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Approve/Deny item</th>
                </tr>
              </thead>
              <tbody>
                
                <tr>
                  <td>1</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td> <Button variant="warning">Remove item</Button>  &nbsp; &nbsp;
                  </td>
                </tr>
              </tbody>
          </Table>
        </Tab>
        
        <Tab eventKey="message" title="My Message">
        <Table responsive>
              <thead>
                <tr>
                  <th>From</th>
                  <th>Message content</th>
                  <th>Approve/Deny item</th>
                </tr>
              </thead>
              <tbody>
                
                <tr>
                  <td>User one</td>
                  <td>This is the message.</td>
                  <td> <Button variant="warning">Check message</Button>  &nbsp; &nbsp;
                       <Button variant="warning">Remove</Button>
                  </td>
                </tr>
              </tbody>
          </Table>
        </Tab>
        </Tabs>

     
    </Container>
    </div>
  );
}


const mapStateToProps = state => ({
  username: state.userReducer.username,
})
  export default connect(mapStateToProps)(Dashboard);




