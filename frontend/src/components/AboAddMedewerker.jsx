import { useState } from "react";
import { toast } from 'sonner';

const AboAddMedewerker = ({ refreshMedewerkers }) => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const token = localStorage.getItem('jwtToken');
        try {
            const response = await fetch('https://localhost:7040/api/Abonnement/add-medewerker', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${token}`                },
                body: JSON.stringify({ email }),
            });

            if (response.ok) {
                toast.success("Medewerker succesvol toegevoegd!");
                setEmail(""); // Reset 
                refreshMedewerkers();
            } else {
                const data = await response.json();
                toast.error(data.message || "Er is iets fout gegaan.");
            }
        } catch (error) {
            toast.error("Er is een netwerkfout opgetreden.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Medewerker toevoegen</h2>
            <form onSubmit={handleSubmit}>
                <label htmlFor="email">Zakelijk e-mailadres:</label>
                <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="bijv. medewerker@bedrijf.com"
                    required
                />
                <button type="submit" disabled={loading}>
                    {loading ? "Bezig met toevoegen..." : "Toevoegen"}
                </button>
            </form>
        </div>
    );
}

export default AboAddMedewerker;
