import React, { useState, useRef } from "react";
import { useReceipts } from "../../context/ReceiptContext";
import { UploadCloud, Camera, FileImage } from "lucide-react";
import { useNavigate } from "react-router-dom";

const AddReceiptPage = () => {
  const [title, setTitle] = useState("");
  const [purchaseDate, setPurchaseDate] = useState("");
  const [warrantyEndDate, setWarrantyEndDate] = useState("");
  const [amount, setAmount] = useState("");
  const [receiptImage, setReceiptImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const { addReceipt, loading } = useReceipts();
  const navigate = useNavigate();

  const galleryInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setReceiptImage(file);
      setSuccess("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!title || !purchaseDate || !receiptImage) {
      setError("Title, Purchase Date, and an Image are required.");
      return;
    }
    const formData = new FormData();
    formData.append("title", title);
    formData.append("purchaseDate", purchaseDate);
    formData.append("receiptImage", receiptImage);
    if (warrantyEndDate) formData.append("warrantyEndDate", warrantyEndDate);
    if (amount) formData.append("amount", amount);
    try {
      await addReceipt(formData);
      setSuccess("Receipt added successfully! Redirecting...");
      setTimeout(() => navigate("/receipts"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    }
  };

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
        Add a New Receipt
      </h1>
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md">
        {error && (
          <p className="bg-red-100 text-red-700 p-3 rounded-md mb-4">{error}</p>
        )}
        {success && (
          <p className="bg-green-100 text-green-700 p-3 rounded-md mb-4">
            {success}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label
              htmlFor="purchaseDate"
              className="block text-sm font-medium text-gray-700"
            >
              Purchase Date
            </label>
            <input
              type="date"
              id="purchaseDate"
              value={purchaseDate}
              onChange={(e) => setPurchaseDate(e.target.value)}
              className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label
                htmlFor="warrantyEndDate"
                className="block text-sm font-medium text-gray-700"
              >
                Warranty End Date (Optional)
              </label>
              <input
                type="date"
                id="warrantyEndDate"
                value={warrantyEndDate}
                onChange={(e) => setWarrantyEndDate(e.target.value)}
                className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label
                htmlFor="amount"
                className="block text-sm font-medium text-gray-700"
              >
                Amount (Optional)
              </label>
              <input
                type="number"
                id="amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g., 19.99"
                className="w-full px-3 py-2 mt-1 text-gray-900 bg-gray-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Receipt Image
            </label>
            <div className="mt-2 p-6 border-2 border-gray-300 border-dashed rounded-md text-center">
              {receiptImage ? (
                <div>
                  <p className="text-gray-700">
                    File selected: <strong>{receiptImage.name}</strong>
                  </p>
                  <button
                    type="button"
                    onClick={() => setReceiptImage(null)}
                    className="text-sm text-red-600 hover:underline mt-2"
                  >
                    Remove file
                  </button>
                </div>
              ) : (
                <div>
                  <UploadCloud className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Choose how to upload your receipt
                  </p>
                  <div className="mt-4 flex flex-col sm:flex-row justify-center gap-4">
                    <input
                      type="file"
                      accept="image/*"
                      capture="environment"
                      ref={cameraInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <input
                      type="file"
                      accept="image/*"
                      ref={galleryInputRef}
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => cameraInputRef.current.click()}
                      className="flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gray-800 hover:bg-gray-900"
                    >
                      <Camera size={20} className="mr-2" />
                      Take Photo
                    </button>
                    <button
                      type="button"
                      onClick={() => galleryInputRef.current.click()}
                      className="flex items-center justify-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <FileImage size={20} className="mr-2" />
                      Choose from Gallery
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || success}
            className="w-full px-4 py-3 font-bold text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed"
          >
            {loading ? "Uploading..." : "Add Receipt"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddReceiptPage;
