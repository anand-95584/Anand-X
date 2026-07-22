import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Flame, RotateCcw, Home, Sparkles, Award } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface GameOverModalProps {
  isOpen: boolean;
  isBooyah: boolean;
  kills: number;
  damage: number;
  survivalTime: number; // seconds
  onPlayAgain: () => void;
  onReturnLobby: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  isOpen,
  isBooyah,
  kills,
  damage,
  survivalTime,
  onPlayAgain,
  onReturnLobby,
}) => {
  useEffect(() => {
    if (isOpen) {
      if (isBooyah) {
        soundManager.playBooyah();
        // Fire celebration confetti!
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#eab308', '#22c55e', '#38bdf8', '#ef4444'],
        });
      }
    }
  }, [isOpen, isBooyah]);

  if (!isOpen) return null;

  const goldEarned = isBooyah ? 450 + kills * 50 : 150 + kills * 30;
  const rankGained = isBooyah ? 55 + kills * 5 : Math.max(5, kills * 8);

  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${mins}m ${s < 10 ? '0' : ''}${s}s`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-lg select-none font-sans">
      <div className="relative w-full max-w-lg bg-slate-900 border-4 border-amber-500 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(245,158,11,0.5)] text-white text-center flex flex-col items-center">
        {/* BOOYAH Banner */}
        {isBooyah ? (
          <div className="flex flex-col items-center animate-bounce-gentle">
            <div className="text-6xl sm:text-7xl mb-2">🏆</div>
            <h1 className="text-5xl sm:text-6xl font-black tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-amber-400 to-yellow-500 drop-shadow-[0_4px_12px_rgba(245,158,11,0.8)]">
              BOOYAH!
            </h1>
            <div className="text-xs font-black tracking-widest text-amber-300 bg-amber-950 px-4 py-1 rounded-full border border-amber-500 mt-2">
              VICTORY SURVIVOR #1
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="text-5xl mb-2">💀</div>
            <h1 className="text-4xl sm:text-5xl font-black tracking-wider text-red-500 drop-shadow">
              ELIMINATED
            </h1>
            <div className="text-xs font-bold text-slate-400 mt-1">BETTER LUCK NEXT TIME SURVIVOR</div>
          </div>
        )}

        {/* Match Statistics Card */}
        <div className="w-full bg-slate-950 border border-amber-500/30 p-4 rounded-2xl my-6 grid grid-cols-2 gap-3 text-left">
          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[10px] text-slate-400 font-bold">TOTAL KILLS</div>
            <div className="text-2xl font-black text-red-500 flex items-center gap-1">
              <Flame className="w-5 h-5 fill-red-500" /> {kills}
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[10px] text-slate-400 font-bold">DAMAGE DEALT</div>
            <div className="text-2xl font-black text-amber-400">{damage}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[10px] text-slate-400 font-bold">SURVIVAL TIME</div>
            <div className="text-xl font-black text-cyan-300">{formatTime(survivalTime)}</div>
          </div>

          <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl">
            <div className="text-[10px] text-slate-400 font-bold">REWARDS</div>
            <div className="text-sm font-black text-amber-300 flex items-center gap-2 mt-0.5">
              <span>🪙 +{goldEarned}</span>
              <span className="text-emerald-400">🔥 +{rankGained} RP</span>
            </div>
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="flex gap-3 w-full">
          <button
            onClick={onReturnLobby}
            className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-black rounded-2xl text-sm flex items-center justify-center gap-2 border border-slate-700 transition"
          >
            <Home className="w-5 h-5" /> LOBBY
          </button>
          <button
            onClick={onPlayAgain}
            className="flex-1 py-3.5 bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black rounded-2xl text-sm flex items-center justify-center gap-2 border-2 border-yellow-200 shadow-lg active:scale-95 transition"
          >
            <RotateCcw className="w-5 h-5" /> PLAY AGAIN
          </button>
        </div>
      </div>
    </div>
  );
};
