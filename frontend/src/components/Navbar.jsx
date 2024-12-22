// eslint-disable-next-line no-unused-vars
import React from 'react';
import { Link } from 'react-router-dom';
import '../style/Navbar.css';
import { FaBars } from 'react-icons/fa';

const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="navbar-left">
                <div className="dropdown">
                    <button className="dropbtn">
                        <FaBars size={20} /> {/* Dropdown menu*/}
                    </button>
                    <div className="dropdown-content">
                        <Link to="/aanvraag-beheer">Aanvraag Beheer</Link>
                        <Link to="/voertuigen">Voertuigen</Link>
                        <Link to="/Huurgeschiedenis">Huurgeschiedenis</Link>
                        <Link to="/abonnementen">Abonnementen</Link>
                        <Link to="/schades">Schades</Link>
                    </div>
                </div>
            <div className="logo">
                <Link to="/">Car And All</Link>{/* Logo text */}
                </div>
            </div>

            <div className="navbar-right">
                <Link to="/login">Login</Link>
                <Link to="/kies-account-type">Register</Link>
            </div>
        </nav>
    );
};

export default Navbar;