import React, { useState, useEffect, useRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DateDropdown.css";
import { Tooltip } from "react-tooltip";

const DateDropdown = ({ sortByDate, resetFiltersTrigger }) => {
  const [selectedType, setSelectedType] = useState("3 дня");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const options = ["3 дня", "Неделя", "Месяц", "Год"];

  const handleOptionClick = (option) => {
    setSelectedType(option);
    setStartDate(null);
    setEndDate(null);
    sortByDate(option);
    setIsOpen(false);
  };

  const handleDateRangeSubmit = () => {
    if (startDate && endDate) {
      const formatDate = (date) =>
        `${date.getFullYear()}-${(date.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${date.getDate().toString().padStart(2, "0")}`;

      const formattedRange = `${formatDate(startDate)} - ${formatDate(
        endDate
      )}`;
      setSelectedType(formatDisplayDate(startDate, endDate));
      sortByDate(formattedRange);
    }
    setIsOpen(false);
  };

  const formatDisplayDate = (startDate, endDate) => {
    const formatForDisplay = (date) =>
      `${date.getDate().toString().padStart(2, "0")}.${(date.getMonth() + 1)
        .toString()
        .padStart(2, "0")}.${date.getFullYear()}`;

    return `${formatForDisplay(startDate)} - ${formatForDisplay(endDate)}`;
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
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
      setSelectedType("3 дня");
      setStartDate(null);
      setEndDate(null);
    }, [resetFiltersTrigger]);

  return (
    <div className="dateDropdown" ref={dropdownRef}>
      <div className="dateRange" onClick={() => setIsOpen(!isOpen)}>
        <img src="/assets/arrowLeft.svg" alt="дата" />
        <div className="rangeWrapper">
          <img src="/assets/calendar.svg" alt="дата" />
          <p className="selectedItem">{selectedType}</p>
        </div>
        <img src="/assets/arrowRight.svg" alt="дата" />
      </div>
      {isOpen && (
        <div className="dateDropdownMenu">
          {options.map((option) => (
            <div
              key={option}
              className={`dateDropdownItem ${
                option === selectedType ? "selectedItem" : ""
              }`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
          <div className="datePickerHeader">Указать даты</div>
          <div className="datePickerWrapper">
            <div className="datePickerContainer">
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                placeholderText="__.__.__"
                className="customDatePickerInput"
                calendarClassName="customCalendar"
              />
              <span> - </span>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="__.__.__"
                className="customDatePickerInput"
                calendarClassName="customCalendar"
              />
            </div>
            <button
              className="dateSubmitButton"
              onClick={handleDateRangeSubmit}
              disabled={!startDate || !endDate}
              data-tooltip-id="my-tooltip"
              data-tooltip-content="Применить"
              data-tooltip-place="bottom"
            >
              <img
                className="menuCalendar"
                src="/assets/calendar.svg"
                alt="дата"
              />
            </button>
            <Tooltip id="my-tooltip" />
          </div>
        </div>
      )}
    </div>
  );
};

export default DateDropdown;
