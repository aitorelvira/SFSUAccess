import React from 'react';
import { Switch, Route } from "react-router-dom";
import About from './pages/About';
import JunMinLi from './pages/JunMinLi';
import { connect } from 'react-redux';
import './App.css';

const App = () => {

  return (
    <div className="App">
      <div className="nav-bar">   
          <Switch>
            <Route exact path="/JunMinLi" component={JunMinLi} />
            <Route exact path="/About" component={About} />
          </Switch>
      </div>
    </div>
  );
}

const mapStateToProps = state => ({
  isLoggedIn: state.userReducer.isLoggedIn,
})
export default connect(mapStateToProps)(App);
