import React from "react";
import ReactDOM from "react-dom/client";
import { ClerkProvider } from "@clerk/clerk-react";
import { BrowserRouter } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

const key = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    {key ? (
      <ClerkProvider publishableKey={key}>
        <BrowserRouter>
          <AuthProvider>
            <Toaster position="top-right" />
            <App />
          </AuthProvider>
        </BrowserRouter>
      </ClerkProvider>
    ) : (
      <div style={{ padding: "24px", fontFamily: "Inter, sans-serif" }}>
        Missing <code>VITE_CLERK_PUBLISHABLE_KEY</code> in <code>.env</code>.
      </div>
    )}
  </React.StrictMode>,
);
