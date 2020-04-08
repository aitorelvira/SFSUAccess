import React,{useState, useEffect}from 'react';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import { Nav, NavItem } from 'reactstrap';
import { Navbar, Button, Container } from 'react-bootstrap';
import { Switch, Route } from "react-router-dom";
import Footer from '../components/Footer'
import { connect } from 'react-redux';
import {setNotes, setSearchInfo, setNotes_perpage, setShow_number_of_items} from '../redux/actions/notesActions.js';
import {setUsername} from '../redux/actions/userActions.js';
import Content from './Content';
import '../css/Home.css';





const Home = ({ dispatch, username }) => {
  const[lists, setList] = useState([]);             // The list of categroies
  const[searchKey, setSearchKey] = useState('');    // user input for searching
  const [cookies, setCookies] = useCookies(['username']);
   
 
 
//Loading the init categories from the db to the Nav bar and dropdowns.
  useEffect (()=>{
    axios.get('/api/search')
        .then(response => {         
         setList(response.data);  
     });
  dispatch(setUsername(cookies.username));
  },[dispatch, cookies.username]);

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
        getRange_last(response.data);
        // If nothing was found , return items in the same category. 
        if(!response.data.length){
          axios.get('/api/search/'+ userSelection)
            .then(response => {
               getRange_last(response.data);
               dispatch(setSearchInfo('Nothing found with search key:  \'' + userSelection + '\' and \'' + searchKey + '\'. Here are items in the same cateory. '));
          })
        }
        else{ // If something was found, return items.
          dispatch(setSearchInfo('   Results with search key:   \'' + userSelection + '\' ,\' ' + searchKey + '\'. '));
        }
      })
    }
    else{ // search by category + '' as searchKey, return items in that category.
      axios.get('/api/search/'+ userSelection)
        .then(response => {
          getRange_last(response.data);
          dispatch(setSearchInfo('   Search results for:   ' + userSelection + '. ' ));
        })
    }
  }

  //Search funtion for Navbar buttons, return items in that category.
  const search_by_category = (e) =>{
   let page = e.target.id
   axios.get('/api/search/'+ page)
   .then(response => {
      getRange_last(response.data);  
      dispatch(setSearchInfo(page + '  Category. '));
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
          {/* <Button variant="warning" href="/Postitem">Post an item</Button>&nbsp;&nbsp;          */}
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
            <Button variant="warning" onClick ={logOut}>Log out</Button>
            </div>
          )}
        </div> 
      </div>
          
      <Navbar expand="sm">
      <Nav >
      <NavItem><a href="/"><button className ="navButton" href="/">Home</button></a></NavItem>       
          {lists.map((x) => {
            if(x.product_category_name !== 'All'){
            return (
              <NavItem title="Category" key = {x.product_category_name}>
                <button className ="navButton" value = {x.product_category_name} id ={x.product_category_name}
                onClick ={search_by_category}>{x.product_category_name} </button> &nbsp;&nbsp;&nbsp;&nbsp;
              </NavItem>             
            )}
            else
              return('');
          }).reverse()       
        }
        &nbsp;&nbsp;&nbsp;&nbsp;<NavItem><a href = "/About"><button className ="navButton">About us</button></a></NavItem>
          
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