import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";
import { useAuth } from "./AuthContext";
import api from "../../api/axios";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const res = await api.post("/Auth/Login", { email, password });
            login(res.data.token);
            navigate("/");
        }
        catch {
            setError("Invalid credentials");
        }
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Login</h2>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                />

                {error && <div className="error">{error}</div>}

                <button type="submit">Sign In</button>

                <p>
                    Don't have an account? <Link to="/signup">Create account</Link>
                </p>
            </form>
        </div>
    );
}
