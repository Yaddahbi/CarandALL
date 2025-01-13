import { useState, useEffect } from "react";
import { fetchSchades } from "../api";
import '../style/Schadelijst.css';

const SchadeLijst = ({ schadesProp }) => {

    const [schades, setSchades] = useState(schadesProp || []);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadSchades = async () => {
            try {
                const data = await fetchSchades();
                if (!data || data.length === 0) {
                    setError("Er zijn momenteel geen schades beschikbaar.");
                } else {
                    setSchades(data);
                }
            } catch (error) {
                setError("Fout bij het ophalen van schades: " + error.message);
                console.error("Fout bij het ophalen van schades: ", error);
            } finally {
                setLoading(false);
            }
        };

        loadSchades();
    }, []);
    const handleSchadeUpdate = async (schadeId, status = null, opmerking = null) => {
        try {
            if (status) {
                await updateSchadeStatus(schadeId, status);
                setSchades((prevSchades) =>
                    prevSchades.map((schade) =>
                        schade.schadeId === schadeId ? { ...schade, status } : schade
                    )
                );
            }

            if (opmerking) {
                alert(`Opmerking toegevoegd aan schade ${schadeId}: ${opmerking}`);
            }

        } catch (error) {
            setError("Fout bij het bijwerken van de schade: " + error.message);
            console.error("Fout bij het bijwerken van de schade:", error);
        }
    };

    
    return (
        <div className="SchadeLijst">
            <h1>Schadelijst</h1>
            {schades.length > 0 ? (
                <ul>
                    {schades.map((schade) => (
                        <li key={schade.schadeId}>
                            <p><strong>Beschrijving:</strong> {schade.beschrijving}</p>
                            <p><strong>Datum:</strong> {schade.datum}</p>
                            <p><strong>Status:</strong> {schade.status}</p>
                            <p><strong>Kosten:</strong> €{schade.kosten}</p>
                            <button onClick={() => handleSchadeUpdate(schade.schadeId, "in reparatie")}>
                                Zet in reparatie
                            </button>

                            {/* Toevoegen van opmerkingen over de schade */}
                            <div>
                                <input
                                    type="text"
                                    placeholder="Voeg een opmerking toe..."
                                    onBlur={(e) => handleSchadeUpdate(schade.schadeId, null, e.target.value)}
                                />
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>Geen schades gevonden.</p>
            )}
        </div>
    );
};

export default SchadeLijst;