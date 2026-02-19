import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const navigate = useNavigate();

  const [token, setToken] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem("token");

    if (stored) {
      setToken(stored);
      setIsAuthenticated(true);
      api.defaults.headers.common["Authorization"] = `Bearer ${stored}`;
    }

    setLoading(false);

    const handleLogout = () => logout(false);
    window.addEventListener("auth:logout", handleLogout);

    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const login = (newToken, refreshToken) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("refreshToken", refreshToken);

    api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;

    setToken(newToken);
    setIsAuthenticated(true);
  };

  const logout = (redirect = true) => {
    localStorage.clear();
    delete api.defaults.headers.common["Authorization"];

    setToken(null);
    setIsAuthenticated(false);

    if (redirect) navigate("/auth", { replace: true });
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
