import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useAuth } from "../AuthContext";
import { toast } from "sonner";

function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useAuth();

    // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch("https://localhost:7040/api/User/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                const data = await response.json();
                login({ email: formData.email, role: data.role });
                localStorage.setItem("jwtToken", data.token);
                localStorage.setItem("userEmail", formData.email);
                toast.success("Inloggen succesvol!");
                navigate("/");
            } else {
                const errorData = await response.json();
                toast.error(errorData.error || "Ongeldige inloggegevens.");
                setError(errorData.error || "Ongeldige inloggegevens.");
            }
        } catch (err) {
            console.error("Login error:", err);
            toast.error("Er is iets misgegaan. Probeer het opnieuw.");
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <h2 className="login-title">Inloggen</h2>
                <form className="login-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">E-mail:</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Voer je e-mailadres in"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Wachtwoord:</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Voer je wachtwoord in"
                            required
                        />
                    </div>
                    <button type="submit" className="login-button">
                        Inloggen
                    </button>
                </form>
                {error && <p className="error-message">{error}</p>}
                <p className="signup-link">
                    Nog geen account?{" "}
                    <span onClick={() => navigate("/kies-account-type")} className="link-text">
                        Account aanmaken
                    </span>
                </p>
            </div>
        </div>
    );
}

export default Login;
