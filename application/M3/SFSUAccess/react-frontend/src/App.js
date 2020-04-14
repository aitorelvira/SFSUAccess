import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import ReactGA from "react-ga";
// import './App.css';
import Home from "./pages/Home";
import About from "./pages/About";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Postitem from "./pages/Postitem";
import ItemDetail from "./pages/ItemDetail";
import Error from "./components/ErrorPage"
import './css/Home.css';

function App() {
    ReactGA.pageview(window.location.pathname + window.location.search);
    return (
        <BrowserRouter>
            <div>
                <Switch>
                <Route  exact path ="/Postitem" component = {Postitem}/>
                <Route  exact path = "/ItemDetail" component = {ItemDetail}/>
                <Route  exact path ="/Dashboard" component = {Dashboard}/>
                <Route  exact path ="/SignUp" component={SignUp}/>
                <Route  exact path ="/SignIn" component={SignIn}/>
                <Route  path ="/About" component={About}/>
                <Route  path ="/" exact component={Home} />
                <Route  component ={Error}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
