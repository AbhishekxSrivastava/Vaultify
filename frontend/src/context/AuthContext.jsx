import React, { createContext, useState, useContext, useEffect } from "react";
import API from "../api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    const storedToken = localStorage.getItem("accessToken");
    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    const { data } = await API.post("/auth/login", { email, password });
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
  };

  const signup = async (name, email, password) => {
    const { data } = await API.post("/auth/signup", { name, email, password });
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("accessToken", data.accessToken);
    setUser(data.user);
  };

  const logout = async () => {
    try {
      await API.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed", error);
    } finally {
      localStorage.removeItem("user");
      localStorage.removeItem("accessToken");
      setUser(null);
    }
  };

  const value = { user, login, signup, logout, loading };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
