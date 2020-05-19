//PURPOSE: This page is used to show an selected item detail information.
//         User should able to do the following:
//          1. to view all the details information about this item.
//          2. to send a message to the seller.
//          3. to view the original image by clicking the thumbnail.
//AUTHOR: JunMin Li
import React, {useState, useEffect}from 'react';
import { useCookies } from 'react-cookie';
import { useHistory} from "react-router-dom";
import { Formik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import Header from '../components/Header';
import { Container, Row, Col, Figure, Button, Form } from 'react-bootstrap';
import '../css/ItemDetail.css'
import ReactGA from "react-ga";

const ItemDetail = () => {

    const [cookies, setCookies] = useCookies(['first_name', 'product_id', 'id']);
    const [username, setUsername] = useState('');
    const [id, setId] = useState('')
    const [imgURL, setURL] = useState('');
    const user_isloggedin = cookies.isLoggedin;
    const productID = cookies.product_id;
    const userID = cookies.id;
    const history = useHistory();

    const [product_name, setName] = useState('');
    const [product_author, setAuthor] = useState('');
    const [product_description, setDescription] = useState('');
    const [product_license, setLicense] = useState('');
    const [product_category, setCategory] = useState('');
    const [product_price, setPrice] = useState('');
    const [product_author_id, setAuthorID] = useState('');

    const [message, setMessage] = useState('');

    useEffect (()=>{
        if(typeof cookies.first_name !== 'undefined')
        setUsername(cookies.first_name);
        setId(window.location.search.substr(8));

        if(id){
        axios.get('/api/product/' + id)
            .then(response => {
                setName(response.data[0].product_name);
                setAuthor(response.data[0].product_author);
                setDescription(response.data[0].product_description);
                setCategory(response.data[0].product_category);
                setLicense(response.data[0].product_license);
                setAuthorID(response.data[0].registered_user_id);
                setPrice(response.data[0].price);
         }).catch((error) => { // send 404 if user tries to access an item that does not exist
             window.open(/404/, "_self", true)
        });
        setURL('/api/thumbnails/' + id);
        }
       },[cookies.first_name, id, username]);



    const open_originalImage = () =>{
        console.log("open original image: " + imgURL)
        window.open(imgURL);
    }

    const downloadItem = () =>{
    axios.get('/api/uploads/' + id, { responseType:'blob'})
    .then((response)=> {
        const file = new Blob([response.data]);
        let file_type = response.data.type;
        let pos = file_type.lastIndexOf("/");
        let slice_index = pos - file_type.length + 1;

        file_type = file_type.slice(slice_index)

        const url = window.URL.createObjectURL(file);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', product_name + '.' + file_type);
        document.body.appendChild(link);
        link.click();
        ReactGA.event({
             category: 'Download',
             action: 'Item Download',
             label: 'Download item: ' + product_name,
             transport: 'beacon'
            });
    })
    }

  return (
    <Formik
        initialValues={{message: ''}}
        validationSchema={Yup.object({
            message: Yup.string()
                .max(120, 'Must be 120 character or less')
                .required('Message is required'),
        })}
        onSubmit={(values, {setSubmitting}) => {
            const sender_user_id = userID;
            const recipient_user_id = product_author_id;
            const message_contents = values['message'];
            const product_id = productID;

            axios.post('/api/messages/new',{
                sender_user_id,
                recipient_user_id,
                message_contents,
                product_id
            })
            .then(res => {
                if(res.status === 200){
                    ReactGA.event({
                     category: 'Messaging',
                     action: 'User Messaged Seller',
                     label: 'Product name: ' + product_name + '. From ' + sender_user_id + ' to ' + recipient_user_id,
                     transport: 'beacon'
                    });
                    //take user back to home page after sending the message
                    setTimeout(function(){ window.location.href='/' },1000);
                }
            })
            setSubmitting(false);

        }}
    >
    {formik => (
        <div>
            <Header/><br/>
            <Container>
                <Row>
                    <Col md={{ span: 5, offset: 1 }}>
                        <Figure>
                        <Figure.Image  className="image" src = {imgURL}  onClick = {(e) =>{open_originalImage()}}/>
                        </Figure>
                    </Col><Col>
                        <Figure.Caption className="description">
                            <div><b>{product_name}</b></div>
                            <div>by: &nbsp;&nbsp;{product_author}</div>
                            <div>Category: &nbsp;&nbsp;{product_category}</div>
                            <div>License:&nbsp;&nbsp;{product_license}</div>
                            <div>Price:&nbsp;&nbsp;{product_price == '0'? "Free" : product_price}</div>
                            <div>Description: &nbsp;&nbsp;{product_description}</div><hr/>
                            {!user_isloggedin && (product_price == '0') &&(
                                <div><b>This item is free for registered users. <a href={'/signup'}>Signup now</a>!</b></div>
                            )}
                            <br/>
                            {user_isloggedin &&(
                                <div>{product_price == '0'? <Button onClick ={(e) => downloadItem()}> Free download</Button> : ''}</div>
                            )}
                        </Figure.Caption>
                        <br/>
                        {!user_isloggedin && (
                            <div>{!product_price == '0'? <Button onClick={()=>{history.push("/SignIn")}} variant="warning">
                                Contact Seller
                            </Button> : ''}</div>
                        )}
                    </Col>
                </Row>

                <br/>
                {user_isloggedin && (userID != product_author_id) &&(
                    <Row>
                        <Col md={{ span: 5, offset: 1 }}>
                            <Form className="message_form" onSubmit={formik.handleSubmit}>
                                <Form.Row>
                                    <Form.Group as={Col}>
                                        <Form.Label>Message</Form.Label>
                                            <Form.Control
                                                name="message"
                                                as="textarea"
                                                className="textarea"
                                                placeholder="Enter message here..."
                                                onFocus={(e) => {e.currentTarget.placeholder=""}}
                                                onBlur={(e) => {e.currentTarget.placeholder="Enter message here..."}}
                                                onChange={(e) => {formik.setFieldValue("message", e.currentTarget.value); setMessage(e.currentTarget.value)}}
                                         />
                                        {formik.touched.message && formik.errors.message ? (<div className="error_message">{formik.errors.message}</div>) : null}
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Button variant="warning" type="submit">  &nbsp;&nbsp;Send &nbsp;&nbsp;</Button>
                                </Form.Row>
                            </Form>
                        </Col>
                    </Row>
                )}
                <br/><br/><br/><br/><br/>
            </Container>
        </div>
    )}
   </Formik>
  );
};

export default ItemDetail;
