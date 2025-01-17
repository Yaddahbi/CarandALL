import { useState } from "react";
import "../style/Abonnementen.css";
import { toast } from "sonner";

const AboWijzigAbonnement = ({ abonnementDetails, onAbonnementUpdated }) => {
    const [nieuwAbonnement, setNieuwAbonnement] = useState("");
    const [nieuweKosten, setNieuweKosten] = useState(0);
    const [loading, setLoading] = useState(false);

    const beschikbareOpties = [
        { type: "Pay-as-you-go", kosten: 50 },
        { type: "Prepaid", kosten: 200 },
    ];

    const handleAbonnementChange = (type) => {
        const geselecteerd = beschikbareOpties.find(optie => optie.type === type);
        setNieuwAbonnement(type);
        setNieuweKosten(geselecteerd.kosten);
    };

    const handleSubmit = async () => {
        if (!nieuwAbonnement) {
            toast.error("Selecteer een abonnementstype.");
            return;
        }

        setLoading(true);
        try {
            const token = localStorage.getItem("jwtToken");
            const response = await fetch("https://localhost:7040/api/Abonnement/update", {
                method: "PUT",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    NieuwAbonnementType: nieuwAbonnement,
                    NieuweKosten: nieuweKosten,
                }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Fout bij het bijwerken van het abonnement.");
            }

            toast.success("Abonnement succesvol bijgewerkt! Wijzigingen gaan in op de eerste dag van de volgende maand.");
            onAbonnementUpdated();
        } catch (error) {
            console.error("Fout:", error.message);
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    const volgendeMaand = new Date();
    volgendeMaand.setMonth(volgendeMaand.getMonth() + 1);
    volgendeMaand.setDate(1);

    return (
        <div className="wijzig-abonnement-container">
            <h3>Wijzig Abonnement</h3>
            <select
                className="abonnement-select"
                value={nieuwAbonnement}
                onChange={(e) => handleAbonnementChange(e.target.value)}
            >
                <option value="">Selecteer een nieuw abonnementstype</option>
                {beschikbareOpties.map((optie) => (
                    <option key={optie.type} value={optie.type}>
                        {optie.type} (€{optie.kosten}/maand)
                    </option>
                ))}
            </select>
            {nieuwAbonnement && (
                <p>Nieuwe kosten: <strong>€{nieuweKosten}</strong></p>
            )}
            <p>
                <em>Let op: Wijzigingen gaan in op de eerste dag van de volgende maand ({volgendeMaand.toLocaleDateString()}).</em>
            </p>
            <button onClick={handleSubmit} disabled={loading}>
                {loading ? "Bijwerken..." : "Wijzig Abonnement"}
            </button>
        </div>
    );
};

export default AboWijzigAbonnement;
