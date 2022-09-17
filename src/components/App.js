import React, { useState, useEffect } from 'react';
import { getAPIHealth } from '../axios-services';
import '../style/App.css';

const App = () => {
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
            <h1>Hello, World!</h1>
            <p>API Status: {APIHealth}</p>
        </div>
    );
};

export default App;