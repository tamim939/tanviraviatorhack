import React, { useState } from 'react';
import { supabase } from '@/src/lib/supabase';
import { SignalBar } from './SignalBar';
import { useSignals } from '@/src/hooks/useSignals';
import { useCountdown } from '@/src/hooks/useCountdown';
import { toast } from 'sonner';
import { cn } from '@/src/lib/utils';

const ADMIN_PASS_KEY = 'admin_auth_pass';
const ADMIN_TS_KEY = 'admin_auth_ts';
const SESSION_DURATION = 24 * 60 * 60 * 1000;

export const AdminPanel: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthorized, setIsAuthorized] = useState(() => {
    const ts = sessionStorage.getItem(ADMIN_TS_KEY);
    if (!ts || Date.now() - parseInt(ts, 10) >= SESSION_DURATION) {
      sessionStorage.removeItem(ADMIN_PASS_KEY);
      sessionStorage.removeItem(ADMIN_TS_KEY);
      return false;
    }
    return !!sessionStorage.getItem(ADMIN_PASS_KEY);
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signal, period } = useSignals();
  const { period: currentPeriod, secondsLeft } = useCountdown();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || loading) return;

    setLoading(true);
    setError('');

    try {
      const { data, error: invokeError } = await supabase.functions.invoke('send-signal', {
        body: { password, signal_type: 'CLEAR', period: '' }
      });

      if (invokeError || data?.error) {
        setError('Wrong password');
      } else {
        sessionStorage.setItem(ADMIN_PASS_KEY, password);
        sessionStorage.setItem(ADMIN_TS_KEY, String(Date.now()));
        setIsAuthorized(true);
      }
    } catch (err) {
      setError('Verification failed');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthorized) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <form onSubmit={handleLogin} className="flex flex-col gap-3 w-72 p-6 rounded-lg border border-border bg-card shadow-lg">
          <h2 className="text-lg font-bold text-foreground text-center">🔒 Admin Access</h2>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-destructive"
            )}
            autoFocus
          />
          {error && <p className="text-destructive text-xs text-center">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-9 px-3"
          >
            {loading ? "Verifying..." : "Unlock"}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <div className="bg-card border-b border-border px-4 py-3 flex items-center justify-between">
        <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
          Admin Monitoring
        </h1>
        <div className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
          Automatic Mode Active
        </div>
      </div>
      <SignalBar 
        signal={signal} 
        period={period} 
        currentPeriod={currentPeriod} 
        secondsLeft={secondsLeft} 
      />
      <iframe
        src="https://22bdwin24.com/"
        className="flex-1 w-full border-none"
        title="22bdwin24"
        sandbox="allow-same-origin allow-scripts allow-popups allow-forms"
      />
    </div>
  );
};
