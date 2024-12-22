import React, { useState } from "react";
import "./CallRow.css";
import PlayBar from "../PlayBar/PlayBar";

const CallRow = ({ call }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlayBar, setShowPlayBar] = useState(false);
  const [isClosed, setIsClosed] = useState(false);

  const handlePlayStart = () => setIsPlaying(true);
  const handlePlayEnd = () => setIsPlaying(false);

  // mm:ss для продолжительности звонка
  const formatTimeInSeconds = (seconds) => {
    if (seconds === 0) return "";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  // hh:mm для времени звонка
  const formatTimeFromDate = (date) => {
    const time = new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    return time;
  };

  const getCallIconPath = (inOut, status) => {
    if (inOut === 1 && status === "Дозвонился") return "/assets/callInIcon.svg";
    if (inOut === 0 && status === "Дозвонился")
      return "/assets/callOutIcon.svg";
    if (inOut === 1 && status === "Не дозвонился")
      return "/assets/missedCallIcon.svg";
    if (inOut === 0 && status === "Не дозвонился")
      return "/assets/notAnsweredCallIcon.svg";
    return null;
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber || phoneNumber.length !== 11) return phoneNumber;
    const formatted = `+${phoneNumber[0]} (${phoneNumber.slice(
      1,
      4
    )}) ${phoneNumber.slice(4, 7)}-${phoneNumber.slice(
      7,
      9
    )}-${phoneNumber.slice(9)}`;
    return formatted;
  };

  const rating = call.rating;

  const ratingClass =
    rating === "Хорошо"
      ? "ratingGood"
      : rating === "Отлично"
      ? "ratingGreat"
      : rating === "Плохо"
      ? "ratingBad"
      : "noRating";

  const handleClose = () => {
    setShowPlayBar(false);
    setIsPlaying(false);
    setIsClosed(true);
  };

  const handleMouseEnter = () => {
    if (isValid && !isClosed) {
      setIsHovered(true);
      setShowPlayBar(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isPlaying) {
      setShowPlayBar(false);
      setIsHovered(false);
      setTimeout(() => {
        setIsClosed(false); // Чтобы при закрытии по кнопке не появлялся мгновенно по hover
      }, 500);
    }
  };
  const callIconPath = getCallIconPath(call.in_out, call.status);
  const avatarSrc = call.person_avatar || "/assets/avatarFallback.svg";
  const callRecord = call.record;
  const partnerId = call.partnership_id;
  const isValid = callRecord && partnerId;

  return (
    <tr
      className="callRow"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <td className="callRowCell tablePaddingLeft">
        {callIconPath && (
          <img src={callIconPath} alt="Иконка звонка" className="callIcon" />
        )}
      </td>
      <td className="callRowCell darkText">{formatTimeFromDate(call.date)}</td>
      <td className="callRowCell">
        <img
          src={avatarSrc}
          alt="Аватар"
          style={{ width: "40px", height: "40px", borderRadius: "50%" }}
        />
      </td>
      <td className="callRowCell darkText">
        <div>
          <p className="contactName">{call.contact_name || ""}</p>
          <p className="contactCompany">{call.contact_company || ""}</p>
          {formatPhoneNumber(call.partner_data?.phone) || "Неизвестно"}
        </div>
      </td>
      <td className="callRowCell lightText">
        {call.partner_data?.name || "Неизвестно"}
      </td>
      <td>
        <span className={`callRowRating ${ratingClass}`}>{rating}</span>
      </td>
      <td className="callRowCell darkText tablePaddingRight cellTextRight">
        <div className="playBarWrapper">
          {isValid && (showPlayBar || isPlaying) ? (
            <PlayBar
              callRecord={callRecord}
              partnerId={partnerId}
              onClose={handleClose}
              onPlayStart={handlePlayStart}
              onPlayEnd={handlePlayEnd}
            />
          ) : (
            formatTimeInSeconds(call.time)
          )}
        </div>
      </td>
    </tr>
  );
};

export default CallRow;
