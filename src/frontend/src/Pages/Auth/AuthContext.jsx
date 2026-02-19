import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const navigate = useNavigate();

    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!token;

    // Load from storage once
    useEffect(() => {
        const stored = localStorage.getItem("token");

        if (stored) {
            setToken(stored);
            api.defaults.headers.common["Authorization"] = `Bearer ${stored}`;
        }

        setLoading(false);

        // axios logout event
        const handleLogout = () => logout(false);
        window.addEventListener("auth:logout", handleLogout);

        return () => window.removeEventListener("auth:logout", handleLogout);

    }, []);

    const login = (accessToken, refreshToken) => {

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

        setToken(accessToken);

        navigate("/", { replace: true });
    };

    const logout = (redirect = true) => {

        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        delete api.defaults.headers.common["Authorization"];

        setToken(null);

        if (redirect)
            navigate("/auth", { replace: true });
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
