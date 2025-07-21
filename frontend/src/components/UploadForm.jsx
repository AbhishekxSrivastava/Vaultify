import React, { useState } from "react";
import axios from "axios";

function UploadForm() {
  const [form, setForm] = useState({
    itemName: "",
    store: "",
    purchaseDate: "",
    warrantyExpiry: "",
  });
  const [file, setFile] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file.");

    const formData = new FormData();
    formData.append("receiptFile", file);
    Object.keys(form).forEach((key) => formData.append(key, form[key]));

    try {
      const token = localStorage.getItem("authToken");
      if (!token) return alert("You must be logged in.");

      await axios.post("http://localhost:5001/api/receipts", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ Receipt uploaded successfully!");
      e.target.reset(); // Reset form fields
    } catch (error) {
      alert(`❌ Error: ${error.response?.data?.message || error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border rounded shadow-md mt-4">
      <h2 className="text-xl font-bold mb-4">Upload New Receipt</h2>
      <input
        name="itemName"
        onChange={handleChange}
        placeholder="Item Name"
        className="border p-2 mb-2 w-full"
        required
      />
      <input
        name="store"
        onChange={handleChange}
        placeholder="Store"
        className="border p-2 mb-2 w-full"
        required
      />
      <label className="text-sm">Purchase Date:</label>
      <input
        name="purchaseDate"
        type="date"
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
        required
      />
      <label className="text-sm">Warranty Expiry:</label>
      <input
        name="warrantyExpiry"
        type="date"
        onChange={handleChange}
        className="border p-2 mb-2 w-full"
        required
      />
      <input
        name="receiptFile"
        type="file"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-4"
        required
      />
      <button
        type="submit"
        className="bg-purple-500 text-white p-2 rounded w-full"
      >
        Upload
      </button>
    </form>
  );
}
export default UploadForm;
