import React, { useState, useRef, useEffect } from "react";
import ReactPlayer from "react-player/lazy";
import { fetchCallRecord } from "../../Api";
import "./PlayBar.css";

const PlayBar = ({
  callRecord,
  partnerId,
  onClose,
  onPlayStart,
  onPlayEnd,
}) => {
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const getAudio = async () => {
      try {
        const url = await fetchCallRecord(callRecord, partnerId);
        setAudioUrl(url);
      } catch (err) {
        setError("Не удалось загрузить запись");
      }
    };

    if (callRecord && partnerId) {
      getAudio();
    }
  }, [callRecord, partnerId]);

  useEffect(() => {
    if (isPlaying) {
      onPlayStart();
    } else {
      onPlayEnd();
    }
  }, [isPlaying, onPlayStart, onPlayEnd]);

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
    setIsLoaded(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e) => {
    const newTime = (e.nativeEvent.offsetX / e.target.offsetWidth) * duration;
    playerRef.current.seekTo(newTime);
  };

  const handleMouseMove = (e) => {
    const seekBar = e.target;
    const position = (e.nativeEvent.offsetX / seekBar.offsetWidth) * duration;
    setCurrentTime(position);
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = audioUrl;
    link.download = "record.mp3";
    link.click();
  };

  const handlePlayerEnd = () => {
    setIsPlaying(false);
    onClose();
  };

  const handleClose = () => {
    onClose();
    setIsPlaying(false);
  };

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="audioContainer">
      {audioUrl ? (
        <ReactPlayer
          ref={playerRef}
          url={audioUrl}
          playing={isPlaying}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnded={handlePlayerEnd}
          width="0"
          height="0"
          controls={false}
        />
      ) : (
        <div className="loadingText">Загружаем запись...</div>
      )}
      {isLoaded && (
        <div className="audioControls">
          <div>{new Date(duration * 1000).toISOString().substr(14, 5)}</div>
          <button className="transparentButton" onClick={handlePlayPause}>
            <img
              src={isPlaying ? "assets/pauseIcon.svg" : "assets/playIcon.svg"}
              alt={isPlaying ? "Пауза" : "Воспроизвести"}
              className="playPauseIcon"
            />
          </button>
          <div
            className="progressBar"
            onClick={handleSeek}
            onMouseMove={handleMouseMove}
          >
            <div
              className="progressBarFilled"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
          </div>
          <div className="controls">
            <button className="transparentButton" onClick={handleDownload}>
              <img
                className="downloadRecord"
                src="assets/downloadIcon.svg"
                alt="загрузить запись"
              />
            </button>
            <button className="transparentButton" onClick={handleClose}>
              <img
                className="closeCross"
                src="assets/crossBlue.svg"
                alt="закрыть"
              />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlayBar;
