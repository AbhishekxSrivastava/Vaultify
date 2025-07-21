import React, { useState } from "react";
import { auth } from "../firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";

function Auth() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAction = async (action) => {
    try {
      const userCredential = await action(auth, email, password);
      const token = await userCredential.user.getIdToken();
      localStorage.setItem("authToken", token);
      alert(
        `${
          action === signInWithEmailAndPassword ? "Login" : "Signup"
        } successful!`
      );
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="p-4 border rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Login or Signup</h2>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
        className="border p-2 mb-2 w-full"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        className="border p-2 mb-4 w-full"
      />
      <button
        onClick={() => handleAction(createUserWithEmailAndPassword)}
        className="bg-blue-500 text-white p-2 mr-2 rounded"
      >
        Sign Up
      </button>
      <button
        onClick={() => handleAction(signInWithEmailAndPassword)}
        className="bg-green-500 text-white p-2 rounded"
      >
        Log In
      </button>
    </div>
  );
}
export default Auth;
