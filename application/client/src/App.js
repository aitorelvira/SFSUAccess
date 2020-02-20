import React from 'react';
import { Switch, Route } from "react-router-dom";
import About from './pages/About';
import JunMinLi from './pages/JunMinLi';
import Aitor from './pages/Aitor';
import CodyXu from './pages/CodyXu';
import YanruiXu from './pages/YanruiXu';
import KevinLuong from './pages/KevinLuong';
import DavidLin from './pages/DavidLin';

import { connect } from 'react-redux';
import './App.css';

const App = () => {

  return (
    <div className="App">
      <div className="nav-bar">   
          <Switch>
            <Route exact path="/JunMinLi" component={JunMinLi} />
            <Route exact path="/CodyXu" component={CodyXu}/>
            <Route exact path="/KevinLuong" component={KevinLuong} />
              <Route exact path="/YanruiXu" component={YanruiXu} />
              <Route exact path="/Aitor" component={Aitor} />
              <Route exact path="/DavidLin" component={DavidLin} />
              <Route exact path="/" component={About} />
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
