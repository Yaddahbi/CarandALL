import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";

const KlantGegevens = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        naam: "",
        email: "",
        adres: "",
        telefoonnummer: "",
    });

    useEffect(() => {
        if (user) {
            setFormData({
                naam: user.naam,
                email: user.email,
                adres: user.adres,
                telefoonnummer: user.telefoonnummer,
            });
        }
    }, [user]);

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
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Gegevens succesvol bijgewerkt!");
            } else {
                const data = await response.json();
                toast.error(data.message || "Er is iets fout gegaan.");
            }
        } catch (error) {
            toast.error("Er is een netwerkfout opgetreden.");
        }
    };

    return (
        <div className="form-container">
            <h2>Mijn Gegevens</h2>
            <form onSubmit={handleSubmit}>
                <label>Naam:</label>
                <input type="text" name="naam" value={formData.naam} onChange={handleChange} required />

                <label>Email:</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} required />

                <label>Adres:</label>
                <input type="text" name="adres" value={formData.adres} onChange={handleChange} required />

                <label>Telefoonnummer:</label>
                <input type="text" name="telefoonnummer" value={formData.telefoonnummer} onChange={handleChange} required />

                <button type="submit">Gegevens Bijwerken</button>
            </form>
        </div>
    );
};

export default KlantGegevens;