import { Routes, Route, useLocation } from "react-router-dom";
import PrivateRoute from "./Pages/Auth/PrivateRoute";
import Navbar from "./Pages/NavBar/Navbar";
import Auth from "./Pages/Auth/Auth";
import Dashboard from "./Pages/Dashboard/Dashboard";

function AppLayout() {
  const location = useLocation();

  return (
    <>
      {location.pathname !== "/auth" && <Navbar />}

      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </>
  );
}

export default function App() {
  return <AppLayout />;
}
