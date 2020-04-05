import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, Switch, Route } from "react-router-dom";
import About from './About';

const JunMinLi = () => {
  return (
    <div>
      <h2>JunMinLi</h2>
      <p>jli58@gmail.sfsu.edu</p>
      <p>A programmer. An artist. A gammer. </p>

      <b>SKILLS</b>
      <hr/>
      <p>Verbal Language: English, Mandarin and Cantonese. </p>
      <p>Programming Skill: Java, Javascript, C++, C, React.</p>
   

      <b>EDUCATION</b>
      <hr/>
      <p>City College of SanFrancisco </p>
      <p>Associate in Science Computer Science with High Honors.</p>

      <p>San Francisco State University </p>
      <p>Currently enrolling.</p>

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

export default JunMinLi;