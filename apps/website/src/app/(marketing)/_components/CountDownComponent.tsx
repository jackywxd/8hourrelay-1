import { useAnimate } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

// NOTE: Change this date to whatever date you want to countdown to :)
const COUNTDOWN_FROM = '2024-09-07';

const SECOND = 1000;
const MINUTE = SECOND * 60;
const HOUR = MINUTE * 60;
const DAY = HOUR * 24;

type Units = 'Day' | 'Hour' | 'Minute' | 'Second';

export const ShiftingCountdown = () => {
  return (
    <section className="countdown-container">
      <CountdownItem unit="Day" text="days" />
      <CountdownItem unit="Hour" text="hours" />
      <CountdownItem unit="Minute" text="minutes" />
      <CountdownItem unit="Second" text="seconds" />
    </section>
  );
};

const CountdownItem = ({ unit, text }: { unit: Units; text: string }) => {
  const { ref, time } = useTimer(unit);

  return (
    <div className="countdown-item">
      <div className="relative w-full overflow-hidden text-center">
        <span ref={ref} className="number">
          {time}
        </span>
      </div>
      <span className="unit">{text}</span>
    </div>
  );
};

export default ShiftingCountdown;

// NOTE: Framer motion exit animations can be a bit buggy when repeating
// keys and tabbing between windows. Instead of using them, we've opted here
// to build our own custom hook for handling the entrance and exit animations
const useTimer = (unit: Units) => {
  const [ref, animate] = useAnimate();

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const timeRef = useRef(0);

  const [time, setTime] = useState(0);

  useEffect(() => {
    intervalRef.current = setInterval(handleCountdown, 2000);

    return () => clearInterval(intervalRef.current || undefined);
  }, []);

  const handleCountdown = async () => {
    const end = new Date(COUNTDOWN_FROM);
    const now = new Date();
    const distance = +end - +now;

    let newTime = 0;

    if (unit === 'Day') {
      newTime = Math.floor(distance / DAY);
    } else if (unit === 'Hour') {
      newTime = Math.floor((distance % DAY) / HOUR);
    } else if (unit === 'Minute') {
      newTime = Math.floor((distance % HOUR) / MINUTE);
    } else {
      newTime = Math.floor((distance % MINUTE) / SECOND);
    }

    if (newTime !== timeRef.current) {
      // Exit animation
      await animate(
        ref.current,
        { y: ['0%', '-50%'], opacity: [1, 0] },
        { duration: 1.0 }
      );

      timeRef.current = newTime;
      setTime(newTime);

      // Enter animation
      await animate(
        ref.current,
        { y: ['50%', '0%'], opacity: [0, 1] },
        { duration: 1.0 }
      );
    }
  };

  return { ref, time };
};
