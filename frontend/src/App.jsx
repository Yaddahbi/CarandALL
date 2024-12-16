import './styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Verhuuraanvragen from './components/Verhuuraanvragen';
import VoertuigenPagina from './components/VoertuigenPagina';
import Abonnementen from './components/Abonnementen';
import GebruikerAanmaken from './GebruikerAanmaken';
import Huurgeschiedenis from './components/Huurgeschiedenis';


const Login = () => <h1>Login Page</h1>;
const Register = () => <h1>Register Page</h1>;


const App = () => {
    const isZakelijk = false; // hardcode
    const huurderId = 1;
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<h1>Welkom bij CarAndAll</h1>} />
                    <Route path="/aanvragen" element={<Verhuuraanvragen />} />
                    <Route path="/voertuigen" element={<VoertuigenPagina isZakelijk={isZakelijk} />} />
                    <Route path="/abonnementen" element={<Abonnementen />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<GebruikerAanmaken />} />
                    <Route path="/Huurgeschiedenis" element={<Huurgeschiedenis huurderId={huurderId} />} />
                </Routes>
            </div>
        </Router>

    );
};


export default App;
