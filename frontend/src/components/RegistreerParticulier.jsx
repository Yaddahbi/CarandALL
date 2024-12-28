import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegistreerParticulier.css";
import { toast } from 'sonner';
function RegistreerParticulier() {
    const [formData, setFormData] = useState({
        rol: "Particulier",
        naam: "",
        email: "",
        wachtwoord: "",
        adres: "",
        telefoonnummer: "",
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
            toast(`Account succesvol aangemaakt!`, {
                description: 'U kunt nu inloggen.',
                type: 'succes',
            }) 
            navigate("/login");
        } else {
            const data = await response.json();
            if (data.errors) {
                toast(`Fouten: ${data.errors.join(", ")}`, {
                    type: 'error',
                }) 
            } else {
                toast(`Er is iets fout gegaan`, {
                    type: 'error',
                }) 
            }
        }
    };


    return (
        <div className="form-container">
            <h2>Registreer Particulier</h2>
            <form onSubmit={handleSubmit}>
                <label>E-mail:</label>
                <input type="email" name="email" onChange={handleChange} required />

                <label>Wachtwoord:</label>
                <input type="password" name="wachtwoord" onChange={handleChange} required />

                <label>Volledige Naam:</label>
                <input type="text" name="naam" onChange={handleChange} required />

                <label>Adres:</label>
                <input type="text" name="adres" onChange={handleChange} required />

                <label>Telefoonnummer:</label>
                <input type="text" name="telefoonnummer" onChange={handleChange} required />

                <button type="submit">Account aanmaken</button>
            </form>
        </div>
    );
}

export default RegistreerParticulier;
