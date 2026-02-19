import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

export default function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();
    debugger;

    console.log("PrivateRoute:", { isAuthenticated, loading });

    if (loading) return <div>Loading...</div>;

    if (!isAuthenticated)
        return <Navigate to="/auth" replace />;

    return children;
}
