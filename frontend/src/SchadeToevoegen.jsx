import { useState } from "react";
import { addSchade } from "./api";

const SchadeToevoegen = ({ onSchadeToevoegen }) => {
    const [beschrijving, setBeschrijving] = useState("");
    const [datum, setDatum] = useState("");
    const [kosten, setKosten] = useState(0);
    const [error, setError] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newSchade = await voegSchadeToe({ beschrijving, datum, kosten });
            console.log("Nieuwe schade toegevoegd:", newSchade);  
            onSchadeToevoegen(newSchade);
            setBeschrijving("");
            setDatum("");
            setKosten(0);
        } catch (err) {
            setError("Fout bij toevoegen van schade");
        }
    };

    return (
        <div>
            <h3>Schade Toevoegen</h3>
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
                <button type="submit">Voeg Schade Toe</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
};

export default SchadeToevoegen;