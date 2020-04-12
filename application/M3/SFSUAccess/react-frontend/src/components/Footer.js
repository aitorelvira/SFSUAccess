import React from 'react';
import '../css/Home.css';
import { Navbar } from 'react-bootstrap';


class Footer extends React.Component {

    render() {
        return (
            
            <Navbar bg="dark" fixed="bottom" className="footer">
                 Software Engineering class SFSU Spring 2020 Section 01 <br/> Team 02
            </Navbar>
            
        )
    }
}

export default Footer;