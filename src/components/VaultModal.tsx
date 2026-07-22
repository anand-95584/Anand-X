import React, { useState } from 'react';
import { X, Check, Shield, Zap, Sparkles } from 'lucide-react';
import { GlooWallSkin, PlayerStats, WeaponSkin } from '../types/game';
import { GLOO_WALL_SKINS, WEAPON_SKINS } from '../utils/constants';

interface VaultModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onEquipSkin: (skinId: string) => void;
  onEquipGlooSkin: (skinId: string) => void;
}

export const VaultModal: React.FC<VaultModalProps> = ({
  isOpen,
  onClose,
  stats,
  onEquipSkin,
  onEquipGlooSkin,
}) => {
  const [activeCategory, setActiveCategory] = useState<'GUN_SKINS' | 'GLOO_WALLS'>('GUN_SKINS');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl text-white font-sans max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-500/30">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-yellow-400" /> WEAPON & GLOO VAULT
            </h2>
            <p className="text-xs text-slate-400">Customize your gun attributes & iconic Gloo Wall ice shields.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-amber-500 hover:text-slate-950 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => setActiveCategory('GUN_SKINS')}
            className={`flex-1 py-3 font-black rounded-xl text-xs sm:text-sm transition ${
              activeCategory === 'GUN_SKINS'
                ? 'bg-amber-500 text-slate-950 shadow-lg'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            🔫 LEGENDARY GUN SKINS
          </button>
          <button
            onClick={() => setActiveCategory('GLOO_WALLS')}
            className={`flex-1 py-3 font-black rounded-xl text-xs sm:text-sm transition ${
              activeCategory === 'GLOO_WALLS'
                ? 'bg-cyan-500 text-slate-950 shadow-lg'
                : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700'
            }`}
          >
            🧊 GLOO WALL SKINS
          </button>
        </div>

        {/* Content */}
        {activeCategory === 'GUN_SKINS' ? (
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
        ) : (
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
      </div>
    </div>
  );
};
