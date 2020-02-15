import axios from 'axios';

export const listNotes = () => (dispatch, getState) => {
  axios.get('/service1/list')
    .then((res) => dispatch(setNotes(res.data)))
    .catch(console.log);
};

export const listUser = username => (dispatch, getState) => {
  axios.get('/service1/listuser', {
    params: { user: username }
  }).then((res) => dispatch(setNotes(res.data)))
    .catch(console.log);
};

export const setNotes = notes => ({
  type: 'NOTES_SET_NOTES',
  notes,
})

export const setNewNote = newNote => ({
  type: 'NOTES_SET_NEW_NOTES',
  newNote,
})