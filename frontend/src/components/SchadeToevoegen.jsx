import { useState } from "react";
import '../style/SchadePagina.css';
import { voegSchadetoe, uploadSchadeFoto, zoekVoertuigOpKenteken } from "../api";
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
            const voertuig = await zoekVoertuigOpKenteken(kenteken);
            if (voertuig) {
                setVoertuigId(voertuig.id);
                setVoertuigGegevens(voertuig);
            } else {
                setError("Voertuig met dit kenteken niet gevonden.");
            }
        } catch (error) {
            setError("Fout bij het zoeken van het voertuig: " + error.message);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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

            const newSchade = await voegSchadetoe(schadeData); 

            
            const fotoResponse = await uploadSchadeFoto(newSchade.SchadeId, foto); 
            console.log("Foto upload succesvol:", fotoResponse);
            
            onSchadeToevoegen(newSchade);
            
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
        <div className="Schade Toevoegen">
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
                {/* Toont de voertuiggegevens als het voertuig is gevonden */}
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
                <label>Datum: </label>
                <input
                    type="date"
                    value={datum}
                    onChange={(e) => setDatum(e.target.value)}
                    required
                />
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
            {error && <p style={{color: "red"}}>{error}</p>} {/* Foutmelding als er een probleem is */}
        </div>
    );
};

export default SchadeToevoegen;