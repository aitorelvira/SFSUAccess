const INITIAL_STATE ={
    username: '',
    password: '',
    isLoggedIn: false,
};

const userReducer = (state = INITIAL_STATE, action) => {
    switch(action.type){
        case 'SET_IS_LOGGED_IN':
            return{
                ...state,
                isLoggedIn: action.isLoggedIn,
            };
        case 'SET_USERNAME':
            return {
                ...state,
                username: action.username,
            };
        case 'SET_PASSWORD':
            return {
                ...state,
                password: action.password,
            };
        case 'SET_TOKEN':
            return {
                ...state,
                token: action.token,
            };
        default:
            return state;
    }
};

export default userReducer;