import { useEffect, useRef } from 'react';

const SESSION_ID_KEY = 'signal-session-id';
const HEARTBEAT_URL = 'https://uojitexpkhexpbuqujxy.supabase.co/functions/v1/heartbeat';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvaml0ZXhwa2hleHBidXF1anh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTY4MzQsImV4cCI6MjA4ODg5MjgzNH0.Srmcs-ho-kq35-HSWF2C6Ua1zVNel_HFS9uu2KcBJ2o';

const getSessionId = () => {
  let id = sessionStorage.getItem(SESSION_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem(SESSION_ID_KEY, id);
  }
  return id;
};

export const useHeartbeat = () => {
  const intervalRef = useRef<number>();

  useEffect(() => {
    const sessionId = getSessionId();

    const sendHeartbeat = async (action: 'ping' | 'leave') => {
      try {
        await fetch(HEARTBEAT_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            apikey: API_KEY,
          },
          body: JSON.stringify({ session_id: sessionId, action }),
        });
      } catch (error) {
        // Silent fail
      }
    };

    const handleLeave = () => {
      const data = JSON.stringify({ session_id: sessionId, action: 'leave' });
      navigator.sendBeacon(`${HEARTBEAT_URL}?apikey=${API_KEY}`, data);
    };

    sendHeartbeat('ping');
    intervalRef.current = window.setInterval(() => sendHeartbeat('ping'), 20000);

    window.addEventListener('beforeunload', handleLeave);
    
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        handleLeave();
      } else {
        sendHeartbeat('ping');
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      window.removeEventListener('beforeunload', handleLeave);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      handleLeave();
    };
  }, []);
};
