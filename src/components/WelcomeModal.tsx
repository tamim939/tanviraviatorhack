import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';
import { cn } from '@/src/lib/utils';

const WELCOME_SEEN_KEY = 'signal-welcome-seen';

export const WelcomeModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(WELCOME_SEEN_KEY)) {
      setIsOpen(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem(WELCOME_SEEN_KEY, '1');
    setIsOpen(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-card border border-primary/20 rounded-2xl shadow-2xl overflow-hidden"
          >
            <div className="p-6 space-y-4">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold text-foreground">⚡ TANVIR AVIATOR HACK</h2>
                <div className="h-1 w-16 bg-primary mx-auto rounded-full" />
              </div>

              <div className="space-y-4 text-sm text-muted-foreground leading-relaxed text-center">
                <p>
                  সরাসরি স্ক্রিনে <span className="font-semibold text-primary">রিয়েল-টাইম সিগন্যাল</span> পেতে নিচের বাটনটি ক্লিক করুন।
                </p>
                
                <div className="rounded-xl bg-primary/5 p-4 border border-primary/10">
                  <p className="font-bold text-foreground">সিস্টেম এখন সচল আছে।</p>
                  <p className="text-xs mt-1">দ্রুত সিগন্যাল পেতে কাউন্টডাউন টাইমার লক্ষ্য করুন।</p>
                </div>
              </div>

              <button
                onClick={handleClose}
                className="w-full py-4 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
              >
                ✅ বুঝেছি
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
