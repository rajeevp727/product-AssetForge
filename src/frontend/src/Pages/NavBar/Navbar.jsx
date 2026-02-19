import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const location = useLocation();
  const { isAuthenticated, logout } = useAuth();

  const isAuthPage = location.pathname === "/auth";

  return (
    <header className="navbar">

      <div className="nav-left">
        <Link to="/" className="logo">AssetForge</Link>
      </div>

      <div className="nav-right">
        {!isAuthPage && (
          !isAuthenticated ? (
            <Link className="login-btn" to="/auth">
              Login
            </Link>
          ) : (
            <button className="logout-btn" onClick={logout}>
              Logout
            </button>
          )
        )}
      </div>

    </header>
  );
}
