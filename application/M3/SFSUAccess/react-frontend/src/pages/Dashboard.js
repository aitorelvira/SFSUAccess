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

  const [validated, setValidated] = useState(false);
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
    setFileName("Upload File here...");
  }

  return (
    <Formik
        initialValues={{itemName: '', category: '', file: null, price: '', license: '', description: '' }}
        validationSchema={Yup.object({
            itemName: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            category: Yup.string()
                .oneOf(['Notes', 'Video', 'Music'])
                .required('Please indicate your category preference'),
            file: Yup.mixed()
                .required('A file is required'),
            price: Yup.number()
                .required("Please enter a price")
                .positive("Must be a position number"),
            license: Yup.string()
                .oneOf(['Free use & modification', 'Free to SFSU related projects', 'For sale'])
                .required("Please indicate your license preference"),
            description: Yup.string()
                .max(500, 'Must be 500 characters or less')
                .required('Please enter description'),
        })}
        onSubmit={(values, {setSubmitting}) => {

             console.log(product_name);
             console.log(cookies.first_name);
             console.log(product_category);
             console.log(product_description);
             console.log(product_license);
             console.log(user_id);

//			//Put all information in formData for api call.
//            var formData = new FormData();
//            formData.append('product_name', product_name);
//            formData.append('product_author', cookies.first_name);
//            formData.append('product_category', product_category);
//            formData.append('product_description', product_description);
//            formData.append('product_license', product_license);
//            formData.append('user_id', user_id);
//
//            let selected_category = document.getElementById("category");
//            let category_index = selected_category.selectedIndex;
//            let product_category = selected_category.options[category_index].value;
//
//            let select_license = document.getElementById("license");
//            let license_index = select_license.selectedIndex;
//            let product_license = select_license.options[license_index].value;
//
//            axios.post('/api/product',formData)
//                .then((response) =>{
//                    console.log("Item posted successfully");
//                    get_pendingItem();
//                })
//                .catch((error) => console.log(error))

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
                                            <td width ="15%"> <Button variant="warning" id = {item.id} onClick={()=>removeItem(item.id)}>Remove</Button>  &nbsp; &nbsp;</td>
                                        </tr>
                                    )})
                                }
                            </tbody>
                        </Table>
                    </Tab>

                    <Tab eventKey="postItem" title="Post an item">
                        <form className="postItem" id = "itemForm" onSubmit={formik.handleSubmit}>
                            <Form.Row>
                                <Form.Group as={Col} controlId="">
                                    <Form.Label>Item Name</Form.Label>
                                    <Form.Control
                                        name="itemName"
                                        type="text"
                                        placeholder="Enter item name"
                                        onChange={(e) => {formik.setFieldValue("itemName", e.currentTarget.value); setItemName(e.currentTarget.value)}}
                                    />
                                    {formik.touched.itemName && formik.errors.itemName ? (<div className="error_message">{formik.errors.itemName}</div>) : null}
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Category</Form.Label>
                                        <Form.Control
                                            name="category"
                                            as="select"
                                            onChange={(e) => {formik.setFieldValue("category", e.currentTarget.value); setCategory(e.currentTarget.value)}}
                                        >
                                            {list.map((x) => {
                                                return (
                                                    <option value={x.product_category_name} key={x.product_category_name}>{x.product_category_name}</option>)
                                                }).reverse()}
                                        </Form.Control>
                                        {formik.touched.category && formik.errors.category ? (<div className="error_message">{formik.errors.category}</div>) : null}
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group  as={Col} controlId="formGridAddress1">
                                    <Form.Label>Upload item image</Form.Label>
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
                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Price</Form.Label>
                                        <Form.Control
                                            name="price"
                                            type="text"
                                            placeholder="$"
                                            onChange={(e) => {formik.setFieldValue("price", e.currentTarget.value); setPrice(e.currentTarget.value)}}
                                        />
                                        {formik.touched.price && formik.errors.price ? (<div className="error_message">{formik.errors.price}</div>) : null}
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>License</Form.Label>
                                        <Form.Control
                                            name="license"
                                            as="select"
                                            onChange={(e) => {formik.setFieldValue("license", e.currentTarget.value); setLicense(e.currentTarget.value)}}
                                        >
                                            <option value="Choose...">Choose...</option>
                                            <option value="Free use & modification">Free use & modification</option>
                                            <option value="Free to SFSU related projects">Free to SFSU related projects</option>
                                            <option value="For sale">For sale</option>
                                         </Form.Control>
                                        {formik.touched.license && formik.errors.license ? (<div className="error_message">{formik.errors.license}</div>) : null}
                                </Form.Group>
                            </Form.Row>

                            <Form.Group controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Item Description</Form.Label>
                                    <Form.Control
                                        name="description"
                                        as="textarea"
                                        rows="3"
                                        onChange={(e) => {formik.setFieldValue("description", e.currentTarget.value); setDescription(e.currentTarget.value)}}
                                    />
                                    {formik.touched.description && formik.errors.description ? (<div className="error_message">{formik.errors.description}</div>) : null}
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

                                        San Francisco, CA 94132
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
