import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

const SchadeDetails = () => {
    const { schadeId } = useParams();
    const [schade, setSchade] = useState(null);
    const [newOpmerking, setNewOpmerking] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    const fetchSchadeDetails = async (schadeId) => {
        const response = await fetch(`https://localhost:7040/api/Schade/${schadeId}`, {
            headers: {
                "Authorization": "Bearer <your_token>", // Voeg hier je token toe
            }
        });

        if (!response.ok) {
            throw new Error(`Fout bij het ophalen van schadedetails: ${response.statusText}`);
        }
        const data = await response.json();
        return data;
    }
    
    useEffect(() => {
        const SchadeDetails = async () => {
            try {
                const data = await fetchSchadeDetails(schadeId);
                setSchade(data);
                setLoading(false);
            } catch (err) {
                setLoading(false);
            }
        };

        SchadeDetails();
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
    
    const updateSchadeStatus = async (schadeId, status) => {
    const response = await fetch(`/api/schade/${schadeId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
    });

    if (!response.ok) {
        throw new Error("Fout bij het bijwerken van de status");
    }
    return await response.json();
    };
    const addOpmerking = async (schadeId, opmerking) => {
    const response = await fetch(`/api/schade/${schadeId}/opmerkingen`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ opmerking }),
    });

    if (!response.ok) {
        throw new Error("Fout bij het toevoegen van de opmerking");
    }
    return await response.json();
    };
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!schade) return <p>Geen schade-informatie beschikbaar.</p>;

    return (
        <div>
            <button onClick={() => navigate(-1)}>Terug naar lijst</button>
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