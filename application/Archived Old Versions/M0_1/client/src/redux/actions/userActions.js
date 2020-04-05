import axios from 'axios';

export const Check = () => (dispatch, username, password, isLoggedIn) => {
    console.log("Check");
    axios.get('/service2/login',{
        username: username,
        password:  password
    })
      .then (({data}) => {console.log(data)})
      .catch(console.log);
  };

export const setUsername = username =>({ 
    type:'SET_USERNAME',
    username,
});

export const setPassword = password =>({ 
    type:'SET_PASSWORD',
    password,
});

export const setIsLoggedIn = isLoggedIn =>({
    type:'SET_IS_LOGGED_IN',
    isLoggedIn,
});

export const setToken = token => ({
    type: 'SET_TOKEN',
    token,
})