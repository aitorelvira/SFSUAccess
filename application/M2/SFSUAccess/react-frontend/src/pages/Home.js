
import React,{useState, useEffect}from 'react';
import axios from 'axios';
import { Nav, NavItem, NavLink } from 'reactstrap';
import { Navbar, Form, FormControl,DropdownButton,Button, Jumbotron,  NavDropdown, Col} from 'react-bootstrap';
import { Switch, Route, Link } from "react-router-dom";
import Footer from '../components/Footer'
import { connect } from 'react-redux';
import {setNotes, setSearchInfo} from '../redux/actions/notesActions.js';
// import {setUsername} from '../redux/actions/userActions.js';
import Content from './Content';
// import Dashboard from './Dashboard'
import '../css/Home.css';





const Home = ({dispatch, searchinfo}) => {
  const[lists, setList] = useState([]);
  const[searchKey, setSearchKey] = useState('');

  useEffect (()=>{
    axios.get('/api/search')
        .then(response => {         
         setList(response.data);  
     });
  },[]);

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
          dispatch(setSearchInfo('   Search results for:   ' + userSelection + ' , ' + searchKey));
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
    setSearchKey('');
    document.getElementById("searchItem").value = '';
  }

  const dropdownSearch = (e) =>{
   let page = e.target.id
   axios.get('/api/search/'+ page)
   .then(response => {
    dispatch(setNotes(response.data));
   })
   dispatch(setSearchInfo(page + '  Category.'));
  }


  
  
  return (  
    <div>
    <Navbar expand="sm" className="navBar">
      <Nav >
      <NavItem>
        <NavLink href="/" id ="nav-text">Home</NavLink>
      </NavItem>      
        <NavDropdown title="Store" id="nav-dropdown">
          {lists.map((x) => {
            // if(x.product_category_name != 'All')
            return (
                <NavDropdown.Item className="dropdownItem" value={x.product_category_name} key={x.product_category_name}>
                <button className ="dropdownButton" value = {x.product_category_name} id ={x.product_category_name}
                onClick ={dropdownSearch}>{x.product_category_name}</button>               
                </NavDropdown.Item>)
          })}
    </NavDropdown> 
      {/* <NavItem>
        <NavLink href="/About" id="nav-text">About us</NavLink>
      </NavItem> */}
      </Nav>
    <div className="search">
    <label>Choose a category:</label>&nbsp;&nbsp;
          <select id="category">
          {lists.map((x) => {
            return (
                <option value={x.product_category_name} key={x.product_category_name}>{x.product_category_name}</option>)
                })}
          </select>&nbsp;&nbsp;&nbsp;
          <input id ="searchItem" placeholder="Enter item name.." onChange={(e)=>setSearchKey(e.target.value)} />&nbsp;&nbsp;&nbsp;
          <Button variant="warning" onClick ={submitSearch}>Search</Button>          
    </div>
    </Navbar>

    <div > 
    <div className="greeting">
           <h3> Software Engineering class SFSU Spring 2020, Section 01 <br/> Team 02 <br/> vertical SW prototype</h3></div><br/>
        </div>

    
         <Switch>
        {/* <Route exact path ="/Dashboard" component = {Dashboard}/>    */}
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