const INITIAL_STATE = {
  _id:'',
  notes: [],
  notes_perpage:[],
  searchinfo:'',
  show_numberOfitems:'',
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
    case "NOTES_SET_SHOW_NUMBER_OF_ITEMS":
      return {
        ...state,
        show_numberOfitems: action.show_numberOfitems,
      };
    default:
      return state;
  }
};

export default notesReducer;






