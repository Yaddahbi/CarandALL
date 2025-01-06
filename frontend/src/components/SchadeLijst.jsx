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

    if (loading) return <div>Loading...</div>;
    if (error) return <div>{error}</div>;

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
                        </li>
                    ))}
                </ul>) : (
                <p>Geen schades gevonden.</p>
            )}
        </div>
    );
};

export default SchadeLijst;