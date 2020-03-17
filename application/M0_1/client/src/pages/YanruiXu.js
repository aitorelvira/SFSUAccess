import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, Switch, Route } from "react-router-dom";
import About from './About';

const YanruiXu = () => {
    return (
        <div>
            <h2>Yanrui Xu</h2>
            <p>yxu13@mail.sfsu.edu</p>
            <p>Website: https://www.linkedin.com/in/yanrui-xu/</p>
            <p>Verbal Language: English, Mandarin, Japanese. </p>
            <p>Programming Skill: Java, Python, Javascript, C++, C, React.</p>
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

export default YanruiXu;