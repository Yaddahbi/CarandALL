import './style/styles.css';
import { BrowserRouter as Router, Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Verhuuraanvraag from './components/Verhuuraanvraag';
import BeheerAanvragen from './components/BeheerAanvragen';
import VoertuigenPagina from './components/VoertuigenPagina';
import Abonnementen from './components/Abonnementen';
import Wagenparkbeheer from './components/Wagenparkbeheer';
import SchadeLijst from './components/SchadeLijst';
import SchadeToevoegen from './components/SchadeToevoegen';
import SchadePagina from './components/SchadePagina';
import Huurgeschiedenis from './components/Huurgeschiedenis';
import UitgifteVoertuig from './components/UitgifteVoertuig';
import InnameVoertuig from './components/InnameVoertuig';
import HuurgeschiedenisBedrijf from './components/HuurgeschiedenisBedrijf';
import KiesAccountType from './components/KiesAccountType';
import Login from './components/Login';
import RegistreerMedewerker from './components/RegistreerMedewerker';
import RegistreerParticulier from './components/RegistreerParticulier';
import RegistreerZakelijk from './components/RegistreerZakelijk';
import Notificaties from './components/Notificaties';
import Privacyverklaring from './components/Privacyverklaring';
import Klantgegevens from './components/KlantGegevens';
import VerhuurdeVoertuigen from './components/VerhuurdeVoertuigen';
import VoertuigStatusOverzicht from './components/VoertuigStatusOverzicht';
import BlokkerenVoertuigen from './components/BlokkerenVoertuigen';
import { useAuth } from './AuthContext';
import { Toaster } from 'sonner';
import ProtectedRoute from './ProtectedRoute';
import Unauthorized from './UnauthorizedPage';

const Reserveringen = () => <h1>Mijn reserveringen Page</h1>;

const HeroSection = () => {
    const navigate = useNavigate();

    const handleZoekVoertuig = () => {
        navigate('/voertuigen');
    };

    return (
        <section className="hero">
            <div className="container">
                <h1>Welkom bij CarAndAll</h1>
                <p>Reserveer eenvoudig en snel je volgende huurauto, caravan of camper.</p>
                <div className="search-bar">
                    <input className="Ophaallocatie" type="text" placeholder="Ophaallocatie" />
                    <input className="Ophaaldatum" type="date" placeholder="Ophaaldatum" />
                    <input className="Inleverdatum" type="date" placeholder="Inleverdatum" />
                    <button onClick={handleZoekVoertuig}>Zoeken</button>
                </div>
            </div>
        </section>
    );
};

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

const FooterWrapper = () => {
    const location = useLocation();

    const noFooterRoutes = [
        '/login',
        '/registreer-particulier',
        '/registreer-zakelijk',
        '/registreer-medewerker',
        '/kies-account-type',
        '/unauthorized',
        '/privacy'
    ];
   
    return !noFooterRoutes.includes(location.pathname) && <Footer />;
};

const routesConfig = [
    { path: '/mijn reserveringen', component: Reserveringen },
    { path: '/voertuigen', component: VoertuigenPagina },
    { path: '/huurgeschiedenis', component: Huurgeschiedenis, roles: ['Particulier', 'Zakelijk'] },
    { path: '/huurgeschiedenisBedrijf', component: HuurgeschiedenisBedrijf, roles: ['ZakelijkeKlant'] },
    { path: '/klantgegevens', component: Klantgegevens, roles: ['Particulier', 'Zakelijk', 'ZakelijkeKlant'] },
    { path: '/mijn-verhuuraanvraag', component: Verhuuraanvraag, roles: ['BackofficeMedewerker'] },
    { path: '/aanvraag-beheer', component: BeheerAanvragen, roles: ['BackofficeMedewerker'] },
    { path: '/abonnementen', component: Abonnementen, roles: ['ZakelijkeKlant'] },
    { path: '/notificaties', component: Notificaties, roles: ['Particulier', 'Zakelijk', 'ZakelijkeKlant'] },
    { path: '/schades', component: SchadePagina, roles: ['FrontofficeMedewerker', 'BackofficeMedewerker'] },
    { path: '/wagenparkbeheer', component: Wagenparkbeheer, roles: ['BackofficeMedewerker'] },
    { path: '/uitgifte', component: UitgifteVoertuig, roles: ['FrontofficeMedewerker'] },
    { path: '/inname', component: InnameVoertuig, roles: ['FrontofficeMedewerker'] },
    { path: '/schades/lijst', component: SchadeLijst, roles: ['FrontofficeMedewerker', 'BackofficeMedewerker'] },
    { path: '/schades/toevoegen', component: SchadeToevoegen, roles: ['FrontofficeMedewerker', 'BackofficeMedewerker'] },
    { path: '/overzicht-verhuurde-voertuigen', component: VerhuurdeVoertuigen, roles: ['Wagenparkbeheerder'] },
    { path: '/voertuigstatus', component: VoertuigStatusOverzicht, roles: ['Wagenparkbeheerder'] },
    { path: '/blokkeren-voertuigen', component: BlokkerenVoertuigen, roles: ['Wagenparkbeheerder', 'BackofficeMedewerker'] },

    { path: '/login', component: Login },
    { path: '/kies-account-type', component: KiesAccountType },
    { path: '/registreer-particulier', component: RegistreerParticulier },
    { path: '/registreer-zakelijk', component: RegistreerZakelijk },
    { path: '/registreer-medewerker', component: RegistreerMedewerker },
    { path: '/privacy', component: Privacyverklaring },
    { path: '/unauthorized', component: Unauthorized },
];

const generateRoutes = () => {
    return routesConfig.map(({ path, component: Component, roles }, index) => {
        if (roles) {
            return (
                <Route
                    key={index}
                    path={path}
                    element={<ProtectedRoute allowedRoles={roles}><Component /></ProtectedRoute>}
                />
            );
        }
        return <Route key={index} path={path} element={<Component />} />;
    });
};

const App = () => {
    const { loading } = useAuth(); 

    if (loading) {
        return (
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
                <p>Loading...</p> 
            </div>
        );
    } 
    return (
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
                        <Route path="/" element={<><HeroSection /><FeaturesSection /></>} />
                        {generateRoutes()}
                    </Routes>
                </div>
                <FooterWrapper />
            </Router>
    );
};

export default App;