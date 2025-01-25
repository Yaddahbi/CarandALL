import { useState } from "react";
import { voegSchadetoe } from "../api";
import { useNavigate } from "react-router-dom";
import { uploadSchadeFoto } from "../api";

const SchadeToevoegen = ({ onSchadeToevoegen }) => {
    const [beschrijving, setBeschrijving] = useState("");
    const [datum, setDatum] = useState("");
    const [kosten, setKosten] = useState(0);
    const [status, setStatus] = useState("Open");
    const [foto, setFoto] = useState([]);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleFotoChange = (e) => {
        const selectedFiles = e.target.files;
        const validFiles = [];
        let errorMessage = "";

        for (let i = 0; i < selectedFiles.length; i++) {
            const file = selectedFiles[i];
            if (file.size > 5000000) {
                errorMessage = "Een of meer foto's zijn te groot (max. 5MB).";
                break;
            } else if (!file.type.startsWith("image/")) {
                errorMessage = "Alle bestanden moeten afbeeldingen zijn.";
                break;
            } else {
                validFiles.push(file);
            }
        }

        if (errorMessage) {
            setError(errorMessage);
        } else {
            setError(null);
            setFoto(validFiles);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!Array.isArray(foto) || foto.length === 0) {
            setError("Je moet minstens één foto toevoegen.");
            return;
        }

        try {
           
            const fotoUrls = await Promise.all(foto.map((file) => uploadSchadeFoto(file)));

            console.log("Geüploade foto's:", fotoUrls);

            
            const schadeData = {
                beschrijving,
                datum,
                kosten,
                status,
                foto: fotoUrls, 
            };

            console.log("Gegevens die worden verzonden:", schadeData);

            
            const newSchade = await voegSchadetoe(schadeData);
            console.log("Nieuwe schade toegevoegd:", newSchade);

            
            onSchadeToevoegen(newSchade);

            
            setBeschrijving("");
            setDatum("");
            setKosten(0);
            setStatus("Open");
            setFoto([]);
            setError(null);
        } catch (error) {
            setError("Fout bij toevoegen van schade: " + error.message);
        }
    };
    
    const handleGoBack = () => {
        navigate("/schade"); 
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
                            min="0"
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
                        <label>Foto's toevoegen: </label>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleFotoChange}
                        />
                    </div>

                    <button type="submit">Voeg Schade Toe</button>
                </form>
                {error && <p style={{ color: "red" }}>{error}</p>} {/* Foutmelding */}

                {foto.length > 0 && (
                    <div>
                        <h3>Geselecteerde Foto's</h3>
                        <ul>
                            {foto.map((file, index) => (
                                <li key={index}>{file.name}</li>
                            ))}
                        </ul>
                    </div>
                )}
                <button onClick={handleGoBack}>Terug naar Schade Pagina</button>
            </div>
        );
};

export default SchadeToevoegen;