import React, { useState, useEffect } from "react";
import "../style/Abonnementen.css";
import { toast } from "sonner";

const BeschikbareOpties = [
    { type: "Pay-as-you-go", kosten: 0 },
    { type: "Prepaid", kosten: 200 },
];

const AboWijzigAbonnement = ({ huidigType, toekomstigeWijziging, onWijziging }) => {
    const [gekozenType, setGekozenType] = useState(huidigType || "");
    const [toonFormulier, setToonFormulier] = useState(false);

    useEffect(() => {
        setGekozenType(huidigType || ""); 
    }, [huidigType]);

    const volgendeMaand = new Date();
    volgendeMaand.setMonth(volgendeMaand.getMonth() + 1);
    volgendeMaand.setDate(1);

    const handleWijziging = async () => {
        if (!gekozenType) {
            toast.error("Geen geldig abonnementstype geselecteerd.");
            return;
        }

        try {
            const token = sessionStorage.getItem("jwtToken");
            if (!token) {
                throw new Error("Geen token gevonden. Log opnieuw in.");
            }

            const kosten = BeschikbareOpties.find((optie) => optie.type === gekozenType)?.kosten;

            const payload = {
                nieuwAbonnementType: gekozenType,
                nieuweKosten: kosten,
            };

            const response = await fetch("https://localhost:7040/api/Abonnement/update", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.title || "Fout bij het wijzigen van het abonnement.");
            }

            const data = await response.json();
            toast.success(data.message || "Abonnement gewijzigd.");
            setToonFormulier(false);
            onWijziging(gekozenType);
        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div className="wijzig-abonnement-container">
            <button
                className="wijzig-button"
                onClick={() => setToonFormulier(!toonFormulier)}
                disabled={!!toekomstigeWijziging}
            >
                {toekomstigeWijziging
                    ? `Wijziging gepland (${new Date(toekomstigeWijziging.ingangsdatum).toLocaleDateString()})`
                    : "Wijzig Abonnement"}
            </button>
            {toonFormulier && (
                <div className="wijzig-formulier">
                    <h3>Wijzig Abonnement</h3>
                    <select
                        value={gekozenType}
                        onChange={(e) => setGekozenType(e.target.value)}
                    >
                        {BeschikbareOpties.map((optie) => (
                            <option key={optie.type} value={optie.type}>
                                {optie.type} - {optie.type === "Pay-as-you-go" ? "Afhankelijk van gebruik" : `\u20AC ${optie.kosten}`}

                            </option>
                        ))}
                    </select>
                    {gekozenType === "Pay-as-you-go" && (
                        <p className="explanation">
                            Bij <strong>Pay-as-you-go</strong> betaalt u alleen voor wat u gebruikt. Er zijn geen vaste maandelijkse kosten.
                        </p>
                    )}
                    <p>
                        <em>
                            Let op: Wijzigingen gaan in op de eerste dag van de volgende maand (
                            {volgendeMaand.toLocaleDateString()}).
                        </em>
                    </p>
                    <button onClick={handleWijziging} disabled={gekozenType === huidigType}>
                        Bevestig Wijziging
                    </button>
                </div>
            )}
        </div>
    );
};

export default AboWijzigAbonnement;
