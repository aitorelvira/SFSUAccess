import React , {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Button, Container, Col, Alert } from 'react-bootstrap';
import '../css/Dashboard.css';
import Header from '../components/Header';

const Postitem = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['first_name', 'post_item']);
    const username = cookies.first_name;
    const [list, setList] = useState([]);
    const [show, setShow] = useState(false);
    const [product_name, setItemName] = useState('');
    const [product_category, setCategory] = useState('');
    const [product_file, setFile] = useState([]);
    const [product_fileName, setFileName] = useState('Upload File here...')
    const [product_price, setPrice] = useState();
    const [product_license, setLicense] = useState('');
    const [product_description, setDescription] = useState('');




    const history = useHistory();
    const user_id = cookies.id;
    const user_isloggedin = cookies.isLoggedin;

    useEffect (() => {
        axios.get('/api/search').then(response =>{setList(response.data)}).catch(error=>console.log(error));
        console.log("isLoggedin? "+ user_isloggedin);

        if(typeof cookies.post_item !== 'undefined'){
            setItemName(cookies.post_item.product_name);
            setCategory(cookies.post_item.product_category);
            //setFileName(cookies.post_item.file[0].name);
            setPrice(cookies.post_item.product_price);
            setLicense(cookies.post_item.product_license);
            setDescription(cookies.post_item.product_description);
        }
    },[]);

  //Reset user input on post item form.
  const resetForm = ()=>{
    document.getElementById("itemForm").reset();
    setFileName("Upload File here...");
  }

  const postItem =()=>{
      console.log(cookies.post_item.file);
    var form_data = new FormData();
     for ( var key in cookies.post_item ) {
     form_data.append(key, cookies.post_item[key]);
     }
     form_data.append("user_id", user_id);
     form_data.append("product_author", cookies.first_name);

    axios.post('/api/product',form_data)
        .then((response) =>{
            console.log("Item posted successfully");
        })
        .catch((error) => console.log(error))  
   
     // display message when an item posted.
     alert(JSON.stringify(product_name) + "has been posted successfully.");
     removeCookies('post_item');
     setShow(false);
  }


  const cancelItem = () =>{
    removeCookies('post_item');
    window.location.reload();
  }


    return (
        <Formik
        initialValues={{product_name: product_name, product_category: product_category, 
        file: null, product_price: '', 
        product_license: product_license, product_description: product_description }}
        validationSchema={Yup.object({
            product_name: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            product_category: Yup.string()
                .oneOf(['Notes', 'Video', 'Music'])
                .required('Please indicate your category preference'),
            file: Yup.mixed()
                .required('A file is required'),
            product_price: Yup.number()
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
        if(user_isloggedin){
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
                   alert(JSON.stringify(values.product_name) + "has been posted successfully.");
                   removeCookies('post_item');
               })
               .catch((error) => console.log(error))  
            resetForm();      
            setSubmitting(false);
        }
        else{
            console.log(values); 
            setCookies('post_item', 
            JSON.stringify(values), { expires: 0});
            console.log(cookies.post_item);
            setShow(true);
        }}}
    >
    {formik => (
        <div>
            <Header/>
            <Container className="dashboard">
                <h3>Post item page.</h3><br/>
                <Alert show={show} variant="dark">
                    <Alert.Heading>Unauthorized action. You tried to post the following item.</Alert.Heading>
                        <b>Name : </b>{product_name}<br/>
                        <b>File : </b>{product_fileName}<br/>
                        <b>Price : </b>{product_price}<br/>
                        <b>Category : </b>{product_category}<br/>
                        <b>License : </b>{product_license}<br/>
                        <b>Description : </b>{product_description}<br/>
                    <hr />
                    <p>Please create and log into your account to continue.</p>
                    <div>
                    <Button onClick={()=>{history.push("/SignUp")}} variant="warning">
                        Sign up
                    </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={()=>{history.push("/SignIn")}} variant="warning">
                        Sign in
                    </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={cancelItem} variant="warning">
                        Not now
                    </Button>
                    </div>                   
                </Alert>

                {(cookies.post_item && user_isloggedin) &&
                    <Alert variant="dark">
                    <Alert.Heading>You tried to post the following item. Do you want to continue?</Alert.Heading>
                        <b>Name : </b>{product_name}<br/>
                        <b>File : </b>{cookies.post_item.file[0]}<br/>
                        <b>Price : </b>{product_price}<br/>
                        <b>Category : </b>{product_category}<br/>
                        <b>License : </b>{product_license}<br/>
                        <b>Description : </b>{product_description}<br/>
                    <hr />
                    <div>
                    <Button onClick={postItem} variant="warning">
                        Post item
                    </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                    <Button onClick={cancelItem} variant="warning">
                        Cancel
                    </Button>
                    </div>                   
                </Alert>
                }
                        <form className="postItem" id = "itemForm" onSubmit={formik.handleSubmit}>
                            <Form.Row>
                                <Form.Group as={Col} id="product_name">
                                    <Form.Label>Item Name</Form.Label>
                                    <Form.Control
                                        name="product_name"
                                        type="text"
                                        placeholder="Enter item name"
                                        onChange={(e) => {formik.setFieldValue("product_name", e.currentTarget.value); setItemName(e.currentTarget.value)}}
                                    />
                                    {formik.touched.product_name && formik.errors.product_name ? (<div className="error_message">{formik.errors.product_name}</div>) : null}
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} id="product_category">
                                    <Form.Label>Category</Form.Label>
                                        <Form.Control
                                            name="product_category"
                                            as="select"
                                            onChange={(e) => {formik.setFieldValue("product_category", e.currentTarget.value); setCategory(e.currentTarget.value)}}
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
                                <Form.Group  as={Col} controlId="file">
                                    <Form.Label>Upload a file.</Form.Label>
                                        <div className="input-group">
                                            <div className="custom-file">
                                                <input
                                                    name="file"
                                                     type="file"
                                                     className="custom-file-input"
                                                     id="file"
                                                     aria-describedby="inputGroupFileAddon01"
                                                     onChange={(e) => {formik.setFieldValue("file", e.currentTarget.files[0]); setFile(e.currentTarget.files[0]); 
                                                     setFileName(e.currentTarget.files[0].name);
                                                     setFile(e.currentTarget.files[0])}}
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
                                            placeholder="$"
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
                                            onChange={(e) => {formik.setFieldValue("product_license", e.currentTarget.value); setLicense(e.currentTarget.value)}}
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
                                        onChange={(e) => {formik.setFieldValue("product_description", e.currentTarget.value); setDescription(e.currentTarget.value)}}
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
                  </Container>
                  <br/><br/><br/><br/><br/>
              </div>
          )}
      </Formik>
      );
 };
export default Postitem;