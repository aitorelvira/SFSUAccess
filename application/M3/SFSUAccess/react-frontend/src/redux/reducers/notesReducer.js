const INITIAL_STATE = {
  _id:'',
  notes: [],
  searchinfo:'',
};

const notesReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'NOTES_SET_ID':
    return {
      ...state,
      _id: action._id,
    };
    case 'NOTES_SET_INFO':
    return {
      ...state,
      searchinfo: action.searchinfo,
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






