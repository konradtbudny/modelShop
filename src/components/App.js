import React, { useState, useEffect } from 'react';
import { getAPIHealth } from '../axios-services';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import useAuth from "../hooks/useAuth";
import '../style/App.css';
import Home from './Home';
import Navbar from './Navbar';
import Register from './Register';

const App = () => {
    const { isLoggedIn, setIsLoggedIn } = useAuth();
    const [APIHealth, setAPIHealth] = useState('');

    useEffect(() => {
        const getAPIStatus = async () => {
            const { healthy } = await getAPIHealth();
            setAPIHealth(healthy ? 'api is up! :D' : 'api is down :/');
        };
        getAPIStatus();
    }, []);

    return (
        <div className="app-container">
            
            <Navbar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
                <Routes>
                    <Route exact path="/" element={<Home APIHealth={APIHealth} />}/>
                    <Route exact path="/user/register" element={<Register/>}/>
                </Routes>
        </div>
    );
};

export default App;