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

  // Deterministic signal generation based on period string digits sum
  const getAutoSignal = (period: string): SignalType => {
    if (!period) return '';
    
    // Logic: sum of digits % 2
    const sum = period.split('').reduce((a, b) => a + (parseInt(b) || 0), 0);
    return sum % 2 === 0 ? 'BIG' : 'SMALL';
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

    const updateSignalFromDB = async () => {
      try {
        const latest = await fetchLatestSignal();
        
        // If we have a signal for the current period, use it
        if (latest.signal && latest.period === currentPeriod) {
          handleSignal(latest);
          return true;
        }
      } catch (error) {
        // Silent fail
      }
      return false;
    };

    const syncToDB = async (signal: SignalType, period: string) => {
      if (!signal || !period) return;
      try {
        // Use a simple insert, unique constraint on period would prevent duplicates
        // If it already exists, it will just fail silently or we can ignore it
        await supabase
          .from('signals')
          .insert([
            { signal_type: signal, period: period }
          ]);
      } catch (error) {
        // Ignore errors (duplicate key, etc)
      }
    };

    const runLogic = async () => {
      if (!currentPeriod) return;

      // 1. Calculate deterministic signal first for instant delivery
      const autoSignal = getAutoSignal(currentPeriod);
      handleSignal({
        signal: autoSignal,
        period: currentPeriod
      });

      // 2. Try to get override from DB
      const foundInDB = await updateSignalFromDB();

      // 3. If NOT found in DB, save our deterministic one so it's "set" for others
      if (!foundInDB) {
        await syncToDB(autoSignal, currentPeriod);
      }
    };

    runLogic();

    // Real-time subscription for manual overrides or new signals
    const channel = supabase
      .channel('signals-live')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'signals' },
        (payload) => {
          const newData = payload.new as any;
          if (newData.period === currentPeriod) {
            handleSignal({
              signal: newData.signal_type as SignalType,
              period: newData.period
            });
          }
        }
      )
      .subscribe();

    const interval = window.setInterval(updateSignalFromDB, 3000);

    return () => {
      active = false;
      window.clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [currentPeriod]);

  return data;
};
