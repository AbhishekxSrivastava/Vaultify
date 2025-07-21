import React from "react";
import Auth from "./components/Auth";
import UploadForm from "./components/UploadForm";

function App() {
  return (
    <div className="container mx-auto p-4 bg-gray-50 min-h-screen">
      <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800">🔐 Vaultify</h1>
        <p className="text-gray-600">Your Secure Receipt & Warranty Vault</p>
      </header>
      <main className="max-w-md mx-auto space-y-8">
        <Auth />
        <UploadForm />
      </main>
    </div>
  );
}

export default App;
