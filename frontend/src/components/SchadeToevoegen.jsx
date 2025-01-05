import { useState } from "react";
import { voegSchadeToe } from "../api";
import "../Schadetoevoegen.css";
import { toast } from 'sonner';

const SchadeToevoegen = ({ onSchadeToevoegen }) => {
    const [voertuigId, setVoertuigId] = useState("");
    const [beschrijving, setBeschrijving] = useState("");
    const [kosten, setKosten] = useState(0);
    const [status, setStatus] = useState("Open");
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const schadeData = {
            VoertuigId: voertuigId,
            Beschrijving: beschrijving,
            Kosten: parseFloat(kosten),
            Status: status
        };
        console.log("Schade data verzonden:", schadeData); // Debug-log
        try {
            const newSchade = await voegSchadeToe(schadeData);
            console.log("Nieuwe schade toegevoegd:", newSchade);
            onSchadeToevoegen(newSchade);
            toast('Nieuwe schade toegevoegd!', {
                type: 'success', 
            })
            // Reset formulier
            setVoertuigId("");
            setBeschrijving("");
            setKosten(0);
            setStatus("Open");
        } catch (error) {
            setError("Fout bij toevoegen van schade: " + error.message);
        }
    };

    return (
        <div className="SchadeToevoegen">
            <h1>Schade Toevoegen</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Voertuig ID:</label>
                    <input
                        type="number"
                        value={voertuigId}
                        onChange={(e) => setVoertuigId(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Beschrijving:</label>
                    <input
                        type="text"
                        value={beschrijving}
                        onChange={(e) => setBeschrijving(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Kosten:</label>
                    <input
                        type="number"
                        value={kosten}
                        onChange={(e) => setKosten(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <label>Status:</label>
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
        </div>
    );
};

export default SchadeToevoegen;