import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Form, Button, Container, Col } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import { Table } from 'reactstrap';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import '../css/Dashboard.css';
import Header from '../components/Header';


const Dashboard = () => {
  const [list, setLists] = useState([]);
  const [cookies, setCookies] = useCookies([]);
  const [active_item, set_active_item] = useState([]);
  const [pending_item, set_pending_item] = useState([]);
  const user_privelege_type = cookies.privelege_type;
  const user_id = cookies.id;
  const [validated, setValidated] = useState(false);
  const [itemName, setItemName] = useState("");
  const [category, setCategory] = useState("");
  const [file, setFile] = useState({});
  const [fileName, setFileName] = useState("Choose File")
  const [price, setPrice] = useState(0);
  const [license, setLicense] = useState("");
  const [description, setDescription] = useState("");


  useEffect (()=>{
//    Based on the user_id, load the following to the Tab
//    Load all active items -> active_item const fetchData = async() =>{
//    Load all pending items -> pending_item
      const fetchData = async() => {
        await axios.get('/api/search').then(response =>{setLists(response.data)}).catch(error=>console.log(error));
//        await axios.get('/api/product?', { params:{user_id: user_id, status: 'active'}})
//                               .then(response =>{
//                                 set_active_item(response.data);
//                               })
//                                .catch(error => console.log(error))
//        await axios.get('/api/product?', { params:{user_id: user_id, status: 'pending'}})
//                               .then(response =>{
//                                 set_pending_item(response.data);
//                               })
//                                .catch(error => console.log(error))
      }
    fetchData();
  },[]);  

  //Invoked after form submission
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if(form.checkValidity() == false) {
        event.preventDefault();
        event.stopPropagation();
    }
    setValidated(true);

    //Testing
    event.preventDefault();
    console.log(itemName);
    console.log(category);
    console.log(file);
    console.log(price);
    console.log(license);
    console.log(description);
    console.log(list)
  }

  //Retrieve files object and name in post item form
  const onChangeFile = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  }
  
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
      <h3>Dashboard</h3> -- The My item, and pending item section are implemented.<br/>
      <Tabs defaultActiveKey="postedItem" id="uncontrolled-tab-example">
        <Tab eventKey="postedItem" title="My Items"> 
          <Table responsive>
              <thead>
                <tr>
                  <th>Number</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Post time</th>
                  <th>Remove item</th>
                </tr>
              </thead>
              <tbody>
              {active_item.map((item,y) => {             
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

        <Tab eventKey="post" title="Post an item">
          <Form className="postItem" noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} controlId="">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                    required
                    type="text"
                    onChange = {e => setItemName(e.target.value)}
                    placeholder="Enter item name"
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>            
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Category</Form.Label>
                <Form.Control
                    required
                    onChange = {e => setCategory(e.target.value)}
                    as="select"
                >
                    {list.map((x) => {
                        return (
                            <option value={x.product_category_name} key={x.product_category_name}>{x.product_category_name}</option>)
                    }).reverse()}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group  as={Col} controlId="formGridAddress1">
            <Form.Label>Upload item image</Form.Label>
            <div className="input-group">
              <div className="custom-file">
                <input
                  required
                  onChange = {onChangeFile}
                  type="file"
                  className="custom-file-input"
                  id="inputGroupFile01"
                  aria-describedby="inputGroupFileAddon01"
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  {fileName}
                </label>
              </div>
            </div>
            </Form.Group>
            </Form.Row>

            <Form.Row>
              
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Price</Form.Label>
                <Form.Control
                    required
                    type="text"
                    onChange = {e => setPrice(e.target.value)}
                    placeholder="Enter item price"
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>License</Form.Label>
                <Form.Control
                    required
                    onChange={e => setLicense(e.target.value)}
                    as="select"
                 >
                      <option value="Choose...">Choose...</option>
                      <option value="Free use & modification">Free use & modification</option>
                      <option value="Free to SFSU related projects">Free to SFSU related projects</option>
                      <option value="For sale">For sale</option>
                  </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Item Description</Form.Label>
              <Form.Control
                required
                onChange = {e => setDescription(e.target.value)}
                as="textarea"
                rows="3"
              />
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


  export default Dashboard;
