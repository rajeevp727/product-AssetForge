export default function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null;

    if (!isAuthenticated)
        return <Navigate to="/auth" replace />;

    return children;
}
