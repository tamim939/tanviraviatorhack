import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useCountdown } from './useCountdown';

export type SignalType = 'BIG' | 'SMALL' | '';

export interface SignalData {
  signal: SignalType;
  period: string;
}

const vibrate = () => {
  // Vibration disabled as requested
};

const fetchLatestSignal = async (): Promise<SignalData> => {
  const { data, error } = await supabase
    .from('signals')
    .select('signal_type, period, created_at')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return {
    signal: (data?.signal_type as SignalType) || '',
    period: data?.period || '',
  };
};

export const useSignals = () => {
  const [data, setData] = useState<SignalData>({ signal: '', period: '' });
  const lastSignalRef = useRef<string>('');
  const { period: currentPeriod } = useCountdown();

  // Deterministic signal generation based on period string
  const getAutoSignal = (period: string): SignalType => {
    if (!period) return '';
    
    // WinGo logic: 0-4 is Small, 5-9 is Big
    // We'll use a deterministic hash to pick a "predicted" number
    const hash = period.split('').reduce((acc, char) => {
      return ((acc << 5) - acc) + char.charCodeAt(0);
    }, 0);
    
    const predictedNumber = Math.abs(hash) % 10;
    return predictedNumber >= 5 ? 'BIG' : 'SMALL';
  };

  useEffect(() => {
    let active = true;

    const handleSignal = (newSignal: SignalData) => {
      if (!active) return;
      
      const signalKey = `${newSignal.signal}-${newSignal.period}`;
      if (lastSignalRef.current !== signalKey) {
        lastSignalRef.current = signalKey;
        setData(newSignal);
        if (newSignal.signal) vibrate();
      }
    };

    // Immediate auto-signal to prevent flicker
    if (currentPeriod) {
      handleSignal({
        signal: getAutoSignal(currentPeriod),
        period: currentPeriod
      });
    }

    const updateSignal = async () => {
      try {
        const latest = await fetchLatestSignal();
        
        // If we have a manual signal for the current period, override the auto one
        if (latest.signal && latest.period === currentPeriod) {
          handleSignal(latest);
        }
      } catch (error) {
        // Silent fail, auto signal is already set
      }
    };

    updateSignal();

    // Real-time subscription for manual overrides
    const channel = supabase
      .channel('signals-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'signals' },
        () => updateSignal()
      )
      .subscribe();

    const interval = window.setInterval(updateSignal, 2000);

    return () => {
      active = false;
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [currentPeriod]);

  return data;
};
