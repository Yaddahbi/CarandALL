import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = sessionStorage.getItem("jwtToken");
        if (token) {
            const userData = {
                email: sessionStorage.getItem("userEmail"),
                role: sessionStorage.getItem("role"),
                name: sessionStorage.getItem("userName"),
                token: token,
            };
            setUser(userData);
        }
        setLoading(false);
    }, []);

    const login = (userData) => {
        setUser(userData);
        sessionStorage.setItem("jwtToken", userData.token);
        sessionStorage.setItem("userEmail", userData.email);
        sessionStorage.setItem("role", userData.role);
        sessionStorage.setItem("userName", userData.name);
    };

    const logout = () => {
        setUser(null);
        sessionStorage.removeItem("jwtToken");
        sessionStorage.removeItem("userEmail");
        sessionStorage.removeItem("role");
        sessionStorage.removeItem("userName");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
