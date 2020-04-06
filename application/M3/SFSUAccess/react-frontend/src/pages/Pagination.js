import React,{ useState }from 'react';
import { Button, Container } from 'react-bootstrap';


import { connect } from 'react-redux';
import { setSearchInfo, setNotes_perpage } from '../redux/actions/notesActions.js';
import '../css/Content.css';


const Pagination = ({dispatch, notes }) => {

  // This function is setting how many items will be shown in one page.
  // Using 2 indexes to get items in notes array(all items). 
  const setIndex = (id) => {
    let first_index = id -1;
    let last_index = id;
    let items = [];
    // console.log(first_index);
    // console.log(last_index);
 
    for(first_index; first_index < last_index; first_index++){
      items.push(notes[first_index]);
    }
    dispatch(setNotes_perpage(items));
  }


  return (
    <Container className = "pagination">
     {notes.map((note,number) => {   
        return(
          <div className = "paginationButton">
          <Button variant="outline-secondary" key = {number+1} id = {number+1} onClick={e => { setIndex(number+1) }}>{number+1}</Button>
          &nbsp;&nbsp;
          </div>
        )
      }) 
      }
    </Container>
  );
}


const mapStateToProps = state => ({
  username: state.userReducer.username,
  notes: state.notesReducer.notes,
  notes_perpage: state.notesReducer.notes_perpage,
  })
  export default connect(mapStateToProps)(Pagination);




