import React from 'react';
import { X, Trophy, Flame, Target, Award, Crown } from 'lucide-react';
import { PlayerStats } from '../types/game';
import { getRankTitle } from '../utils/storage';

interface StatsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
}

export const StatsModal: React.FC<StatsModalProps> = ({ isOpen, onClose, stats }) => {
  if (!isOpen) return null;

  const rankInfo = getRankTitle(stats.rankPoints);
  const winRate = stats.totalMatches > 0 ? Math.round((stats.booyahs / stats.totalMatches) * 100) : 0;
  const kdRatio = stats.totalMatches > 0 ? (stats.totalKills / stats.totalMatches).toFixed(2) : '0.00';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-2xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl text-white font-sans max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-500/30">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-2">
              <Trophy className="w-7 h-7 text-yellow-400" /> SURVIVOR CAREER RECORD
            </h2>
            <p className="text-xs text-slate-400">Battle Royale lifetime combat statistics & rank progression.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-amber-500 hover:text-slate-950 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Rank Card */}
        <div className="bg-gradient-to-r from-amber-950 to-slate-950 border-2 border-amber-500/60 p-5 rounded-2xl mb-6 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500/20 border-2 border-amber-400 flex items-center justify-center text-3xl shadow-lg">
              {rankInfo.badge}
            </div>
            <div>
              <div className="text-xs font-bold text-slate-400">CURRENT RANK</div>
              <div className={`text-2xl font-black ${rankInfo.color}`}>{rankInfo.title}</div>
              <div className="text-xs text-amber-300 font-semibold">{stats.rankPoints} Rank Points</div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-amber-400">{stats.totalMatches}</div>
            <div className="text-xs text-slate-400 font-bold mt-1">TOTAL MATCHES</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-emerald-400">{stats.booyahs}</div>
            <div className="text-xs text-slate-400 font-bold mt-1">BOOYAHS (WINS)</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-red-500">{stats.totalKills}</div>
            <div className="text-xs text-slate-400 font-bold mt-1">TOTAL KILLS</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-cyan-400">{winRate}%</div>
            <div className="text-xs text-slate-400 font-bold mt-1">WIN RATE</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-purple-400">{kdRatio}</div>
            <div className="text-xs text-slate-400 font-bold mt-1">K/D RATIO</div>
          </div>

          <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl flex flex-col items-center justify-center">
            <div className="text-3xl font-black text-yellow-400">{stats.maxKillsInMatch}</div>
            <div className="text-xs text-slate-400 font-bold mt-1">MAX KILLS / MATCH</div>
          </div>
        </div>
      </div>
    </div>
  );
};
