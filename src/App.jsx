import React, { useState, useEffect } from "react";
import { fetchCallList } from "./Api";
import TopBar from "./components/TopBar/TopBar";
import CallTable from "./components/CallTable/CallTable";
import "./App.css";

function App() {
  const [callList, setCallList] = useState([]);
  const [fullCallList, setFullCallList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [resetFiltersTrigger, setResetFiltersTrigger] = useState(0);

  const [selectedType, setSelectedType] = useState("Все типы");
  const [selectedDate, setSelectedDate] = useState("");

  const getRandomRating = () => {
    const ratings = ["Хорошо", "Отлично", "Плохо", ""];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchCallList({
          limit: 260,
          sort_by: "date",
          order: "DESC",
        });
        if (response && response.results) {
          const updatedCalls = response.results.map((call) => {
            return {
              ...call,
              rating:
                call.status === "Дозвонился" ? getRandomRating() : undefined,
            };
          });
          setCallList(updatedCalls);
          setFullCallList(updatedCalls);
          console.log("Полный набор данных с рейтингом:", updatedCalls); // удалить после отладки
        } else {
          setCallList([]);
          setFullCallList([]);
        }
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
        setCallList([]);
        setFullCallList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const applyFilters = () => {
    let filteredCalls = fullCallList;

    switch (selectedType) {
      case "Исходящие":
        filteredCalls = filteredCalls.filter((call) => call.in_out === 1);
        break;
      case "Входящие":
        filteredCalls = filteredCalls.filter((call) => call.in_out === 0);
        break;
      default:
        break;
    }

    const now = new Date();
    switch (selectedDate) {
      case "3 дня":
        const threeDaysAgo = new Date();
        threeDaysAgo.setDate(now.getDate() - 3);
        filteredCalls = filteredCalls.filter(
          (call) => new Date(call.date_notime) >= threeDaysAgo
        );
        break;
      case "Неделя":
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(now.getDate() - 7);
        filteredCalls = filteredCalls.filter(
          (call) => new Date(call.date_notime) >= oneWeekAgo
        );
        break;
      case "Месяц":
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(now.getMonth() - 1);
        filteredCalls = filteredCalls.filter(
          (call) => new Date(call.date_notime) >= oneMonthAgo
        );
        break;
      case "Год":
        const oneYearAgo = new Date();
        oneYearAgo.setFullYear(now.getFullYear() - 1);
        filteredCalls = filteredCalls.filter(
          (call) => new Date(call.date_notime) >= oneYearAgo
        );
        break;
      default:
        if (selectedDate.includes(" - ")) {
          const [start, end] = selectedDate
            .split(" - ")
            .map((date) => new Date(date));
          filteredCalls = filteredCalls.filter((call) => {
            const callDate = new Date(call.date_notime);
            return callDate >= start && callDate <= end;
          });
        }
        break;
    }

    setCallList(filteredCalls);
  };

  const sortByType = (option) => {
    setSelectedType(option);
  };

  const sortByDate = (option) => {
    setSelectedDate(option);
  };

  const resetFilters = () => {
    setSelectedType("Все типы");
    setSelectedDate("");
    setCallList(fullCallList);
    setResetFiltersTrigger((prev) => prev + 1);
  };

  const isFilterApplied = selectedType !== "Все типы" || selectedDate !== "";

  useEffect(() => {
    applyFilters();
  }, [selectedType, selectedDate]);

  return (
    <div className="tableWrapper">
      <TopBar
        sortByType={sortByType}
        sortByDate={sortByDate}
        resetFilters={resetFilters}
        isFilterApplied={isFilterApplied}
        resetFiltersTrigger={resetFiltersTrigger}
      />
      <CallTable callList={callList} isLoading={isLoading} />
    </div>
  );
}

export default App;
