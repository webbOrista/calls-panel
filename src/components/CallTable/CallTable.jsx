import React, { useState, useEffect } from "react";
import CallRow from "../CallRow/CallRow";
import "./CallTable.css";

function CallTable({ callList, isLoading }) {
  const [callsWithRating, setCallsWithRating] = useState([]);

  const getRandomRating = () => {
    const ratings = ["Хорошо", "Отлично", "Плохо", ""];
    return ratings[Math.floor(Math.random() * ratings.length)];
  };

  useEffect(() => {
    const updatedCalls = callList.map((call) => {
      if (call.status === "Дозвонился") {
        return {
          ...call,
          rating: call.rating || getRandomRating(),
        };
      }
      return call;
    });
  
    setCallsWithRating(updatedCalls);
  }, [callList]);

  const groupByDate = (calls) => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    return calls.reduce(
      (acc, call) => {
        const callDate = new Date(call.date);
        const callDay = callDate.toLocaleDateString();

        if (callDay === today.toLocaleDateString()) {
          acc.today.push(call);
        } else if (callDay === yesterday.toLocaleDateString()) {
          acc.yesterday.push(call);
        } else {
          acc.earlier.push(call);
        }
        return acc;
      },
      { today: [], yesterday: [], earlier: [] }
    );
  };

  const { today, yesterday, earlier } = groupByDate(callsWithRating);

  return (
    <div className="callTable">
      {isLoading ? (
        <p className="informText">Загружаем звонки...</p>
      ) : callList.length === 0 ? (
        <p className="informText">Данные по вашим параметрам не найдены</p>
      ) : (
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th
                className="tableHeaderItem tablePaddingLeft "
                style={{ width: "calc(94 / 1440 * 100%)" }}
              >
                Тип
              </th>
              <th
                className="tableHeaderItem"
                style={{ width: "calc(88 / 1440 * 100%)" }}
              >
                <span>Время</span>
                <img
                  className="filterIcon"
                  src="/assets/arrowChoose.svg"
                  alt="выбрать"
                />
              </th>
              <th
                className="tableHeaderItem"
                style={{ width: "calc(130 / 1440 * 100%)" }}
              >
                Сотрудник
              </th>
              <th
                className="tableHeaderItem"
                style={{ width: "calc(325 / 1440 * 100%)" }}
              >
                Звонок
              </th>
              <th
                className="tableHeaderItem"
                style={{ width: "calc(215 / 1440 * 100%)" }}
              >
                Источник
              </th>
              <th
                className="tableHeaderItem"
                style={{ width: "calc(120 / 1440 * 100%)" }}
              >
                Оценка
              </th>
              <th
                className="tableHeaderItem tableHeaderPaddingRight textRight"
                style={{ width: "calc(470 / 1440 * 100%)" }}
              >
                <span>Длительность</span>
                <img
                  className="filterIcon"
                  src="/assets/arrowChoose.svg"
                  alt="выбрать"
                />
              </th>
            </tr>
          </thead>
          <tbody>
            {today.map((call) => (
              <CallRow key={call.id} call={call} />
            ))}

            {yesterday.length > 0 && (
              <>
                <tr className="separatorRow">
                  <td colSpan="7" className="separator">
                    <span>Вчера</span>
                    <span className="callCountPin">{yesterday.length}</span>
                  </td>
                </tr>
                {yesterday.map((call) => (
                  <CallRow key={call.id} call={call} />
                ))}
              </>
            )}

            {earlier.length > 0 && (
              <>
                <tr className="separatorRow">
                  <td colSpan="7" className="separator">
                    <span>Позавчера и ранее</span>
                    <span className="callCountPin">{earlier.length}</span>
                  </td>
                </tr>
                {earlier.map((call) => (
                  <CallRow key={call.id} call={call} />
                ))}
              </>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default CallTable;
