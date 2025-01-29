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
        abonnementType: "Pay-as-you-go", 
    });

    const [isChecked, setIsChecked] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCheckboxChange = (event) => {
        setIsChecked(event.target.checked);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!isChecked) {
            toast.error("U moet akkoord gaan met de privacyverklaring om verder te gaan.");
            return;
        }

        try {
            const response = await fetch("https://localhost:7040/api/User/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Bedrijfsaccount succesvol aangemaakt! U kunt nu inloggen.");
                window.scrollTo(0, 0); 
                navigate("/login");   
            } else {
                const data = await response.json();
                toast.error(data.errors ? `Fouten: ${data.errors.join(", ")}` : "Er is iets fout gegaan.");
            }
        } catch (error) {
            toast.error("Er is een netwerkfout opgetreden. Controleer uw verbinding.");
        }
    };

    return (
        <div className="regz">
            <div className="regz-container">
                <h2 className="regz-title">Registreer Zakelijk</h2>
                <form className="regz-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">E-mail:</label>
                        <input id="email" type="email" name="email" onChange={handleChange} required />
                        <small>Vul een geldig e-mailadres in.</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Wachtwoord:</label>
                        <input id="password" type="password" name="wachtwoord" onChange={handleChange} required />
                        <small>Minimaal 6 tekens, 1 hoofdletter en 1 speciaal teken.</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="naam">Volledige Naam:</label>
                        <input id="naam" type="text" name="naam" onChange={handleChange} required />
                        <small>Gebruik uw voor- en achternaam.</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="adres">Adres:</label>
                        <input id="adres" type="text" name="adres" onChange={handleChange} required />
                        <small> Vul uw volledige adres in (straatnaam en huisnummer).</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefoonnummer">Telefoonnummer:</label>
                        <input id="telefoonnummer" type="text" name="telefoonnummer" onChange={handleChange} required />
                        <small>Voer een geldig telefoonnummer in.</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="bedrijfsNaam">Bedrijfsnaam:</label>
                        <input id="bedrijfsNaam" type="text" name="bedrijfsNaam" onChange={handleChange} required />
                        <small>Vul de naam van uw bedrijf in.</small>
                    </div>

                    <div className="form-group">
                        <label htmlFor="kvkNummer">KVK-nummer:</label>
                        <input id="kvkNummer" type="text" name="kvkNummer" onChange={handleChange} required />
                        <small>Voer het KVK-nummer van het bedrijf in (8 cijfers).</small>
                    </div>

                    <label>
                        Abonnementstype:
                        <span
                            className="info-icon"
                            onMouseEnter={() => setShowTooltip(true)}
                            onMouseLeave={() => setShowTooltip(false)}
                            aria-label="Meer informatie over abonnementen"
                        >
                            ℹ️
                        </span>
                        {showTooltip && (
                            <div className="tooltip">
                                <p><strong>Pay-as-you-go:</strong> Betaal alleen voor wat u gebruikt, ideaal voor flexibel gebruik.</p>
                                <p><strong>Prepaid:</strong> Betaal vooraf en geniet van korting. (€200 per maand)</p>
                            </div>
                        )}
                    </label>
                    <select name="abonnementType" onChange={handleChange} required>
                        <option value="Pay-as-you-go">Pay-as-you-go</option>
                        <option value="Prepaid">Prepaid</option>
                    </select>

                    <div className="privacy-consent">
                        <label>
                        <input
                            type="checkbox"
                            checked={isChecked}
                            onChange={handleCheckboxChange}
                        />
                        <span>
                            Ik ga akkoord met de{" "}
                            <span
                                className="privacy-link"
                                onClick={() => {
                                    navigate('/privacy');
                                    setTimeout(() => window.scrollTo(0, 0), 100);
                                }}
                            >
                                privacyverklaring
                            </span>.
                        </span>
                    </label>
                    </div>

                    <button type="submit" className="regz-button">
                        Account aanmaken
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegistreerZakelijk;
