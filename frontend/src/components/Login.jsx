import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";

function Login() {
    const [formData, setFormData] = useState({ email: "", wachtwoord: "" });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("/api/account/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            navigate("/home");
        } else {
            alert("Ongeldige inloggegevens.");
        }
    };

    return (
        <div className="form-container">
            <h2>Inloggen</h2>
            <form onSubmit={handleSubmit}>
                <label>E-mail:</label>
                <input type="email" name="email" onChange={handleChange} required />

                <label>Wachtwoord:</label>
                <input type="password" name="wachtwoord" onChange={handleChange} required />

                <button type="submit">Inloggen</button>
            </form>
            <p>
                Nog geen account? <a onClick={() => navigate("/kies-account-type")}>Account aanmaken</a>
            </p>
        </div>
    );
}

export default Login;
