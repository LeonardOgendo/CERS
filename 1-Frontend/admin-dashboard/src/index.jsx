import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";

import AuthProvider from "./context/AuthContext";
import { CountsProvider } from "./context/CountsContext";


const container = document.getElementById('root');
const root = createRoot(container);

root.render(
    <BrowserRouter>
        <AuthProvider>
            <CountsProvider>
                <App />
            </CountsProvider>
        </AuthProvider>
    </BrowserRouter>
);


