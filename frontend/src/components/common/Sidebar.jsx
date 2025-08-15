import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  PlusCircle,
  LogOut,
  Receipt,
} from "lucide-react";

const Sidebar = ({ onLinkClick = () => {} }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    onLinkClick(); // Close mobile sidebar if open
    await logout();
    navigate("/login");
  };

  const navLinkClasses = ({ isActive }) =>
    `flex items-center px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-600 text-white shadow-sm"
        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
    }`;

  const handleLinkClick = () => {
    onLinkClick(); // Close mobile sidebar when a link is clicked
  };

  return (
    <aside className="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col">
      <div className="h-16 flex items-center justify-center border-b border-gray-200">
        <Receipt size={28} className="text-blue-600" />
        <h1 className="text-xl font-bold text-gray-800 ml-2">Vaultify</h1>
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <NavLink
          to="/"
          end
          className={navLinkClasses}
          onClick={handleLinkClick}
        >
          <LayoutDashboard size={20} className="mr-3" />
          Dashboard
        </NavLink>
        <NavLink
          to="/receipts"
          className={navLinkClasses}
          onClick={handleLinkClick}
        >
          <FileText size={20} className="mr-3" />
          All Receipts
        </NavLink>
        <NavLink to="/add" className={navLinkClasses} onClick={handleLinkClick}>
          <PlusCircle size={20} className="mr-3" />
          Add Receipt
        </NavLink>
      </nav>
      <div className="p-4 border-t border-gray-200">
        <div className="mb-4">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {user?.name}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center px-4 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:bg-red-500 hover:text-white transition-colors"
        >
          <LogOut size={20} className="mr-3" />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
