import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../Auth/AuthContext.jsx";
import "./Navbar.css";

export default function Navbar() {
    const location = useLocation();
    const { isAuthenticated, logout } = useAuth();

    const isAuthPage = location.pathname === "/auth";

    return (
        <div className="navbar">
            <div className="logo">AssetForge</div>

            <div className="nav-links">

                {/* hide buttons on auth screen */}
                {!isAuthPage && (
                    !isAuthenticated ? (
                        <Link className="primary-btn" to="/auth">
                            Login / Signup
                        </Link>
                    ) : (
                        <button className="logout-btn" onClick={logout}>
                            Logout
                        </button>

                    )
                )}

            </div>
        </div>
    );
}
