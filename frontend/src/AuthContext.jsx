import React, { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("jwtToken"); 
        if (token) {
            const userData = { email: localStorage.getItem("userEmail"), role: localStorage.getItem("role"), token: token };
            setUser(userData);  // Login user with token info
        }
    }, []);

    const login = (userData) => {
        setUser(userData);
        localStorage.setItem("jwtToken", userData.token);
        localStorage.setItem("userEmail", userData.email);
        localStorage.setItem("role", userData.role);
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem("jwtToken");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("role");
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
