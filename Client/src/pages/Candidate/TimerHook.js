import React, { useEffect } from "react";
import { useTimer } from "react-timer-hook";

const TimerHook = ({
  expiryTimestamp,
  submitResult,
  toggleFullscreen,
  pauseTimer,
  duration,
  resetTimer,
  getTimerCount,
  setShowConfirmation,
}) => {
  const {
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => {
      console.warn("Time expired.");
      submitResult();
      toggleFullscreen();
      setShowConfirmation(true);
    },
  });

  useEffect(() => {
    getTimerCount(
      `${(hours.toString().length > 1 ? "" : "0") + hours}:${
        (minutes.toString().length > 1 ? "" : "0") + minutes
      }:${(seconds.toString().length > 1 ? "" : "0") + seconds}`
    );
    // eslint-disable-next-line
  }, [seconds]);

  useEffect(() => {
    handlePause(pauseTimer);
    // eslint-disable-next-line
  }, [pauseTimer]);

  const handlePause = (pauseTimer) => {
    pauseTimer ? pause() : resume();
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "25px" }}>
        <span>
          <i className="fas fa-clock mr-2"></i>
        </span>
        <span>{(hours.toString().length > 1 ? "" : "0") + hours}</span>:
        <span>{(minutes.toString().length > 1 ? "" : "0") + minutes}</span>:
        <span>{(seconds.toString().length > 1 ? "" : "0") + seconds}</span>
      </div>
    </div>
  );
};

export default TimerHook;
