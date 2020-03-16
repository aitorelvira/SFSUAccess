import React, { useState, useEffect } from 'react';
import Search from '../components/Search';
function Home() {
    const [currentTime, setCurrentTime] = useState(0);

    useEffect(() => {
        fetch('/time').then(res => res.json()).then(data => {
            setCurrentTime(data.time);
        });
    }, []);
    return (
        <div>
            <h1>SFSU Access</h1>
            <p>CSC 648 Section 01, Spring 2020, Team 02</p>
            <p>The current time is {currentTime}</p>
            <Search/>
        </div>
    );
}

export default Home;