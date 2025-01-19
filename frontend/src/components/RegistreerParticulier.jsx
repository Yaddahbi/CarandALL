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
            toast('U moet akkoord gaan met de privacyverklaring om verder te gaan.', {
                type: 'error',
            });
            return;
        }

        const response = await fetch("https://localhost:7040/api/User/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            toast(`Account succesvol aangemaakt!`, {
                description: 'U kunt nu inloggen.',
                type: 'succes',
            });
            navigate("/login");
        } else {
            const data = await response.json();
            if (data.errors) {
                toast(`Fouten: ${data.errors.join(", ")}`, {
                    type: 'error',
                });
            } else {
                toast(`Er is iets fout gegaan`, {
                    type: 'error',
                });
            }
        }
    };

    return (
        <div className="regp">
            <div className="regp-container">
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
                        </span>
                    </label>


                    <button type="submit">Account aanmaken</button>
                </form>
            </div>
        </div>
    );
}

export default RegistreerParticulier;
