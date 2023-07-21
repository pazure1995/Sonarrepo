import React, { useEffect, useState, useRef } from "react";

const Timer = ({
  duration,
  submitResult,
  toggleFullscreen,
  resetTimer,
  getTimerCount,
  pauseTimer,
}) => {
  // The state for our timer
  const [timer, setTimer] = useState("00:00:00");
  const Ref = useRef(null);
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      hours,
      minutes,
      seconds,
    };
  };

  const startTimer = (e) => {
    let { total, hours, minutes, seconds } = getTimeRemaining(e);
    let timerCount =
      (hours > 9 ? hours : "0" + hours) +
      ":" +
      (minutes > 9 ? minutes : "0" + minutes) +
      ":" +
      (seconds > 9 ? seconds : "0" + seconds);

    const testCount = `00:${duration}:00`;

    if (timerCount === testCount) {
      submitResult();
      toggleFullscreen();
      return;
    }

    if (total >= 0) {
      setTimer(
        (hours > 9 ? hours : "0" + hours) +
          ":" +
          (minutes > 9 ? minutes : "0" + minutes) +
          ":" +
          (seconds > 9 ? seconds : "0" + seconds)
      );
    }
  };

  const clearTimer = (e) => {
    setTimer("00:00:00");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = () => {
    let deadline = new Date();
    deadline.setMinutes(deadline.getMinutes() + parseInt(duration));
    return deadline;
  };

  useEffect(() => {
    clearTimer(getDeadTime());
    // eslint-disable-next-line
  }, [resetTimer]);

  useEffect(() => {
    getTimerCount(timer);
    // eslint-disable-next-line
  }, [timer]);

  return (
    <div>
      <i className="fas fa-clock mr-2"></i>
      {timer}
    </div>
  );
};

export default Timer;
