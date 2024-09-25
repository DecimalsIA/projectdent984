/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';

interface CountdownProps {
  stopCounting: boolean;
  startTime: number; // Tiempo inicial en Unix
  endTime: number; // Tiempo final en Unix
}

const Countdown: React.FC<CountdownProps> = ({
  stopCounting,
  startTime,
  endTime,
}) => {
  const calculateTimeLeft = () => {
    const now = Date.now(); // Obtiene el tiempo actual en Unix
    const difference = endTime - now;

    if (difference <= 0) {
      return { hours: 0, minutes: 0, seconds: 0 };
    }

    const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((difference / 1000 / 60) % 60);
    const seconds = Math.floor((difference / 1000) % 60);

    return { hours, minutes, seconds };
  };

  const [time, setTime] = useState(calculateTimeLeft());

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;

    if (!stopCounting) {
      timer = setInterval(() => {
        setTime(calculateTimeLeft());
      }, 1000);
    } else if (stopCounting && timer) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [stopCounting, startTime, endTime]);

  return (
    <span>
      {String(time.hours).padStart(2, '0')}:
      {String(time.minutes).padStart(2, '0')}:
      {String(time.seconds).padStart(2, '0')}
    </span>
  );
};

export default Countdown;
