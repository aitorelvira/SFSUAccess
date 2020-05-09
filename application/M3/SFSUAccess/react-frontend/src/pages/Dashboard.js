//PURPOSE: This page is used to manage user's item.
//         To check active / pending posted item, messages and able to post item.
//AUTHOR: JunMin Li
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Button, Container, Row, Modal } from 'react-bootstrap';
import { useCookies } from 'react-cookie';
import Image from 'react-bootstrap/Image';
import { Table } from 'reactstrap';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import '../css/Dashboard.css';
import Header from '../components/Header';

const Dashboard = () => {
  const [messages, setMessages] = useState([]);
  const [cookies, setCookies] = useCookies([]);
  const [active_item, set_active_item] = useState([]);
  const [pending_item, set_pending_item] = useState([]);
  const [admin_pending_item, set_admin_pending_item] = useState([]);
  const user_privelege_type = cookies.privelege_type;
  const user_id = cookies.id;

  //Message reply popup window
  const [show, setShow] = useState(false);
  const [reply, setReply] = useState(false);
  const [markRead, setMarkRead] = useState(true);
  const closeReply = () => setReply(false);
  const showReply = () => setReply(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect (()=>{
//    Based on the user_id, load the following to the Tab
//    Load all active items -> active_item
//    Load all pending items -> pending_item
      const fetchData = async() => {
        await axios.get('/api/product?', { params:{user_id: user_id, status: 'active'}})
          .then(response =>{
            set_active_item(response.data);
          })
          .catch(error => console.log(error))
        // await axios.get('/api/messages').then(response =>{setMessages(response.data)}).catch(error=>console.log(error));
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

  //List active items.
  const get_activeItem = () =>{
    axios.get('/api/product?', { params:{user_id: user_id, status: 'active'}})
      .then(response =>{
        set_active_item(response.data);
      })
      .catch(error => console.log(error))
  }

  //List pending items.
  const get_pendingItem = () =>{
    axios.get('/api/product?', { params:{user_id: user_id, status: 'pending'}})
      .then(response =>{
        set_pending_item(response.data);
      })
      .catch(error => console.log(error))
  }

  //List all pending items for admin.
  const get_admin_pendingItem = ()=>{
    axios.get('/api/admin/pending')
      .then(response =>{
        set_admin_pending_item(response.data);
      })
      .catch(error => console.log(error))
  }

  const get_user_message = () => {
    axios.get('/api/')
  }

  //Remove pending item function.
  const remove_pendingitem = (id) =>{
    axios.delete('/api/product/' + id)
    .then ((response) => { console.log("Item deleted");
    get_pendingItem();
  })
    .catch((error) => console.log("Delete error..."));
  }

  //Remove active item function
  const remove_activeitem = (id) =>{
    axios.delete('/api/product/' + id)
    .then ((response) => { console.log("Item deleted");
    get_activeItem();
  })
    .catch((error) => console.log("Delete error..."));
  }

  //Aprove, deny item function for admin
  const admin_approve_deny =(product_id, decision)=>{
    var formData = new FormData();
    formData.append('product_id', product_id);
    formData.append('decision', decision);
    axios.post('/api/admin/review', formData)
      .then ((response) => { console.log("Item decision: " + decision);
        get_admin_pendingItem();
      })
      .catch((error) => console.log("Decision error..."))
  }


  const get_thumbnails = (item_id) => {
      return '/api/thumbnails/' + item_id + '-0';
  }

  const open_originalImage = (id) =>{
    console.log("open original image: " + id)
    window.open(get_thumbnails(id));
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
                          <td width ="10%"> {y+1} </td>
                          <td width ="20%"> <Image src = {get_thumbnails(item.id)} className="thumbnails" onClick = {(e) =>{open_originalImage(item.id)}}/></td>
                          <td width ="55%"> {item.product_name}<br/>{item.product_description} <br/>by : {item.date_time_added}</td>
                          <td width ="15%"> <Button variant="danger" id = {item.id} onClick={()=>remove_activeitem(item.id)}>
                            Remove</Button>  &nbsp; &nbsp;</td>
                        </tr>
                      )})
                    }
                  </tbody>
                </Table>
            </Tab>

          {/* user pending list */}
          {user_privelege_type !== '1' &&
          <Tab eventKey="pending" title="Pending items">
            <Table responsive = "true">
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
            <Table responsive = "true">
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
                   <Table hover>
                        <thead>
                            <tr>
                              <th></th>
                              <th>Message</th>
                              <th>Date</th>
                              <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                                <tr>
                                   <td width="1%">{markRead ? <img src={require('../images/blue-dot.png')} width="35px"/> : <img src={require('../images/white-dot.png')} width="35px"/>}</td>
                                   <td width="30%">
                                        <h6><b>John</b></h6>
                                        <div className="messageContent">
                                            <p>Hello asdfasfasdfafdsaffdsafaasdfafafaf a asfasf afasdfasfafsa asdfasfa asdf asf sfa asdfasfdaasdfafsaasfd CoSE Students</p>
                                        </div>
                                   </td>
                                   <td width="46%">
                                       10/2/2020
                                   </td>
                                   <td>
                                     <Button variant="warning" onClick={handleShow}>Read</Button>&nbsp; &nbsp;
                                        {!reply && (
                                            <Modal
                                                size="md"
                                                aria-labelledby="contained-modal-title-vcenter"
                                                centered
                                                show={show}
                                                onHide={handleClose}
                                            >
                                            <Modal.Header closeButton>
                                            <Modal.Title>Form: john</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <p>Message goes here...</p>
                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="primary" onClick={()=> {showReply(); handleClose()}}>
                                                Reply
                                                </Button>

                                            </Modal.Footer>
                                          </Modal>
                                        )}

                                        {reply && (
                                            <Modal
                                                size="md"
                                                aria-labelledby="contained-modal-title-vcenter"
                                                centered
                                                show={reply}
                                                onHide={closeReply}
                                            >
                                            <Modal.Header closeButton>
                                            <Modal.Title>To: john</Modal.Title>
                                            </Modal.Header>
                                                <textarea
                                                className="messageReply"
                                                id="message"
                                                rows="5"
                                                placeholder="Message..."
                                            />
                                            <Modal.Footer>
                                                <Button variant="primary" onClick={() => {closeReply(); handleClose()}}>
                                                    Send
                                                </Button>
                                            </Modal.Footer>
                                          </Modal>
                                        )}
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