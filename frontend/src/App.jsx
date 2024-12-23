import './style/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Verhuuraanvraag from './components/Verhuuraanvraag';
import VoertuigenPagina from './components/VoertuigenPagina';
import Abonnementen from './components/Abonnementen';
import SchadeLijst from './components/SchadeLijst';  
import SchadeToevoegen from './components/SchadeToevoegen'; 
import SchadePagina from './components/SchadePagina'; 
import Huurgeschiedenis from './components/Huurgeschiedenis';
import KiesAccountType from './components/KiesAccountType';
import Login from './components/Login';
import RegistreerMedewerker from './components/RegistreerMedewerker';
import RegistreerParticulier from './components/RegistreerParticulier';
import RegistreerZakelijk from './components/RegistreerZakelijk';  
  

const Reserveringen = () => <h1>Mijn reserveringen Page</h1>;
const HeroSection = () => (
    <section className="hero">
        <div className="container">
        <h1>Welkom bij CarAndAll</h1>
        <p>Reserveer eenvoudig en snel je volgende huurauto, caravan of camper.</p>
            <div className="search-bar">
                <input className="Ophaallocatie" type="text" placeholder="Ophaallocatie" />
                <input className="Ophaaldatum"  type="date" placeholder="Ophaaldatum" />
                <input className="Inleverdatum" type="date" placeholder="Inleverdatum" />
            <button>Zoeken</button>
            </div>
        </div>
    </section>
);

const FeaturesSection = () => (
    <section className="features">
        <div className="feature Premium">
            <h3>Premium Auto's</h3>
            <p>Rijd in stijl met onze luxe voertuigen.</p>
        </div>
        <div className="feature Carvan">
            <h3>Campers & Caravans</h3>
            <p>Ga op avontuur met onze moderne campers en caravans.</p>
        </div>
        <div className="feature Betaalbare">
            <h3>Betaalbare Prijzen</h3>
            <p>Geniet van concurrerende tarieven en geweldige deals.</p>
        </div>
    </section>
);

const App = () => {
    const isZakelijk = false; // hardcode
    const huurderId = "642f2dac-615f-4700-b088-10990e8d1d39"; // harcode
  
    return (
        <Router>
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<>
                        <HeroSection />
                        <FeaturesSection />
                    </>
                    } />

                    <Route path="/mijn-reservingen" element={<Reserveringen />} />
                  
                    <Route path="/voertuigen" element={<VoertuigenPagina isZakelijk={isZakelijk} />} />
                    <Route path="/Huurgeschiedenis" element={<Huurgeschiedenis huurderId={huurderId} />} />

                    <Route path="/aanvraag-beheer" element={<Verhuuraanvraag />} />
                    <Route path="/abonnementen" element={<Abonnementen />} />

                    {/* New routes for login and account creation */}
                    <Route path="/login" element={<Login />} />
                    <Route path="/kies-account-type" element={<KiesAccountType />} />
                    <Route path="/registreer-particulier" element={<RegistreerParticulier />} />
                    <Route path="/registreer-zakelijk" element={<RegistreerZakelijk />} />
                    <Route path="/registreer-medewerker" element={<RegistreerMedewerker />} />

                    <Route path="/schades" element={<SchadeLijst />} /> {/* Lijst van schades */}
                    <Route path="/schades/toevoegen" element={<SchadeToevoegen />} /> {/* Schade toevoegen */}
                    <Route path="/schades/:id" element={<SchadePagina />} /> {/* Schade detailpagina (bewerken) */}
                </Routes>
            </div>
        </Router>
    );
};


export default App;                                                                                                       
