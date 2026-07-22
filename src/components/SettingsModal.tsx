import React from 'react';
import { X, Volume2, VolumeX, Keyboard, Monitor } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  onToggleMute,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md font-sans">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-500/50 rounded-3xl p-6 shadow-2xl text-white">
        <div className="flex justify-between items-center mb-5 pb-3 border-b border-amber-500/30">
          <h2 className="text-2xl font-black text-amber-400 flex items-center gap-2">
            <Monitor className="w-6 h-6" /> GAME CONTROLS & SETTINGS
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-amber-500 hover:text-slate-950 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Audio Toggle */}
        <div className="flex justify-between items-center bg-slate-950 p-4 rounded-2xl mb-5 border border-slate-800">
          <span className="font-bold text-sm text-slate-200">GAME AUDIO EFFECTS</span>
          <button
            onClick={onToggleMute}
            className={`px-4 py-2 rounded-xl font-black text-xs flex items-center gap-2 transition ${
              isMuted
                ? 'bg-red-500/20 text-red-400 border border-red-500/50'
                : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/50'
            }`}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            {isMuted ? 'MUTED' : 'ENABLED'}
          </button>
        </div>

        {/* Keybindings Reference Table */}
        <div className="bg-slate-950 border border-slate-800 p-4 rounded-2xl space-y-2 text-xs">
          <div className="font-black text-amber-400 text-sm mb-2 flex items-center gap-1.5">
            <Keyboard className="w-4 h-4" /> KEYBOARD SHORTCUTS
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
              <span className="text-slate-400">WASD / ARROWS</span>
              <span className="font-bold text-white">Move Character</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
              <span className="text-slate-400">G / TAP GLOO</span>
              <span className="font-bold text-cyan-300">Drop Gloo Wall</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
              <span className="text-slate-400">Q</span>
              <span className="font-bold text-yellow-300">Use Alok Skill</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
              <span className="text-slate-400">4 / MED</span>
              <span className="font-bold text-emerald-300">Use Medkit</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
              <span className="text-slate-400">R</span>
              <span className="font-bold text-white">Reload Gun</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
              <span className="text-slate-400">RIGHT CLICK / TAP</span>
              <span className="font-bold text-amber-300">Toggle Scope</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
              <span className="text-slate-400">LEFT CLICK / FIRE</span>
              <span className="font-bold text-red-400">Shoot / Attack</span>
            </div>
            <div className="flex justify-between p-2 bg-slate-900 rounded-lg">
              <span className="text-slate-400">1 / 2 / 3</span>
              <span className="font-bold text-white">Switch Weapon</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
