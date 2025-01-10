import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";

const KlantGegevens = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        Naam: "",
        Email: "",
        Adres: "",
        Telefoonnummer: "",
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                const response = await fetch(`https://localhost:7040/api/User/details`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
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
                    toast.error(data.message || "Kon gebruikersgegevens niet ophalen.");
                }
            } catch (error) {
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
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                toast.success("Gegevens succesvol bijgewerkt!");
            } else {
                const data = await response.json();
                console.error("Foutdetails:", data);
                toast.error(data.errors ? data.errors.join(", ") : data.message || "Er is iets fout gegaan.");
            }
        } catch (error) {
            toast.error("Er is een netwerkfout opgetreden.");
        }
    };

    return (
        <div className="form-container">
            <h2>Mijn Gegevens</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="Naam">Naam:</label>
                <input
                    type="text"
                    name="Naam"
                    id="Naam"
                    value={formData.Naam}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="Email">Email:</label>
                <input
                    type="email"
                    name="Email"
                    id="Email"
                    value={formData.Email}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="Adres">Adres:</label>
                <input
                    type="text"
                    name="Adres"
                    id="Adres"
                    value={formData.Adres}
                    onChange={handleChange}
                    required
                />

                <label htmlFor="Telefoonnummer">Telefoonnummer:</label>
                <input
                    type="text"
                    name="Telefoonnummer"
                    id="Telefoonnummer"
                    value={formData.Telefoonnummer}
                    onChange={handleChange}
                    required
                />

                <button type="submit">Gegevens Bijwerken</button>
            </form>
        </div>
    );
};

export default KlantGegevens;
