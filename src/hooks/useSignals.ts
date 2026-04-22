import { useState, useEffect, useRef } from 'react';
import { useCountdown } from './useCountdown';

export type SignalType = 'BIG' | 'SMALL' | '';

export interface SignalData {
  signal: SignalType;
  period: string;
}

export const useSignals = () => {
  const [data, setData] = useState<SignalData>({ signal: '', period: '' });
  const lastSignalRef = useRef<string>('');
  const { period: currentPeriod } = useCountdown();

  // Deterministic signal generation based on period string
  const getAutoSignal = (period: string): SignalType => {
    if (!period) return '';
    
    // WinGo logic substitute: simple deterministic hash
    const hash = period.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    
    const predictedNumber = Math.abs(hash) % 10;
    return predictedNumber >= 5 ? 'BIG' : 'SMALL';
  };

  useEffect(() => {
    if (currentPeriod && currentPeriod !== lastSignalRef.current) {
      lastSignalRef.current = currentPeriod;
      setData({
        signal: getAutoSignal(currentPeriod),
        period: currentPeriod
      });
    }
  }, [currentPeriod]);

  return data;
};
