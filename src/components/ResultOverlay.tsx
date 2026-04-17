import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface ResultOverlayProps {
  result: 'WIN' | 'LOSS' | null;
  onComplete: () => void;
}

export const ResultOverlay: React.FC<ResultOverlayProps> = ({ result, onComplete }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (result) {
      setVisible(true);
      const timer = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 600); // 0.6 seconds duration - very fast
      return () => clearTimeout(timer);
    }
  }, [result, onComplete]);

  return (
    <AnimatePresence>
      {visible && result && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center pointer-events-none overflow-hidden">
          {/* Background Flash */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 0.4, 0] }}
            transition={{ duration: 0.3 }}
            className={cn(
              "absolute inset-0",
              result === 'WIN' ? "bg-green-500/20" : "bg-red-500/20"
            )}
          />

          {/* Falling Fireworks/Particles - Very Fast */}
          {[...Array(15)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ 
                opacity: 0, 
                y: -50, 
                x: Math.random() * window.innerWidth,
                scale: Math.random() * 0.5 + 0.5
              }}
              animate={{ 
                opacity: [0, 1, 0],
                y: window.innerHeight + 50,
                x: (Math.random() - 0.5) * 300 + (Math.random() * window.innerWidth),
              }}
              transition={{ 
                duration: 0.7, // Very fast fall
                delay: Math.random() * 0.2,
                ease: "easeOut"
              }}
              className={cn(
                "absolute font-black text-xl whitespace-nowrap",
                result === 'WIN' ? "text-green-400" : "text-red-400"
              )}
            >
              {result === 'WIN' ? "WIN" : "LOSS"}
            </motion.div>
          ))}

          {/* Main Bursting Text - Instant Pop */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: [0, 1.2, 1],
              opacity: 1,
            }}
            exit={{ scale: 0, opacity: 0, transition: { duration: 0.15 } }}
            className="relative flex flex-col items-center"
          >
            <div className={cn(
              "text-7xl md:text-9xl font-black tracking-tighter uppercase drop-shadow-2xl",
              result === 'WIN' ? "text-green-500" : "text-red-500"
            )}
            style={{ WebkitTextStroke: '2px white' }}
            >
              {result} {result}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
