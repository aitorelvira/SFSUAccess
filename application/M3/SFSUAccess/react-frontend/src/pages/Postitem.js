//PURPOSE: This page is used for posting items.
//AUTHOR: JunMin Li
import React , {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Button, Container, Col, Alert, Row } from 'react-bootstrap';
import '../css/Dashboard.css';
import Header from '../components/Header';

const Postitem = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['first_name', 'post_item']);
    const username = cookies.first_name;
    const [list, setList] = useState([]);
    const [show, setShow] = useState(false);
    const [product_name, setName] = useState('');
    const [product_category, setCategory] = useState('');
    const [product_file, setFile] = useState({});
    const [product_fileName, setFileName] = useState('Upload File here...')
    const [product_price, setPrice] = useState();
    const [product_license, setLicense] = useState('');
    const [product_description, setDescription] = useState('');
    const [error_message, setErrormessage] = useState('');
    const history = useHistory();
    const user_id = cookies.id;
    const user_isloggedin = cookies.isLoggedin;

    useEffect (() => {
        axios.get('/api/search').then(response =>{setList(response.data)}).catch(error=>console.log(error));
        console.log("isLoggedin? "+ user_isloggedin);

        if(typeof cookies.post_item !== 'undefined'){
            setName(cookies.post_item.product_name);
            setCategory(cookies.post_item.product_category);
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

  //this function is used to post cookies item
  const postItem =()=>{
    if(document.getElementById("file").files.length !== 0 ){
        var form_data = new FormData();
        for ( var key in cookies.post_item ) {
            if(key !== "file")
                form_data.append(key, cookies.post_item[key]);
        }
        form_data.append("user_id", user_id);
        form_data.append("product_author", cookies.first_name);
        form_data.append("file", product_file);

        axios.post('/api/product',form_data)
            .then((response) =>{
                console.log("Item has been posted successfully.");
                alert("Item has been posted successfully and waiting for approval. You can find it on dashboard, pending item list.");
                setFileName('Upload File here...');
                removeCookies('post_item');
            })
            .catch((error) => console.log(error))  
        setShow(false);
    }
     else
        setErrormessage('A file is required');
  }

  //delete the cookies item.
  const cancelItem = () =>{
    window.location.reload();
    removeCookies('post_item');
  }


    return (
        <Formik
        initialValues={{product_name: product_name, product_category: product_category,
        file: null, product_price: '', 
        product_license: product_license, product_description: product_description }}
        validationSchema={Yup.object({
            product_name: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .matches(/^[a-zA-Z0-9]*$/gm, 'Please close the whitespace')
                .required('Required'),
            product_category: Yup.string()
                .oneOf(['Notes', 'Video', 'Music'])
                .matches(/^[a-zA-Z0-9]*$/gm, 'Please close the whitespace')
                .required('Please indicate your category preference'),
            file: Yup.mixed()
                .required('A file is required'),
            product_price: Yup.string()
                .required("Please enter a price")
                .matches(/^\s*(?=.*[0-9])\d*(?:\.\d{1,2})?\s*$/g, 'Must be a positive number'),
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

           var form_data = new FormData();
            for ( var key in values ) {
            form_data.append(key, values[key]);
            }

           axios.post('/api/product',form_data)
               .then((response) =>{
                   console.log("Item has been posted successfully.");
                   alert( 
                   " Item has been posted successfully and waiting for approval. You can find it on dashboard, pending item list.");
                   removeCookies('post_item');
               })
               .catch((error) => console.log(error))  
            resetForm();
            setSubmitting(false);          
        }
        else{
            setCookies('post_item', values, { expires: 0});
            setShow(true);
        }
     
    }}
    >
    {formik => (
        <div>
            <Header/>
            <Container className="dashboard">
                <h3>Post item page</h3><br/>
                
                {/* display when a user try to post an item without log in. */}
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
                    <Button onClick={cancelItem} variant="danger">
                        Not now
                    </Button>
                    </div>                   
                </Alert>

                {/* display when a user logged in, and having an existing post item which saved in cookies. */}
                {(cookies.post_item && user_isloggedin) &&
                    <Alert variant="dark">
                    <Alert.Heading>You tried to post the following item. Do you want to continue?</Alert.Heading>
                        <b>Name : </b>{product_name}<br/>
                        <b>Price : </b>{product_price}<br/>
                        <b>Category : </b>{product_category}<br/>
                        <b>License : </b>{product_license}<br/>
                        <b>Description : </b>{product_description}<br/>
                    <hr />
                    <form id = "itemForm">
                    <Form.Row>
                        <Form.Group controlId="file">
                            <Form.Label>Upload your file here again, then you good to go.</Form.Label>
                                <div className="input-group">
                                    <div className="custom-file">
                                        <input
                                            name="file"
                                            type="file"
                                            className="custom-file-input"
                                            id="file"
                                            onChange={(e) => {  
                                            setFileName(e.currentTarget.files[0].name); setFile(e.currentTarget.files[0])
                                            }}
                                        />
                                        <label className="custom-file-label">
                                            {product_fileName}
                                        </label>
                                    </div>
                                </div>
                            <div className="error_message">{ product_fileName === 'Upload File here...' ? error_message: null}</div>
                        </Form.Group>
                    </Form.Row>
                    </form>
                    <Row>
                        <Col>
                            <Button onClick={cancelItem} variant="danger">&nbsp;&nbsp;Cancel&nbsp;&nbsp;</Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                            <Button variant="warning" onClick={postItem}>Post item</Button>
                        </Col>
                    </Row>                   
                </Alert>
                }

                {/* default post item form  */}
                {!cookies.post_item &&        
                        <form className="postItem" id = "itemForm" onSubmit={formik.handleSubmit}>
                            <Form.Label>All fields are required</Form.Label>
                            <Form.Row>
                                <Form.Group as={Col} id="product_name">
                                    <Form.Label>Title </Form.Label>
                                    <Form.Control
                                        name="product_name"
                                        type="text"
                                        onFocus={(e) => e.target.placeholder = ""}
                                        onBlur={(e) => e.target.placeholder = "Enter title"}
                                        placeholder="Enter title"
                                        onChange={(e) => {formik.setFieldValue("product_name", e.currentTarget.value); 
                                        setName(e.currentTarget.value)}}
                                    />
                                    <Form.Text className="text-muted">
                                        {formik.touched.product_name && formik.errors.product_name ? (<div className="error_message">{formik.errors.product_name}</div>) : null}
                                    </Form.Text>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} id="product_category">
                                    <Form.Label>Category</Form.Label>
                                        <Form.Control
                                            name="product_category"
                                            as="select"
                                            onChange={(e) => {formik.setFieldValue("product_category", e.currentTarget.value); 
                                            setCategory(e.currentTarget.value)}}
                                        >
                                            {list.map((x) => {
                                                return (
                                                    <option value={x.product_category_name} key={x.product_category_name}>
                                                    {x.product_category_name}</option>)
                                                }).reverse()}
                                        </Form.Control>
                                    <Form.Text className="text-muted"> 
                                        {formik.touched.product_category && formik.errors.product_category ? (<div className="error_message">{formik.errors.product_category}</div>) : null}
                                    </Form.Text>
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
                                            onChange={(e) => {formik.setFieldValue("product_price", e.currentTarget.value); 
                                            setPrice(e.currentTarget.value)}}
                                        />
                                    <Form.Text className="text-muted"> 
                                        {formik.touched.product_price && formik.errors.product_price ? (<div className="error_message">{formik.errors.product_price}</div>) : null}
                                    </Form.Text>
                                </Form.Group>
                            </Form.Row>

                            <Form.Row>
                                <Form.Group as={Col} id="product_license">
                                    <Form.Label>License</Form.Label>
                                        <Form.Control
                                            name="product_license"
                                            as="select"
                                            onChange={(e) => {formik.setFieldValue("product_license", e.currentTarget.value); 
                                            setLicense(e.currentTarget.value)}}
                                        >
                                            <option value="Choose...">Choose...</option>
                                            <option value="Free use & modification">Free use & modification</option>
                                            <option value="Free to SFSU related projects">Free to SFSU related projects</option>
                                            <option value="For sale">For sale</option>
                                         </Form.Control>
                                    <Form.Text className="text-muted">   
                                        {formik.touched.product_license && formik.errors.product_license ? (<div className="error_message">{formik.errors.product_license}</div>) : null}
                                    </Form.Text>
                                </Form.Group>
                            </Form.Row>

                            <Form.Group id="product_description">
                                <Form.Label>Item Description</Form.Label>
                                    <Form.Control
                                        name="product_description"
                                        as="textarea"
                                        rows="3"
                                        className = "textarea"
                                        placeholder=""
                                        onFocus={(e) => e.target.placeholder = ""}
                                        onBlur={(e) => e.target.placeholder = ""}
                                        onChange={(e) => {formik.setFieldValue("product_description", e.currentTarget.value); 
                                        setDescription(e.currentTarget.value)}}
                                    />
                                <Form.Text className="text-muted">    
                                    {formik.touched.product_description && formik.errors.product_description ? (<div className="error_message">{formik.errors.product_description}</div>) : null}
                                </Form.Text>                
                            </Form.Group>

                            <Form.Row>
                                <Form.Group  as={Col} controlId="file">
                                    <Form.Label>Upload your file.</Form.Label>
                                        <div className="input-group">
                                            <div className="custom-file">
                                                <input
                                                    name="file"
                                                     type="file"
                                                     className="custom-file-input"
                                                     id="file"
                                                     aria-describedby="inputGroupFileAddon01"
                                                     onChange={(e) => {formik.setFieldValue("file", e.currentTarget.files[0]);  
                                                     setFileName(e.currentTarget.files[0].name);}}
                                                />
                                                <label className="custom-file-label" htmlFor="inputGroupFile01">
                                                    {product_fileName}
                                                </label>
                                             </div>
                                         </div>
                                    <Form.Text className="text-muted">
                                        {formik.touched.file && formik.errors.file ? (<div className="error_message">{formik.errors.file}</div>) : null}
                                    </Form.Text>        
                                </Form.Group>
                            </Form.Row>
                            <Form.Label><p>Notice: all item might take up to 24 hours to be approved.</p></Form.Label><br/>
                            <Form.Row >
                                <Col>
                                    <Button variant="danger" onClick = {resetForm} block>Reset</Button>
                                </Col>
                                <Col>
                                    <Button variant="warning" type="submit" block>Post item</Button>
                                </Col>
                            </Form.Row>
                        </form>
                    }   
                  </Container>
                  <br/><br/><br/><br/><br/>
              </div>
          )}
      </Formik>
      );
 };

  export default Postitem;