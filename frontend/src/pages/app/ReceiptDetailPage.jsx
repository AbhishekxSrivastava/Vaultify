import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useReceipts } from "../../context/ReceiptContext";
import API from "../../api";
import Modal from "../../components/common/Modal";
import {
  Trash2,
  ArrowLeft,
  Calendar,
  ShieldCheck,
  DollarSign,
} from "lucide-react";

const ReceiptDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { deleteReceipt } = useReceipts();
  const [receipt, setReceipt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const getReceipt = async () => {
      try {
        setLoading(true);
        const { data } = await API.get(`/receipts/${id}`);
        setReceipt(data);
      } catch (err) {
        setError("Failed to fetch receipt details.");
      } finally {
        setLoading(false);
      }
    };
    getReceipt();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteReceipt(id);
      navigate("/receipts");
    } catch (err) {
      setError("Failed to delete receipt.");
      setIsModalOpen(false);
    }
  };

  if (loading) return <p className="text-center p-8">Loading details...</p>;
  if (error) return <p className="text-center p-8 text-red-500">{error}</p>;
  if (!receipt) return <p className="text-center p-8">Receipt not found.</p>;

  return (
    <div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
        title="Delete Receipt"
      >
        Are you sure you want to permanently delete this receipt? This action
        cannot be undone.
      </Modal>

      <div className="mb-6">
        <Link
          to="/receipts"
          className="flex items-center text-blue-600 hover:underline font-medium"
        >
          <ArrowLeft size={20} className="mr-2" />
          Back to All Receipts
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <img
          src={receipt.imageUrl}
          alt={receipt.title}
          className="w-full h-auto max-h-[500px] object-contain bg-gray-200 p-2"
        />
        <div className="p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row justify-between sm:items-start">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">
              {receipt.title}
            </h1>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center justify-center px-4 py-2 text-sm font-medium text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
            >
              <Trash2 size={16} className="mr-2" />
              Delete
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-gray-700 my-6">
            <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg">
              <Calendar size={20} className="text-blue-600" />
              <div>
                <span className="text-sm text-gray-500">Purchase Date</span>
                <p className="font-semibold">
                  {new Date(receipt.purchaseDate).toLocaleDateString()}
                </p>
              </div>
            </div>
            {receipt.warrantyEndDate && (
              <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg">
                <ShieldCheck size={20} className="text-green-600" />
                <div>
                  <span className="text-sm text-gray-500">Warranty Ends</span>
                  <p className="font-semibold">
                    {new Date(receipt.warrantyEndDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}
            {receipt.amount && (
              <div className="flex items-center space-x-3 bg-gray-100 p-3 rounded-lg">
                <DollarSign size={20} className="text-yellow-600" />
                <div>
                  <span className="text-sm text-gray-500">Amount</span>
                  <p className="font-semibold">${receipt.amount}</p>
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Extracted Text
            </h2>
            <p className="text-gray-600 bg-gray-50 p-4 rounded-md whitespace-pre-wrap font-mono text-sm leading-relaxed">
              {receipt.extractedText ||
                "No text was extracted from this image."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReceiptDetailPage;
