import React from 'react';
import { Container} from 'react-bootstrap';
import { connect } from 'react-redux';
import { setNotes_perpage, setShow_number_of_items } from '../redux/actions/notesActions.js';
import '../css/Content.css';

//always say how many found out of how many "showing 1-10 out of 12345"
const Pagination = ({ dispatch, notes }) => {

  // This function is setting how many items will be shown in one page.
  // Using 2 indexes to get items in notes array(all items). 
  const setIndex = (id) => {
    let first_index = id;
    let last_index = first_index + 4;
    let items = [];
    let range_first = first_index+1;
    let range_last;

    for(first_index; first_index < last_index; first_index++){
     if(first_index < notes.length)
        items.push(notes[first_index]);
    }
  //formatting the searchinfo.
    if(last_index > notes.length)
      range_last = notes.length;
    else
      range_last = last_index;
    dispatch(setNotes_perpage(items));
    dispatch(setShow_number_of_items('Showing ' + range_first + '-' + range_last + ' out of ' + notes.length + '.'));
    
    //set active css..
    let current = document.getElementById(id);
    current.setAttribute("class", "pagination_button active");

    let pagination = document.getElementById("pagination");
    let all = pagination.getElementsByTagName("button");
    
  
    let temp = id/4;
    for(var i = 0; i<all.length; i++){
         if(i !== temp)
          all[i].setAttribute('class','pagination_button');
    }
  }

  

  return (
    <Container>
      <div id = "pagination" className="pagination">
     {
     notes.map((note, index) => {   
       if(index % 4 === 0){
        return(
          <div  key = {index}>
          <button key = {index} id = {index} onClick={e => { setIndex(index) }}  name = "button" className ={ index === 0 ? 'pagination_button active' : 'pagination_button'}>
            {Math.round(Math.sqrt(index+1))}</button>
          &nbsp;&nbsp;
          </div>
        )
      }
      else
        return('');
      }) 
      }
      </div>
    </Container>
  );
}


const mapStateToProps = state => ({
  username: state.userReducer.username,
  notes: state.notesReducer.notes,
  searchinfo: state.notesReducer.searchinfo,
  notes_perpage: state.notesReducer.notes_perpage,
  show_numberOfitems:state.notesReducer.show_numberOfitems,
  })
  export default connect(mapStateToProps)(Pagination);




