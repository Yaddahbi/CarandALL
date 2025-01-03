import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegistreerZakelijk.css";
import { toast } from "sonner";

function RegistreerZakelijk() {
    const [formData, setFormData] = useState({
        rol: "ZakelijkeKlant",
        naam: "",
        email: "",
        wachtwoord: "",
        adres: "",
        telefoonnummer: "",
        bedrijfsNaam: "",
        kvkNummer: "",
        abonnementType: "PayAsYouGo", // default waarde
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
            toast(`Bedrijfsaccount succesvol aangemaakt!`, {
                description: "U kunt nu inloggen.",
                type: "success",
            });
            navigate("/login");
        } else {
            const data = await response.json();
            if (data.errors) {
                toast(`Fouten: ${data.errors.join(", ")}`, {
                    type: "error",
                });
            } else {
                toast("Er is iets fout gegaan", {
                    type: "error",
                });
            }
        }
    };

    return (
        <div className="form-container">
            <h2>Registreer Zakelijk</h2>
            <form className="form-display" onSubmit={handleSubmit}>
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

                <label>Bedrijfsnaam:</label>
                <input type="text" name="bedrijfsNaam" onChange={handleChange} required />

                <label>KVK-nummer:</label>
                <input type="text" name="kvkNummer" onChange={handleChange} required />

                <label>Abonnementstype:</label>
                <select name="abonnementType" onChange={handleChange} required>
                    <option value="PayAsYouGo">Pay-As-You-Go</option>
                    <option value="Prepaid">Prepaid</option>
                </select>

                <button type="submit">Account aanmaken</button>
            </form>
        </div>
    );
}

export default RegistreerZakelijk;
