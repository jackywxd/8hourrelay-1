'use client';
import { useEffect, useState } from 'react';
import { TimerContainer } from './TimerContainer';

const useTimer = () => {
  const [time, setTime] = useState<number>(70);
  const [newTime, setNewTime] = useState<number>(0);
  const [days, setDays] = useState<number>(0);
  const [hours, setHours] = useState<number>(0);
  const [minutes, setMinutes] = useState<number>(0);
  const [seconds, setSeconds] = useState<number>(0);
  const [message, setMessage] = useState<string>('');

  const timeToDays = time * 60 * 60 * 24 * 1000;

  const launchDate = '2024/09/10';
  let countDownDate = new Date(launchDate).getTime();

  useEffect(() => {
    var updateTime = setInterval(() => {
      var now = new Date().getTime();

      var difference = countDownDate - now;

      var newDays = Math.floor(difference / (1000 * 60 * 60 * 24));
      var newHours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
      );
      var newMinutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60),
      );
      var newSeconds = Math.floor((difference % (1000 * 60)) / 1000);

      setDays(newDays);
      setHours(newHours);
      setMinutes(newMinutes);
      setSeconds(newSeconds);

      if (difference <= 0) {
        clearInterval(updateTime);
        setMessage('The Launch Has Started');
        setDays(0);
        setHours(0);
        setMinutes(0);
        setSeconds(0);
      }
    });

    return () => {
      clearInterval(updateTime);
    };
  }, [time]);

  return { days, hours, minutes, seconds };
};

export default function CountDownComponent() {
  const { days, hours, minutes, seconds } = useTimer();

  return (
    <TimerContainer
      days={days}
      hours={hours}
      minutes={minutes}
      seconds={seconds}
    />
  );
}
