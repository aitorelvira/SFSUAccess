import React from 'react';
import Search from "../components/Search";
import Img from 'react-image'
function Home() {
    return (
        <div>
            <h1>SFSU Access</h1>
            <p>CSC 648 Section 01, Spring 2020, Team 02</p>
            <Search/>
            <Img src="https://upload.wikimedia.org/wikipedia/en/7/72/Too_Good_at_Goodbyes.jpg" />
        </div>
    );
}

export default Home;