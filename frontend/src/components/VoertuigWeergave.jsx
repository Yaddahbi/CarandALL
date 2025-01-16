import { useState } from "react";
import VoertuigFormulier from "./VoertuigFormulier";
import { createHuurverzoek } from "../api";
import { useAuth } from "../AuthContext";
import { toast } from 'sonner';

const VoertuigWeergave = ({ voertuigen, filters }) => {
    const [geselecteerdVoertuig, setGeselecteerdVoertuig] = useState(null);
    const [error, setError] = useState(null);
    const { user } = useAuth();
    const userId = user?.id;

    const getImagePath = (name) => {
        if (!name) {
            console.log("No vehicle name provided. Using placeholder.");
            return "src/images/cars/placeholder.png";
        }
        const formattedName = name.replace(/ /g, "_").toLowerCase();
        return {
            jpg: `src/images/cars/${formattedName}.jpg`,
            png: `src/images/cars/${formattedName}.png`,
        };
    };

    const handleVoertuigKlik = (voertuig) => {
        setGeselecteerdVoertuig({
            voertuig,
            startDatum: filters.startDatum,
            eindDatum: filters.eindDatum,
        });
    };

    const handleFormulierSluiten = () => {
        setGeselecteerdVoertuig(null);
    };

    const handleHuurverzoek = async (huurverzoekData) => {
        try {
            await createHuurverzoek({ ...huurverzoekData, userId });
            toast("Huurverzoek succesvol aangemaakt!", {
                description: "Check de status in uw huurgeschiedenis.",
                type: "success",
            });
            setGeselecteerdVoertuig(null);
        } catch (err) {
            console.error("Fout bij maken huurverzoek:", err);
            toast(`Er ging iets fout: ${err.message}`, {
                type: "error",
            });
            setError(err.message);
        }
    };

    if (!voertuigen || voertuigen.length === 0) {
        return <p>Geen voertuigen gevonden</p>;
    }

    return (
        <div className="voertuigen-weergave">
            <h3>Beschikbare Voertuigen</h3>
            <div className="voertuigen-grid">
                {voertuigen.map((voertuig) => {
                    const { jpg, png } = getImagePath(`${voertuig.merk} ${voertuig.type}`);
                    return (
                        <div
                            className="voertuigen-kaart"
                            key={voertuig.voertuigId}
                            role="article"
                            aria-labelledby={`voertuig-${voertuig.voertuigId}`}
                        >
                            <img
                                src={jpg}
                                alt={`${voertuig.merk} ${voertuig.type}`}
                                onError={(e) => {
                                    e.target.onerror = null;
                                    const fallbackSrc = png;
                                    if (e.target.src !== fallbackSrc) {
                                        e.target.src = fallbackSrc;
                                    } else {
                                        e.target.src = "src/images/cars/placeholder.png";
                                    }
                                }}
                            />
                            <p id={`voertuig-${voertuig.voertuigId}`}>
                                <strong>{voertuig.merk} {voertuig.type} ({voertuig.soort})</strong>
                            </p>
                            <p>Kleur: {voertuig.kleur}</p>
                            <p>Aanschafjaar: {voertuig.aanschafjaar}</p>
                            <p>Prijs per dag: €{voertuig.prijs}</p>
                            <p>Status: {voertuig.status}</p>
                            <button
                                onClick={() => handleVoertuigKlik(voertuig)}
                                aria-label={`Huur ${voertuig.merk} ${voertuig.type}`}
                            >
                                Huur voertuig
                            </button>
                        </div>
                    );
                })}
            </div>

            {geselecteerdVoertuig && (
                <VoertuigFormulier
                    voertuig={geselecteerdVoertuig.voertuig}
                    startDatum={geselecteerdVoertuig.startDatum}
                    eindDatum={geselecteerdVoertuig.eindDatum}
                    onClose={handleFormulierSluiten}
                    onSubmit={handleHuurverzoek}
                />
            )}

            {error && <p style={{ color: "red" }} aria-live="assertive">{error}</p>}
        </div>
    );
};

export default VoertuigWeergave;
