import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";

// Layouts
import MainLayout from "./layout/MainLayout";

// Auth Pages
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";

// App Pages
import DashboardPage from "./pages/app/DashboardPage";
import ReceiptsListPage from "./pages/app/ReceiptsListPage";
import AddReceiptPage from "./pages/app/AddReceiptPage";
import ReceiptDetailPage from "./pages/app/ReceiptDetailPage";

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <Routes>
      {/* Routes for unauthenticated users */}
      <Route
        path="/login"
        element={!user ? <LoginPage /> : <Navigate to="/" />}
      />
      <Route
        path="/signup"
        element={!user ? <SignupPage /> : <Navigate to="/" />}
      />

      {/* Protected routes wrapped in MainLayout */}
      <Route
        path="/"
        element={user ? <MainLayout /> : <Navigate to="/login" />}
      >
        <Route index element={<DashboardPage />} />
        <Route path="receipts" element={<ReceiptsListPage />} />
        <Route path="add" element={<AddReceiptPage />} />
        <Route path="receipt/:id" element={<ReceiptDetailPage />} />
      </Route>

      {/* Fallback route */}
      <Route path="*" element={<Navigate to={user ? "/" : "/login"} />} />
    </Routes>
  );
}

export default App;
