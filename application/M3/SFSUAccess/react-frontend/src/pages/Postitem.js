import React , {useEffect, useState} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { Form, Button, Container, Col, Tabs, Tab } from 'react-bootstrap';
import '../css/Dashboard.css';
import Header from '../components/Header';

const Postitem = () => {
    const [cookies, setCookies] = useCookies(['first_name']);
    const username = cookies.first_name;
    const [list, setList] = useState([]);
    const [validated, setValidated] = useState(false);
    const [itemName, setItemName] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState({});
    const [fileName, setFileName] = useState("Upload File here...")
    const [price, setPrice] = useState(0);
    const [license, setLicense] = useState("");
    const [description, setDescription] = useState("");

    useEffect (() => {
       const fetchData = async() =>{
        await axios.get('/api/search').then(response =>{setList(response.data)}).catch(error=>console.log(error));
       }
      fetchData();
    },[]);

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
                  .required('Item name is required'),
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
                  .max(100, 'Must be 500 characters or less')
                  .required('Please enter description'),
          })}

          onSubmit={(values, {setSubmitting}) => {

                 console.log(itemName);
                 console.log(category);
                 console.log(file);
                 console.log(price);
                 console.log(license);
                 console.log(description);

                //Put all information in formData for api call.
                var formData = new FormData();
                formData.append('product_name', itemName);
                formData.append('product_category', category);
                formData.append('product_file', file);
                formData.append('product_price', price);
                formData.append('product_license', license);
                formData.append('product_description', description);

                axios.post('/api/product',formData)
                  .then((response) =>{
                    console.log("Item posted successfully");
//                    get_pendingItem();
                  })
                  .catch((error) => console.log(error))
          }}
      >
         {formik => (
              <div>
                  <Header/>
                  {/* Dash content   */}
                  <Container>
                      <h3>Post an item</h3>
                      <hr/>
                      <Col md={{ offset: 2 }}>
                          <form className="postItem" onSubmit={formik.handleSubmit} id="itemForm">
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
                                                      onChange={(e) => {formik.setFieldValue("file", e.currentTarget.files[0]); setFileName(e.currentTarget.files[0].name)}}
                                                  />
                                                  <label className="custom-file-label" htmlFor="inputGroupFile01">
                                                      {fileName}
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
                                      <Button variant="warning" onClick = {resetForm} block>Reset</Button>
                                  </Col>
                                  <Col>
                                      <Button variant="warning" type="submit" block>Post Item</Button>
                                  </Col>
                              </Form.Row>
                          </form>
                      </Col>
                  </Container>
                  <br/><br/><br/><br/><br/>
              </div>
          )}
      </Formik>
      );
 };
export default Postitem;