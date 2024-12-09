import './styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Verhuuraanvragen from './components/Verhuuraanvragen';
import VoertuigenPagina from './components/VoertuigenPagina';
import Abonnementen from './components/Abonnementen';


const App = () => {
    const isZakelijk = false; // hardcode
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<h1>Welkom bij CarAndAll</h1>} />
                    <Route path="/aanvragen" element={<Verhuuraanvragen />} />
                    <Route path="/voertuigen" element={<VoertuigenPagina isZakelijk={isZakelijk} />} />
                    <Route path="/abonnementen" element={<Abonnementen />} />
                </Routes>
            </div>
        </Router>

    );
};


export default App;
