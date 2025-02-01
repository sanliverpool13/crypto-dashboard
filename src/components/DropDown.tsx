import React, { useState, useEffect, useRef } from "react";
import { Symbol } from "../types/binance";

interface DropdownProps {
  options: Map<Symbol, { value: Symbol; label: string }>;
  symbol: Symbol;
  setSymbol: (symbol: Symbol) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ options, setSymbol, symbol }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState<Symbol>(symbol);

  const dropdownRef = useRef<HTMLDivElement>(null); // Ref to detect outside clicks

  // Close the dropdown if clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false); // Close dropdown
      }
    };

    window.addEventListener("click", handleClickOutside);
    return () => {
      window.removeEventListener("click", handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option: Symbol) => {
    setSelectedOption(option);
    setSymbol(option);
    setIsOpen(false); // Close the dropdown after selection
  };

  return (
    <div
      ref={dropdownRef}
      className="relative inline-block w-[200px] max-w-sm dark:text-white"
    >
      {/* Dropdown Trigger */}
      <button
        className="w-full bg-[#f2f2f2] dark:bg-transparent  border-2 border-black dark:border-white py-2 px-4 rounded shadow focus:outline-none  text-left"
        onClick={handleToggle}
      >
        {options.get(selectedOption)?.label}
        <span className="float-right">▾</span>
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <ul
          className="absolute z-100 bg-[#f2f2f2] dark:bg-[#1B1B1B] border-2 border-black  rounded shadow w-full mt-2"
          onClick={(e) => e.stopPropagation()} // Prevent menu from closing when clicking inside
        >
          {Array.from(options.values()).map((option, index) => (
            <li
              key={index}
              className="hover:bg-[#000000] hover:bg-opacity-10 cursor-pointer px-4 py-2"
              onClick={() => handleOptionClick(option.value)}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default Dropdown;
