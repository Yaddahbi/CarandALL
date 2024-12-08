import './styles.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Verhuuraanvragen from './components/Verhuuraanvragen';
import Voertuigen from './components/Voertuigen';
import Abonnementen from './components/Abonnementen';

const App = () => {
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<h1>Welkom bij CarAndAll</h1>} />
                    <Route path="/aanvragen" element={<Verhuuraanvragen />} />
                    <Route path="/voertuigen" element={<Voertuigen />} />
                    <Route path="/abonnementen" element={<Abonnementen />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
