import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import api from "../../api/axios";
import "./Auth.css";

const fallbackRoles = [
  { id: 0, name: "Admin" },
  { id: 1, name: "User" },
  { id: 2, name: "Buyer" }
];

export default function Auth() {

  const { login } = useAuth();
  const navigate = useNavigate();
  const emailRef = useRef(null);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("rajeevp727@gmail.com");
  const [password, setPassword] = useState("Pass123");
  const [error, setError] = useState("");

  const [roles, setRoles] = useState(fallbackRoles);
  const [selectedRole, setSelectedRole] = useState(1);

  // focus input when mode changes
  useEffect(() => {
    emailRef.current?.focus();
    setError("");
  }, [isLogin]);

  // load roles (optional API)
  useEffect(() => {
    const loadRoles = async () => {
      try {
        const res = await api.get("/meta/registration-roles");

        if (res.data && res.data.length > 0)
          setRoles(res.data);
        else
          setRoles(fallbackRoles);

      } catch {
        setRoles(fallbackRoles);
      }
    };

    loadRoles();
  }, []);

  const handleSubmit = async e => {
    e.preventDefault();
    setError("");

    try {

      if (isLogin) {
        // LOGIN
        const res = await api.post("/Auth/login", { email, password });

        login(res.data.token, res.data.refreshToken);

        navigate("/", { replace: true });
      }
      else {
        // REGISTER
        await api.post("/Auth/register", {
          email,
          password,
          requestedRole: selectedRole
        });

        setIsLogin(true);
        setError("Account created. Please login.");
      }

    } catch (err) {
      debugger;
      if(err?.response?.status === 401) setError("Invalid credentials");
      else if(err?.response?.status === 400) setError("Email already in use");
      else setError(err?.response?.data?.error || "Operation failed");
    }
  };

  return (
    <div className="auth-page">

      <div className="auth-card">

        {/* LEFT PANEL */}
        <div className="auth-left">
          <div className="auth-left-content">
            <h1>{isLogin ? "Welcome Back" : "Join AssetForge"}</h1>

            <p>
              {isLogin
                ? "Manage and track your business brands effortlessly."
                : "Create an account and start managing your brands."}
            </p>

            <button
              className="switch-mode"
              onClick={() => setIsLogin(prev => !prev)}
            >
              {isLogin ? "Create Account" : "Sign In"}
            </button>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="auth-right">
          <form className="auth-form" onSubmit={handleSubmit}>

            <h2>{isLogin ? "Login" : "Register"}</h2>

            <input
              ref={emailRef}
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

            {!isLogin && (
              <select
                value={selectedRole}
                onChange={e => setSelectedRole(Number(e.target.value))}
              >
                {roles.map(r => (
                  <option key={r.id} value={r.id}>{r.name}</option>
                ))}
              </select>
            )}

            {error && <div className="auth-error">{error}</div>}

            <button className="auth-submit">
              {isLogin ? "Login" : "Create Account"}
            </button>

          </form>
        </div>

      </div>
    </div>
  );
}
