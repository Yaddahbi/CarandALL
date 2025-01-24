import React , { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Navbar.css';
import { FaBars } from 'react-icons/fa';
import { FaHome } from 'react-icons/fa'; 
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
                    <Link to="/" className="home-link">
                        <FaHome className="home-icon" /> Car And All
                    </Link>
                </div>

                <div className="menu">
                    {user && (user.role === "Particulier" || user.role === "Zakelijk") && (
                        <>
                            <Link to="/voertuigen">Voertuigen</Link>
                            <Link to="/huurgeschiedenis">Huurgeschiedenis</Link>
                            <Link to="/notificaties">Notificaties</Link>
                            <Link to="/klantgegevens">Mijn gegevens</Link>
                        </>
                    )}
                    {user && user?.role === 'ZakelijkeKlant' && (
                        <>
                        <Link to="/abonnementen">Abonnement</Link>
                        <Link to="/huurgeschiedenisBedrijf">Huurgeschiedenis medewerkers</Link>
                        <Link to="/notificaties">Notificaties</Link>
                        <Link to="/klantgegevens">Mijn gegevens</Link>
                        </>
                    )}
                    {user?.role === 'BackofficeMedewerker' && (
                        <>
                            <Link to="/wagenparkbeheer">Wagenparkbeheer</Link>
                            <Link to="/mijn-verhuuraanvraag">Aanvragen</Link>
                            <Link to="/schades">Schades</Link>
                        </>
                    )}
                    {user?.role === 'FrontofficeMedewerker' && (
                        <>
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
                            <div className="user-info">
                            <span className="gebruikersnaam">{user.name}</span>
                            <button className="button-logout" onClick={handleLogout}>Logout -></button> 
                            </div>
                        </>
                )}
            </div>
        </nav>
    );
};

export default Navbar;