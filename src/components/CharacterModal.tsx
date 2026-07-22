import React from 'react';
import { X, Check, Lock, Sparkles, Shield, Flame } from 'lucide-react';
import { CharacterId, PlayerStats } from '../types/game';
import { CHARACTERS } from '../utils/constants';

interface CharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  stats: PlayerStats;
  onSelectCharacter: (charId: CharacterId) => void;
  onUnlockCharacter: (charId: CharacterId, cost: number) => void;
}

export const CharacterModal: React.FC<CharacterModalProps> = ({
  isOpen,
  onClose,
  stats,
  onSelectCharacter,
  onUnlockCharacter,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-4xl bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl text-white font-sans max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-amber-500/30">
          <div>
            <h2 className="text-2xl sm:text-3xl font-black text-amber-400 flex items-center gap-2">
              <Sparkles className="w-7 h-7 text-yellow-400" /> CHARACTER SELECTION
            </h2>
            <p className="text-xs text-slate-400">Choose your character skill loadout for the battlefield.</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-amber-500 hover:text-slate-950 transition"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Character Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CHARACTERS.map((char) => {
            const isUnlocked = stats.unlockedCharacters.includes(char.id);
            const isSelected = stats.selectedCharacter === char.id;

            return (
              <div
                key={char.id}
                className={`relative rounded-2xl border-2 p-5 transition flex flex-col justify-between ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 shadow-xl shadow-amber-500/20'
                    : isUnlocked
                    ? 'bg-slate-950 border-slate-800 hover:border-slate-700'
                    : 'bg-slate-950/60 border-slate-800 opacity-80'
                }`}
              >
                <div>
                  {/* Top Badge */}
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[10px] font-black tracking-wider text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-full border border-amber-500/40">
                      {char.skillType} SKILL
                    </span>
                    {isSelected && (
                      <span className="text-xs font-bold text-slate-950 bg-amber-400 px-2 py-0.5 rounded-full flex items-center gap-1">
                        <Check className="w-3 h-3 stroke-[3]" /> EQUIPPED
                      </span>
                    )}
                  </div>

                  {/* Character Name & Title */}
                  <h3 className="text-xl font-black text-white">{char.name}</h3>
                  <div className="text-xs font-semibold text-amber-400 mb-2">{char.title}</div>

                  {/* Skill Card Box */}
                  <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl mb-4">
                    <div className="font-bold text-xs text-yellow-300 flex items-center gap-1.5 mb-1">
                      <Flame className="w-4 h-4 text-amber-400 fill-amber-400" /> {char.skillName}
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">{char.description}</p>
                  </div>
                </div>

                {/* Bottom Action Button */}
                <div className="mt-2">
                  {isSelected ? (
                    <button
                      disabled
                      className="w-full py-2.5 bg-amber-500/30 text-amber-300 font-black rounded-xl text-xs cursor-default"
                    >
                      CURRENTLY EQUIPPED
                    </button>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => onSelectCharacter(char.id)}
                      className="w-full py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black rounded-xl text-xs active:scale-95 transition shadow-lg"
                    >
                      EQUIP CHARACTER
                    </button>
                  ) : (
                    <button
                      onClick={() => onUnlockCharacter(char.id, char.cost)}
                      disabled={stats.gold < char.cost}
                      className={`w-full py-2.5 font-black rounded-xl text-xs active:scale-95 transition flex items-center justify-center gap-1.5 ${
                        stats.gold >= char.cost
                          ? 'bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950'
                          : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                      }`}
                    >
                      <Lock className="w-3.5 h-3.5" /> UNLOCK FOR 🪙 {char.cost} GOLD
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
