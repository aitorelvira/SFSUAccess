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
  const [list, setLists] = useState([]);
  const [cookies, setCookies] = useCookies([]);
  const [active_item, set_active_item] = useState([]);
  const [pending_item, set_pending_item] = useState([]);
  const [admin_pending_item, set_admin_pending_item] = useState([]);
  const user_privelege_type = cookies.privelege_type;
  const user_id = cookies.id;

  
  const [validated, setValidated] = useState(false);
  const [product_name, setItemName] = useState('');
  const [product_category, setCategory] = useState('');
  const [product_file, setFile] = useState({});
  const [product_fileName, setFileName] = useState('')
  const [product_price, setPrice] = useState(0);
  const [product_license, setLicense] = useState('');
  const [product_description, setDescription] = useState('');


  useEffect (()=>{
//    Based on the user_id, load the following to the Tab
//    Load all active items -> active_item 
//    Load all pending items -> pending_item
      const fetchData = async() => {
        await axios.get('/api/search').then(response =>{setLists(response.data)}).catch(error=>console.log(error));
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

  const get_activeItem = () =>{
    axios.get('/api/product?', { params:{user_id: user_id, status: 'active'}})
    .then(response =>{
      set_active_item(response.data);
    })
    .catch(error => console.log(error))
  }

  const get_pendingItem = () =>{
    axios.get('/api/product?', { params:{user_id: user_id, status: 'pending'}})
    .then(response =>{
      set_pending_item(response.data);
    })
    .catch(error => console.log(error))
  }


  //Post item function. Invoked after form submission
  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if(form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    setValidated(true);

    event.preventDefault();
    
    let selected_category = document.getElementById("category");
    let category_index = selected_category.selectedIndex;
    let product_category = selected_category.options[category_index].value;

    let select_license = document.getElementById("license");
    let license_index = select_license.selectedIndex;
    let product_license = select_license.options[license_index].value;
    

    //Put all information in formData for api call.
    var formData = new FormData();
    formData.append('product_name', product_name);
    formData.append('product_author', cookies.first_name);
    formData.append('product_category', product_category);
    formData.append('product_description', product_description);
    formData.append('product_license', product_license);
    formData.append('user_id', user_id);
    
    axios.post('/api/product',formData)
      .then((response) =>{
        console.log("Item posted successfully");
        get_pendingItem();
      })
      .catch((error) => console.log(error))
  }

  //Retrieve files object and name in post item form
  const onChangeFile = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  }

  //Remove active/pending items 
  const removeItem = (id) =>{
    axios.delete('/api/product/' + id, {id : id})
    .then ((response) => { console.log("Item deleted");
      get_activeItem();
      get_pendingItem();  
    })
    .catch((error) => console.log("Delete error..."))
  }

  //Aprove, deny item function for Admin
  const decision =(product_id, decision)=>{
    console.log(product_id + " " + decision)
    var formData = new FormData();
    formData.append('product_id', product_id);
    formData.append('decision', decision);
    axios.post('/api/admin/review', formData)
      .then ((response) => { console.log("Item decision: " + decision); 
      })
      .catch((error) => console.log("Decision error..."))
  }
  
  //Reset user input on post item form.
  const resetForm = ()=>{
    document.getElementById("itemForm").reset();
  }

  return (
    <div>
      <Header/>
    {/* Dash content   */}
    <Container className="dashboard">
      <h3>{user_privelege_type ==='1'? "Administrator Dashboard" : "My Dashboard"}</h3><br/>
      <Tabs defaultActiveKey="listItem" id="dashboard">
        <Tab eventKey="listItem" title="My Items"> 
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
                    <td width ="15%"> <Button variant="warning" id = {item.id} onClick={()=>removeItem(item.id)}>Remove</Button>  &nbsp; &nbsp;</td>
                  </tr>
                )})      
              }            
              </tbody>
          </Table>
        </Tab>

        <Tab eventKey="postItem" title="Post an item">
          <Form className="postItem" noValidate validated={validated} onSubmit={handleSubmit} id = "itemForm">
            <Form.Row>
              <Form.Group as={Col} controlId="itemName">
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
            <Form.Group as={Col} controlId="category">
                <Form.Label>Category</Form.Label>
                <Form.Control
                    required
                    // onChange = {e => setCategory(e.target.value)}
                    as="select"
                >
                    {list.map((x) => {
                      if(x.product_category_name !== 'All')
                        return (
                            <option value={x.product_category_name} key={x.product_category_name}>{x.product_category_name}</option>)
                    }).reverse()}
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group  as={Col} controlId="image">
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
                  {product_fileName}
                </label>
              </div>
            </div>
            </Form.Group>
            </Form.Row>

            <Form.Row>
              
            <Form.Group as={Col} controlId="price">
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
            <Form.Group as={Col} controlId="license">
                <Form.Label>License</Form.Label>
                <Form.Control
                    required
                    as="select"
                 >
                      <option value="Free use & modification">Free use & modification</option>
                      <option value="Free to SFSU related projects">Free to SFSU related projects</option>
                      <option value="For sale">For sale</option>
                  </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="itemDescription">
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
              <Button variant="warning" onClick = {resetForm} block>Cancel</Button> 
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
                    <td> <Button variant="warning" id = {item.id} onClick = {()=>removeItem(item.id)}>Remove</Button>  &nbsp; &nbsp;</td>
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
                    <Button variant="warning" onClick = {()=>decision('24','Approve')}>Approve</Button>  &nbsp; &nbsp;
                    <Button variant="warning" onClick = {()=>decision('25','Deny')}>Deny</Button>  &nbsp; &nbsp;
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
                  <td width="65%">abcdefghijklmnopqrstuvwxyz
                  abcdefghijklmnopqrstuvwxyz
                  abcdefghijklmnopqrstuvwxyz
                  abcdefghijklmnopqrstuvwxyz
                  abcdefghijklmnopqrstuvwxyz</td>
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
