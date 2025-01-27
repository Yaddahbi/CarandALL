import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SchadeDetails = () => {
    const { schadeId } = useParams(); 
    const [schade, setSchade] = useState(null);
    const [newOpmerking, setNewOpmerking] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const loadSchadeDetails = async () => {
            try {
                const data = await fetchSchadeDetails(schadeId);
                setSchade(data);
            } catch (err) {
                setError("Fout bij het ophalen van schadedetails: " + err.message);
            }
        };
        loadSchadeDetails();
    }, [schadeId]);

    const handleUpdateStatus = async (status) => {
        try {
            await updateSchadeStatus(schadeId, status);
            setSchade((prev) => ({ ...prev, status }));
        } catch (err) {
            setError("Fout bij het bijwerken van de status: " + err.message);
        }
    };

    const handleAddOpmerking = async () => {
        try {
            await addOpmerking(schadeId, newOpmerking);
            setSchade((prev) => ({
                ...prev,
                opmerkingen: [...prev.opmerkingen, newOpmerking],
            }));
            setNewOpmerking("");
        } catch (err) {
            setError("Fout bij het toevoegen van een opmerking: " + err.message);
        }
    };

    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!schade) return <p>Geen schade-informatie beschikbaar.</p>;

    return (
        <div>
            <button onClick={() => history.goBack()}>Terug naar lijst</button>
            <h2>Schadedetails</h2>
            <p><strong>Beschrijving:</strong> {schade.beschrijving}</p>
            <p><strong>Datum:</strong> {schade.datum}</p>
            <p><strong>Status:</strong> {schade.status}</p>
            <button onClick={() => handleUpdateStatus("in reparatie")}>
                Zet in reparatie
            </button>
            <h3>Opmerkingen</h3>
            <ul>
                {schade.opmerkingen.map((opmerking, index) => (
                    <li key={index}>{opmerking}</li>
                ))}
            </ul>
            <input
                type="text"
                value={newOpmerking}
                onChange={(e) => setNewOpmerking(e.target.value)}
                placeholder="Voeg een opmerking toe"
            />
            <button onClick={handleAddOpmerking}>Voeg toe</button>
        </div>
    );
};

export default SchadeDetails;