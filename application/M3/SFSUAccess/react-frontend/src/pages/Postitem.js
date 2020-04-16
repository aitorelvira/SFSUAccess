import React , {useEffect, useState} from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Form, Button, Container, Col } from 'react-bootstrap';
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
  const [fileName, setFileName] = useState("Choose File")
  const [price, setPrice] = useState(0);
  const [license, setLicense] = useState("");
  const [description, setDescription] = useState("");

  useEffect (() => {
     const fetchData = async() =>{
      await axios.get('/api/search').then(response =>{setList(response.data)}).catch(error=>console.log(error));
     }
    fetchData();
  },[]);

  const handleSubmit = (event) => {
    const form = event.currentTarget;
    if(form.checkValidity() === false) {
        event.preventDefault();
        event.stopPropagation();
    }
    setValidated(true);

    //testing
    event.preventDefault();
    console.log(itemName);
    console.log(category);
    console.log(file);
    console.log(price);
    console.log(license);
    console.log(description);
    console.log(list)
  }

  const onChangeFile = (event) => {
    setFile(event.target.files[0]);
    setFileName(event.target.files[0].name);
  }

  return (
    <div>
       <Header/>
    {/* Dash content   */}
    <Container>
      <h3>Post an item</h3><hr/><Col md={{ offset: 2 }}>
        <Form className="postItem" noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Row>
              <Form.Group as={Col} controlId="">
                <Form.Label>Item Name</Form.Label>
                <Form.Control
                    required
                    type="text"
                    onChange = {e => setItemName(e.target.value)}
                    placeholder="Enter item name"
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Category</Form.Label>
                 <Form.Control
                    required
                    onChange = {e => setCategory(e.target.value)}
                    as="select"
                >
                {list.map((x) => {
                    return (
                        <option value={x.product_category_name} key={x.product_category_name}>{x.product_category_name}</option>)
                }).reverse()}

                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group  as={Col} controlId="formGridAddress1">
            <Form.Label>Upload item image</Form.Label>
            <div className="input-group">
              <div className="custom-file">
                <input
                  required
                  onChange = {onChangeFile}
                  type="file"
                  className="custom-file-input"
                  id="inputGroupFile01"
                  aria-describedby="inputGroupFileAddon01"
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  {fileName}
                </label>
              </div>
            </div>
            </Form.Group>
            </Form.Row>

            <Form.Row>

            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Price</Form.Label>
                <Form.Control
                    required
                    type="text"
                    onChange = {e => setPrice(e.target.value)}
                    placeholder="Enter item price"
                />
              </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>License</Form.Label>
                <Form.Control
                    required
                    onChange={e => setLicense(e.target.value)}
                    as="select"
                 >
                      <option value="Choose...">Choose...</option>
                      <option value="Free use & modification">Free use & modification</option>
                      <option value="Free to SFSU related projects">Free to SFSU related projects</option>
                      <option value="For sale">For sale</option>
                  </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Item Description</Form.Label>
              <Form.Control
                required
                onChange = {e => setDescription(e.target.value)}
                as="textarea"
                rows="3"
              />
            </Form.Group>

            <Form.Row >
              <Col>
              <Button variant="warning" type="submit" block>Cancel</Button>
              </Col>
              <Col>
              <Button variant="warning" type="submit" block>Post Item</Button>
              </Col>
            </Form.Row>
        </Form>
        </Col>
    </Container>
    <br/><br/><br/><br/><br/>
    </div>
  );
}

  export default Postitem;




