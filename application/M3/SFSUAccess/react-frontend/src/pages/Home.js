//PURPOSE: This is the home page of our app.
//AUTHOR: JunMin Li
import React,{useState, useEffect}from 'react';
import { useCookies } from 'react-cookie';
import { Formik } from 'formik';
import * as Yup from 'yup';
import ReactGA from "react-ga";
import axios from 'axios';
import { Nav, NavItem, Container, Card, CardBody, CardTitle, CardText} from 'reactstrap';
import { Navbar, Button, Col, Row, Form } from 'react-bootstrap';
import { Switch, Route } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import { connect } from 'react-redux';
import {setNotes, setSearchInfo, setNotes_perpage, setShow_number_of_items} from '../redux/actions/notesActions.js';
import {setUsername} from '../redux/actions/userActions.js';
import Content from './Content';
import Notice from '../components/Notice';
import '../css/Home.css';

const Home = ({ dispatch, username, searchinfo}) => {
  const item_perpage = 8;
  const [lists, setList] = useState([]);                   // The list of categroies.
  const [product_name, setProduct_name] = useState('');    // user input for searching.
  const [cookies, setCookies, removeCookies] = useCookies(['id', 'email','first_name','last_name','privelege_type']);

  const [notes_list, set_notes_list] = useState([]);      //default page arrays for three categories.
  const [video_list, set_video_list] = useState([]);
  const [music_list, set_music_list] = useState([]);

//Loading the init categories from the db to the Nav bar and dropdowns and three categories arrays.
  useEffect (()=>{
    const fetchData = async() =>{
      await axios.get('/api/search').then(response =>{setList(response.data)}).catch(error=>console.log(error));
      await axios.get('/api/search/video').then(response =>{set_video_list(response.data)}).catch(error=>console.log(error));
      await axios.get('/api/search/music').then(response =>{set_music_list(response.data)}).catch(error=>console.log(error));
      await axios.get('/api/search/notes').then(response =>{set_notes_list(response.data)}).catch(error=>console.log(error));
    }
    dispatch(setUsername(cookies.first_name));
    fetchData();
  },[dispatch, cookies.first_name]);


  //Search funtion for Navbar buttons, return items in that category.
  const search_by_category = (e) =>{
   let category = e.target.id
   axios.get('/api/search/'+ category)
   .then(response => {
      getRange_last(response.data);
      dispatch(setSearchInfo(category + '  Category. '));
  })
  }

  //Helper function to format the search result.
  const getRange_last = (data) =>{
    let last;
    dispatch(setNotes(data));           // All the items
    dispatch(setNotes_perpage(data));   // Itmes shown per page.
    if(item_perpage > data.length)
      last = data.length;
    else
      last = item_perpage;
    dispatch(setShow_number_of_items('Showing ' + 1 + '-' + last + ' out of ' + data.length + '.')); // Showing 1-4 out of 5..
    return last;
  }

  // Use to log out. Clear the cookies and redux value.
  const logOut =()=>{
    removeCookies('first_name');
    removeCookies('last_name');
    removeCookies('id');
    removeCookies('email');
    removeCookies('privelege_type');
    removeCookies('isLoggedin');
    removeCookies('post_item');
    ReactGA.event({
     category: 'LogOut',
     action: 'User Logged Out',
     transport: 'beacon'
    });
    ReactGA.initialize('UA-163580713-1'); // reinitialize GA on log out to reset clientId
    dispatch(setUsername(''));
  }

  //Use to redirecting to item detail page with an item id.
  const goItemDetail =(id) => {
       window.open("/ItemDetail?itemId=" + id);

  };

  //Formatting the item posted date on the card
  const formatDate =(dateString)=>{
    return dateString.replace('GMT','')
  }

  return (
    <Formik
        initialValues={{searchItem: ''}}
        validationSchema={Yup.object({
            searchItem: Yup.string()
                .max(40, 'Must be 40 character or less.')
                .required('Please enter term to search.'),
        })}

        onSubmit={(values, {setSubmitting, setErrors}) => {

            // getting the category input from the dropdown menu
            let select = document.getElementById("category");
            let index = select.selectedIndex;
            let category = select.options[index].value;

            if(product_name){    // search by category + searchKey
              const body = {
                product_name : product_name.toLowerCase()
            }
            ReactGA.event({
             category: 'Search',
             action: 'Search Submit',
             label: 'Category: ' + category + '. SearchKey: ' + product_name,
             transport: 'beacon'
            });
              axios.post('/api/search/' + category,body)
              .then((response) => {
                // If nothing was found , return items in the same category.
                if(!response.data.length){
                  console.log("Category: " + category + ". SearchKey: " + product_name);
                  axios.get('/api/search/'+ category)
                    .then(response => {
                       getRange_last(response.data);
                       if(category === "All"){
                           dispatch(setSearchInfo('Here are all items listed. '));
                           setErrors({searchItem: 'Nothing found with search key:  \'' + category +'\' and \'' + product_name + '\'.'})
                       } else {
                           dispatch(setSearchInfo('Here are items in the same category.'));
                           setErrors({searchItem: 'Nothing found with search key:  \'' + category +'\' and \'' + product_name + '\'.'})
                       }
                    })
                }
                else{ // If something was found, return items.
                   console.log("Something found in Category: " + category + ". SearchKey: " + product_name);
                   getRange_last(response.data);
                   dispatch(setSearchInfo('   Results with search key:   \'' + category + '\' ,\' ' + product_name + '\'. '));
                }
              })
              .catch(error => console.log(error))
            }
            else{ // search by category + '' as searchKey, return items in that category.
              console.log("Category: " + category +". SearchKey: Null" )
              axios.get('/api/search/'+ category)
                .then(response => {
                  getRange_last(response.data);
                  dispatch(setSearchInfo('   Search results for:   ' + category + '. ' ));
              })
            }
        }}
    >
        {formik => (
            <div>
                <Navbar bg="dark" variant="dark" className="navbar"><Notice/></Navbar>
                {/* Navbar section  */}
                <Navbar bg="dark" variant="dark" className="navbar">
                    <Navbar.Brand  href="/" className="navLogo">SFSUAccess</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Form onSubmit={formik.handleSubmit}>
                            <Form.Row>
                                <Form.Group>
                                    <select id="category">
                                        {lists.map((x) => {
                                            return (
                                                <option value={x.product_category_name} key={x.product_category_name}>{x.product_category_name}</option>)
                                        }).reverse()}
                                    </select>&nbsp;
                                </Form.Group>
                                <Form.Group>
                                    <input
                                        className="searchBar"
                                        id ="searchItem"
                                        placeholder="Enter item name.."
                                        onChange={(e) => {formik.setFieldValue("searchItem", e.target.value.replace(/[^a-z0-9\s']+/ig,"")); setProduct_name(e.target.value.replace(/[^a-z0-9\s']+/ig,""))}}
                                    />&nbsp;&nbsp;
                                    {formik.touched.searchItem && formik.errors.searchItem ? (<div className="error_message">{formik.errors.searchItem}</div>) : null}
                                </Form.Group>
                                <Form.Group>
                                    <Button variant="warning" size="sm" type="submit">Search</Button> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    <Button variant="warning" size="sm" href="/Postitem">Upload File</Button>&nbsp;&nbsp;
                                </Form.Group>
                            </Form.Row>
                        </Form>

                            <Navbar.Collapse className="justify-content-end">
                                {/* Display signIn, signUp, signOut buttons according to the user status */}
                                {!username &&(
                                      <div>
                                        <Button variant="warning" size="sm" href="/SignIn">&nbsp;&nbsp;Login&nbsp;&nbsp;</Button>&nbsp;&nbsp;
                                        <Button variant="warning" size="sm" href="/SignUp">Sign up</Button>
                                      </div>
                                )}
                                {username &&(
                                  <div>
                                    {'Welcome, '+ username + '   '}&nbsp;&nbsp;
                                    <Button variant="warning" size="sm" href = "/Dashboard">My dashboard</Button>&nbsp;&nbsp;
                                    <Button variant="warning" size="sm" onClick ={logOut}>Log out</Button>
                                  </div>
                                )}
                            </Navbar.Collapse>
                        </Navbar.Collapse>
                    </Navbar>

                        <Navbar  bg="dark" variant="dark">
                            <Navbar.Brand className="navLogo"></Navbar.Brand>
                            <Navbar.Toggle aria-controls="basic-navbar-nav" />
                            <Navbar.Collapse id="basic-navbar-nav">
                                <Nav>
                                    {lists.map((x) => {
                                      if(x.product_category_name !== 'All'){
                                       return (
                                          <NavItem title="Category" key = {x.product_category_name}>
                                            <button className ="navButton" value = {x.product_category_name} id ={x.product_category_name}
                                            onClick ={search_by_category}>{x.product_category_name} </button>
                                          </NavItem>
                                        )}
                                        else
                                          return('');
                                      }).reverse()
                                    }
                                    <NavItem><a href = "/About"><button className ="navButton">About us</button></a></NavItem>
                                </Nav>
                            </Navbar.Collapse>
                        </Navbar>
                        <br/>
                        {/* Navbar end here     */}

                        {/* Here is the default content page */}
                        {!searchinfo && (
                            <Container>
                                <div>Latest items in each category</div><hr/>
                                <div>Notes category</div><br/>
                                <Row>{
                                    notes_list.map((x,item_number) => {
                                        if(item_number < item_perpage){ // initialized how many items per page.
                                            return(
                                                 <Col  sm="3" key={item_number} >
                                                     <Card id = {x.id} onClick = {e => goItemDetail(x.id)}  border="light" className = "card_div">
                                                        <Image src="https://www.w3schools.com/html/img_chania.jpg" className="thumbnails"/>
                                                        <CardBody>
                                                            <CardTitle className="card_text">{x.product_name}</CardTitle>
                                                            <CardText className="card_user">by&nbsp;{x.product_author}</CardText>
                                                            <CardText className="card_date">{ formatDate(x.date_time_added)}</CardText>
                                                        </CardBody>
                                                     </Card>
                                                 </Col>
                                            )}
                                        else
                                            return('');
                                    })}
                                </Row><hr/>

                                <div>Video category</div><br/>
                                    <Row>{
                                        video_list.map((x,item_number) => {
                                            if(item_number < item_perpage){ // initialized how many items per page.
                                                return(
                                                  <Col  sm="3" key={item_number} >
                                                      <Card id = {x.id} onClick = {e => goItemDetail(x.id)}  border="light" className = "card_div">
                                                        <Image src="https://www.w3schools.com/html/img_chania.jpg" className="thumbnails"/>
                                                        <CardBody>
                                                        <CardTitle className="card_text">{x.product_name}</CardTitle>
                                                        <CardText className="card_user">by&nbsp;{x.product_author}</CardText>
                                                        <CardText className="card_date">{formatDate(x.date_time_added)}</CardText>
                                                        </CardBody>
                                                      </Card>
                                                  </Col>
                                                )}
                                            else
                                                return('');
                                        })}
                                    </Row><hr/>

                                <div>Music category</div><br/>
                                <Row>{
                                    music_list.map((x,item_number) => {
                                        if(item_number < item_perpage){ // initialized how many items per page.
                                            return(
                                                 <Col  sm="3" key={item_number} >
                                                    <Card id = {x.id} onClick = {e => goItemDetail(x.id)}  border="light" className = "card_div">
                                                        <Image src="http://hdwpro.com/wp-content/uploads/2015/12/Widescreen-Image.jpg" className="thumbnails"/>
                                                        <CardBody>
                                                            <CardTitle className="card_text">{x.product_name}</CardTitle>
                                                            <CardText className="card_user">by&nbsp;{x.product_author}</CardText>
                                                            <CardText className="card_date">{formatDate(x.date_time_added)}</CardText>
                                                        </CardBody>
                                                    </Card>
                                                 </Col>
                                            )}
                                        else
                                            return('');
                                    })}
                                </Row>
                            </Container>
                        )}
                        {/* End of the default content page */}
                        <Switch>
                            <Route path ="/" component = {Content}/>
                        </Switch>
            </div>
        )}
    </Formik>
  );
};

const mapStateToProps = state => ({
  username: state.userReducer.username,
  list: state.userReducer.list,
  notes: state.notesReducer.notes,
  searchinfo: state.notesReducer.searchinfo,
})
export default connect(mapStateToProps)(Home);


