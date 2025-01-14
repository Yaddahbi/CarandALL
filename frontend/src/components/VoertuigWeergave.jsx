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
            await createHuurverzoek({ ...huurverzoekData, userId: {userId} });
            toast(`Huurverzoek succesvol aangemaakt!`, {
                description: 'Check de status in uw huurgeschiedenis.',
                type: 'succes',
            }) 
            setGeselecteerdVoertuig(null);
        } catch (err) {
            console.error("Fout bij maken huurverzoek:", err);
            toast(`Er ging iets fout: ${err.message}`, {
                type: 'error',
            }) 
            setError(err.message);
        }
    };

    if (!voertuigen.length) {
        return <p>Voertuigen worden geladen...</p>;
    }

    return (
        <div className="voertuigen-weergave">
            <div className="voertuigen-grid">
                {voertuigen.map((voertuig) => (
                    <div className="voertuigen-kaart" key={voertuig.voertuigId} role="article">
                        <p>
                            <strong>
                                {voertuig.merk} {voertuig.type} ({voertuig.soort})
                            </strong>
                        </p>
                        <p>Kleur: {voertuig.kleur}</p>
                        <p>Aanschafjaar: {voertuig.aanschafjaar}</p>
                        <p>Prijs per dag: €{voertuig.prijs}</p>
                        <button className = "huur-button" onClick={() => handleVoertuigKlik(voertuig)}>
                            Huur voertuig
                        </button>
                    </div>
                ))}
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

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default VoertuigWeergave;
