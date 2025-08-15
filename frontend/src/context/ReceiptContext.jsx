import React, { createContext, useState, useContext, useCallback } from "react";
import API from "../api";

const ReceiptContext = createContext();

export const ReceiptProvider = ({ children }) => {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchReceipts = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await API.get("/receipts");
      setReceipts(data);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to fetch receipts");
    } finally {
      setLoading(false);
    }
  }, []);

  const addReceipt = async (formData) => {
    setLoading(true);
    setError(null);
    try {
      // Axios is smart enough to set the 'multipart/form-data' header
      // automatically when you pass a FormData object. Setting it manually
      // can sometimes cause issues, so we remove it.
      const { data } = await API.post("/receipts", formData);
      setReceipts((prevReceipts) => [data, ...prevReceipts]);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add receipt");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReceipt = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await API.delete(`/receipts/${id}`);
      setReceipts((prevReceipts) => prevReceipts.filter((r) => r._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to delete receipt");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    receipts,
    loading,
    error,
    fetchReceipts,
    addReceipt,
    deleteReceipt,
  };

  return (
    <ReceiptContext.Provider value={value}>{children}</ReceiptContext.Provider>
  );
};

export const useReceipts = () => {
  return useContext(ReceiptContext);
};
