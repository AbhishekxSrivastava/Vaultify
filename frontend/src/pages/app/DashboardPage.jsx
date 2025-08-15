import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useReceipts } from "../../context/ReceiptContext";
import { Link } from "react-router-dom";
import { FileText, PlusCircle } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const { receipts, fetchReceipts, loading } = useReceipts();

  useEffect(() => {
    if (receipts.length === 0) {
      fetchReceipts();
    }
  }, [fetchReceipts, receipts.length]);

  const totalReceipts = receipts.length;

  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.name}!
      </h1>
      <p className="text-gray-600 mb-6 md:mb-8">
        Here's a quick overview of your vault.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FileText size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Receipts</p>
              {loading && receipts.length === 0 ? (
                <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {totalReceipts}
                </p>
              )}
            </div>
          </div>
        </div>

        <Link
          to="/add"
          className="bg-white p-6 rounded-lg shadow flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <PlusCircle size={24} className="mr-3" />
          <span className="text-lg font-semibold">Add New Receipt</span>
        </Link>
      </div>

      <div className="mt-8 md:mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Receipts
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading && receipts.length === 0 ? (
            <p className="p-4 text-gray-500">Loading recent receipts...</p>
          ) : receipts.length > 0 ? (
            <ul>
              {receipts.slice(0, 5).map((receipt, index) => (
                <li
                  key={receipt._id}
                  className={`border-b border-gray-200 ${
                    index === receipts.slice(0, 5).length - 1
                      ? "border-b-0"
                      : ""
                  }`}
                >
                  <Link
                    to={`/receipt/${receipt._id}`}
                    className="flex items-center p-4 hover:bg-gray-50"
                  >
                    <img
                      src={receipt.imageUrl}
                      alt={receipt.title}
                      className="w-12 h-12 object-cover rounded-md mr-4"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">
                        {receipt.title}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(receipt.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="p-4 text-gray-500">No recent receipts found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
