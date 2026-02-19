import { useState, useEffect, useRef } from "react";
import "./Auth.css";
import api from "../../api/axios";
import { useAuth } from "./AuthContext";
import { useTheme } from "../../ThemeContext";
import { useNavigate } from "react-router-dom";


const defaultRoles = [
    { id: 1, name: "User" },
    { id: 0, name: "Admin" },
    { id: 2, name: "Buyer" }
];

export default function Auth() {
    const { login } = useAuth();
    const emailRef = useRef(null);
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("rajeevp727@gmail.com");
    const [password, setPassword] = useState("Pass123");
    const roles = defaultRoles;
    const [selectedRole, setSelectedRole] = useState(1);
    const [error, setError] = useState("");
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    useEffect(() => {
        if (emailRef.current) emailRef.current.focus();
    }, [isLogin]);

    const submit = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setError("");

        try {
            if (isLogin) {
                const res = await api.post("/Auth/login", { email, password });

                login(res.data.Token, res.data.RefreshToken);

                // attach token instantly so navbar requests don't 401
                api.defaults.headers.common["Authorization"] = `Bearer ${res.data.token}`;

                navigate("/", { replace: true });

            } else {
                await api.post("/Auth/register", {
                    email,
                    password,
                    requestedRole: selectedRole
                });

                setIsLogin(true);
                setError("Account created. Please login.");
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data || "Server error");
        }
    };


    return (
        <div className="auth-wrapper">
            <div className="theme-toggle">
                <button type="button" onClick={(e) => {
                    e.stopPropagation();
                    toggleTheme();
                }}
                >
                    {theme === "dark" ? "☀ Light" : "🌙 Dark"}
                </button>

            </div>

            <div className="auth-container">

                <div className="left-panel">
                    <div className="overlay">
                        <h2>{isLogin ? "Welcome!" : "Hello there!"}</h2>
                        <p>{isLogin ? "Create your account for free" : "Already have an account?"}</p>
                        <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
                            {isLogin ? "Sign Up" : "Login"}
                        </button>
                    </div>
                </div>

                <div className="right-panel">
                    <form className="form" onSubmit={submit}>
                        <h2>{isLogin ? "Login" : "Sign Up"}</h2>

                        <input
                            placeholder="Email address"
                            ref={emailRef}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                        />

                        {!isLogin && (
                            <select
                                className="role-select"
                                value={selectedRole}
                                onChange={e => setSelectedRole(Number(e.target.value))}
                            >
                                {roles.map(r => (
                                    <option key={r.id} value={r.id}>{r.name}</option>
                                ))}
                            </select>
                        )}

                        {error && <div className="error">{error}</div>}

                        <button type="submit" className="submit-btn">
                            {isLogin ? "Sign In" : "Create Account"}
                        </button>

                    </form>
                </div>

            </div>
        </div>
    );
}
