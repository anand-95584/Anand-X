import React, { useState } from 'react';
import { Shield, Heart, Zap, Crosshair, Plus, Flame, Navigation, Volume2, VolumeX, Menu } from 'lucide-react';
import { DamageIndicator, KillFeedEntry, PlayerState, Weapon } from '../types/game';
import { CHARACTERS } from '../utils/constants';
import { soundManager } from '../utils/sound';

interface GameHUDProps {
  playerState: PlayerState;
  setPlayerState: React.Dispatch<React.SetStateAction<PlayerState>>;
  aliveCount: number;
  totalCount: number;
  killFeed: KillFeedEntry[];
  damageIndicators: DamageIndicator[];
  safeZone: { radius: number; centerX: number; centerZ: number; isShrinking: boolean };
  onPlaceGlooWall: () => void;
  onUseSkill: () => void;
  onUseMedkit: () => void;
  onReload: () => void;
  onToggleScope: () => void;
  onToggleMute: () => void;
  isMuted: boolean;
  onOpenSettings: () => void;
  isShootingRef: React.MutableRefObject<boolean>;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  playerState,
  setPlayerState,
  aliveCount,
  totalCount,
  killFeed,
  damageIndicators,
  safeZone,
  onPlaceGlooWall,
  onUseSkill,
  onUseMedkit,
  onReload,
  onToggleScope,
  onToggleMute,
  isMuted,
  onOpenSettings,
  isShootingRef,
}) => {
  const [touchFireActive, setTouchFireActive] = useState(false);

  const character = CHARACTERS.find((c) => c.id === playerState.characterId) || CHARACTERS[0];
  const currentWeapon: Weapon | null =
    playerState.currentWeaponIndex === 0
      ? playerState.primaryWeapon
      : playerState.currentWeaponIndex === 1
      ? playerState.secondaryWeapon
      : playerState.meleeWeapon;

  const currentAmmo = playerState.currentMagAmmo[playerState.currentWeaponIndex];

  // Minimap canvas coords calculation
  const mapRadius = 55; // HUD minimap size radius
  const mapScale = 0.35;
  const playerMapX = mapRadius + (playerState.x - safeZone.centerX) * mapScale;
  const playerMapY = mapRadius + (playerState.z - safeZone.centerZ) * mapScale;

  const handlePointerDownShoot = () => {
    isShootingRef.current = true;
    setTouchFireActive(true);
  };

  const handlePointerUpShoot = () => {
    isShootingRef.current = false;
    setTouchFireActive(false);
  };

  return (
    <div className="absolute inset-0 pointer-events-none select-none flex flex-col justify-between p-3 sm:p-5 overflow-hidden font-sans">
      {/* 1. SNIPER / SCOPE OVERLAY */}
      {playerState.isScoped && (
        <div className="absolute inset-0 pointer-events-none z-10 flex items-center justify-center">
          {/* Black Scope Mask */}
          <div className="w-[320px] h-[320px] sm:w-[500px] sm:h-[500px] rounded-full border-[1000px] border-black/90 relative flex items-center justify-center shadow-2xl">
            {/* Scope Crosshair Lines */}
            <div className="absolute w-full h-[1.5px] bg-red-500/80" />
            <div className="absolute h-full w-[1.5px] bg-red-500/80" />
            <div className="absolute w-12 h-12 rounded-full border border-red-500/60" />
            <div className="absolute bottom-6 text-[10px] text-amber-400 font-mono tracking-widest bg-black/60 px-2 py-0.5 rounded">
              RANGE: 120m | AWM 4X
            </div>
          </div>
        </div>
      )}

      {/* 2. TOP HEADER HUD */}
      <div className="flex justify-between items-start pointer-events-auto z-20">
        {/* Top Left: Minimap & Sound Controls */}
        <div className="flex items-center gap-3">
          {/* Minimap Circle */}
          <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-full border-2 border-amber-500/80 bg-slate-900/90 shadow-lg overflow-hidden flex items-center justify-center">
            {/* Safe Zone Circle on Minimap */}
            <div
              className="absolute rounded-full border border-cyan-400/80 bg-cyan-400/10 transition-all duration-300"
              style={{
                width: `${Math.max(10, safeZone.radius * mapScale * 2)}px`,
                height: `${Math.max(10, safeZone.radius * mapScale * 2)}px`,
              }}
            />
            {/* Player Marker Arrow */}
            <div
              className="absolute w-3.5 h-3.5 bg-amber-400 clip-arrow shadow-md transform -translate-x-1/2 -translate-y-1/2 transition-transform"
              style={{
                left: '50%',
                top: '50%',
                transform: `translate(-50%, -50%) rotate(${playerState.rotationY}rad)`,
              }}
            >
              <Navigation className="w-4 h-4 text-amber-400 fill-amber-400" />
            </div>

            <div className="absolute top-1 text-[9px] text-amber-400 font-bold bg-black/70 px-1.5 py-0.5 rounded">
              BERMUDA
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <button
              onClick={onToggleMute}
              className="p-2 rounded-full bg-slate-900/80 text-amber-400 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 transition"
              title="Toggle Audio"
            >
              {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </button>
            <button
              onClick={onOpenSettings}
              className="p-2 rounded-full bg-slate-900/80 text-amber-400 hover:bg-amber-500 hover:text-slate-950 border border-amber-500/40 transition"
              title="Settings"
            >
              <Menu className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Top Center: Match Counter & Safe Zone Timer */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-4 bg-slate-900/90 border border-amber-500/50 px-4 py-1.5 rounded-full shadow-lg">
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-amber-400">
              <span className="text-slate-400">ALIVE</span>
              <span className="text-white bg-amber-600/60 px-2 py-0.5 rounded">{aliveCount}</span>
            </div>
            <div className="w-px h-4 bg-slate-700" />
            <div className="flex items-center gap-1.5 text-xs sm:text-sm font-black text-red-500">
              <span className="text-slate-400">KILLS</span>
              <span className="text-white bg-red-600/60 px-2 py-0.5 rounded">{playerState.kills}</span>
            </div>
          </div>

          {/* Safe Zone Alert Badge */}
          <div className="mt-1.5 px-3 py-0.5 rounded bg-cyan-950/80 border border-cyan-500/40 text-[11px] text-cyan-300 font-bold animate-pulse flex items-center gap-1">
            <Zap className="w-3 h-3 text-cyan-400 fill-cyan-400" />
            SAFE ZONE SHRINKING
          </div>
        </div>

        {/* Top Right: Free Fire Kill Feed */}
        <div className="flex flex-col items-end gap-1 max-w-[200px] sm:max-w-[280px]">
          {killFeed.slice(-4).map((feed) => (
            <div
              key={feed.id}
              className="bg-black/80 border-l-2 border-amber-500 px-2.5 py-1 rounded text-[10px] sm:text-xs text-white font-mono flex items-center gap-1.5 shadow-md animate-fade-in"
            >
              <span className="text-amber-400 font-bold">{feed.killerName}</span>
              <span className="text-slate-400">{feed.isHeadshot ? '💥 🎯' : '🔫'}</span>
              <span className="text-slate-200">{feed.victimName}</span>
              <span className="text-[9px] text-red-400 bg-red-950/60 px-1 rounded">{feed.weaponName}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. CENTER OVERLAY (Floating Damage Numbers & Crosshair) */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        {/* Dynamic Crosshair */}
        {!playerState.isScoped && (
          <div className="relative w-8 h-8 flex items-center justify-center">
            <div className="w-1.5 h-1.5 bg-red-500 rounded-full shadow-sm shadow-red-500" />
            <div className="absolute w-4 h-0.5 bg-amber-400/80 -top-2" />
            <div className="absolute w-4 h-0.5 bg-amber-400/80 -bottom-2" />
            <div className="absolute h-4 w-0.5 bg-amber-400/80 -left-2" />
            <div className="absolute h-4 w-0.5 bg-amber-400/80 -right-2" />
          </div>
        )}

        {/* Damage Indicators */}
        {damageIndicators.map((dmg) => (
          <div
            key={dmg.id}
            className={`absolute font-black tracking-wider text-lg sm:text-2xl animate-bounce-damage ${
              dmg.isHeadshot ? 'text-red-500 text-2xl sm:text-3xl font-extrabold drop-shadow-[0_2px_8px_rgba(239,68,68,0.9)]' : 'text-amber-400 drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]'
            }`}
            style={{
              transform: 'translate(-50%, -100%)',
            }}
          >
            {dmg.isHeadshot ? `🎯 ${dmg.damage}` : dmg.damage}
          </div>
        ))}
      </div>

      {/* 4. BOTTOM ACTION & CONTROLS HUD */}
      <div className="flex justify-between items-end pointer-events-auto z-20 gap-2">
        {/* Bottom Left: Touch Joystick / Posture Controls & Gloo Wall Button */}
        <div className="flex items-end gap-3">
          {/* Quick Gloo Wall Button (G) */}
          <button
            onClick={onPlaceGlooWall}
            className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-cyan-500 to-blue-700 border-2 border-cyan-300 shadow-xl flex flex-col items-center justify-center active:scale-95 transition transform hover:brightness-110"
          >
            <span className="text-xl sm:text-2xl">🧊</span>
            <span className="text-[10px] font-black text-white bg-black/50 px-1 rounded -mt-0.5">
              GLOO [{playerState.glooWalls}]
            </span>
            <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white">
              G
            </span>
          </button>

          {/* Quick Medkit Button (4) */}
          <button
            onClick={onUseMedkit}
            className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-b from-emerald-500 to-teal-700 border-2 border-emerald-300 shadow-xl flex flex-col items-center justify-center active:scale-95 transition transform hover:brightness-110"
          >
            <Plus className="w-6 h-6 text-white stroke-[3]" />
            <span className="text-[10px] font-black text-white bg-black/50 px-1 rounded">
              MED [{playerState.medkits}]
            </span>
            <span className="absolute -top-2 -right-2 bg-amber-500 text-slate-950 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-white">
              4
            </span>
          </button>

          {/* Alok / Character Skill Button (Q) */}
          <button
            onClick={onUseSkill}
            disabled={playerState.skillCooldownRemaining > 0}
            className={`group relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border-2 shadow-xl flex flex-col items-center justify-center active:scale-95 transition transform ${
              playerState.skillCooldownRemaining > 0
                ? 'bg-slate-800 border-slate-600 opacity-60'
                : 'bg-gradient-to-b from-amber-400 to-yellow-600 border-amber-200 hover:brightness-110'
            }`}
          >
            <Flame className="w-6 h-6 text-slate-950 fill-slate-950" />
            <span className="text-[9px] font-black text-slate-950 bg-amber-300/80 px-1 rounded">
              {playerState.skillCooldownRemaining > 0
                ? `${Math.ceil(playerState.skillCooldownRemaining)}s`
                : character.skillName}
            </span>
            <span className="absolute -top-2 -right-2 bg-slate-900 text-amber-400 font-black text-[10px] w-5 h-5 rounded-full flex items-center justify-center border border-amber-400">
              Q
            </span>
          </button>
        </div>

        {/* Bottom Center: Player Health / EP / Armor Gauge */}
        <div className="flex flex-col items-center gap-1.5 w-full max-w-xs sm:max-w-md bg-slate-900/90 border border-amber-500/40 p-2.5 rounded-2xl shadow-2xl backdrop-blur-md">
          {/* Helmet & Vest Status Icons */}
          <div className="flex items-center justify-between w-full text-xs font-bold px-1 text-slate-300">
            <div className="flex items-center gap-1">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>VEST LVL 3</span>
            </div>
            <div className="flex items-center gap-1 text-amber-400">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>EP {Math.round(playerState.ep)}/200</span>
            </div>
          </div>

          {/* EP Energy Bar */}
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden border border-amber-500/30">
            <div
              className="h-full bg-gradient-to-r from-amber-500 to-yellow-400 transition-all duration-200"
              style={{ width: `${(playerState.ep / playerState.maxEp) * 100}%` }}
            />
          </div>

          {/* HP Health Bar */}
          <div className="relative w-full h-4 bg-slate-950 rounded-full overflow-hidden border border-emerald-500/50 shadow-inner flex items-center">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-green-400 transition-all duration-200"
              style={{ width: `${(playerState.hp / playerState.maxHp) * 100}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-white drop-shadow">
              <Heart className="w-3 h-3 text-red-500 fill-red-500 mr-1" />
              {Math.round(playerState.hp)} / {playerState.maxHp} HP
            </div>
          </div>
        </div>

        {/* Bottom Right: Weapon Slots, Reload & Scope / Fire Controls */}
        <div className="flex items-end gap-2 sm:gap-3">
          {/* Scope Toggle Button */}
          <button
            onClick={onToggleScope}
            className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center active:scale-95 transition shadow-lg ${
              playerState.isScoped
                ? 'bg-amber-500 border-white text-slate-950'
                : 'bg-slate-900/90 border-amber-500/50 text-amber-400 hover:bg-amber-500/20'
            }`}
          >
            <Crosshair className="w-6 h-6" />
          </button>

          {/* Reload Button */}
          <button
            onClick={onReload}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-slate-900/90 border-2 border-amber-500/50 text-amber-400 flex items-center justify-center active:scale-95 transition hover:bg-amber-500/20 shadow-lg"
          >
            <span className="font-black text-xs">RELOAD [R]</span>
          </button>

          {/* Active Weapon Display Box */}
          <div
            onClick={() => {
              setPlayerState((prev) => ({
                ...prev,
                currentWeaponIndex: ((prev.currentWeaponIndex + 1) % 3) as 0 | 1 | 2,
              }));
              soundManager.playReload();
            }}
            className="cursor-pointer bg-slate-900/90 border-2 border-amber-500 p-2.5 rounded-2xl shadow-2xl flex flex-col items-center justify-between min-w-[120px] sm:min-w-[150px] hover:brightness-110 active:scale-95 transition"
          >
            <div className="text-[10px] text-amber-400 font-bold tracking-wider">
              {currentWeapon?.category || 'PRIMARY'}
            </div>
            <div className="text-sm sm:text-base font-black text-white tracking-wide">
              {currentWeapon?.name || 'NO WEAPON'}
            </div>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-lg sm:text-xl font-black text-amber-400">{currentAmmo}</span>
              <span className="text-xs text-slate-400 font-bold">/ 120</span>
            </div>
          </div>

          {/* Touch Fire Trigger Button */}
          <button
            onPointerDown={handlePointerDownShoot}
            onPointerUp={handlePointerUpShoot}
            className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 shadow-2xl flex items-center justify-center active:scale-90 transition transform ${
              touchFireActive
                ? 'bg-red-600 border-yellow-300 scale-95 shadow-red-500/50'
                : 'bg-gradient-to-b from-red-500 to-amber-600 border-white hover:brightness-110'
            }`}
          >
            <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center bg-black/20">
              <div className="w-3 h-3 bg-white rounded-full" />
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
