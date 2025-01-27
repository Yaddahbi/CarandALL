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
        abonnementType: "Pay-as-you-go", // default waarde
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

        const response = await fetch("https://localhost:7040/api/User/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            toast.success("Bedrijfsaccount succesvol aangemaakt! U kunt nu inloggen.");
            navigate("/login");
        } else {
            const data = await response.json();
            toast.error(data.errors ? `Fouten: ${data.errors.join(", ")}` : "Er is iets fout gegaan.");
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
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Wachtwoord:</label>
                        <input id="password" type="password" name="wachtwoord" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="naam">Volledige Naam:</label>
                        <input id="naam" type="text" name="naam" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="adres">Adres:</label>
                        <input id="adres" type="text" name="adres" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="telefoonnummer">Telefoonnummer:</label>
                        <input id="telefoonnummer" type="text" name="telefoonnummer" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="bedrijfsNaam">Bedrijfsnaam:</label>
                        <input id="bedrijfsNaam" type="text" name="bedrijfsNaam" onChange={handleChange} required />
                    </div>

                    <div className="form-group">
                        <label htmlFor="kvkNummer">KVK-nummer:</label>
                        <input id="kvkNummer" type="text" name="kvkNummer" onChange={handleChange} required />
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
                        <option value="PayAsYouGo">Pay-as-you-go</option>
                        <option value="Prepaid">Prepaid</option>
                    </select>

                    <label className="privacy-consent">
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
                                    window.scrollTo(0, 0);
                                }}
                            >
                                privacyverklaring
                            </span>.
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
