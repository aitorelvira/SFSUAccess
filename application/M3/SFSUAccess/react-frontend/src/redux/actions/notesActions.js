// import axios from 'axios';

// export const listNotes = () => (dispatch, getState) => {
//   axios.get('/service1/list')
//     .then((res) => dispatch(setNotes(res.data)))
//     .catch(console.log);
// };

// export const listUser = username => (dispatch, getState) => {
//   axios.get('/service1/listuser', {
//     params: { user: username }
//   }).then((res) => dispatch(setNotes(res.data)))
//     .catch(console.log);
// };

export const setNotes = notes => ({
  type: 'NOTES_SET_NOTES',
  notes,
})


export const setSearchInfo = searchinfo => ({
  type: 'NOTES_SET_INFO',
  searchinfo,
})

export const setNotes_perpage = notes_perpage => ({
  type: 'NOTES_SET_NOTESPERPAGE',
  notes_perpage,
})

export const setShow_number_of_items = show_numberOfitems => ({
  type: 'NOTES_SET_SHOW_NUMBER_OF_ITEMS',
  show_numberOfitems,
})