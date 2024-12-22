import React, { useState, useEffect, useRef } from "react";
import "./CallTypeDropdown.css";

const CallTypeDropdown = ({ sortByType, resetFiltersTrigger }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedType, setSelectedType] = useState("Все типы");
  const callDropdownRef = useRef(null);

  const options = ["Все типы", "Входящие", "Исходящие"];

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (option) => {
    setSelectedType(option);
    sortByType(option);
    setIsOpen(false);
  };

  const handleClickOutside = (event) => {
    if (
      callDropdownRef.current &&
      !callDropdownRef.current.contains(event.target)
    ) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    setSelectedType("Все типы");
  }, [resetFiltersTrigger]);

  return (
    <div className="callTypeDropdown" ref={callDropdownRef}>
      <div className="callType" onClick={handleToggle}>
        <p className={selectedType !== "Все типы" ? "selectedItem" : ""}>{selectedType}</p>
        <img
          src={isOpen ? "assets/arrowChooseUp.svg" : "assets/arrowChoose.svg"}
          alt="выбрать"
        />
      </div>
      {isOpen && (
        <div className="dropdownMenu">
          {options.map((option) => (
            <div
              key={option}
              className={`dropdownItem ${
                option === selectedType ? "selectedItem" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CallTypeDropdown;
