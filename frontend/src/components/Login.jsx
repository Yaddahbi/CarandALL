import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../AuthContext";
import "../styles/Login.css";

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
                login({ email: formData.email, role: data.role, name: data.name,});
                sessionStorage.setItem("jwtToken", data.token);
                sessionStorage.setItem("userEmail", formData.email);
                sessionStorage.setItem("userName", data.name); 
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
        <div className="login-pagina">
            <div className="loginform-container">
                <h2>Inloggen</h2>
                <form onSubmit={handleSubmit}>
                    <label>E-mail:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />

                    <label>Wachtwoord:</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />

                    <button className="loginbtn" type="submit">Inloggen</button>
                </form>
                { /*} {error && <p className="error">{error}</p>} { */}
                <p>
                    Nog geen account? <a onClick={() => navigate("/kies-account-type")}>Account aanmaken</a>
                </p>
            </div>
        </div>
    );
}

export default Login;
