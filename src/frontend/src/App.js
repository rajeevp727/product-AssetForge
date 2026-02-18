import { BrowserRouter, Routes, Route } from "react-router-dom";
import Auth from "./Pages/Auth/Auth";
import PrivateRoute from "./Pages/Auth/PrivateRoute";
import Dashboard from "./Pages/Dashboard/Dashboard";
import Navbar from "./Pages/NavBar/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
