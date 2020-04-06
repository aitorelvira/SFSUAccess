const INITIAL_STATE = {
  _id:'',
  notes: [],
  notes_perpage:[],
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
    case "NOTES_SET_NOTESPERPAGE":
      return {
        ...state,
        notes_perpage: action.notes_perpage,
      };
    default:
      return state;
  }
};

export default notesReducer;






