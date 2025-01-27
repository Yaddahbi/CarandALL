import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegistreerMedewerker.css";

function RegistreerMedewerker() {
    const [formData, setFormData] = useState({
        rol: "Medewerker",
        naam: "",
        email: "",
        wachtwoord: "",
    });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("https://localhost:7040/api/User/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            alert("Account succesvol aangemaakt!");
            navigate("/login");
        } else {
            const data = await response.json();
            if (data.errors) {
                alert(`Fouten: ${data.errors.join(", ")}`);
            } else {
                alert("Er is iets fout gegaan.");
            }
        }
    };


    return (
        <div className="form-container">
            <h2>Registreer Medewerker</h2>
            <form onSubmit={handleSubmit}>
                <label>E-mail:</label>
                <input type="email" name="email" onChange={handleChange} required />

                <label>Wachtwoord:</label>
                <input type="password" name="wachtwoord" onChange={handleChange} required />

                <label>Volledige Naam:</label>
                <input type="text" name="naam" onChange={handleChange} required />

                <button type="submit">Account aanmaken</button>
            </form>
        </div>
    );
}

export default RegistreerMedewerker;
