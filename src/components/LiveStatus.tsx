import React, { useState, useEffect } from 'react';
import { Globe, Users, Wifi } from 'lucide-react';

const HEARTBEAT_URL = 'https://uojitexpkhexpbuqujxy.supabase.co/functions/v1/heartbeat';
const API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvaml0ZXhwa2hleHBidXF1anh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMzMTY4MzQsImV4cCI6MjA4ODg5MjgzNH0.Srmcs-ho-kq35-HSWF2C6Ua1zVNel_HFS9uu2KcBJ2o';

export const LiveStatus: React.FC = () => {
  const [stats, setStats] = useState({ active_users: 0, unique_ips: 0 });
  const [lastUpdate, setLastUpdate] = useState(new Date());

  const fetchStats = async () => {
    try {
      const response = await fetch(HEARTBEAT_URL, {
        headers: { apikey: API_KEY }
      });
      const data = await response.json();
      if (data.status === 'success') {
        setStats({
          active_users: data.active_users,
          unique_ips: data.unique_ips
        });
        setLastUpdate(new Date());
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchStats();
    const interval = window.setInterval(fetchStats, 10000);
    return () => window.clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-foreground">📊 লাইভ স্ট্যাটাস</h1>
          <p className="text-sm text-muted-foreground">রিয়েল-টাইম সিগন্যাল ইউজার মনিটরিং</p>
        </div>

        <div className="bg-card border border-primary/20 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Users className="h-4 w-4" />
            সক্রিয় ইউজার (সেশন)
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-primary tabular-nums">{stats.active_users}</span>
            <span className="text-sm text-muted-foreground">জন অনলাইনে</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            <Wifi className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-xs text-primary">লাইভ</span>
          </div>
        </div>

        <div className="bg-card border border-accent/20 rounded-lg p-6 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground mb-2">
            <Globe className="h-4 w-4" />
            ইউনিক আইপি
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-foreground tabular-nums">{stats.unique_ips}</span>
            <span className="text-sm text-muted-foreground">টি ডিভাইস</span>
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground">
          সর্বশেষ আপডেট: {lastUpdate.toLocaleTimeString('bn-BD')}
          <br />
          প্রতি ১০ সেকেন্ডে অটো-রিফ্রেশ হয়
        </p>
      </div>
    </div>
  );
};
