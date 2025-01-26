import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/KiesAccountType.css";

function KiesAccountType() {
    const navigate = useNavigate();

    return (
        <div className="account-type-container">
            <h2 className="account-type-title">Kies een accounttype</h2>
            <div className="button-group">
                <button
                    className="account-button particulier"
                    onClick={() => navigate("/registreer-particulier")}
                >
                    Particulier
                </button>
                <button
                    className="account-button zakelijk"
                    onClick={() => navigate("/registreer-zakelijk")}
                >
                    Zakelijk
                </button>
            </div>
        </div>
    );
}

export default KiesAccountType;
