import React,{useState, useEffect}from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Nav, NavItem, Container, Card, CardBody, CardTitle, CardText } from 'reactstrap';
import { Navbar, Button, Col, Row } from 'react-bootstrap';
import { Switch, Route } from "react-router-dom";
import Image from 'react-bootstrap/Image';
import { connect } from 'react-redux';
import {setNotes, setSearchInfo, setNotes_perpage, setShow_number_of_items} from '../redux/actions/notesActions.js';
import {setUsername} from '../redux/actions/userActions.js';
import Content from './Content';
import Notice from '../components/Notice';
import Footer from '../components/Footer';
import '../css/Home.css';


const Home = ({ dispatch, username, searchinfo}) => {
  const[lists, setList] = useState([]);                   // The list of categroies.
  const[product_name, setProduct_name] = useState('');    // user input for searching.
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
 
//Main Search function for Navbar search section
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

  // Use to log out. Clear the cookies and redux value.
  const logOut =()=>{
    removeCookies('first_name');
    removeCookies('last_name');
    removeCookies('id');
    removeCookies('email');
    removeCookies('privelege_type');
    dispatch(setUsername('')); 
  }



  //Use to redirecting to item detail page with an item id.
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
            <Button variant="warning" href = "/Dashboard">My Dashboard</Button>&nbsp;&nbsp;
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
    {/* Here is the default content page */}
    {!searchinfo && (
    <Container>
      <div>Lastest items</div><br/>
      <div>Notes category</div><hr/>
      <Row>{
        notes_list.map((x,item_number) => {  
          if(item_number < 4){ // initialized how many items per page. 
            return(
              <Col  sm="3" key={item_number} className = "card_div">
              <Card id = {x.id} onClick = {e => goItemDetail(x.id)}  border="light">
                <Image src="https://helpx.adobe.com/content/dam/help/en/photoshop/how-to/compositing/_jcr_content/main-pars/image/compositing_1408x792.jpg" thumbnail/>
                <CardBody>
                <CardTitle className="card_text">{x.product_name}__Here is the product_name section. Added more chars to test the css.</CardTitle>
                <CardText className="card_user">by&nbsp;{x.product_author}</CardText>
                <CardText className="card_date">04/14/20</CardText>
                </CardBody>
            </Card>
            </Col> 
            )}
          else
            return('');
      })} 
      </Row>
      
      <div>Video category</div><hr/>
      <Row>{
        video_list.map((x,item_number) => {  
          if(item_number < 4){ // initialized how many items per page. 
            return(
              <Col  sm="3" key={item_number} className = "card_div">
              <Card id = {x.id} onClick = {e => goItemDetail(x.id)}  border="light">
                <Image src="http://www.wallpaperback.net/wp-content/uploads/2018/06/Stock%20Images%20love%20image,%20heart,%20HD,%20island,%20ocean,%20Stock%20Images%20706144221-1024x576.jpg" thumbnail/>
                <CardBody>
                <CardTitle className="card_text">{x.product_name}__Here is the product_name section. Added more chars to test the css.</CardTitle>
                <CardText className="card_user">by&nbsp;{x.product_author}</CardText>
                <CardText className="card_date">04/14/20</CardText>
                </CardBody>
            </Card>
            </Col> 
            )}
          else
            return('');
        })} 
      </Row>
      <div>Music category</div><hr/>
      <Row>{
        music_list.map((x,item_number) => {  
          if(item_number < 4){ // initialized how many items per page. 
            return(
              <Col  sm="3" key={item_number} className = "card_div">
              <Card id = {x.id} onClick = {e => goItemDetail(x.id)}  border="light">
                <Image src="http://hdwpro.com/wp-content/uploads/2015/12/Widescreen-Image.jpg" thumbnail/>  
                <CardBody>
                <CardTitle className="card_text">{x.product_name}__Here is the product_name section. Added more chars to test the css.</CardTitle>
                <CardText className="card_user">by&nbsp;{x.product_author}</CardText>
                <CardText className="card_date">04/14/20</CardText>
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
    <Footer/>
    </div>
  );
};


const mapStateToProps = state => ({
  username: state.userReducer.username,
  list: state.userReducer.list,
  notes: state.notesReducer.notes,
  searchinfo: state.notesReducer.searchinfo,
})
export default connect(mapStateToProps)(Home);