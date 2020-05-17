//PURPOSE: This page is used to manage user's item.
//         To check active / pending posted item, messages and able to post item.
//AUTHOR: JunMin Li
import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Button, Container, Row, Modal, Col } from 'react-bootstrap';
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

  //Message system.
  const [show, setShow] = useState(false);
  const [markRead, setMarkRead] = useState(true);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const [message_history, set_message_history] = useState([]);
  const [recipient, setRecipient] = useState('');
  const [reply_message, set_reply_message] = useState('');
  const [thread_id, set_thread_id] = useState('');

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

         await axios.post('/api/messages', {user_id})
            .then(response => {
               setMessages(response.data)
            })
            .catch(error => console.log(error))
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
      return '/api/thumbnails/' + item_id;
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

   const formatDate =(dateString)=>{
    return dateString.replace('GMT','')
  }

  //get message list, use this function to refresh the message list.
  const get_message_list =()=>{
    axios.post('/api/messages', {user_id})
      .then(response => {
          setMessages(response.data)
      })
      .catch(error => console.log(error))
  }

  //Use to redirecting to item detail page with an item id.
  const goItemDetail =(id) => {
    window.open("/ItemDetail?itemId=" + id);
};

  //get message history of a conversation.
  const get_message_history = (thread_id) => {
    axios.get('/api/messages/'+ thread_id +"/")
    .then(response => {
      console.log('get message history..')
      set_message_history(response.data);
    })
    .catch(error => console.log(error))
  }

  //delete a message thread
  const delete_message = (thread_id)=>{
    axios.delete('/api/messages/' + thread_id)
    .then(response => {
      console.log('message thread ' + thread_id + ' is deleted...');
      get_message_list();
    })
    .catch(error => console.log('delete message error ' + error))

  }


  return (
    <Formik
        initialValues={{textarea: ''}}
        validationSchema={Yup.object({
          textarea: Yup.string()
                .max(250, 'Must be 120 character or less')
                .required('You can not send an empty message'),
        })}
        onSubmit={(values, {setSubmitting}) => {
            const sender_user_id = user_id;
            const recipient_user_id = recipient;
            const message_contents = document.getElementById("message").value;
            console.log("message: " + message_contents + ". sender " + sender_user_id + ". recipient "+ recipient_user_id +
            ". thread_id: " + thread_id);

            var formData = new FormData();
            formData.append('sender_user_id', sender_user_id)
            formData.append('recipient_user_id', recipient)
            formData.append('message_contents', message_contents)
            document.getElementById("message_form").reset();

            axios.post('/api/messages/'+ thread_id + '/reply/',{
                sender_user_id,
                recipient_user_id,
                message_contents,
            })
            .then(response => {
              console.log("message sent...");
              //reload message_history
              setShow(false)
              get_message_list()
            })
            .catch(error => console.log("sent message error..."))

            setSubmitting(false);
        }}
    >
    {formik => (
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
                          <td width ="55%"> {item.product_name}<br/>{item.product_description} <br/>by : {formatDate(item.date_time_added)}</td>
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
                <th>Thumbnails</th>
                <th>Item detail</th>
                <th>Approve/Deny item</th>
                </tr>
              </thead>
              <tbody>
                {admin_pending_item.map((item,y) => {
                  return (
                    <tr key = {y + 1}>
                      <td width ="10%"> {y+1} </td>
                      <td width ="20%"> <Image src = {get_thumbnails(item.id)} className="thumbnails" onClick = {(e) =>{open_originalImage(item.id)}}/></td>
                      <td width ="45%"> {item.product_name}<br/>{item.product_description} <br/>by : {formatDate(item.date_time_added)}</td>
                      <td> <Button variant="warning" onClick = {(e)=>admin_approve_deny(item.id,'Approve')}>Approve</Button>  &nbsp; &nbsp;
                            <Button variant="danger" onClick = {(e)=>admin_approve_deny(item.id,'Deny')}>Deny</Button>  &nbsp; &nbsp;</td>
                    </tr>
                  )})
                }
              </tbody>
            </Table>
          </Tab>
          }

          <Tab eventKey="message" title="My Message" id="message_tab">
            <Table hover>
                <thead>
                    <tr>
                      <th>Item</th>
                      <th>Message</th>
                      <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {messages.map((data) => {
                    return(
                        <tr key = {data.id}>
                        <td width ="20%"><Image src = {get_thumbnails(data.product_id)} className="thumbnails" onClick = {(e) =>{goItemDetail(data.product_id)}}/></td>
                        <td width="30%">
                            <h6><b>{data.first_name}</b></h6>
                            <div className="messageContent">
                                <p>{data.last_message}</p>
                            </div>
                        </td>
                        <td>
                          <Button variant="warning" onClick={(e) => {handleShow(); get_message_history(data.id); set_thread_id(data.id);}}>
                            Reply</Button>&nbsp; &nbsp;
                          <Button variant="danger" onClick ={e=>delete_message(data.id)}>Remove</Button>
                        </td>
                      </tr>
                    )})
                }
              </tbody>
            </Table>
          </Tab>
        </Tabs>

        <Modal
              size="lg"
              aria-labelledby="contained-modal-title-vcenter"
              centered
              show={show}
              onHide={handleClose}
          >

          <Modal.Body>
          <Container className="messageBox">
          { message_history.map((data, number) =>{
            if(number == 0){
              setRecipient(data.sender_user_id)
            }
              return(
                <div  key = {number}>
                <div className = {data.sender_user_id.toString() === user_id? "message_sender" : "message_recipient"}>
                <div className = {data.sender_user_id.toString() === user_id? "sender" : "recipient"} >{data.message_contents}<br/>
                <p className="message_date">{formatDate(data.date_time_sent)}</p></div><br/>
                </div></div>
              )
          })}
          </Container>
          </Modal.Body>
          <form onSubmit={formik.handleSubmit} id="message_form">
            <Row><Col md={{ span: 10, offset: 1 }}>
              <textarea
              className="messageReply"
              name="textarea"
              id="message"
              rows="3"
              cols='50'
              placeholder="Message..."
              onChange={(e) => {formik.setFieldValue("textarea", e.currentTarget.value)}}
            />
           </Col></Row>
           <Row>&nbsp;
           {formik.touched.textarea && formik.errors.textarea ? (<div className="error_message">{formik.errors.textarea}</div>) : null}
           </Row>
           <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>Close</Button>

        <Button variant="warning" type="submit">Send</Button>
            </Modal.Footer>
          </form>
        </Modal>

      </Container>
    </div>
   )}
   </Formik>
  );
};
export default Dashboard;
