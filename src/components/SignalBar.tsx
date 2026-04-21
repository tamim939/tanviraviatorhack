import React from 'react';
import { cn } from '@/src/lib/utils';

import { motion } from 'motion/react';

interface SignalBarProps {
  signal: string;
  period: string;
  currentPeriod: string;
  secondsLeft: number;
  maxSeconds?: number;
  isVip?: boolean;
  onManualSync?: () => void;
  onNextSignal?: () => void;
  isAnalyzing?: boolean;
}

export const SignalBar: React.FC<SignalBarProps> = ({
  signal,
  period,
  currentPeriod,
  secondsLeft,
  maxSeconds = 30,
  isVip = false,
  onManualSync,
  onNextSignal,
  isAnalyzing = false,
}) => {
  const isActive = signal && period && (isVip || period === currentPeriod);
  const progress = ((maxSeconds - secondsLeft) / maxSeconds) * 100;
  const [boxScale, setBoxScale] = React.useState(1);

  const handleGetSignal = () => {
    if (isAnalyzing || signal) return;
    onManualSync?.();
  };

  const handleNext = () => {
    if (isAnalyzing) return;
    onNextSignal?.();
  };

  if (isVip) {
    return (
      <motion.div 
        drag
        dragMomentum={false}
        initial={{ x: 0, y: 0 }}
        style={{ scale: boxScale }}
        className="fixed top-20 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center pointer-events-auto touch-none origin-center"
      >
        <div className="relative p-3 rounded-2xl bg-gradient-to-b from-[#1a1c2e] to-[#0a0b1e] backdrop-blur-3xl border-2 border-amber-500/30 shadow-[0_0_30px_rgba(245,158,11,0.15)] flex flex-col items-center min-w-[210px] ring-1 ring-white/5">
          {/* VIP Badge */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-amber-400 to-yellow-600 rounded-full shadow-lg shadow-amber-500/20 border border-amber-300/50 flex items-center gap-1">
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-pulse shadow-[0_0_4px_white]" />
            <span className="text-[9px] font-black text-white uppercase tracking-tighter">Premium VIP</span>
          </div>

          {/* Zoom Controller */}
          <div className="absolute top-4 right-3 flex items-center gap-1 opacity-40 hover:opacity-100 transition-opacity">
            <button 
              onClick={() => setBoxScale(prev => Math.max(0.4, prev - 0.1))}
              className="w-4 h-4 flex items-center justify-center bg-white/10 rounded-sm text-white text-[8px] font-bold"
            >
              -
            </button>
            <button 
              onClick={() => setBoxScale(prev => Math.min(2.5, prev + 0.1))}
              className="w-4 h-4 flex items-center justify-center bg-white/10 rounded-sm text-white text-[8px] font-bold"
            >
              +
            </button>
          </div>

          {/* Header */}
          <h2 className="text-amber-500/80 font-black text-[9px] tracking-[0.2em] mt-2 mb-3 uppercase w-full text-center leading-none italic">
            TRADER TAMIM SIGNAL
          </h2>

          {/* Main Circle Display */}
          <div className="relative w-28 h-28 mb-4">
            {/* Outer ring glow */}
            <div className="absolute inset-[-4px] rounded-full bg-amber-500/10 blur-[8px]" />
            
            <div className="absolute inset-0 rounded-full border-[1.5px] border-amber-500/20 flex items-center justify-center overflow-hidden bg-black/40 shadow-inner">
              {/* Scanline effect */}
              <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(245,158,11,0.03)_50%,transparent_100%)] bg-[length:100%_4px] animate-[scan_2s_linear_infinite]" />
              
              <div className="flex flex-col items-center justify-center h-full w-full relative z-10">
                {isAnalyzing && (
                  <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-[#0a0b1e]/80 backdrop-blur-sm">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.6, ease: "linear" }}
                      className="w-8 h-8 border-2 border-amber-500 border-t-transparent rounded-full mb-2 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                    />
                    <span className="text-[10px] font-black text-amber-500 animate-pulse tracking-[0.15em] uppercase">
                      Syncing...
                    </span>
                  </div>
                )}
                
                <div className="flex flex-col items-center pt-1">
                  <span className="text-[8px] font-black text-amber-500/40 uppercase tracking-widest mb-0.5">Predicted</span>
                  <motion.span 
                    key={signal}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl font-mono font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]"
                  >
                    {signal || "---"}
                  </motion.span>
                  <div className="h-0.5 w-8 bg-amber-500/20 mt-1 rounded-full" />
                </div>
              </div>
            </div>
            
            {/* Circular Progress (Static Decorative) */}
            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none opacity-30" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="48" fill="none" stroke="currentColor" strokeWidth="0.5" className="text-amber-500" strokeDasharray="4 4" />
            </svg>
          </div>

          {/* Buttons Row */}
          <div className="flex gap-2 w-full pt-1">
            <button
              onClick={handleNext}
              disabled={isAnalyzing}
              className={cn(
                "flex-1 py-2.5 rounded-xl font-black text-[11px] uppercase tracking-[0.1em] transition-all active:scale-95 border group relative overflow-hidden",
                isAnalyzing 
                  ? "bg-slate-800/50 cursor-not-allowed text-white/30 border-white/5" 
                  : "bg-gradient-to-r from-amber-500 to-yellow-600 text-white border-amber-400/50 shadow-lg shadow-amber-500/20"
              )}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                Get Next Result
                <span className="group-hover:translate-x-0.5 transition-transform italic text-amber-200">➔</span>
              </span>
              {/* Shine effect */}
              {!isAnalyzing && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />}
            </button>
          </div>
          
          <div className="w-full flex justify-between items-center mt-3.5 px-1">
            <span className="text-[7px] font-black text-white/10 uppercase tracking-widest">v4.2.0-secure</span>
            <div className="flex gap-0.5">
              {[1,2,3].map(i => <div key={i} className="w-1 h-1 rounded-full bg-emerald-500/20" />)}
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative flex items-center justify-between px-4 py-2 bg-white border-b border-gray-100 h-[56px]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1">
          <span className="text-gray-400 font-medium text-sm">P:</span>
          <span className="font-mono font-bold text-gray-800 text-base">
            {currentPeriod?.slice(-6) || "..."}
          </span>
        </div>
        
        <div className="relative w-9 h-9 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10.5"
              fill="none"
              stroke="#e5e7eb"
              strokeWidth="1.5"
            />
            <circle
              cx="12"
              cy="12"
              r="10.5"
              fill="none"
              stroke="#2563eb"
              strokeWidth="1.8"
              strokeDasharray="65.97"
              strokeDashoffset={65.97 * (1 - progress / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <span className="relative font-mono font-bold text-xs text-gray-700">
            {secondsLeft}
          </span>
        </div>
      </div>

      <div className="flex items-center">
        {isActive ? (
          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-full font-black text-xs uppercase tracking-wider text-white transition-all shadow-sm",
              signal === "BIG" 
                ? "bg-red-500" 
                : "bg-green-500"
            )}
          >
            <div className="w-4 h-4 rounded-full bg-white/30 flex items-center justify-center border border-white/20">
              <div className="w-2 h-2 rounded-full bg-white shadow-[0_0_4px_white]" />
            </div>
            {signal}
          </motion.div>
        ) : (
          <div className="px-4 py-2 rounded-full bg-gray-50 text-gray-400 text-[10px] font-black uppercase tracking-widest animate-pulse border border-gray-100">
            WAITING...
          </div>
        )}
      </div>
    </div>
  );
};
