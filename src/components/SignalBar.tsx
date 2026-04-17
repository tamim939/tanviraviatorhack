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
        <div className="relative p-3 rounded-[1.25rem] bg-[#0c1427]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col items-center min-w-[200px]">
          {/* Zoom Controller */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5 bg-black/80 backdrop-blur-lg px-2.5 py-1 rounded-full border border-white/20 shadow-lg pointer-events-auto">
            <button 
              onClick={() => setBoxScale(prev => Math.max(0.4, prev - 0.1))}
              className="w-5 h-5 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-bold transition-all"
            >
              -
            </button>
            <div className="flex flex-col items-center px-0.5">
              <span className="text-[9px] font-mono font-black text-cyan-400 leading-none">
                {Math.round(boxScale * 100)}%
              </span>
            </div>
            <button 
              onClick={() => setBoxScale(prev => Math.min(2.5, prev + 0.1))}
              className="w-5 h-5 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full text-white text-sm font-bold transition-all"
            >
              +
            </button>
          </div>

          {/* Header */}
          <h2 className="text-cyan-400 font-black text-[10px] tracking-widest mb-2.5 uppercase w-full text-center leading-none">
            Aviator Predictor
          </h2>

          {/* Main Circle Display */}
          <div className="relative w-24 h-24 mb-3">
            <div className="absolute inset-0 rounded-full border-[3px] border-[#1a2b4b] flex items-center justify-center overflow-hidden bg-[#081021]">
              <div className="flex flex-col items-center justify-center h-full w-full">
                {isAnalyzing && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/40 backdrop-blur-[1px]">
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                      className="w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full mb-1"
                    />
                    <span className="text-[10px] font-black text-cyan-400 animate-pulse tracking-widest uppercase">
                      Analyzing...
                    </span>
                  </div>
                )}
                
                <motion.span 
                  key={signal}
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-2xl font-black text-white"
                >
                  {signal || "0.00x"}
                </motion.span>
              </div>
            </div>
          </div>

          {/* Buttons Row */}
          <div className="flex gap-2 w-full">
            <button
              onClick={handleNext}
              disabled={isAnalyzing}
              className={cn(
                "flex-1 py-1.5 rounded-md font-black text-[10px] uppercase tracking-wider transition-all active:scale-95 border",
                isAnalyzing 
                  ? "bg-slate-800/50 cursor-not-allowed text-white/30 border-white/5" 
                  : "bg-emerald-500 text-[#0c1427] border-emerald-300/30"
              )}
            >
              Next ➔
            </button>
          </div>
          
          <div className="w-full flex justify-center mt-3">
            <div className="text-[6px] font-black text-white/10 uppercase tracking-widest">
              Drag to move
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="relative flex items-center justify-between px-3.5 py-2.5 bg-white border-b border-gray-100 h-[64px]">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-gray-400 font-bold text-base">P:</span>
          <span className="font-mono font-black text-black text-lg tracking-tight">
            {currentPeriod?.slice(-6) || "..."}
          </span>
        </div>
        
        <div className="relative w-8 h-8 flex items-center justify-center">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 24 24">
            <circle
              cx="12"
              cy="12"
              r="10.5"
              fill="none"
              stroke="#f3f4f6"
              strokeWidth="1.5"
            />
            <circle
              cx="12"
              cy="12"
              r="10.5"
              fill="none"
              stroke="#2563eb"
              strokeWidth="2"
              strokeDasharray="65.97"
              strokeDashoffset={65.97 * (1 - progress / 100)}
              strokeLinecap="round"
              className="transition-all duration-1000"
            />
          </svg>
          <span className="relative font-mono font-black text-xs text-black">
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
              "flex items-center gap-3 px-7 py-2.5 rounded-full font-black text-base uppercase tracking-wider text-white transition-all shadow-xl",
              signal === "BIG" 
                ? "bg-[#ff3b3b] shadow-red-500/40 ring-[6px] ring-red-500/10" 
                : "bg-[#22c55e] shadow-green-500/40 ring-[6px] ring-green-500/10"
            )}
          >
            <div className={cn(
              "w-3 h-3 rounded-full border-2 border-white/40 shadow-[0_0_8px_rgba(255,255,255,0.8)]",
              signal === "BIG" ? "bg-white" : "bg-white" 
            )} />
            {signal}
          </motion.div>
        ) : (
          <div className="px-6 py-2.5 rounded-full bg-gray-50 text-gray-400 text-xs font-black uppercase tracking-widest animate-pulse border border-gray-100">
            Wait...
          </div>
        )}
      </div>
    </div>
  );
};
