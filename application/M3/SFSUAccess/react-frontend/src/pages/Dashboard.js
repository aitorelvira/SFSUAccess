import React, {useEffect, useState} from 'react';
import axios from 'axios';
import { Form, Button, Container, Col } from 'react-bootstrap';
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

  return (
    <Formik
        initialValues={{product_title: '', product_category: '',
        file: null, 
        product_price: '', 
        product_license: '', product_description: '' }}
        validationSchema={Yup.object({
            product_title: Yup.string()
                .max(50, 'Must be 50 characters or less')
                .matches(/^[a-zA-Z0-9]*$/gm, 'Please close the whitespace')
                .required('Required'),
            product_category: Yup.string()
                .oneOf(['Notes', 'Video', 'Music'])
                .required('Please indicate your category preference'),
            file: Yup.mixed()
                .required('A file is required'),
            product_price: Yup.string()
                .matches(/^[0-9]*$/, 'Must be a positive number')
                .required("Please enter a price")
                .min(0, "Must be '0' or a positive number"),
            product_license: Yup.string()
                .oneOf(['Free use & modification', 'Free to SFSU related projects', 'For sale'])
                .required("Please indicate your license preference"),
            product_description: Yup.string()
                .max(500, 'Must be 500 characters or less')
                .required('Please enter description'),
        })}
        
        onSubmit={(values, {setSubmitting}) => {
           values.user_id = user_id;
           values.product_author = cookies.first_name;
           //convert json obj to formdata.
           var form_data = new FormData();
            for ( var key in values ) {
            form_data.append(key, values[key]);
            }

           axios.post('/api/product',form_data)
               .then((response) =>{
                   console.log("Item posted successfully");    
                    get_pendingItem();
                    alert(JSON.stringify(values.product_name) + " has been posted successfully and waiting for approval. You can find it on dashboard, pending item list.");
               })
               .catch((error) => console.log(error))
                resetForm();   
            setSubmitting(false);
        }}
    >
    {formik => (
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
                                            <td width ="15%"> <Button variant="warning" id = {item.id} onClick={()=>remove_activeitem(item.id)}>Remove</Button>  &nbsp; &nbsp;</td>
                                        </tr>
                                    )})
                                }
                            </tbody>
                        </Table>
                    </Tab>

                    <Tab eventKey="postItem" title="Post an item">
                        <form className="postItem" id = "itemForm" onSubmit={formik.handleSubmit}>
                            <Form.Row>
                                <Form.Group as={Col} id="product_title">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control
                                        name="product_title"
                                        type="text"
                                        placeholder="Enter title"
                                        onFocus={(e) => e.target.placeholder = ""}
                                        onBlur={(e) => e.target.placeholder = "Enter title"}
                                        onChange={(e) => {formik.setFieldValue("product_title", e.currentTarget.value)}}
                                    />
                                    {formik.touched.product_title && formik.errors.product_title ? (<div className="error_message">{formik.errors.product_title}</div>) : null}
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} id="product_category">
                                    <Form.Label>Category</Form.Label>
                                        <Form.Control
                                            name="product_category"
                                            as="select"
                                            onChange={(e) => {formik.setFieldValue("product_category", e.currentTarget.value)}}
                                        >
                                            {list.map((x) => {
                                                return (
                                                    <option value={x.product_category_name} key={x.product_category_name}>{x.product_category_name}</option>)
                                                }).reverse()}
                                        </Form.Control>
                                        {formik.touched.product_category && formik.errors.product_category ? (<div className="error_message">{formik.errors.product_category}</div>) : null}
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group  as={Col} controlId="img">
                                    <Form.Label>Upload file.</Form.Label>
                                        <div className="input-group">
                                            <div className="custom-file">
                                                <input
                                                    name="file"
                                                     type="file"
                                                     className="custom-file-input"
                                                     id="file"
                                                     aria-describedby="inputGroupFileAddon01"
                                                     onChange={(e) => {formik.setFieldValue("file", e.currentTarget.files[0]); setFile(e.currentTarget.files[0]); setFileName(e.currentTarget.files[0].name)}}
                                                />
                                                <label className="custom-file-label" htmlFor="inputGroupFile01">
                                                    {product_fileName}
                                                </label>
                                             </div>
                                         </div>
                                         {formik.touched.file && formik.errors.file ? (<div className="error_message">{formik.errors.file}</div>) : null}
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="product_price">
                                    <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            name="product_price"
                                            type="text"
                                            placeholder="$0"
                                            onFocus={(e) => e.target.placeholder = ""}
                                            onBlur={(e) => e.target.placeholder = "$0"}
                                            onChange={(e) => {formik.setFieldValue("product_price", e.currentTarget.value); setPrice(e.currentTarget.value)}}
                                        />
                                        {formik.touched.product_price && formik.errors.product_price ? (<div className="error_message">{formik.errors.product_price}</div>) : null}
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} id="product_license">
                                    <Form.Label>License</Form.Label>
                                        <Form.Control
                                            name="product_license"
                                            as="select"
                                            onChange={(e) => {formik.setFieldValue("product_license", e.currentTarget.value)}}
                                        >
                                            <option value="Choose...">Choose...</option>
                                            <option value="Free use & modification">Free use & modification</option>
                                            <option value="Free to SFSU related projects">Free to SFSU related projects</option>
                                            <option value="For sale">For sale</option>
                                         </Form.Control>
                                        {formik.touched.product_license && formik.errors.product_license ? (<div className="error_message">{formik.errors.product_license}</div>) : null}
                                </Form.Group>
                            </Form.Row>

                            <Form.Group id="product_description">
                                <Form.Label>Item Description</Form.Label>
                                    <Form.Control
                                        name="product_description"
                                        as="textarea"
                                        rows="3"
                                        onChange={(e) => {formik.setFieldValue("product_description", e.currentTarget.value)}}
                                    />
                                    {formik.touched.product_description && formik.errors.product_description ? (<div className="error_message">{formik.errors.product_description}</div>) : null}
                            </Form.Group>

                            <Form.Row >
                                <Col>
                                    <Button variant="warning" onClick = {resetForm} block>Cancel</Button>
                                </Col>
                                <Col>
                                    <Button variant="warning" type="submit" block>Post Item</Button>
                                </Col>
                            </Form.Row>
                        </form>
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
                                    <tr key = {y + 1}>
                                    <td> {y + 1} </td>
                                    <td> {item.product_name} </td>
                                    <td> {item.product_description} </td>
                                    <td> {item.date_time_added}</td>
                                    <td> <Button variant="warning" id = {item.id} onClick = {()=>remove_pendingitem(item.id)}>Remove</Button>  &nbsp; &nbsp;</td>
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
                                        <Button variant="warning">Remove</Button>
                                    </td>
                                </tr>
                            </tbody>
                        </Table>
                    </Tab>
                </Tabs>
            </Container>
        </div>
    )}
    </Formik>
  );
};
export default Dashboard;