//PURPOSE: This page is used for posting items.
//AUTHOR: JunMin Li
import React , {useEffect, useState} from 'react';
import { useHistory } from "react-router-dom";
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Button, Container, Col, Alert, Row } from 'react-bootstrap';
import Spinner from 'react-bootstrap/Spinner'
import '../css/Dashboard.css';
import Header from '../components/Header';
import ReactGA from "react-ga";

const Postitem = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['first_name', 'post_item']);
    const username = cookies.first_name;
    const [list, setList] = useState([]);
    const [show, setShow] = useState(false);
    const [posting_item, setPosting] = useState(false);
    const [post_successully, setSuccessully] = useState(false);
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

    const FILE_SIZE = 51200 * 1024; // 50 MB file size

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

        setPosting(true);

        axios.post('/api/product',form_data)
            .then((response) =>{
                console.log("Item has been posted successfully.");
                setSuccessully(true);
                setFileName('Upload File here...');
                removeCookies('post_item');
                ReactGA.event({
                 category: 'PostItem',
                 action: 'Item Posted',
                 transport: 'beacon'
                });
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
        file: product_fileName, product_price: '',
        product_license: product_license, product_description: product_description }}
        validationSchema={Yup.object({
            product_name: Yup.string()
                .max(30, 'Must be 30 characters or less') // increased limit
                .matches(/^[a-zA-Z0-9\s]*$/gm, 'Alphanumeric characters only')
                .required('Required'),
            product_category: Yup.string()
                .oneOf(['Other', 'Notes', 'Video', 'Music'])
                .required('Please indicate your category preference'),
            file: Yup.mixed()
                .required('A file is required')
                .test(
                  "fileSize",
                  "File too large: must be under 50 MB",
                  value => product_file && product_file.size <= FILE_SIZE
                ),
            product_price: Yup.string()
                .required("Please enter a price")
                .matches(/^\s*(?=.*[0-9])\d*(?:\.\d{1,2})?\s*$/g, 'Must be a positive number'),
            product_license: Yup.string()
                .oneOf(['Free use & modification', 'Free to SFSU related projects', 'Copyrighted'])
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

            setPosting(true);

           axios.post('/api/product',form_data)
               .then((response) =>{
                   console.log("Item has been posted successfully.");
                   removeCookies('post_item');
                   setSuccessully(true);
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
                <h3>Post an item</h3><br/>
                <Alert show = {posting_item} variant="dark">
                    { !post_successully &&
                        <div>
                            <Alert.Heading><Spinner animation="border" />&nbsp;&nbsp;Posting the following item, please wait..</Alert.Heading>
                            <b>Name : </b>{product_name}<br/>
                            <b>File : </b>{product_fileName}<br/>
                            <b>Price : </b>{product_price}<br/>
                            <b>Category : </b>{product_category}<br/>
                            <b>License : </b>{product_license}<br/>
                            <b>Description : </b>{product_description}<br/>
                        </div>
                    }
                    { post_successully &&
                    <div>
                        <Alert.Heading>Item has been posted successfully. </Alert.Heading><hr/>
                        <p>You can find it on dashboard, pending item list.</p>
                        <p>Notice: all item might take up to 24 hours to be approved.</p>
                        <Button onClick={()=>{history.push("/Dashboard")}} variant="warning">
                            Dashboard
                        </Button>&nbsp;&nbsp;&nbsp;&nbsp;
                        <Button onClick={cancelItem} variant="warning">
                            Post another item
                        </Button>
                    </div>
                    }
                </Alert>

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
                    <Alert show={!posting_item} variant="dark">
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
                            <Form.Label>Upload your file here again, then you are good to go.</Form.Label>
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
                {(!cookies.post_item && !posting_item) &&
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
                                            <option value="Choose...">Choose...</option>
                                            <option value="Notes">Notes</option>
                                            <option value="Video">Video</option>
                                            <option value="Music">Music</option>
                                            <option value="Other">Other</option>
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
                                            <option value="Copyrighted">Copyrighted</option>
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
                                                     onChange={(e) => {
                                                         // this only changes the FileName and File if the file is picked
                                                         // if the user CANCELS the file picker, it will return undefined
                                                         // which is why this is needed
                                                         if (typeof e.currentTarget.files[0] !== 'undefined') {
                                                             formik.setFieldValue("file", e.currentTarget.files[0]);
                                                             setFileName(e.currentTarget.files[0].name);
                                                             setFile(e.currentTarget.files[0])
                                                         } else { // if the user did cancel, reset file field
                                                             formik.setFieldValue("file", null);
                                                             setFileName('Upload File here...');
                                                         }}
                                                     }
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