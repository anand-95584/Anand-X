import React, { useState } from 'react';
import { X, Check, Shield, Zap, Sparkles, Smile, Volume2, Shirt } from 'lucide-react';
import { GlooWallSkin, PlayerStats, WeaponSkin } from '../types/game';
import { GLOO_WALL_SKINS, OG_BUNDLES, WEAPON_SKINS } from '../utils/constants';
import { EMOTES } from '../utils/emotes';
import { soundManager } from '../utils/sound';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onEquipSkin: (skinId: string) => void;
  onEquipGlooSkin: (skinId: string) => void;
  onEquipBundle: (bundleId: string) => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({
  isOpen,
  onClose,
  stats,
  onEquipSkin,
  onEquipGlooSkin,
  onEquipBundle,
}) => {
  const [activeCategory, setActiveCategory] = useState<'OG_BUNDLES' | 'GUN_SKINS' | 'GLOO_WALLS' | 'EMOTES'>('OG_BUNDLES');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl text-white font-sans max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-500/30">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-yellow-400" /> OG BUNDLES & VAULT
            </h2>
            <p className="text-xs text-slate-400">Equip Season 1 Sakura, Season 2 Hip-Hop, classic Gun Skins & Gloo Walls.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-amber-500 hover:text-slate-950 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6">
          <button
            onClick={() => setActiveCategory('OG_BUNDLES')}
            className={`flex-1 min-w-[120px] py-3 font-black rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 ${
              activeCategory === 'OG_BUNDLES'
                ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            <Shirt className="w-4 h-4 stroke-[2.5]" /> OG BUNDLES
          </button>
          <button
            onClick={() => setActiveCategory('GUN_SKINS')}
            className={`flex-1 min-w-[120px] py-3 font-black rounded-xl text-xs sm:text-sm transition ${
              activeCategory === 'GUN_SKINS'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            🔫 GUN SKINS
          </button>
          <button
            onClick={() => setActiveCategory('GLOO_WALLS')}
            className={`flex-1 min-w-[120px] py-3 font-black rounded-xl text-xs sm:text-sm transition ${
              activeCategory === 'GLOO_WALLS'
                ? 'bg-cyan-500 text-slate-950 shadow-lg'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            🧊 GLOO WALLS
          </button>
          <button
            onClick={() => setActiveCategory('EMOTES')}
            className={`flex-1 min-w-[120px] py-3 font-black rounded-xl text-xs sm:text-sm transition ${
              activeCategory === 'EMOTES'
                ? 'bg-purple-500 text-white shadow-lg'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            😂 EMOTES
          </button>
        </div>

        {/* Content */}
        {activeCategory === 'OG_BUNDLES' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {OG_BUNDLES.map((bundle) => {
              const isEquipped = (stats.selectedBundle || 'BUNDLE_S1_SAKURA') === bundle.id;

              return (
                <div
                  key={bundle.id}
                  className={`rounded-2xl border-2 p-5 transition flex flex-col justify-between relative overflow-hidden ${
                    isEquipped
                      ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-pink-950/40 border-pink-500 shadow-[0_0_25px_rgba(236,72,153,0.3)]'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="text-[10px] font-black px-2.5 py-0.5 rounded-full border"
                        style={{ color: bundle.color, borderColor: `${bundle.color}60`, backgroundColor: `${bundle.color}20` }}
                      >
                        {bundle.season}
                      </span>
                      {isEquipped && (
                        <span className="text-[10px] font-black text-slate-950 bg-pink-400 px-2 py-0.5 rounded-full flex items-center gap-1 shadow">
                          <Check className="w-3 h-3 stroke-[3]" /> EQUIPPED
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-3 my-2">
                      <span className="text-4xl p-2 bg-slate-900 border border-slate-800 rounded-2xl shadow">{bundle.icon}</span>
                      <div>
                        <h3 className="text-base font-black text-white">{bundle.name}</h3>
                        <span className="text-[10px] font-bold text-amber-400">{bundle.rarity} OUTFIT</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-300 my-2 leading-relaxed bg-slate-950/80 p-2.5 rounded-xl border border-slate-800">
                      {bundle.description}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      onEquipBundle(bundle.id);
                      soundManager.playButtonClick();
                    }}
                    className={`w-full py-2.5 font-black rounded-xl text-xs active:scale-95 transition shadow-lg mt-3 ${
                      isEquipped
                        ? 'bg-slate-800 text-pink-300 border border-pink-500/50'
                        : 'bg-gradient-to-r from-pink-500 to-amber-500 hover:from-pink-400 hover:to-amber-400 text-slate-950'
                    }`}
                  >
                    {isEquipped ? 'EQUIPPED IN LOBBY' : 'EQUIP BUNDLE'}
                  </button>
                </div>
              );
            })}
          </div>
        )}
        {activeCategory === 'GUN_SKINS' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {WEAPON_SKINS.map((skin) => {
              const isEquipped = Object.values(stats.selectedSkins).includes(skin.id);

              return (
                <div
                  key={skin.id}
                  className={`rounded-2xl border-2 p-5 transition flex flex-col justify-between ${
                    isEquipped
                      ? 'bg-amber-500/20 border-amber-400 shadow-xl'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span
                        className="text-[10px] font-black px-2 py-0.5 rounded-full"
                        style={{ color: skin.color, backgroundColor: `${skin.color}20` }}
                      >
                        {skin.rarity}
                      </span>
                      {isEquipped && (
                        <span className="text-[10px] font-black text-slate-950 bg-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[3]" /> EQUIPPED
                        </span>
                      )}
                    </div>

                    <h3 className="text-lg font-black text-white">{skin.name}</h3>

                    {/* Skin Stat Bonuses */}
                    <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl my-3 space-y-1">
                      {skin.damageBonus > 0 && (
                        <div className="text-xs font-bold text-emerald-400 flex justify-between">
                          <span>Damage</span>
                          <span>+{skin.damageBonus}</span>
                        </div>
                      )}
                      {skin.rateBonus > 0 && (
                        <div className="text-xs font-bold text-amber-400 flex justify-between">
                          <span>Rate of Fire</span>
                          <span>+{skin.rateBonus}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => onEquipSkin(skin.id)}
                    className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs active:scale-95 transition shadow-lg mt-2"
                  >
                    {isEquipped ? 'EQUIPPED' : 'EQUIP SKIN'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeCategory === 'GLOO_WALLS' && (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {GLOO_WALL_SKINS.map((gloo) => {
              const isEquipped = stats.selectedGlooSkin === gloo.id;

              return (
                <div
                  key={gloo.id}
                  className={`rounded-2xl border-2 p-5 transition flex flex-col justify-between ${
                    isEquipped
                      ? 'bg-cyan-500/20 border-cyan-400 shadow-xl'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex flex-col items-center my-4">
                    <div className="text-5xl my-2">{gloo.emblem}</div>
                    <h3 className="text-lg font-black text-white text-center">{gloo.name}</h3>
                  </div>

                  <button
                    onClick={() => onEquipGlooSkin(gloo.id)}
                    className="w-full py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-black rounded-xl text-xs active:scale-95 transition shadow-lg"
                  >
                    {isEquipped ? 'EQUIPPED' : 'EQUIP GLOO WALL'}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {activeCategory === 'EMOTES' && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {EMOTES.map((emote) => (
              <div
                key={emote.id}
                className="rounded-2xl border-2 border-purple-500/40 bg-slate-950 p-4 flex flex-col items-center text-center justify-between hover:border-purple-400 transition group"
              >
                <div className="text-4xl my-2 group-hover:scale-125 transition-transform">
                  {emote.icon}
                </div>
                <div>
                  <h3 className="text-sm font-black text-purple-300">{emote.name}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 line-clamp-2">{emote.description}</p>
                </div>
                <button
                  onClick={() => soundManager.playEmoteSound(emote.id)}
                  className="w-full mt-3 py-1.5 bg-purple-600 hover:bg-purple-500 text-white font-black rounded-xl text-[11px] flex items-center justify-center gap-1 transition active:scale-95"
                >
                  <Volume2 className="w-3.5 h-3.5" /> TEST AUDIO
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
