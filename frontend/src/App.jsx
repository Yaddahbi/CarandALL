import './style/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Verhuuraanvraag from './components/Verhuuraanvraag';
import VoertuigenPagina from './components/VoertuigenPagina';
import Abonnementen from './components/Abonnementen';
import SchadeLijst from './components/SchadeLijst';  
import SchadeToevoegen from './components/SchadeToevoegen'; 
import SchadePagina from './components/SchadePagina'; 
import Huurgeschiedenis from './components/Huurgeschiedenis';
import HuurgeschiedenisBedrijf from './components/HuurgeschiedenisBedrijf';
import KiesAccountType from './components/KiesAccountType';
import Login from './components/Login';
import RegistreerMedewerker from './components/RegistreerMedewerker';
import RegistreerParticulier from './components/RegistreerParticulier';
import RegistreerZakelijk from './components/RegistreerZakelijk'; 
import Notificaties from './components/Notificaties';
import Privacyverklaring from './components/Privacyverklaring';
import { AuthProvider } from "./AuthContext";
import { Toaster } from 'sonner';
  

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
    
  
    return (
        <AuthProvider>
        <Router>
                <Toaster
                    position="top-center"
                    richColors
                    aria-live="assertive" 
                    aria-atomic="true"    
                    duration={5000}       
                />
            <Navbar />
            <div className="container mt-4">
                <Routes>
                    <Route path="/" element={<>
                        <HeroSection />
                            <FeaturesSection />
                            <Footer />
                    </>
                    } />

                    <Route path="/mijn-reservingen" element={<Reserveringen />} />
                  
                    <Route path="/voertuigen" element={<VoertuigenPagina />} />
                    <Route path="/Huurgeschiedenis" element={<Huurgeschiedenis />} />

                    <Route path="/aanvraag-beheer" element={<Verhuuraanvraag />} />
                    <Route path="/abonnementen" element={<Abonnementen />} />
                    <Route path="/HuurgeschiedenisBedrijf" element={<HuurgeschiedenisBedrijf />} />

                    <Route path="/notificaties" element={<Notificaties />} />

                    {/* New routes for login and account creation */}
                    <Route path="/login" element={<Login />} />
                   
                    <Route path="/schades" element={<SchadePagina />} />
                    <Route path="/schades/lijst" element={<SchadeLijst />} /> 
                    <Route path="/schades/toevoegen" element={<SchadeToevoegen />} /> 

                    <Route path="/kies-account-type" element={<KiesAccountType />} />
                    <Route path="/registreer-particulier" element={<RegistreerParticulier />} />
                    <Route path="/registreer-zakelijk" element={<RegistreerZakelijk />} />
                    <Route path="/registreer-medewerker" element={<RegistreerMedewerker />} />

                    <Route path="/privacy" element={<Privacyverklaring />} />
                    
                </Routes>
                </div>
            </Router>
        </AuthProvider>
    );
};


export default App;                                                                                                       
