//PURPOSE: This is the header component with a "back to home" button.
//AUTHOR: JunMin Li
import React from 'react';
import { useCookies } from 'react-cookie';
import { Navbar, Button} from 'react-bootstrap';
import Notice from '../components/Notice';
import '../css/Home.css';


const Header = () => {
    const[cookies, setCookies] = useCookies(['first_name']);
        return (
            <div>
            <Navbar bg="dark" variant="dark" className="navbar"><Notice/></Navbar>
            <Navbar bg="dark" variant="dark" className="navbar">
            <Navbar.Brand href="/">SFSUAccess</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" /> 
             <Navbar className="navbar justify-content-sm-end navbar-collapse collapse">
             Welcome{typeof cookies.first_name === 'undefined'? '': ', ' + cookies.first_name }  &nbsp;&nbsp;
                <Button variant="warning" href="/">Home Page</Button>&nbsp;&nbsp;
            </Navbar>
            </Navbar><br/>
            </div>
        )
}

export default Header;