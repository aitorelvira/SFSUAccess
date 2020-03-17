import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import './App.css';
import Navigation from "./pages/Navigation";
import Home from "./pages/Home";
import About from "./pages/About";

function App() {
    return (
        <BrowserRouter>
            <div>
                <Navigation/>
                <Switch>
                    <Route path="/" component={Home} exact/>
                    <Route path="/about" component={About}/>
                    <Route component={Error}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
