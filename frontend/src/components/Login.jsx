import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Login.css";
import { useAuth } from "../AuthContext";
import { toast } from 'sonner';
function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const navigate = useNavigate();
    const { login } = useAuth();
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("https://localhost:7040/api/User/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(formData),
        });

        if (response.ok) {
            const data = await response.json();
            login({ email: formData.email, role: data.role });
           /* toast('Inloggen succesvol!', {
                type: 'success',
            }) */
            localStorage.setItem('jwtToken', data.token);
            localStorage.setItem('userEmail', formData.email); 
            navigate("/");
        } else {
            const errorData = await response.json();
            toast('Ongeldige inloggegevens', {
                type: 'error',
            })
            setError(errorData.error || "Ongeldige inloggegevens.");
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

                <button className= "loginbtn" type="submit">Inloggen</button>
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
