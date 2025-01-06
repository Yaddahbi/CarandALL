import React, { useState, useEffect } from "react";
import { fetchSchades } from "../api";
import SchadeLijst from "./SchadeLijst";
import SchadeToevoegen from "./SchadeToevoegen";
import '../Schadepagina.css';

const SchadePagina = () => {
    const [schades, setSchades] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [activePage, setActivePage] = useState(null);

    const loadSchades = async () => {
        setLoading(true);
        setError(null);
        try {
            const data = await fetchSchades();
            if (data && data.length === 0) {
                setError("Er zijn momenteel geen schades beschikbaar.");
            } else {
                setSchades(data);
            }
        } catch (error) {
            setError("Fout bij het ophalen van schades: " + error.message);
            console.error("Fout bij het ophalen van schades:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSchadeToevoegen = async (newSchade) => {
        try {
            const addedSchade = await voegSchadeToe(newSchade);
            setSchades((prevSchades) => [...prevSchades, addedSchade]);
            setActivePage("Lijst");
        } catch (err) {
            setError("Fout bij het toevoegen van schade: " + err.message);
            console.error("Fout bij het toevoegen van schade:", err);
        }
    };
    useEffect(() => {
        if (activePage === "lijst") {
            loadSchades();
        }
    }, [activePage]);

    return (
        <div className="Schades">
            <h1>Schades</h1>

            <div>
                <button onClick={() => setActivePage("lijst")}>Schade Lijst</button>
                <button onClick={() => setActivePage("toevoegen")}>Voeg Schade Toe</button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {activePage === "lijst" && (
                <>
                    {loading ? (
                        <div>Schades worden geladen...</div>
                    ) : (
                        <SchadeLijst schades={schades} />
                    )}
                </>
            )}

            {activePage === "toevoegen" && (
                <SchadeToevoegen onSchadeToevoegen={handleSchadeToevoegen} />
            )}
        </div>
    );
};


export default SchadePagina;