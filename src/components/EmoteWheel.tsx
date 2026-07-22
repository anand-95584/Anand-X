import React, { useState } from 'react';
import { Smile, MessageSquare, X, Zap } from 'lucide-react';
import { EMOTES, EmoteItem, QUICK_CHAT_MESSAGES, QuickChatMessage } from '../utils/emotes';
import { soundManager } from '../utils/sound';

interface EmoteWheelProps {
  isOpen: boolean;
  onClose: () => void;
  onTriggerEmote: (emote: EmoteItem) => void;
  onTriggerQuickChat: (msg: QuickChatMessage) => void;
}

export const EmoteWheel: React.FC<EmoteWheelProps> = ({
  isOpen,
  onClose,
  onTriggerEmote,
  onTriggerQuickChat,
}) => {
  const [activeTab, setActiveTab] = useState<'EMOTES' | 'CHAT'>('EMOTES');
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md animate-fade-in pointer-events-auto">
      {/* Click outside backdrop */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-lg p-5 bg-slate-900/95 border-2 border-amber-500/70 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.3)] flex flex-col items-center select-none font-sans">
        {/* Header Bar */}
        <div className="flex items-center justify-between w-full pb-3 border-b border-amber-500/30">
          <div className="flex items-center gap-2 text-amber-400 font-black tracking-wider text-base sm:text-lg">
            <Smile className="w-5 h-5 text-amber-400" />
            <span>EXPRESSION WHEEL</span>
            <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
              [KEY: E]
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center gap-2 my-4 bg-slate-950 p-1 rounded-2xl border border-slate-800 w-full">
          <button
            onClick={() => {
              setActiveTab('EMOTES');
              soundManager.playLoot();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-black transition ${
              activeTab === 'EMOTES'
                ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-md scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smile className="w-4 h-4" />
            <span>EMOTES ({EMOTES.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('CHAT');
              soundManager.playLoot();
            }}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-black transition ${
              activeTab === 'CHAT'
                ? 'bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 shadow-md scale-[1.02]'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>QUICK CHAT ({QUICK_CHAT_MESSAGES.length})</span>
          </button>
        </div>

        {/* TAB 1: EMOTES RADIAL GRID */}
        {activeTab === 'EMOTES' && (
          <div className="w-full my-2">
            <div className="grid grid-cols-4 gap-3 sm:gap-4 p-2">
              {EMOTES.map((emote, idx) => (
                <button
                  key={emote.id}
                  onClick={() => {
                    onTriggerEmote(emote);
                    onClose();
                  }}
                  onMouseEnter={() => {
                    setHoveredIndex(idx);
                    soundManager.playLoot();
                  }}
                  onMouseLeave={() => setHoveredIndex(null)}
                  className={`group relative aspect-square rounded-2xl border-2 flex flex-col items-center justify-center p-2 transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                    hoveredIndex === idx
                      ? 'bg-gradient-to-b from-amber-500/30 to-yellow-600/30 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                      : 'bg-slate-950/80 border-slate-800 hover:border-amber-500/50'
                  }`}
                >
                  <span className="text-3xl sm:text-4xl transition-transform group-hover:scale-125">
                    {emote.icon}
                  </span>
                  <span className="mt-1 text-[10px] sm:text-xs font-black text-slate-200 group-hover:text-amber-300 text-center line-clamp-1">
                    {emote.name}
                  </span>

                  {/* Hotkey Tag */}
                  <span className="absolute top-1 left-1 bg-black/70 text-amber-400 text-[8px] font-black px-1 rounded border border-amber-500/30">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>

            {/* Selected Emote Info Banner */}
            <div className="mt-3 p-2.5 bg-slate-950/80 rounded-xl border border-amber-500/30 flex items-center justify-between text-xs text-slate-300 min-h-[42px]">
              {hoveredIndex !== null ? (
                <div className="flex items-center gap-2">
                  <span className="text-xl">{EMOTES[hoveredIndex].icon}</span>
                  <div>
                    <span className="font-bold text-amber-400">{EMOTES[hoveredIndex].name}: </span>
                    <span className="text-slate-300">{EMOTES[hoveredIndex].description}</span>
                  </div>
                </div>
              ) : (
                <div className="flex items-center gap-1.5 text-slate-400 italic">
                  <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                  Hover over an emote to preview its description, click to perform in match!
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: QUICK CHAT BUBBLES */}
        {activeTab === 'CHAT' && (
          <div className="w-full my-2">
            <div className="grid grid-cols-2 gap-3 p-2 max-h-[300px] overflow-y-auto custom-scrollbar">
              {QUICK_CHAT_MESSAGES.map((msg) => (
                <button
                  key={msg.id}
                  onClick={() => {
                    onTriggerQuickChat(msg);
                    onClose();
                  }}
                  onMouseEnter={() => soundManager.playLoot()}
                  className="flex items-center gap-3 p-3 bg-slate-950/80 hover:bg-cyan-950/60 border border-slate-800 hover:border-cyan-400/70 rounded-2xl transition transform hover:scale-[1.02] active:scale-95 text-left group"
                >
                  <div className="w-10 h-10 rounded-xl bg-slate-900 border border-cyan-500/40 flex items-center justify-center text-xl shrink-0 group-hover:scale-110 transition">
                    {msg.icon}
                  </div>
                  <div>
                    <div className="text-xs font-black text-white group-hover:text-cyan-300">
                      {msg.text}
                    </div>
                    <div className="text-[9px] text-slate-400 font-mono tracking-wider">
                      {msg.category}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Footer tip */}
        <div className="mt-3 text-[10px] text-slate-500 text-center font-mono">
          Press [E] or [1-8] during gameplay to trigger instantly • All team members see chat & emotes!
        </div>
      </div>
    </div>
  );
};
