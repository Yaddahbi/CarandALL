import { useState } from "react";
import { voegGebruikerToe } from "./api";
import "./GebruikerAanmaken.css"; // CSS-bestand importeren

const GebruikerAanmaken = () => {
    const [gebruiker, setGebruiker] = useState({
        rol: "Particulier",
        naam: "",
        email: "",
        wachtwoord: "",
        telefoonnummer: "",
        adres: "",
        bedrijfsNaam: "", // Dit veld zal weggelaten worden als het een particulier is
        kvkNummer: "",    // Dit veld zal weggelaten worden als het een particulier is
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState("");

    // Verwerkt de wijzigingen van de invoervelden
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setGebruiker((prev) => ({ ...prev, [name]: value }));
    };

    // Verzendt de gebruikersdata naar de backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Verwijder de zakelijke velden als de gebruiker een particulier is
        const gebruikerData = { ...gebruiker };
        if (gebruiker.rol === "Particulier") {
            delete gebruikerData.bedrijfsNaam;
            delete gebruikerData.kvkNummer;
        }

        try {
            await voegGebruikerToe(gebruikerData);
            setSuccess("Gebruiker succesvol aangemaakt!");
            setError(null);
        } catch (err) {
            setError("Er is iets misgegaan: " + err.message);
            setSuccess("");
        }
    };

    return (
        <div className="container">
            <h2>Maak een Account aan</h2>
            <form onSubmit={handleSubmit} className="form">
                {/* Rol keuzelijst */}
                <label>Rol:</label>
                <select
                    name="rol"
                    value={gebruiker.rol}
                    onChange={handleInputChange}
                    className="input"
                >
                    <option value="Particulier">Particulier</option>
                    <option value="Zakelijk">Zakelijk</option>
                </select>

                {/* Naam invoerveld */}
                <label>Naam:</label>
                <input
                    type="text"
                    name="naam"
                    onChange={handleInputChange}
                    required
                    className="input"
                />

                {/* Email invoerveld */}
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    onChange={handleInputChange}
                    required
                    className="input"
                />

                {/* Wachtwoord invoerveld */}
                <label>Wachtwoord:</label>
                <input
                    type="password"
                    name="wachtwoord"
                    onChange={handleInputChange}
                    required
                    className="input"
                />

                {/* Particulier specifieke velden */}
                {gebruiker.rol === "Particulier" && (
                    <>
                        <label>Adres:</label>
                        <input
                            type="text"
                            name="adres"
                            onChange={handleInputChange}
                            className="input"
                        />
                        <label>Telefoonnummer:</label>
                        <input
                            type="tel"
                            name="telefoonnummer"
                            onChange={handleInputChange}
                            className="input"
                        />
                    </>
                )}

                {/* Zakelijk specifieke velden */}
                {gebruiker.rol === "Zakelijk" && (
                    <>
                        <label>Bedrijfsnaam:</label>
                        <input
                            type="text"
                            name="bedrijfsNaam"
                            onChange={handleInputChange}
                            className="input"
                        />
                        <label>KVK-nummer:</label>
                        <input
                            type="text"
                            name="kvkNummer"
                            onChange={handleInputChange}
                            className="input"
                        />
                    </>
                )}

                {/* Submit knop */}
                <button type="submit" className="button">
                    Account Aanmaken
                </button>
            </form>

            {/* Fout- en succesberichten */}
            {success && <p className="success">{success}</p>}
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default GebruikerAanmaken;
