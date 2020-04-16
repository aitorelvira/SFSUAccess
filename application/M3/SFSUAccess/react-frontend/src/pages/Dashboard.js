import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Form, Button, Container, Col } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import Image from 'react-bootstrap/Image';
import { Table } from 'reactstrap';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import '../css/Dashboard.css';
import Header from '../components/Header';


const Dashboard = () => {
  const [cookies, setCookies] = useCookies([]);
  const [active_item, set_active_item] = useState([]);
  const [pending_item, set_pending_item] = useState([]);
  const user_privelege_type = cookies.privelege_type;
  const user_id = cookies.id;


  useEffect (()=>{
    
    //Based on the user_id, load the following to the Tab
    //Load all active items -> active_item
    //Load all pending items -> pending_item
    const fetchData = async() =>{
      await axios.get('/api/product?', { params:{user_id: user_id, status: 'active'}})
                               .then(response =>{
                                 set_active_item(response.data);
                               })
                                .catch(error => console.log(error))
       await axios.get('/api/product?', { params:{user_id: user_id, status: 'pending'}})
                               .then(response =>{
                                 set_pending_item(response.data);
                               })
                                .catch(error => console.log(error))
    }
    fetchData();
  },[]);  


  
  // axios.interceptors.response.use((response) =>{
  //   if(response.status === 200)
  //     setItem(response.data[0]);
    
  //   return response;
  // },error =>{
  //   if(error.response.status === 401){
  //    console.log("error")
  //   }
  //   return error;
  // })


  return (
    <div>
      <Header/>
    {/* Dash content   */}
    <Container className="dashboard">
      <h3>My Dashboard</h3><br/>
      <Tabs defaultActiveKey="postedItem" id="uncontrolled-tab-example">
        <Tab eventKey="postedItem" title="My Items"> 
          <Table>
              <thead>
                <tr>
                  <th>Item#</th>
                  <th>Thumbnails</th>
                  <th>Description</th>
                  <th>Remove item</th>
                </tr>
              </thead>
              <tbody>
              {active_item.map((item,y) => {             
                return (
                  <tr key = {y+1}>
                    <td width ="5%"> {y+1} </td>
                    <td width ="20%"> <Image src="https://helpx.adobe.com/content/dam/help/en/photoshop/how-to/compositing/_jcr_content/main-pars/image/compositing_1408x792.jpg" thumbnail/></td>
                    <td width ="60%"> {item.product_name}<br/>{item.product_description} <br/>by : {item.date_time_added}</td> 
                    <td width ="15%"> <Button variant="warning" id = {item.id}>Remove</Button>  &nbsp; &nbsp;</td>
                  </tr>
                )})      
              }  
               
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
      {user_privelege_type !== '1' && 
        <Tab eventKey="pending" title="Pending items">
        <Table responsive>
              <thead>
                <th>Number</th>
                <th>Name</th>
                <th>Description</th>
                <th>Post time</th>
                <th>Remove item</th>
              </thead>
              <tbody>
                {pending_item.map((item,y) => {
                  return (
                    <tr key = {y+1}>
                    <td> {y+1} </td>
                    <td> {item.product_name} </td>
                    <td> {item.product_description} </td> 
                    <td> {item.date_time_added}</td>
                    <td> <Button variant="warning" id = {item.id}>Remove</Button>  &nbsp; &nbsp;</td>
                  </tr>
                              
                  )})      
                }
              </tbody>
          </Table>
        </Tab>
      }

      {user_privelege_type === '1' && 
        <Tab eventKey="admin_pending" title="Pending items">
        <Table responsive>
              <thead>
                <tr>
                  <th>Item Number</th>
                  <th>Item Name</th>
                  <th>Description</th>
                  <th>Approve/Deny item</th>
                </tr>
              </thead>
              <tbody>
                
                <tr>
                  <td>1</td>
                  <td>Table cell</td>
                  <td>Table cell</td>
                  <td> 
                    <Button variant="warning">Approve</Button>  &nbsp; &nbsp;
                    <Button variant="warning">Deny</Button>  &nbsp; &nbsp;
                  </td>
                </tr>
              </tbody>
          </Table>
        </Tab>
        }
        
        <Tab eventKey="message" title="My Message">
        <Table responsive>
              <thead>
                <tr>
                  <th>From</th>
                  <th>Message content</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                
                <tr>
                  <td width="10%">User one</td>
                  <td width="65%">Hello CoSE Students,

Hope all is well with you and your family,

How are your remotely-taught classes?

CoSE is offering many different scholarships for the upcoming academic year 2020-2021.

You can search for scholarships at sfsu.academicworks.com and put in the scholarship name.

ARCS Scholarships ($10,000)
Awarded to ten graduate students in the Departments of Biology, Chemistry & Biochemistry, Computer Science, Earth & Climate Sciences, Geography & Environment, Mathematics, Physics & Astronomy
 

Robert W. Maxwell Memorial Scholarships ($4,000)
Awarded to three to five graduate students in the Departments of Biology, Chemistry & Biochemistry, Computer Science, Earth & Climate Sciences, Engineering, Geography & Environment, Mathematics, Physics & Astronomy, Psychology

College of Science & Engineering Advisory Board Scholarship ($2,500)
Awarded to one graduate student in the College of Science & Engineering

 

Bruce A. Rosenblatt Community Service Scholarships ($1,250)
Awarded to four undergraduate or graduate students with 100 hours of Community Service
 

James C. Kelley Scholarship ($1,000)
Awarded to one undergraduate or graduate student in the field of Marine or Environmental science
 

David & Cary Cassa Memorial Scholarships ($1,000)
Awarded to two College of Science & Engineering undergraduate students who live in San Francisco
 

Kenneth Fong Biology Scholarship ($1,250)
Awarded to one undergraduate student in the Department of Biology
 

C.Y. Chow Memorial Scholarships ($1,000)
Awarded to two undergraduate students in the Department of Computer Science or Mathematics
 

Pamela Fong Mathematics Scholarship ($1,250)
Awarded to one undergraduate student in the Department of Mathematics

Stay healthy and be safe.

Best,

Lannie

Lannie Nguyen

Manager, Special Events and Alumni Relations

College of Science & Engineering

San Francisco State University

1600 Holloway Avenue

San Francisco, CA 94132</td>
                  <td> <Button variant="warning">Mark as read</Button>&nbsp; &nbsp;
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


  export default Dashboard;
