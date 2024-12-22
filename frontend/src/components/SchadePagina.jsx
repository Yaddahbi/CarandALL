import { useState, useEffect } from "react";
import { fetchSchades, voegSchadetoe } from "../api";
import SchadeLijst from "./SchadeLijst";
import SchadeToevoegen from "./SchadeToevoegen";
import '../Schadepagina.css';

const SchadePagina = () => {
    const [schades, setSchades] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showLijst, setShowLijst] = useState(null);

    useEffect(() => {
        if (showLijst === true) {
            // Alleen schades ophalen als "Schade Lijst" is gekozen
            const loadSchades = async () => {
                setLoading(true);
                try {
                    const data = await fetchSchades();
                    if (data && data.length === 0) {
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
        }
    }, [showLijst]);
    
    const handleSchadeToevoegen = async (newSchade) => {
        try {
            const addedSchade = await voegSchadeToe(newSchade); 
            setSchades((prevSchades) => [...prevSchades, addedSchade]);
            setShowLijst(true);
        } catch (err) {
            setError("Fout bij het toevoegen van schade: " + err.message); 
        }
    };
    if (loading) return <div>Loading...</div>;

    return (
        <div className="Schades">
            <h1>Schadebeheer</h1>

            {showLijst === null && (
                <div>
                    <button onClick={() => setShowLijst(true)}>Schade Lijst</button>
                    <button onClick={() => setShowLijst(false)}>Voeg Schade Toe</button>
                </div>
            )}
            {showLijst === true && !loading && (
                <SchadeLijst schades={schades} />
            )}

            {showLijst === true && loading && <div>Loading...</div>}

            {showLijst === false && (
                <SchadeToevoegen onSchadeToevoegen={handleSchadeToevoegen} />
            )}

            {/* Toon foutmelding als er iets misgaat */}
            {error && <p style={{color: "red"}}>{error}</p>}
        </div>
    );
};

export default SchadePagina;
