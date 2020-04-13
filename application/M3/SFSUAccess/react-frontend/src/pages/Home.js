import React,{useState, useEffect}from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Nav, NavItem, Container } from 'reactstrap';
import { Navbar, Button, Col, Row } from 'react-bootstrap';
import { Switch, Route } from "react-router-dom";
import Footer from '../components/Footer'
import { connect } from 'react-redux';
import {setNotes, setSearchInfo, setNotes_perpage, setShow_number_of_items} from '../redux/actions/notesActions.js';
import {setUsername} from '../redux/actions/userActions.js';
import Content from './Content';
import Notice from '../components/Notice';
import {
  Card, CardBody,
  CardTitle, CardSubtitle
} from 'reactstrap';
import '../css/Home.css';


const Home = ({ dispatch, username, searchinfo}) => {
  const[lists, setList] = useState([]);             // The list of categroies
  const[product_name, setProduct_name] = useState('');    // user input for searching
  const[cookies, setCookies] = useCookies(['username']);

  const [notes_list, set_notes_list] = useState([]);
  const [video_list, set_video_list] = useState([]);
  const [music_list, set_music_list] = useState([]);
  

//Loading the init categories from the db to the Nav bar and dropdowns.
  useEffect (()=>{
    const fetchData = async() =>{
      const category = await axios.get('/api/search');
      const video = await axios.get('/api/search/video');
      const music = await axios.get('/api/search/music');
      const note  = await axios.get('/api/search/notes');
           
      set_notes_list(note.data);
      set_video_list(video.data);
      set_music_list(music.data);
      setList(category.data);  
    }
    dispatch(setUsername(cookies.username));
    fetchData();
  },[dispatch, cookies.username]);  
 
//Search function for Navbar search section
const submitSearch = ()=> {
    // getting the category input from the dropdown menu
    let select = document.getElementById("category");
    let index = select.selectedIndex;
    let category = select.options[index].value;

    if(product_name){    // search by category + searchKey
      const body = {
        product_name : product_name.toLowerCase()
    }
      axios.post('/api/search/' + category,body)
      .then((response) => {
        
        // If nothing was found , return items in the same category. 
        if(!response.data.length){
          console.log("Category: " + category + ". SearchKey: " + product_name);
          axios.get('/api/search/'+ category)
            .then(response => {
               getRange_last(response.data);
               dispatch(setSearchInfo('Nothing found with search key:  \'' + category + '\' and \'' + product_name + '\'. Here are items in the same cateory. '));
            })
        }     
        else{ // If something was found, return items.
           console.log("Something found in Category: " + category + ". SearchKey: " + product_name);
           getRange_last(response.data);
           dispatch(setSearchInfo('   Results with search key:   \'' + category + '\' ,\' ' + product_name + '\'. '));
        }
      })
      .catch(error => console.log("error: " + error))
    }
    else{ // search by category + '' as searchKey, return items in that category.
      console.log("Category: " + category +". SearchKey: Null" )
      axios.get('/api/search/'+ category)
        .then(response => {
          getRange_last(response.data);
          dispatch(setSearchInfo('   Search results for:   ' + category + '. ' ));
       })
    }
  }

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
    if(4 > data.length)
      last = data.length;
    else
      last =4;
    dispatch(setShow_number_of_items('Showing ' + 1 + '-' + last + ' out of ' + data.length + '.')); // Showing 1-4 out of 5..
    return last;
  }

  const logOut =()=>{
    setCookies('username', '');
    dispatch(setUsername(cookies.username)); 
  }

  const goItemDetail =(id) => {
    window.open("/ItemDetail?itemId=" + id);
  };
      
  return (  
    <div>
    {/* Navbar section  */}
    
      <Navbar bg="dark" variant="dark" className="navbar">
      <Navbar.Brand>SFSUAccess</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">

          <select id="category" >
          {lists.map((x) => {
            return (
                <option value={x.product_category_name} key={x.product_category_name}>{x.product_category_name}</option>)
                }).reverse()}
          </select>&nbsp;
          <input className="searchBar" id ="searchItem" placeholder="Enter item name.." onChange={(e)=>setProduct_name(e.target.value)} />&nbsp;&nbsp;
          <Button variant="warning" onClick ={submitSearch}>Search</Button> &nbsp;&nbsp;
          <Button variant="warning" href="/Postitem">Post an item</Button>&nbsp;&nbsp;         
        
        <Navbar.Collapse className="justify-content-end">       
        
        {/* Display signIn, signUp, signOut buttons according to the user status */}
        {!username &&(
          <div>
            <Button variant="warning" href="/SignIn">&nbsp;&nbsp;Login&nbsp;&nbsp;</Button>&nbsp;&nbsp;
            <Button variant="warning" href="/SignUp">Sign up</Button>
          </div>
         )}  
        {username &&(
          <div>             
            {'Welcome, '+ username + '   '}&nbsp;&nbsp;
            <Button variant="warning" href="/Dashboard">My Dashboard</Button>&nbsp;&nbsp;
            <Button variant="warning" onClick ={logOut}>Log out</Button>
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
          <NavItem><a href="/"><button className ="navButton">Home</button></a></NavItem>     
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

    {/* Navbar end here     */}

    <Notice/>

    {!searchinfo && (
    <Container>
      <Nav bg="light">Notes Category</Nav><br/>
      <Row>{
        notes_list.map((x,item_number) => {  
          if(item_number < 4){ // initialized how many items per page. 
            return(
              <Col  sm="3" key={item_number} className = "carddiv">
              <Card id = {x.id} onClick = {e => goItemDetail(x.id)}  border="light">
                <img  src="https://www.w3schools.com/html/img_chania.jpg" alt ="img" className="thumbnails"/>
                  <CardBody>
                  <CardTitle className="title">{x.product_name}</CardTitle>
                  <CardSubtitle>{x.product_author}</CardSubtitle><br/>
                  </CardBody>
            </Card>
            </Col> 
            )}
          else
            return('');
      })} 
      </Row>
      <Nav bg="light">Video Category</Nav><br/>
      <Row>{
        video_list.map((x,item_number) => {  
          if(item_number < 4){ // initialized how many items per page. 
            return(
              <Col  sm="3" key={item_number} className = "carddiv">
              <Card id = {x.id} onClick = {e => goItemDetail(x.id)}  border="light">
                <img  src="https://www.w3schools.com/html/img_chania.jpg" alt ="img" className="thumbnails"/>
                  <CardBody>
                  <CardTitle className="title">{x.product_name}</CardTitle>
                  <CardSubtitle>{x.product_author}</CardSubtitle><br/>
                  </CardBody>
            </Card>
            </Col> 
            )}
          else
            return('');
        })} 
      </Row>
      <Nav bg="light">Music Category</Nav><br/>
      <Row>{
        music_list.map((x,item_number) => {  
          if(item_number < 4){ // initialized how many items per page. 
            return(
              <Col  sm="3" key={item_number} className = "carddiv">
              <Card id = {x.id} onClick = {e => goItemDetail(x.id)}  border="light">
                <img  src="https://www.w3schools.com/html/img_chania.jpg" alt ="img" className="thumbnails"/>
                  <CardBody>
                  <CardTitle className="title">{x.product_name}</CardTitle>
                  <CardSubtitle>{x.product_author}</CardSubtitle><br/>
                  </CardBody>
            </Card>
            </Col> 
            )}
          else
            return('');
        })} 
      </Row>
    
    
    
    </Container>
    )  
    }


    <Switch>
        <Route path ="/" component = {Content}/> 
    </Switch>
    
    <Footer/>
    </div>
  );
};


const mapStateToProps = state => ({
  isLoggedIn: state.userReducer.isLoggedIn,
  username: state.userReducer.username,
  list: state.userReducer.list,
  notes: state.notesReducer.notes,
  searchinfo: state.notesReducer.searchinfo,

})
export default connect(mapStateToProps)(Home);