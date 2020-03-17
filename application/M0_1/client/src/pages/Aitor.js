import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, Switch, Route } from "react-router-dom";
import About from './About';

const Aitor = () => {
  return (
    <div>
      <h2>Aitor</h2>
      <p>aelviramonsalve@mail.sfsu.edu</p>
      <p>Having fun programming.</p>

      <b>SKILLS</b>
      <hr/>
      <p>Verbal Language: English and Spanish. </p>
      <p>Programming Skills: Java, Python, C, Swift.</p>
   

      <b>EDUCATION</b>
      <hr/>
     

      <p>San Francisco State University </p>
      <p>Computer Engineering and Business Management</p>

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

export default Aitor;