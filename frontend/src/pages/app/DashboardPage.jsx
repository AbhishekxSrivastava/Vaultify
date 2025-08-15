import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useReceipts } from "../../context/ReceiptContext";
import { Link } from "react-router-dom";
import { FileText, PlusCircle } from "lucide-react";

const DashboardPage = () => {
  const { user } = useAuth();
  const { receipts, fetchReceipts, loading } = useReceipts();

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const totalReceipts = receipts.length;
  // In a real app, you could calculate more stats here (e.g., total spending)

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        Welcome back, {user?.name}!
      </h1>
      <p className="text-gray-600 mb-8">
        Here's a quick overview of your vault.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Stat Card */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FileText size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-500">Total Receipts</p>
              {loading ? (
                <div className="h-6 w-10 bg-gray-200 rounded animate-pulse"></div>
              ) : (
                <p className="text-2xl font-bold text-gray-900">
                  {totalReceipts}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Quick Action Card */}
        <Link
          to="/add"
          className="bg-white p-6 rounded-lg shadow flex items-center justify-center text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <PlusCircle size={24} className="mr-3" />
          <span className="text-lg font-semibold">Add New Receipt</span>
        </Link>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Recent Receipts
        </h2>
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {loading ? (
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
