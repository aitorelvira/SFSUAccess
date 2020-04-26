import React, {useEffect, useState} from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import * as Yup from 'yup';
import { Button, Container, Col } from 'react-bootstrap';
import { Formik, Form, Field, ErrorMessage } from 'formik';

const PostForm = () => {
    const [list, setLists] = useState([]);
    const [cookies, setCookies] = useCookies([]);
    // const [active_item, set_active_item] = useState([]);
    // const [pending_item, set_pending_item] = useState([]);
    // const [admin_pending_item, set_admin_pending_item] = useState([]);
    // const user_privelege_type = cookies.privelege_type;
    // const user_id = cookies.id;
  
    const [validated, setValidated] = useState(false);
    const [product_name, setItemName] = useState('');
    const [product_category, setCategory] = useState('');
    const [product_file, setFile] = useState({});
    const [product_fileName, setFileName] = useState('Upload File here...')
    const [product_price, setPrice] = useState(0);
    const [product_license, setLicense] = useState('');
    const [product_description, setDescription] = useState('');

    useEffect (()=>{
              const fetchData = async() => {
                await axios.get('/api/search').then(response =>{setLists(response.data)}).catch(error=>console.log(error));
              }
            fetchData();
          },[]);

    return(
    <Formik
        initialValues={{item_name: '', item_category: '', file: null, item_price: '', item_license: '', item_description: '' }}
        validationSchema={Yup.object().shape({
            item_name: Yup.string()
                .max(15, 'Must be 15 characters or less')
                .required('Required'),
            item_category: Yup.string()
                .oneOf(['Notes', 'Video', 'Music'])
                .required('Please indicate your category preference'),
            file: Yup.mixed()
                .required('A file is required'),
            price: Yup.number()
                .required("Please enter a price")
                .positive("Must be a position number"),
            item_license: Yup.string()
                .oneOf(['Free use & modification', 'Free to SFSU related projects', 'For sale'])
                .required("Please indicate your license preference"),
            item_description: Yup.string()
                .max(500, 'Must be 500 characters or less')
                .required('Please enter description'),
        })}

        

      onSubmit={(values, { setSubmitting }) => {
        setTimeout(() => {
          alert(JSON.stringify(values, null, 2));
          setSubmitting(false);
        }, 400);
      }}
    >
      { formik  => (
          
        <Form className="postItem" id = "itemform">
        <Form.Row>
            <Form.Group as={Col} controlId="item_name">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                    name="item_name"
                    type="text"
                    placeholder="Enter item name"
                    onChange={(e) => {formik.setFieldValue("item_name", e.currentTarget.value); setItemName(e.currentTarget.value)}}
                />
                {formik.touched.item_name && formik.errors.item_name ? (<div className="error_message">{formik.errors.item_name}</div>) : null}
            </Form.Group>
        </Form.Row>

        <Form.Row>
            <Form.Group as={Col} controlId="item_category">
                <Form.Label>Category</Form.Label>
                    <Form.Control
                        name="item_category"
                        as="select"
                        onChange={(e) => {formik.setFieldValue("item_category", e.currentTarget.value); setCategory(e.currentTarget.value)}}
                    >
                        {list.map((x) => {
                            return (
                                <option value={x.product_category_name} key={x.product_category_name}>{x.product_category_name}</option>)
                            }).reverse()}
                    </Form.Control>
                    {formik.touched.item_category && formik.errors.item_category ? (<div className="error_message">{formik.errors.item_category}</div>) : null}
            </Form.Group>
        </Form.Row>

        {/* <Form.Row>
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
        </Form.Row> */}

        {/* <Form.Row>
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
        </Form.Row> */}

        <Form.Row>
            <Form.Group as={Col} controlId="item_license">
                <Form.Label>License</Form.Label>
                    <Form.Control
                        name="item_license"
                        as="select"
                        onChange={(e) => {formik.setFieldValue("item_license", e.currentTarget.value); setLicense(e.currentTarget.value)}}
                    >
                        <option value="Choose...">Choose...</option>
                        <option value="Free use & modification">Free use & modification</option>
                        <option value="Free to SFSU related projects">Free to SFSU related projects</option>
                        <option value="For sale">For sale</option>
                     </Form.Control>
                    {formik.touched.item_license && formik.errors.item_license ? (<div className="error_message">{formik.errors.item_license}</div>) : null}
            </Form.Group>
        </Form.Row>

        <Form.Group controlId="item_description">
            <Form.Label>Item Description</Form.Label>
                <Form.Control
                    name="item_description"
                    as="textarea"
                    rows="3"
                    onChange={(e) => {formik.setFieldValue("item_description", e.currentTarget.value); setDescription(e.currentTarget.value)}}
                />
                {formik.touched.item_description && formik.errors.item_description ? (<div className="error_message">{formik.errors.item_description}</div>) : null}
        </Form.Group>

        <Form.Row >
            <Col>
                <Button variant="warning" type="reset" block>Cancel</Button>
            </Col>
            <Col>
                <Button variant="warning" type = "submit" block>Post Item</Button>
            </Col>
        </Form.Row>
    </Form>
        // <Form>
        //   <Field type="email" name="email" />
        //   <ErrorMessage name="email" component="div" />
        //   <Field type="password" name="password" />
        //   <ErrorMessage name="password" component="div" />
        //   <button type="submit" disabled={isSubmitting}>
        //     Submit
        //   </button>
        // </Form>
      )}
    </Formik>
)};

export default PostForm;