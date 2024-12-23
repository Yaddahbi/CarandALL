import { useState } from "react";
import VoertuigFormulier from "./VoertuigFormulier";
import { createHuurverzoek } from "../api";

const VoertuigWeergave = ({ voertuigen, filters }) => {
    const [geselecteerdVoertuig, setGeselecteerdVoertuig] = useState(null);
    const [error, setError] = useState(null);

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
            await createHuurverzoek({ ...huurverzoekData, userId: "642f2dac-615f-4700-b088-10990e8d1d39" });
            alert("Huurverzoek succesvol aangemaakt!");
            setGeselecteerdVoertuig(null);
        } catch (err) {
            console.error("Fout bij maken huurverzoek:", err);
            alert(`Er ging iets fout: ${err.message}`);
            setError(err.message);
        }
    };

    if (!voertuigen.length) {
        return <p>Geen voertuigen gevonden</p>;
    }

    return (
        <div className="voertuigen-weergave">
            <h3>Beschikbare Voertuigen</h3>
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
                        <p>Status: {voertuig.status}</p>
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
