import React , { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Navbar.css';
import { FaBars } from 'react-icons/fa';
import { useAuth } from "../AuthContext";
import { toast } from 'sonner';
const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        toast('U bent uitgelogd.', {
            type: 'info',
        })
        navigate('/'); // Navigeer naar de homepagina
    };
    return (
        <nav className="navbar">
            <div className="navbar-left">
                 <div className="logo">
                <Link to="/">Car And All</Link>{/* Logo */}
                </div>

                <div className="menu">
                    {user && (user.role === "Particulier" || user.role === "Zakelijk") && (
                        <>
                            <Link to="/voertuigen">Voertuigen</Link>
                            <Link to="/huurgeschiedenis">Huurgeschiedenis</Link>
                            <Link to="/notificaties">Notificaties</Link>
                        </>
                    )}
                    {user && user?.role === 'ZakelijkeKlant' && (
                        <>
                        <Link to="/abonnementen">Abonnementen</Link>
                        <Link to="/notificaties">Notificaties</Link>
                        <Link to="/huurgeschiedenisBedrijf">Huurgeschiedenis Medewerkers</Link>
                        </>
                    )}
                    {user?.role === 'BackofficeMedewerker' && (
                        <>
                            <Link to="/wagenparkbeheer">Wagenparkbeheer</Link>
                            <Link to="/mijn-verhuuraanvraag">Aanvragen</Link>
                        </>
                    )}
                    {user?.role === 'FrontofficeMedewerker' && (
                        <>
                        <Link to="/schades">Schades</Link>
                        <Link to="/uitgifte">Uitgifte Voertuig</Link>
                        <Link to="/inname">Inname Voertuig</Link>
                        </>
                    )}

                    {user && user.role === "Wagenparkbeheerder" && (
                        <>
                            <Link to="/overzicht-verhuurde-voertuigen">Overzicht Verhuurde Voertuigen</Link>
                            <Link to="/voertuigstatus">Voertuigstatus Overzicht</Link>
                        </>
                    )}
                  
                </div>
            </div>

            <div className="navbar-right">
                {!user ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/kies-account-type">Register</Link>
                    </>
                ) : (
                        <>
                            { /*}  <span className="gebruikersnaam">Welkom, {user.naam}</span> {*/ }
                            <button className="button-logout" onClick={handleLogout}>Logout -></button> 
                            
                        </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;