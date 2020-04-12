import React from 'react';
import { useCookies } from 'react-cookie';
import { Navbar, Button} from 'react-bootstrap';
import Notice from '../components/Notice';
import '../css/Home.css';


const Header = () => {
    const[cookies, setCookies] = useCookies(['username']);

    
        return (
            <div>
             <Navbar bg="dark" variant="dark" className="navbar">
            <Navbar.Brand>SFSUAccess</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
             
             <Navbar.Collapse className="justify-content-end"> 
             {'Welcome  '+ cookies.username + '   '}&nbsp;&nbsp;
                <Button variant="warning" href="/">Home Page</Button>&nbsp;&nbsp;
            </Navbar.Collapse>
            </Navbar><br/>
            <Notice/>
            </div>
        )
}

export default Header;