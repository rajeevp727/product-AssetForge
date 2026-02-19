import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

    const [token, setToken] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);   // ⭐ IMPORTANT

    useEffect(() => {
        const stored = localStorage.getItem("token");

        if (stored) {
            setToken(stored);
            setIsAuthenticated(true);
        }

        setLoading(false);

        // listen interceptor logout
        const handleLogout = () => {
            setToken(null);
            setIsAuthenticated(false);
        };

        window.addEventListener("auth:logout", handleLogout);
        return () => window.removeEventListener("auth:logout", handleLogout);

    }, []);


    const login = (newToken, refreshToken) => {
        login(res.data.token, res.data.refreshToken);
        api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;
        setToken(newToken);
        setIsAuthenticated(true);
    };


    const logout = () => {
        localStorage.clear();
        setToken(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ token, isAuthenticated, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
