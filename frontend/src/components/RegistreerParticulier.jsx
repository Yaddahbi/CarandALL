import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RegistreerParticulier.css";
import { toast } from "sonner";

function RegistreerParticulier() {
    const [formData, setFormData] = useState({
        rol: "Particulier",
        naam: "",
        email: "",
        wachtwoord: "",
        adres: "",
        telefoonnummer: "",
    });
    const [isChecked, setIsChecked] = useState(false);
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
            toast.success("Account succesvol aangemaakt! U kunt nu inloggen.");
            navigate("/login");
        } else {
            const data = await response.json();
            toast.error(data.errors ? `Fouten: ${data.errors.join(", ")}` : "Er is iets fout gegaan.");
        }
    };

    return (
        <div className="regp">
            <div className="regp-container">
                <h2 className="regp-title">Registreer Particulier</h2>
                <form className="regp-form" onSubmit={handleSubmit}>
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

                    <div className="form-group privacy-consent">
                        <label>
                            <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                            Ik ga akkoord met de{" "}
                            <span className="privacy-link" onClick={() => navigate("/privacy")}>
                                privacyverklaring
                            </span>.
                        </label>
                    </div>

                    <button type="submit" className="regp-button">
                        Account aanmaken
                    </button>
                </form>
            </div>
        </div>
    );
}

export default RegistreerParticulier;
