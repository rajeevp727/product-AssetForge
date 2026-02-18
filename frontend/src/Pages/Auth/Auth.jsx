import { useState, useEffect } from "react";
import "./Auth.css";
import api from "../../api/axios";
import { useAuth } from "./AuthContext";

export default function Auth() {
    const { login } = useAuth();

    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [roles, setRoles] = useState([]);
    const [selectedRole, setSelectedRole] = useState(1);
    const [error, setError] = useState("");

    useEffect(() => {
        api.get("/meta/registration-roles")
            .then(res => setRoles(res.data))
            .catch(() => {});
    }, []);

    const submit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            if (isLogin) {
                const res = await api.post("/Auth/login", { email, password });
                login(res.data.token);
                window.location.href = "/";
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
            setError(err.response?.data || "Server error");
        }
    };

    return (
        <div className="auth-wrapper">
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

                        <button className="submit-btn">
                            {isLogin ? "Sign In" : "Create Account"}
                        </button>
                    </form>
                </div>

            </div>
        </div>
    );
}
