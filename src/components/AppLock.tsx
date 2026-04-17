import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const AUTH_KEY = 'app-unlocked-v2';
const APP_PASSWORD = 'Tanvir0011'; // User specified password

export const AppLock: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLocked, setIsLocked] = useState(true);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(AUTH_KEY) === 'true') {
      setIsLocked(false);
    }
  }, []);

  const handleUnlock = () => {
    if (password === APP_PASSWORD) {
      localStorage.setItem(AUTH_KEY, 'true');
      setIsLocked(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const telegramLink = `https://t.me/TRADER_TANVIR_EX?text=${encodeURIComponent('ভাইয়া আমি একটা নিতে চাই কি করতে হবে')}`;

  if (!isLocked) return <>{children}</>;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-background p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-sm space-y-8 p-8 rounded-3xl border border-border bg-card shadow-2xl text-center"
      >
        <div className="space-y-2">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <motion.span 
              animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-3xl"
            >
              🔐
            </motion.span>
          </div>
          <h1 className="text-2xl font-black tracking-tight text-foreground">সিস্টেম লক করা আছে</h1>
          <p className="text-sm text-muted-foreground">ভিতরে প্রবেশ করতে পাসওয়ার্ড দিন</p>
        </div>

        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="পাসওয়ার্ড লিখুন"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                "w-full px-4 py-4 rounded-2xl border bg-muted/50 text-center font-mono font-bold text-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all",
                error ? "border-destructive ring-2 ring-destructive" : "border-border"
              )}
            />
          </div>

          <div className="flex gap-2">
            <a
              href={telegramLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center w-14 h-14 bg-[#0088cc] text-white rounded-2xl hover:opacity-90 transition-opacity shrink-0 shadow-lg shadow-blue-500/20"
              title="Contact Telegram"
            >
              <Send size={24} />
            </a>
            <button
              onClick={handleUnlock}
              className="flex-1 h-14 bg-primary text-primary-foreground font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-lg shadow-primary/20 active:scale-95"
            >
              আনলক করুন
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <p className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">
            〲 TANVIR AVIATOR HACK ♡ ̆̈—͟͞𖣘
          </p>
        </div>
      </motion.div>
    </div>
  );
};
