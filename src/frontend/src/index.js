import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./Pages/Auth/AuthContext";
import { ThemeProvider } from "./ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
    <AuthProvider>
        <ThemeProvider>
            <App />
        </ThemeProvider>
    </AuthProvider>
);
