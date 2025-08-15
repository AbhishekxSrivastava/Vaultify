import React from "react";
import { Menu, Receipt } from "lucide-react";

const Header = ({ onMenuClick }) => {
  return (
    <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow-sm lg:hidden">
      <button
        onClick={onMenuClick}
        className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex-1 px-4 flex justify-center items-center">
        <div className="flex items-center">
          <Receipt size={24} className="text-blue-600" />
          <h1 className="text-lg font-bold text-gray-800 ml-2">Vaultify</h1>
        </div>
      </div>
    </div>
  );
};

export default Header;
