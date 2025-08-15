import React, { useEffect, useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useReceipts } from "../../context/ReceiptContext";
import { Search } from "lucide-react";

const ReceiptsListPage = () => {
  const { receipts, fetchReceipts, loading, error } = useReceipts();
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);

  const filteredReceipts = useMemo(() => {
    if (!searchTerm) return receipts;
    return receipts.filter(
      (r) =>
        r.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (r.extractedText &&
          r.extractedText.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [receipts, searchTerm]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">All Receipts</h1>

      <div className="relative mb-6">
        <input
          type="text"
          placeholder="Search by title or content..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 text-gray-900 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
          size={20}
        />
      </div>

      <div className="bg-white rounded-lg shadow">
        {loading && <p className="p-4 text-gray-500">Loading receipts...</p>}
        {error && <p className="p-4 text-red-500">{error}</p>}
        {!loading && !error && (
          <ul>
            {filteredReceipts.length > 0 ? (
              filteredReceipts.map((receipt, index) => (
                <li
                  key={receipt._id}
                  className={`border-b border-gray-200 ${
                    index === filteredReceipts.length - 1 ? "border-b-0" : ""
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
                        Purchased on:{" "}
                        {new Date(receipt.purchaseDate).toLocaleDateString()}
                      </p>
                    </div>
                  </Link>
                </li>
              ))
            ) : (
              <p className="p-4 text-gray-500">
                {searchTerm
                  ? "No receipts match your search."
                  : "You have no receipts yet."}
              </p>
            )}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ReceiptsListPage;
