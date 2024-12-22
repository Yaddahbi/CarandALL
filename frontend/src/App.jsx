import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Abonnementen from './components/Abonnementen';
import KiesAccountType from './components/KiesAccountType';
import Login from './components/Login';
import Navbar from './components/Navbar';
import RegistreerMedewerker from './components/RegistreerMedewerker';
import RegistreerParticulier from './components/RegistreerParticulier';
import RegistreerZakelijk from './components/RegistreerZakelijk';
import Verhuuraanvragen from './components/Verhuuraanvragen';
import VoertuigenPagina from './components/VoertuigenPagina';
import './styles.css';

const App = () => {
    const isZakelijk = false; // hardcoded example, replace as needed

    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    {/* Existing routes */}
                    <Route path="/" element={<h1>Welkom bij CarAndAll</h1>} />
                    <Route path="/aanvragen" element={<Verhuuraanvragen />} />
                    <Route path="/voertuigen" element={<VoertuigenPagina isZakelijk={isZakelijk} />} />
                    <Route path="/abonnementen" element={<Abonnementen />} />

                    {/* New routes for login and account creation */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/kies-account-type" element={<KiesAccountType />} />
                    <Route path="/registreer-particulier" element={<RegistreerParticulier />} />
                    <Route path="/registreer-zakelijk" element={<RegistreerZakelijk />} />
                    <Route path="/registreer-medewerker" element={<RegistreerMedewerker />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
