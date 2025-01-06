// eslint-disable-next-line no-unused-vars
import React , { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../style/Navbar.css';
import { FaBars } from 'react-icons/fa';
import { useAuth } from "../AuthContext";

const Navbar = () => {

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/'); // Navigeer naar de homepagina
    };

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);  // Toggle de dropdown zichtbaarheid
    };
    
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="dropdown">
                    <button className="dropbtn" onClick={toggleDropdown} >
                        <FaBars size={20} /> {/* Dropdown menu*/}
                    </button>
                    {isDropdownOpen && (
                    <div className="dropdown-content">
                        {user && user.role === "FrontOfficeMedewerker" && (
                            <>
                                <Link to="/uitgifte">Uitgifte Voertuig</Link>
                                <Link to="/inname">Inname Voertuig</Link>
                            </>
                        )}
                        {user && user.role === "BackOfficeMedewerker" && (
                            <>
                                <Link to="/aanvraag-beheer">Aanvragen</Link>
                                <Link to="/schades">Schades</Link>
                         
                            </>
                        )}
                        {user && (user.role === "Particulier" || user.role === "Zakelijk") && (
                            <>
                                <Link to="/voertuigen">Voertuigen</Link>
                                <Link to="/huurgeschiedenis">Huurgeschiedenis</Link>
                            </>
                        )}
                        {user && user.role === "ZakelijkeKlant" && (
                            <>
                                <Link to="/abonnementen">Abonnementen</Link>
                            </>
                        )}
                    </div>
                    )}
                </div>
            <div className="logo">
                <Link to="/">Car And All</Link>{/* Logo text */}
                </div>
            </div>

            <div className="navbar-right">
                {!user ? (
                    <>
                        <Link to="/login">Login</Link>
                        <Link to="/kies-account-type">Register</Link>
                    </>
                ) : (
                    <button onClick={handleLogout}>Logout</button>
                )}
            </div>
        </nav>
    );
};

export default Navbar;