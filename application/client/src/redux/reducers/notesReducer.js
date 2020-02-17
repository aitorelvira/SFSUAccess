const DEFAULT_STATE = {
  _id:'',
  notes: [],
  newNote:'',
};

const notesReducer = (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case 'NOTES_SET_ID':
    return {
      ...state,
      _id: action._id,
    };
    case 'NOTES_SET_NEW_NOTES':
    return {
      ...state,
      newNote: action.newNote,
    };
    case "NOTES_SET_NOTES":
      return {
        ...state,
        notes: action.notes,
      };
    default:
      return state;
  }
};

export default notesReducer;






