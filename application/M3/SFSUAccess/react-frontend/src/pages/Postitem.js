import React , {useEffect} from 'react';
import { useCookies } from 'react-cookie';
import { Form, Button, Container, Col } from 'react-bootstrap';
import '../css/Dashboard.css';
import Header from '../components/Header';


const Postitem = () => {
  const [cookies, setCookies] = useCookies(['first_name']);
  const username = cookies.first_name;

  return (
    <div>
    <Header/>
    {/* Dash content   */}
    <Container>
      <h3>Post an item</h3><hr/><Col md={{ offset: 2 }}>
        <Form className="postItem">
            <Form.Row>
              <Form.Group as={Col} controlId="">
                <Form.Label>Item Name</Form.Label>
                <Form.Control placeholder="Enter item name" />
              </Form.Group>
            </Form.Row>

            <Form.Row>            
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Category</Form.Label>
                <Form.Control as="select" value="Choose...">
                  <option>Choose...</option>
                  <option>...</option>
                </Form.Control>
              </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group  as={Col} controlId="formGridAddress1">
            <Form.Label>Upload item image</Form.Label>
            <div className="input-group">
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  id="inputGroupFile01"
                  aria-describedby="inputGroupFileAddon01"
                />
                <label className="custom-file-label" htmlFor="inputGroupFile01">
                  Choose file
                </label>
              </div>
            </div>
            </Form.Group>
            </Form.Row>

            <Form.Row>
              
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Price</Form.Label>
                <Form.Control placeholder="Enter item price" />
              </Form.Group>
            </Form.Row>

            <Form.Row>
            <Form.Group as={Col} controlId="formGridState">
                <Form.Label>License</Form.Label>
                <Form.Control placeholder="Enter item price" />
              </Form.Group>
            </Form.Row>

            <Form.Group controlId="exampleForm.ControlTextarea1">
              <Form.Label>Item Description</Form.Label>
              <Form.Control as="textarea" rows="3" />
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




