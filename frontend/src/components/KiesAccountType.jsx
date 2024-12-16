import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/KiesAccountType.css";

function KiesAccountType() {
    const navigate = useNavigate();

    return (
        <div className="form-container">
            <h2>Kies een accounttype</h2>
            <button onClick={() => navigate("/registreer-particulier")}>Particulier</button>
            <button onClick={() => navigate("/registreer-zakelijk")}>Zakelijk</button>
            <button onClick={() => navigate("/registreer-medewerker")}>Medewerker</button>
        </div>
    );
}

export default KiesAccountType;
