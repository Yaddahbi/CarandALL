import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import "../styles/KlantGegevens.css";

const KlantGegevens = () => {
    const { user, logout } = useAuth() || {}; // Fallback voor user en logout functie
    const [formData, setFormData] = useState({
        Naam: "",
        Email: "",
        Adres: "",
        Telefoonnummer: "",
    });
    const [statusMessage, setStatusMessage] = useState("");
    const [error, setError] = useState(null); // Foutbeheer
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await fetch(`https://localhost:7040/api/User/details`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    setFormData({
                        Naam: data.naam,
                        Email: data.email,
                        Adres: data.adres,
                        Telefoonnummer: data.phoneNumber,
                    });
                } else {
                    const data = await response.json();
                    setError(data.message || "Kon gebruikersgegevens niet ophalen.");
                    toast.error(data.message || "Kon gebruikersgegevens niet ophalen.");
                }
            } catch (error) {
                setError("Netwerkfout bij het ophalen van gebruikersgegevens.");
                toast.error("Netwerkfout bij het ophalen van gebruikersgegevens.");
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch(`https://localhost:7040/api/User/update`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setStatusMessage("Gegevens succesvol bijgewerkt!");
                toast.success("Gegevens succesvol bijgewerkt!");
            } else {
                const data = await response.json();
                setError(data.errors ? data.errors.join(", ") : data.message || "Er is iets fout gegaan.");
                toast.error(data.errors ? data.errors.join(", ") : data.message || "Er is iets fout gegaan.");
            }
        } catch (error) {
            setError("Er is een netwerkfout opgetreden.");
            toast.error("Er is een netwerkfout opgetreden.");
        }
    };

    const handleDeleteAccount = async () => {
        if (window.confirm("Weet je zeker dat je je account wilt verwijderen? Dit kan niet ongedaan worden gemaakt.")) {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await fetch(`https://localhost:7040/api/User/delete`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    toast.success("Account succesvol verwijderd.");
                    logout(); // Log de gebruiker uit
                    navigate("/login");
                } else {
                    const data = await response.json();
                    setError(data.message || "Er is iets fout gegaan.");
                    toast.error(data.message || "Er is iets fout gegaan.");
                }
            } catch (error) {
                setError("Er is een netwerkfout opgetreden.");
                toast.error("Er is een netwerkfout opgetreden.");
            }
        }
    };

    const goToPrivacy = () => {
        navigate("/privacy");
        window.scrollTo(0, 0);
    };

    return (
        <div className="user-form-container">
            <h2>Mijn Gegevens</h2>
            {error && <p className="error-message">{error}</p>} {/* Foutmeldingen */}
            <form className="user-form" onSubmit={handleSubmit}>
                <label htmlFor="Naam">Naam:</label>
                <input
                    type="text"
                    name="Naam"
                    id="Naam"
                    value={formData.Naam}
                    placeholder="Bijv. Jan Jansen"
                    onChange={handleChange}
                    required
                />

                <label htmlFor="Email">Email:</label>
                <input
                    type="email"
                    name="Email"
                    id="Email"
                    value={formData.Email}
                    placeholder="Bijv. jan.jansen@example.com"
                    onChange={handleChange}
                    required
                />

                <label htmlFor="Adres">Adres:</label>
                <input
                    type="text"
                    name="Adres"
                    id="Adres"
                    value={formData.Adres}
                    placeholder="Bijv. Hoofdstraat 123"
                    onChange={handleChange}
                    required
                />

                <label htmlFor="Telefoonnummer">Telefoonnummer:</label>
                <input
                    type="text"
                    name="Telefoonnummer"
                    id="Telefoonnummer"
                    value={formData.Telefoonnummer}
                    placeholder="Bijv. 0612345678"
                    onChange={handleChange}
                    required
                />

                <div className="privacy-link-container">
                    <span>
                        Bekijk onze{" "}
                        <span className="privacy-link" onClick={goToPrivacy}>
                            privacyverklaring
                        </span>.
                    </span>
                </div>

                <button className="update-button" type="submit">
                    Gegevens Bijwerken
                </button>
            </form>
            <div aria-live="polite" className="status-message">
                {statusMessage && <p>{statusMessage}</p>}
            </div>
            <button className="delete-button" onClick={handleDeleteAccount}>
                Verwijder Account
            </button>
        </div>
    );
};

export default KlantGegevens;