import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, Switch, Route } from "react-router-dom";
import About from './About';

const CodyXu = () => {
  return (
    <div>
      <h2>CodyXu</h2>
      <p>cxu@mail.sfsu.edu</p>
      <p>A programmer</p>

      <b>SKILLS</b>
      <hr/>
      <p>Verbal Language: English, Mandarin. </p>
      <p>Programming Skill: Python, Java, Javascript, C++, C, React.</p>
   
      <b>EDUCATION</b>
      <p>San Francisco State University </p>
      <p>Currently enrolling in computer science major.</p>

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

export default CodyXu;