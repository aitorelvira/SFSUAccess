//PURPOSE: This is the error message page for any invalid url in the app.
//AUTHOR: JunMin Li
import React from "react";
import { Navbar, Button } from 'react-bootstrap';
import Notice from './Notice';
import ReactGA from "react-ga";

const ErrorPage =()=>{
    if (window.location.href.indexOf("/404/") > -1) { // from redirection to /404/ from invalid ItemDetail page
        ReactGA.event({
            category: 'ErrorEncountered',
            action: '404 Page Hit',
            label: 'Page: ' + window.location.href + ' from Referrer: ' + document.referrer,
            transport: 'beacon'
        });
    } else { // all other 404 page hits
        ReactGA.event({
            category: 'ErrorEncountered',
            action: '404 Page Hit',
            label: 'Page: ' + window.location.href,
            transport: 'beacon'
        });
    }
    return(

        <div>
         <Navbar bg="dark" variant="dark" className="navbar">
          <Navbar.Brand  href="/" className="navLogo">SFSUAccess</Navbar.Brand>
        </Navbar>
        <Notice/>

        <div  className="errorgreeting">
        <h1>Oops !</h1>
        <h4 className="not_second">404 - PAGE NOT FOUND</h4>
        <p className="not_third">The page you are looking for might have been removed<br/>
        had its name changed or is temporarily unavailable.
        </p>
        <Button variant="warning" href="/">BACK TO HOME PAGE</Button>&nbsp;&nbsp;
        </div>
        </div>
    )
}
export default ErrorPage;