import { useState } from "react";
import { voegSchadetoe } from "../api";
import '../Schadetoevoegen.css';

const SchadeToevoegen = ({ onSchadeToevoegen }) => {
    const [beschrijving, setBeschrijving] = useState("");
    const [datum, setDatum] = useState("");
    const [kosten, setKosten] = useState(0);
    const [status, setStatus] = useState("Open");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const schadeData = { beschrijving, datum, kosten, status };

        try {
            const newSchade = await voegSchadeToe(schadeData);
            console.log("Nieuwe schade toegevoegd:", newSchade);
            onSchadeToevoegen(newSchade); 
            setBeschrijving("");
            setDatum("");
            setKosten(0);
            setStatus("Open");
        } catch (error) {
            setError("Fout bij toevoegen van schade: " + error.message); 
        }
    };

    return (
            <div className="Schade Toevoegen">
                <h1>Schade Toevoegen</h1>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>Beschrijving: </label>
                        <input
                            type="text"
                            value={beschrijving}
                            onChange={(e) => setBeschrijving(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Datum: </label>
                        <input
                            type="date"
                            value={datum}
                            onChange={(e) => setDatum(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Kosten: </label>
                        <input
                            type="number"
                            value={kosten}
                            onChange={(e) => setKosten(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label>Status: </label>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="Open">Open</option>
                            <option value="In behandeling">In behandeling</option>
                            <option value="Afgehandeld">Afgehandeld</option>
                        </select>
                    </div>
                    <button type="submit">Voeg Schade Toe</button>
                </form>
                {error && <p style={{color: "red"}}>{error}</p>} {/* Foutmelding als er een probleem is */}
            </div>
            );
            };

            export default SchadeToevoegen;