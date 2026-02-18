import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css";
import api from "../../api/axios";

export default function Signup() {

    const [form, setForm] = useState({
        email: "",
        password: "",
        role: 1
    });

    const navigate = useNavigate();
    const [msg, setMsg] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post("/Auth/Register", form);
        setMsg("Account created. Please login.");
        setTimeout(() => navigate("/login"), 1200);
    };

    return (
        <div className="auth-container">
            <form className="auth-card" onSubmit={handleSubmit}>
                <h2>Signup</h2>

                <input placeholder="Email"
                    onChange={e => setForm({ ...form, email: e.target.value })} />

                <input type="password" placeholder="Password"
                    onChange={e => setForm({ ...form, password: e.target.value })} />

                <select onChange={e => setForm({ ...form, role: Number(e.target.value) })}>
                    <option value={1}>User</option>
                    <option value={3}>Admin</option>
                    <option value={2}>Buyer</option>
                </select>

                {msg && <div className="success">{msg}</div>}

                <button type="submit">Create Account</button>

                <p>
                    Already registered? <Link to="/login">Login</Link>
                </p>
            </form>
        </div>
    );
}
