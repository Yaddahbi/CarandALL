import { useState, useEffect } from "react";
import '../style/SchadePagina.css';
import { voegSchadetoe, uploadSchadeFoto } from "../api";
import { useNavigate } from "react-router-dom";

const SchadeToevoegen = ({ onSchadeToevoegen }) => {
    const [beschrijving, setBeschrijving] = useState("");
    const [datum, setDatum] = useState("");
    const [status, setStatus] = useState("Open");
    const [foto, setFoto] = useState(null);
    const [kenteken, setKenteken] = useState("");
    const [voertuigId, setVoertuigId] = useState(null);
    const [voertuigGegevens, setVoertuigGegevens] = useState(null);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleFotoChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            setFoto(selectedFile);
        }
    };

    const handleKentekenZoeken = async () => {
        try {
            const response = await fetch(`https://localhost:7040/api/Voertuigs/kenteken/${encodeURIComponent(kenteken)}`);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Voertuig niet gevonden: ${errorText}`);
            }

            const voertuig = await response.json();
            console.log("API-respons voertuig:", voertuig); // Debugging API-response

            if (!voertuig || (!voertuig.id && !voertuig.voertuigId)) {
                throw new Error("Ongeldige voertuiggegevens ontvangen.");
            }

            setVoertuigId(voertuig.id || voertuig.voertuigId); // Gebruik voertuigId als id ontbreekt
            setVoertuigGegevens(voertuig);
            setError(null);
            console.log("Voertuig ID correct ingesteld:", voertuig.id || voertuig.voertuigId); // Debugging
        } catch (error) {
            console.error("Fout bij voertuig zoeken:", error.message);
            setError("Fout bij het zoeken van het voertuig: " + error.message);
        }
    };


    // ✅ useEffect om voertuigId correct te synchroniseren
    useEffect(() => {
        if (voertuigGegevens && voertuigGegevens.id) {
            setVoertuigId(voertuigGegevens.id);
            console.log("Voertuig ID ingesteld:", voertuigGegevens.id); // Debugging voertuigId
        }
    }, [voertuigGegevens]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        console.log("Huidige voertuig ID bij submit:", voertuigId); // Debugging voor submit

        if (!foto) {
            setError("Je moet minstens één foto toevoegen.");
            return;
        }

        if (!voertuigId) {
            setError("Je moet eerst een voertuig selecteren.");
            return;
        }

        try {
            const schadeData = {
                beschrijving,
                datum,
                status,
                voertuigId
            };

            console.log("SchadeData die wordt verstuurd:", schadeData); // Debugging schadeData

            const newSchade = await voegSchadetoe(schadeData);

            const fotoResponse = await uploadSchadeFoto(newSchade.SchadeId, foto);
            console.log("Foto upload succesvol:", fotoResponse);

            onSchadeToevoegen(newSchade);

            // Reset velden
            setBeschrijving("");
            setDatum("");
            setStatus("Open");
            setFoto(null);
            setKenteken("");
            setVoertuigId(null);
            setVoertuigGegevens(null);
        } catch (error) {
            setError("Fout bij toevoegen van schade: " + error.message);
        }
    };

    return (
        <div className="SchadeToevoegen">
            <h2>Schade Formulier</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Voer kenteken in: </label>
                    <input
                        type="text"
                        value={kenteken}
                        onChange={(e) => setKenteken(e.target.value)}
                        placeholder="Kenteken"
                    />
                    <button type="button" onClick={handleKentekenZoeken}>
                        Zoek Voertuig
                    </button>
                </div>

                {/* ✅ Toont de voertuiggegevens als het voertuig is gevonden */}
                {voertuigGegevens && (
                    <div>
                        <h3>Voertuig Gegevens:</h3>
                        <p><strong>Merk:</strong> {voertuigGegevens.merk}</p>
                        <p><strong>Soort:</strong> {voertuigGegevens.soort}</p>
                        <p><strong>Type:</strong> {voertuigGegevens.type}</p>
                        <p><strong>Kleur:</strong> {voertuigGegevens.kleur}</p>
                        <p><strong>Aanschafjaar:</strong> {voertuigGegevens.aanschafjaar}</p>
                    </div>
                )}

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
                <div>
                    <label>Foto toevoegen: </label>
                    <input
                        type="file"
                        onChange={handleFotoChange}
                    />
                </div>
                <button type="submit">Voeg Schade Toe</button>
            </form>

            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default SchadeToevoegen;
