import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { ReceiptProvider } from "./context/ReceiptContext.jsx"; // Import ReceiptProvider
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Router>
      <AuthProvider>
        <ReceiptProvider>
          {" "}
          {/* Wrap App with ReceiptProvider */}
          <App />
        </ReceiptProvider>
      </AuthProvider>
    </Router>
  </React.StrictMode>
);
