import { useState, useEffect, useRef } from 'react';

const calculateLocalPeriod = (): string => {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, '0');
  const day = String(now.getUTCDate()).padStart(2, '0');
  const dateStr = `${year}${month}${day}`;
  
  const secondsSinceMidnight = now.getUTCHours() * 3600 + now.getUTCMinutes() * 60 + now.getUTCSeconds();
  const periodIndex = Math.floor(secondsSinceMidnight / 30) + 1;
  const periodStr = String(periodIndex).padStart(4, '0');
  
  // Format: YYYYMMDD030[index]
  // This matches common WinGo 30s patterns
  return `${dateStr}030${periodStr}`;
};

export const useCountdown = (onPeriodChange?: (newPeriod: string) => void) => {
  const [period, setPeriod] = useState('');
  const [secondsLeft, setSecondsLeft] = useState(30);
  const lastPeriodRef = useRef('');

  useEffect(() => {
    let active = true;

    const updatePeriod = () => {
      const newPeriod = calculateLocalPeriod();
      if (newPeriod && active) {
        if (newPeriod !== lastPeriodRef.current) {
          if (lastPeriodRef.current) {
            onPeriodChange?.(lastPeriodRef.current);
          }
          lastPeriodRef.current = newPeriod;
        }
        setPeriod(newPeriod);
      }
    };

    updatePeriod();
    const periodInterval = window.setInterval(updatePeriod, 5000);

    const countdownInterval = window.setInterval(() => {
      if (!active) return;
      
      const now = new Date();
      const seconds = now.getUTCSeconds();
      const ms = now.getUTCMilliseconds();
      
      const elapsedInCycle = (seconds % 30) * 1000 + ms; 
      const remaining = Math.max(0, 30 - Math.floor(elapsedInCycle / 1000));
      
      if (remaining === 30 && secondsLeft === 1) {
        if (lastPeriodRef.current) {
          onPeriodChange?.(lastPeriodRef.current);
        }
      }
      
      setSecondsLeft(remaining === 0 ? 30 : remaining);
    }, 1000);

    return () => {
      active = false;
      window.clearInterval(periodInterval);
      window.clearInterval(countdownInterval);
    };
  }, []);

  return { period, secondsLeft };
};
