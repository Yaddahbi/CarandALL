import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegistreerZakelijk.css";

function RegistreerZakelijk() {
    const [formData, setFormData] = useState({
        email: "",
        wachtwoord: "",
        volledigeNaam: "",
        bedrijfsnaam: "",
        kvkNummer: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/account/registreer-zakelijk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Account succesvol aangemaakt!");
            navigate("/login");
        } else {
            alert("Er is iets fout gegaan.");
        }
    };

    return (
        <div className="form-container">
            <h2>Registreer Zakelijk</h2>
            <form onSubmit={handleSubmit}>
                <label>E-mail:</label>
                <input type="email" name="email" onChange={handleChange} required />

                <label>Wachtwoord:</label>
                <input type="password" name="wachtwoord" onChange={handleChange} required />

                <label>Volledige Naam:</label>
                <input type="text" name="volledigeNaam" onChange={handleChange} required />

                <label>Bedrijfsnaam:</label>
                <input type="text" name="bedrijfsnaam" onChange={handleChange} required />

                <label>KVK-nummer:</label>
                <input type="text" name="kvkNummer" onChange={handleChange} required />

                <button type="submit">Account aanmaken</button>
            </form>
        </div>
    );
}

export default RegistreerZakelijk;
