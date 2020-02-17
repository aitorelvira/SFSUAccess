import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, Switch, Route } from "react-router-dom";
import About from './About';

const KevinLuong = () => {
    return (
        <div>
        <h2>Kevin Luong</h2>
        <p>kluong4@mail.sfsu.edu</p>
    <p>A mechanic learning how to make stuff instead of fix stuff</p>
    <Link to="/About">
        <Button variant = "secondary">
        Back to About Page
    </Button>
    </Link>
    <Switch>
    <Route exact path="/About" component={About} />
    </Switch>
    </div>
);
};

export default KevinLuong;