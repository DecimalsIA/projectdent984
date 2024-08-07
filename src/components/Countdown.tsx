import React, { useState, useEffect } from 'react';

interface CountdownProps {
  stopCounting: boolean;
}

const Countdown: React.FC<CountdownProps> = ({ stopCounting }) => {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined = undefined;

    if (!stopCounting) {
      timer = setInterval(() => {
        setTime((prevTime) => {
          let { hours, minutes, seconds } = prevTime;

          seconds += 1;
          if (seconds === 60) {
            seconds = 0;
            minutes += 1;
          }
          if (minutes === 60) {
            minutes = 0;
            hours += 1;
          }

          return { hours, minutes, seconds };
        });
      }, 1000);
    } else if (stopCounting && timer) {
      clearInterval(timer);
    }

    return () => clearInterval(timer);
  }, [stopCounting]);

  return (
    <span>
      {String(time.hours).padStart(2, '0')}:
      {String(time.minutes).padStart(2, '0')}:
      {String(time.seconds).padStart(2, '0')}
    </span>
  );
};

export default Countdown;
