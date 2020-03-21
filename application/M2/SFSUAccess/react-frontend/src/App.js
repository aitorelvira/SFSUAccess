import React from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
// import './App.css';
import Home from "./pages/Home";
import About from "./pages/About";
import './css/Home.css';

function App() {
    return (
        <BrowserRouter>
            <div>
                <Switch>
                    <Route path="/" component={Home} exact/>
                    <Route path="/" component={Home} exact/>

                    <Route path="/about" component={About}/>
                    <Route component={Error}/>
                </Switch>
            </div>
        </BrowserRouter>
    );
}

export default App;
