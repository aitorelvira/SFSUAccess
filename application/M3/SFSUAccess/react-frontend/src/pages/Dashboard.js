//PURPOSE: This page is used to manage user's item.
//         To check active / pending posted item, messages and able to post item.
//AUTHOR: JunMin Li
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Form, Button, Container, Col, Row } from 'react-bootstrap';
import { Formik } from 'formik';
import * as Yup from 'yup';
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


  const [product_name, setItemName] = useState('');
  const [product_category, setCategory] = useState('');
  const [product_file, setFile] = useState({});
  const [product_fileName, setFileName] = useState('Upload File here...')
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
        if(user_privelege_type !== '1' ){
          await axios.get('/api/product?', { params:{user_id: user_id, status: 'pending'}})
                                  .then(response =>{
                                    set_pending_item(response.data);
                                  })
                                  .catch(error => console.log(error))
        }
        else{
          await axios.get('/api/admin/pending')
                                  .then(response =>{
                                    set_admin_pending_item(response.data);
                                  })
                                  .catch(error => console.log(error))
        }
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

  const get_admin_pendingItem = ()=>{
    axios.get('/api/admin/pending')
      .then(response =>{
        set_admin_pending_item(response.data);
      })
      .catch(error => console.log(error))
  }

 
  const remove_pendingitem = (id) =>{
    axios.delete('/api/product/' + id)
    .then ((response) => { console.log("Item deleted");
    get_pendingItem();
  })
    .catch((error) => console.log("Delete error..."));
  }
 
  const remove_activeitem = (id) =>{
    axios.delete('/api/product/' + id)
    .then ((response) => { console.log("Item deleted");
    get_activeItem();  
  })
    .catch((error) => console.log("Delete error..."));
  }

  //Aprove, deny item function for Admin
  const admin_approve_deny =(product_id, decision)=>{
    console.log(product_id + " " + decision)
    var formData = new FormData();
    formData.append('product_id', product_id);
    formData.append('decision', decision);
    axios.post('/api/admin/review', formData)
      .then ((response) => { console.log("Item decision: " + decision);
        get_admin_pendingItem();
      })
      .catch((error) => console.log("Decision error..."))
  }

  //Reset user input on post item form.
  const resetForm = ()=>{
    document.getElementById("itemForm").reset();
    setFileName("Upload File here...");
  }

   //Use to redirecting to post item page.
   const goPostitem = () => {
     console.log("go post item page.")
    window.open("/Postitem");
  };

  return (
    <div>
      <Header/>
      {/* Dash content   */}
      <Container className="dashboard">
          <Row><h3>{user_privelege_type ==='1'? "Administrator Dashboard" : "My Dashboard"}</h3>
          &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <Button variant="warning" onClick = { goPostitem }>Post an item</Button></Row>
          <br/>
          <Tabs defaultActiveKey="listItem" id="dashboard">
              <Tab eventKey="listItem" title="My Items">
                <Table>
                  <thead>
                      <tr>
                          <th>Item</th>
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
                          <td width ="15%"> <Button variant="danger" id = {item.id} onClick={()=>remove_activeitem(item.id)}>Remove</Button>  &nbsp; &nbsp;</td>
                        </tr>
                      )})
                    }
                  </tbody>
                </Table>
            </Tab>
          
          {/* user pending list */}
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
                    <tr key = {y + 1}>
                    <td> {y + 1} </td>
                    <td> {item.product_name} </td>
                    <td> {item.product_description} </td>
                    <td> {item.date_time_added}</td>
                    <td> <Button variant="danger" id = {item.id} onClick = {()=>remove_pendingitem(item.id)}>Remove</Button>  &nbsp; &nbsp;</td>
                  </tr>
                  )})
                }
              </tbody>
            </Table>
          </Tab>
          }

          {/* admin pending item list */}
          {user_privelege_type === '1' &&
            <Tab eventKey="admin_pending" title="Pending items">
            <Table responsive>
              <thead>
                <tr>
                <th>Number</th>
                <th>Name</th>
                <th>Description</th>
                <th>Post time</th>
                <th>Approve/Deny item</th>
                </tr>
              </thead>
              <tbody>
                {admin_pending_item.map((item,y) => {
                  return (
                    <tr key = {y + 1}>
                      <td> {y + 1} </td>
                      <td> {item.product_name} </td>
                      <td> {item.product_description} </td>
                      <td> {item.date_time_added}</td>
                      <td> <Button variant="warning" onClick = {()=>admin_approve_deny(item.id,'Approve')}>Approve</Button>  &nbsp; &nbsp;
                            <Button variant="warning" onClick = {()=>admin_approve_deny(item.id,'Deny')}>Deny</Button>  &nbsp; &nbsp;</td>
                    </tr>
                  )})
                }
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
                  </td>
                  <td><Button variant="warning">Mark as read</Button>&nbsp; &nbsp;
                      <Button variant="danger">Remove</Button>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Tab>
          </Tabs>
      </Container>
    </div>
  );
};
export default Dashboard;