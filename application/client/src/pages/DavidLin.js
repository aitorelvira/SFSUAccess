import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, Switch, Route } from "react-router-dom";
import About from './About';

const DavidLin = () => {
    return (
        <div>
            <h2>David Lin</h2>
            <p>dlin5@mail.sfsu.edu</p>
            <p>CS student that enjoys gaming.</p>

            <br/>
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

export default DavidLin;