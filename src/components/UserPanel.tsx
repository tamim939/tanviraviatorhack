import React, { useState, useEffect } from 'react';
import { SignalBar } from './SignalBar';
import { WelcomeModal } from './WelcomeModal';
import { ResultOverlay } from './ResultOverlay';
import { useSignals } from '@/src/hooks/useSignals';
import { useCountdown } from '@/src/hooks/useCountdown';
import { useHeartbeat } from '@/src/hooks/useHeartbeat';
import { cn } from '@/src/lib/utils';

export const UserPanel: React.FC = () => {
  const { signal: dbSignal, period: dbPeriod } = useSignals();
  const { period: currentPeriod, secondsLeft } = useCountdown((prevPeriod) => {
    // Only trigger results for the 30s manual signal periods, NOT in VIP mode
    if (!isVipMode && dbSignal) {
      setResult(Math.random() > 0.1 ? 'WIN' : 'LOSS');
    }
  });
  
  const [currentUrl, setCurrentUrl] = useState('https://23bdwin24.com/register?inviteCode=6QB3D5N&from=web');
  const [isVipMode, setIsVipMode] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [vipSignal, setVipSignal] = useState<string>('');
  const [vipPeriod, setVipPeriod] = useState<string>('');
  const [vipSeconds, setVipSeconds] = useState(5);
  const [vipState, setVipState] = useState<'WAITING' | 'ACTIVE'>('WAITING');
  const [result, setResult] = useState<'WIN' | 'LOSS' | null>(null);

  useEffect(() => {
    // Force refresh the layout for dynamic viewport
    window.addEventListener('resize', () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
    });
  }, []);

  useEffect(() => {
    let interval: number;
    if (isVipMode) {
      interval = window.setInterval(() => {
        setVipSeconds(prev => {
          if (vipState === 'ACTIVE' && prev > 0) {
            return prev - 1;
          }
          return prev;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isVipMode, vipState]);

  /* 
    Automatic auto-trigger removed to ensure purely manual interaction via 'Next' button
  useEffect(() => {
    if (isVipMode && vipState === 'ACTIVE' && vipSeconds === 0 && !isAnalyzing) {
      generateNewVipSignal();
    }
  }, [vipSeconds, isVipMode, vipState, isAnalyzing]);
  */
  
  const syncVip = () => {
    setVipState('WAITING');
    setVipSeconds(5);
    setVipSignal('');
  };

  // Remove automatic VIP signal generation on switch
  const handleVipSwitch = () => {
    if (isAnalyzing) return;
    setCurrentUrl('https://23bdwin24.com/register?inviteCode=6QB3D5N&from=web');
    setIsVipMode(true);
    setVipSignal('');
    setVipState('WAITING');
    // generateNewVipSignal() is no longer called here automatically
  };

  const handleManualSync = () => {
    if (isAnalyzing || vipState === 'ACTIVE') return;
    generateNewVipSignal();
  };

  const handleNextSignal = () => {
    // Force a new signal regardless of state
    generateNewVipSignal();
  };

  const generateNewVipSignal = async () => {
    setIsAnalyzing(true);
    setVipSignal('');
    
    // Force 0.8 seconds loading delay for a very snappy feel
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      // Fallback distribution
      const rand = Math.random();
      let multiplier;
      if (rand < 0.7) multiplier = (Math.random() * (2.8 - 1.2) + 1.2).toFixed(2);
      else multiplier = (Math.random() * (6.5 - 2.8) + 2.8).toFixed(2);
      
      setVipSignal(multiplier + 'x');
      setVipPeriod((Date.now() % 1000000).toString());
      setVipState('ACTIVE');
      setVipSeconds(15);
    } finally {
      setIsAnalyzing(false);
    }
  };

  useHeartbeat();

  return (
    <div className="flex flex-col h-[100dvh] bg-white relative font-sans select-text overflow-hidden">
      <WelcomeModal />
      <ResultOverlay result={result} onComplete={() => setResult(null)} />
      <div className="z-20 relative shrink-0">
        <SignalBar 
          signal={isVipMode ? vipSignal : dbSignal} 
          period={isVipMode ? vipPeriod : dbPeriod} 
          currentPeriod={isVipMode ? vipPeriod : currentPeriod} 
          secondsLeft={isVipMode ? vipSeconds : secondsLeft} 
          maxSeconds={isVipMode ? (vipState === 'WAITING' ? 5 : 15) : 30}
          isVip={isVipMode}
          onManualSync={handleManualSync}
          onNextSignal={handleNextSignal}
          isAnalyzing={isAnalyzing}
        />
        <div className="flex gap-2.5 p-2.5 bg-white border-b border-gray-100">
          <button
            onClick={() => {
              if (isAnalyzing) return;
              setCurrentUrl('https://23bdwin24.com/register?inviteCode=6QB3D5N&from=web');
              setIsVipMode(false);
            }}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all active:scale-95",
              currentUrl === 'https://23bdwin24.com/register?inviteCode=6QB3D5N&from=web' && !isVipMode
                ? "bg-[#2563eb] text-white shadow-lg shadow-blue-500/20" 
                : "bg-[#f1f5f9] text-[#64748b] hover:bg-gray-200"
            )}
          >
            BD Win 24
          </button>
          <button
            onClick={handleVipSwitch}
            className={cn(
              "flex-1 py-3 px-4 rounded-lg text-sm font-bold uppercase tracking-wide transition-all active:scale-95 flex items-center justify-center gap-1",
              isVipMode 
                ? "bg-[#2563eb] text-white shadow-lg shadow-blue-500/20" 
                : "bg-[#f1f5f9] text-[#64748b] hover:bg-gray-200"
            )}
          >
            VIP ❤️
          </button>
        </div>
      </div>
      <div className="flex-1 relative z-0 overflow-hidden bg-white">
        <iframe
          src={currentUrl}
          className="absolute inset-0 w-full h-full border-none bg-white"
          title="Game View"
          allow="clipboard-write; fullscreen"
          loading="lazy"
        />
        
        <a 
          href="https://t.me/+GT8s_D0ipJFkMzhl"
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-20 right-6 z-[50] w-12 h-12 bg-[#0088cc] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 active:scale-90 transition-all border-2 border-white/20"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-send"><path d="m22 2-7 20-4-9-9-4Z"/><path d="M22 2 11 13"/></svg>
        </a>
      </div>
    </div>
  );
};
