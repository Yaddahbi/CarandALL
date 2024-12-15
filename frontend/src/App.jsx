import './style/styles.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Verhuuraanvraag from './components/Verhuuraanvraag';
import VoertuigenPagina from './components/VoertuigenPagina';
import Abonnementen from './components/Abonnementen'; 



const Login = () => <h1>Login Page</h1>;
const Register = () => <h1>Register Page</h1>;
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

                    <Route path="/aanvraag-beheer" element={<Verhuuraanvraag />} />
                    <Route path="/abonnementen" element={<Abonnementen />} />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                </Routes>
            </div>
        </Router>

    );
};


export default App;                                                                                                       