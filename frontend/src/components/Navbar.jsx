// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Navbar.css';


const Navbar = ({gebruiker}) => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                 <div className="logo">
                <Link to="/">Car And All</Link>{/* Logo */}
                </div>

                <div className="menu">
                 

                    {gebruiker?.rol === 'Particulier' && (
                        <>
                            <Link to="/voertuigen">Voertuigen</Link>            
                            <Link to="/mijn-verhuuraanvraag">Mijn Aanvragen</Link>
                        </>
                    )}
                    {gebruiker?.rol === 'ZakelijkeHuurder' && (
                        <Link to="/abonnementen">Abonnementen</Link>
                    )}
                    {gebruiker?.rol === 'BackofficeMedewerker' && (
                        <>
                            <Link to="/wagenparkbeheer">Wagenparkbeheer</Link>
                            <Link to="/aanvraag-beheer">Aanvraagbeheer</Link>
                        </>
                    )}
                    {gebruiker?.rol === 'FrontofficeMedewerker' && (
                        <Link to="/schades">Schades</Link>
                    )}
                  
                </div>
            </div>

            <div className="navbar-right">
                {!gebruiker ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/register">Register</Link>
                    </>
                ) : (

                    <>
                        <span className="gebruikersnaam">Welkom, {gebruiker.naam}</span>
                        <Link to="/logout">Uitloggen</Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;