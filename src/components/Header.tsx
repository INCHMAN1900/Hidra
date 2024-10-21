import React, { useState } from "react";
import { Settings } from "lucide-react";
import ConfigModal from "./Config";

const Header: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-5 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
          Hidra
        </h1>
        <div className="flex items-center space-x-4">
          {/* <Twitter className="text-blue-400 h-5 w-5" />
          <Cloud className="text-sky-500 h-5 4-5" /> */}
          <Settings
            className="text-sky-500 h-5 w-5 cursor-pointer"
            onClick={() => setIsOpen(true)}
          />
        </div>
      </div>
      {isOpen && (
        <ConfigModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
      )}
    </header>
  );
};

export default Header;
