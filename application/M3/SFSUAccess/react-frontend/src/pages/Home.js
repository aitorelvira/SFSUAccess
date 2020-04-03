import React,{useState, useEffect}from 'react';
import axios from 'axios';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Navbar, Form, FormControl,DropdownButton,Button, Jumbotron,  NavDropdown, Col} from 'react-bootstrap';
import { Switch, Route, Link } from "react-router-dom";
import Footer from '../components/Footer'
import { connect } from 'react-redux';
import {setNotes, setSearchInfo} from '../redux/actions/notesActions.js';
import {setUsername, setIsLoggedIn} from '../redux/actions/userActions.js';
import Content from './Content';
import '../css/Home.css';





const Home = ({dispatch, searchinfo, username, isLoggedIn}) => {
  const[lists, setList] = useState([]);             // The list of categroies
  const[searchKey, setSearchKey] = useState('');    // user input for searching

//Loading the init categories from the db   
  useEffect (()=>{
    axios.get('/api/search')
        .then(response => {         
         setList(response.data);  
     });
  },[]);

//Search function for Navbar search section
const submitSearch = ()=> {
    // getting the category input from the dropdown menu
    let select = document.getElementById("category");
    let index = select.selectedIndex;
    let userSelection = select.options[index].value;

    if(searchKey){    // search by category + searchKey
      axios.get('/api/search/'+ userSelection,{
        params:{
          product_name: searchKey.toLowerCase()
        }
      })
      .then(response => {
        dispatch(setNotes(response.data))
        if(!response.data.length){
         dispatch( setSearchInfo('Nothing found with search key:  \'' + userSelection + '\' and \'' + searchKey + '\'. Here are items in the same cateory.'));
          axios.get('/api/search/'+ userSelection)
            .then(response => {
            dispatch(setNotes(response.data))
          })
        }
        else{
          dispatch(setSearchInfo('   Results with search key:   \'' + userSelection + '\' ,\' ' + searchKey + '\'. ' + response.data.length + ' items found.'));
        }
      })
    }
    else{         // search by category only
      axios.get('/api/search/'+ userSelection)
        .then(response => {
          dispatch(setNotes(response.data))
        })
        dispatch(setSearchInfo('   Search results for:   ' + userSelection));
    }
    // setSearchKey('');
    // document.getElementById("searchItem").value = '';
  }

  //Search funtion for Navbar buttons
  const search_by_category = (e) =>{
   let page = e.target.id
   axios.get('/api/search/'+ page)
   .then(response => {
    dispatch(setNotes(response.data));
   })
   dispatch(setSearchInfo(page + '  Category.'));
  }

  
  
  return (  
    <div>
    {/* Navbar section  */}
    <div className="navBar">
      <div className="navLogo">SFSUAccess</div>
      <div className="navbarcenten">
          <div className="searchSection">
          <select id="category" >
          {lists.map((x) => {
            return (
                <option value={x.product_category_name} key={x.product_category_name}>{x.product_category_name}</option>)
                }).reverse()}
          </select>&nbsp;
          <input className="searchBar" id ="searchItem" placeholder="Enter item name.." onChange={(e)=>setSearchKey(e.target.value)} />&nbsp;&nbsp;
          <Button variant="warning" onClick ={submitSearch}>Search</Button> &nbsp;&nbsp;
          <Button variant="warning" href="/Postitem">Post an item</Button>&nbsp;&nbsp;         
        <div className = "loginSection">

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
            <Button variant="warning" onClick ={(e) => dispatch(setUsername(''))}>Log out</Button>
            </div>
          )}
        </div> 
      </div>
          
      <Navbar expand="sm">
      <Nav >
      <NavItem><a href="/"><button className ="navButton">Home</button></a></NavItem>       
          {lists.map((x) => {
            if(x.product_category_name !== 'All')
            return (
              <NavItem title="Category" key = {x.product_category_name}>
                <button className ="navButton" value = {x.product_category_name} id ={x.product_category_name}
                onClick ={search_by_category}>{x.product_category_name}</button>&nbsp;&nbsp;&nbsp;&nbsp;
              </NavItem>             
            )
          }).reverse()
        }
        &nbsp;&nbsp;&nbsp;&nbsp;<NavItem><a href="/About"><button className ="navButton">About us</button></a></NavItem>
          
      </Nav>
    </Navbar>
    </div>
    </div>
    {/* Navbar end here     */}
   
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