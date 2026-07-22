import React, { useState } from 'react';
import { Play, Shield, Award, Sparkles, User, Crosshair, HelpCircle, Trophy, ShoppingBag, Swords, Shirt } from 'lucide-react';
import { GameMode, PlayerStats } from '../types/game';
import { CHARACTERS, GLOO_WALL_SKINS, OG_BUNDLES, WEAPON_SKINS } from '../utils/constants';
import { getRankTitle } from '../utils/storage';

interface LobbyProps {
  stats: PlayerStats;
  selectedMode: GameMode;
  setSelectedMode: (mode: GameMode) => void;
  onStartGame: () => void;
  onOpenCharacterModal: () => void;
  onOpenVaultModal: () => void;
  onOpenStatsModal: () => void;
}

export const Lobby: React.FC<LobbyProps> = ({
  stats,
  selectedMode,
  setSelectedMode,
  onStartGame,
  onOpenCharacterModal,
  onOpenVaultModal,
  onOpenStatsModal,
}) => {
  const [activeTab, setActiveTab] = useState<'BERMUDA' | 'CLASH_SQUAD' | 'TRAINING'>('BERMUDA');
  
  const currentCharacter = CHARACTERS.find((c) => c.id === stats.selectedCharacter) || CHARACTERS[0];
  const activeBundle = OG_BUNDLES.find((b) => b.id === (stats.selectedBundle || 'BUNDLE_S1_SAKURA')) || OG_BUNDLES[0];
  const rankInfo = getRankTitle(stats.rankPoints);

  const handleModeChange = (mode: GameMode) => {
    setSelectedMode(mode);
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 overflow-hidden text-white font-sans flex flex-col justify-between p-4 sm:p-6 select-none">
      {/* Background Free Fire Aesthetic Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-950/40 via-slate-950 to-cyan-950/30 z-0" />
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl" />

      {/* TOP BAR: Player Profile, Rank & Currencies */}
      <div className="relative z-10 flex flex-wrap justify-between items-center gap-4 bg-slate-900/80 border border-amber-500/30 p-3 sm:p-4 rounded-2xl backdrop-blur-md shadow-2xl">
        {/* Left: Player Badge */}
        <div className="flex items-center gap-3 cursor-pointer group" onClick={onOpenStatsModal}>
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 border-2 border-amber-300 flex items-center justify-center text-2xl shadow-lg">
            {rankInfo.badge}
            <span className="absolute -bottom-1 -right-1 bg-black text-[9px] font-black text-amber-400 px-1 rounded border border-amber-500">
              LVL 48
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base sm:text-lg tracking-wide text-amber-300">SURVIVOR_2019</span>
              <span className={`text-xs font-bold px-2 py-0.5 rounded bg-amber-950 border border-amber-500/50 ${rankInfo.color}`}>
                {rankInfo.title}
              </span>
            </div>
            <div className="text-xs text-slate-400 flex items-center gap-2 font-medium">
              <span>🔥 Booyahs: {stats.booyahs}</span>
              <span>•</span>
              <span>☠️ Kills: {stats.totalKills}</span>
            </div>
          </div>
        </div>

        {/* Right: Currencies (Gold & Diamonds) */}
        <div className="flex items-center gap-3">
          {/* Gold Coins */}
          <div className="flex items-center gap-2 bg-slate-950/90 border border-amber-500/50 px-3.5 py-1.5 rounded-xl shadow-inner">
            <span className="text-lg">🪙</span>
            <span className="font-black text-amber-400 text-sm sm:text-base">{stats.gold.toLocaleString()}</span>
          </div>
          {/* Diamonds */}
          <div className="flex items-center gap-2 bg-slate-950/90 border border-cyan-500/50 px-3.5 py-1.5 rounded-xl shadow-inner">
            <span className="text-lg">💎</span>
            <span className="font-black text-cyan-300 text-sm sm:text-base">{stats.diamonds.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* CENTER STAGE: Character Display Stand & Side Menu Buttons */}
      <div className="relative z-10 flex-1 flex flex-col md:flex-row items-center justify-between my-4 gap-6">
        {/* Left Side Menu (Vault, Characters, Rank) */}
        <div className="flex md:flex-col gap-3 w-full md:w-auto justify-center">
          <button
            onClick={onOpenCharacterModal}
            className="flex-1 md:flex-initial flex items-center gap-3 bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 border border-amber-300 p-3 sm:p-4 rounded-2xl shadow-xl active:scale-95 transition"
          >
            <User className="w-6 h-6 text-slate-950 stroke-[2.5]" />
            <div className="text-left hidden sm:block">
              <div className="font-black text-slate-950 text-sm">CHARACTERS</div>
              <div className="text-[10px] text-slate-900 font-bold">{currentCharacter.name}</div>
            </div>
          </button>

          <button
            onClick={onOpenVaultModal}
            className="flex-1 md:flex-initial flex items-center gap-3 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 p-3 sm:p-4 rounded-2xl shadow-xl active:scale-95 transition"
          >
            <ShoppingBag className="w-6 h-6 text-amber-400" />
            <div className="text-left hidden sm:block">
              <div className="font-black text-amber-400 text-sm">WEAPON VAULT</div>
              <div className="text-[10px] text-slate-400 font-medium">Skins & Gloo Walls</div>
            </div>
          </button>

          <button
            onClick={onOpenStatsModal}
            className="flex-1 md:flex-initial flex items-center gap-3 bg-slate-900/90 hover:bg-slate-800 border border-amber-500/40 p-3 sm:p-4 rounded-2xl shadow-xl active:scale-95 transition"
          >
            <Trophy className="w-6 h-6 text-amber-400" />
            <div className="text-left hidden sm:block">
              <div className="font-black text-amber-400 text-sm">MATCH RECORD</div>
              <div className="text-[10px] text-slate-400 font-medium">Booyahs & Stats</div>
            </div>
          </button>
        </div>

        {/* Center Character Spotlight Stand */}
        <div className="relative flex flex-col items-center justify-center flex-1 my-2">
          {/* Glowing Aura Ring */}
          <div
            className="absolute w-64 h-64 sm:w-80 sm:h-80 rounded-full blur-2xl animate-pulse"
            style={{ backgroundColor: `${activeBundle.color}30` }}
          />
          <div className="relative z-10 flex flex-col items-center">
            {/* 2019 Character Stand Silhouette */}
            <div className="w-52 h-72 sm:w-64 sm:h-84 bg-gradient-to-b from-slate-900/90 to-slate-950 border-2 rounded-3xl shadow-2xl flex flex-col items-center justify-between p-5 backdrop-blur-md relative overflow-hidden"
              style={{ borderColor: activeBundle.color }}>
              
              {/* Season Badge Header */}
              <div
                className="text-[10px] font-black px-3 py-1 rounded-full border shadow uppercase tracking-wider flex items-center gap-1"
                style={{ color: activeBundle.color, backgroundColor: `${activeBundle.color}20`, borderColor: activeBundle.color }}
              >
                <span>{activeBundle.icon}</span>
                <span>{activeBundle.season}</span>
              </div>

              {/* Character + Bundle Icon Stack */}
              <div className="flex flex-col items-center my-auto">
                <div className="text-5xl sm:text-6xl animate-bounce filter drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                  {activeBundle.icon}
                </div>
                <div className="text-2xl mt-1 opacity-90">
                  {currentCharacter.id === 'ALOK' ? '🎧' : currentCharacter.id === 'KELLY' ? '🏃‍♀️' : '🪖'}
                </div>
              </div>

              {/* Character & Outfit Name */}
              <div className="text-center mt-auto w-full">
                <div className="font-black text-xs text-pink-300 uppercase tracking-widest">{activeBundle.name}</div>
                <div className="font-black text-xl text-amber-400 tracking-wider leading-tight">{currentCharacter.name}</div>
                <div className="text-[11px] text-slate-300 font-semibold bg-amber-950/80 px-3 py-1 rounded-full border border-amber-500/40 mt-1.5 flex items-center justify-center gap-1">
                  <span>✨ {currentCharacter.skillName}</span>
                </div>
              </div>
            </div>

            {/* Pedestal Base */}
            <div
              className="w-60 h-4 rounded-full shadow-lg -mt-2 blur-[1px]"
              style={{ background: `linear-gradient(to right, ${activeBundle.color}, #f59e0b, ${activeBundle.color})` }}
            />
          </div>
        </div>

        {/* Right Side: Game Mode Selector Card */}
        <div className="w-full md:w-80 bg-slate-900/90 border border-amber-500/40 p-4 rounded-2xl shadow-2xl backdrop-blur-md">
          <div className="font-black text-sm text-amber-400 mb-3 flex items-center gap-2">
            <Swords className="w-4 h-4" /> SELECT MATCH MODE
          </div>

          <div className="flex flex-col gap-2">
            {/* Classic BR Bermuda */}
            <div
              onClick={() => handleModeChange('BATTLE_ROYALE')}
              className={`cursor-pointer p-3 rounded-xl border-2 transition flex items-center justify-between ${
                selectedMode === 'BATTLE_ROYALE'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="font-black text-sm text-white">CLASSIC BERMUDA</div>
                <div className="text-[11px] text-slate-400">Battle Royale • 30 Players</div>
              </div>
              <span className="text-xl">🏝️</span>
            </div>

            {/* Clash Squad 4v4 */}
            <div
              onClick={() => handleModeChange('CLASH_SQUAD')}
              className={`cursor-pointer p-3 rounded-xl border-2 transition flex items-center justify-between ${
                selectedMode === 'CLASH_SQUAD'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="font-black text-sm text-white">CLASH SQUAD 4V4</div>
                <div className="text-[11px] text-slate-400">Round Shop • Best of 7</div>
              </div>
              <span className="text-xl">🎯</span>
            </div>

            {/* Training Grounds */}
            <div
              onClick={() => handleModeChange('TRAINING')}
              className={`cursor-pointer p-3 rounded-xl border-2 transition flex items-center justify-between ${
                selectedMode === 'TRAINING'
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-lg'
                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="font-black text-sm text-white">TRAINING GROUNDS</div>
                <div className="text-[11px] text-slate-400">Target Range • Gloo Practice</div>
              </div>
              <span className="text-xl">🎯</span>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR: Big Yellow START MATCH Button */}
      <div className="relative z-10 flex justify-end items-center">
        <button
          onClick={onStartGame}
          className="group relative w-full sm:w-auto px-10 py-5 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xl sm:text-2xl rounded-2xl shadow-[0_0_30px_rgba(245,158,11,0.6)] border-2 border-yellow-200 active:scale-95 transition transform flex items-center justify-center gap-3"
        >
          <Play className="w-8 h-8 fill-slate-950 stroke-[3]" />
          <span>START MATCH</span>
          <span className="text-xs font-bold text-slate-900 bg-amber-300 px-2 py-0.5 rounded-full border border-slate-900 ml-2">
            {selectedMode === 'BATTLE_ROYALE' ? 'BERMUDA BR' : selectedMode === 'CLASH_SQUAD' ? '4V4 CLASH' : 'TRAINING'}
          </span>
        </button>
      </div>
    </div>
  );
};
