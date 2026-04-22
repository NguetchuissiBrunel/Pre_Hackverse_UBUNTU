"use client";

import { useState } from "react";
import { audioManager } from "@/lib/audio/audioManager";
import { Music, Volume1, Volume2, X, CloudRain, Flame, Coffee, Ban } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AudioMixer() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [volume, setVolume] = useState(0.5);

  const ambienceTracks = [
    { id: 'rain', label: 'Pluie', icon: CloudRain },
    { id: 'fire', label: 'Feu', icon: Flame },
    { id: 'cafe', label: 'Café', icon: Coffee },
  ];

  const handleToggleTrack = (trackId: string) => {
    if (activeTrack === trackId) {
      audioManager.stopAmbience();
      setActiveTrack(null);
    } else {
      audioManager.playAmbience(trackId as 'rain' | 'fire' | 'cafe');
      setActiveTrack(trackId);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    audioManager.setAmbienceVolume(val);
  };

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`p-3 rounded-full border transition-all ${
          activeTrack 
            ? 'bg-neon-cyan text-oled-black shadow-neon-cyan border-neon-cyan' 
            : 'bg-glass-dark border-white/10 text-white/70 hover:text-white'
        }`}
      >
        <Music size={20} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: -10 }}
              className="absolute top-full left-0 mt-4 w-64 bg-glass-dark border border-white/20 rounded-2xl p-6 backdrop-blur-xl z-50 shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Atmosphères</h3>
                <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-white">
                  <X size={14} />
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3 mb-6">
                <button
                  onClick={() => {
                    audioManager.stopAmbience();
                    setActiveTrack(null);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-xs font-bold ${
                    activeTrack === null 
                      ? 'bg-white/10 border-white/20 text-white' 
                      : 'border-transparent text-gray-500 hover:text-gray-300'
                  }`}
                >
                  <Ban size={16} /> Silence
                </button>
                
                {ambienceTracks.map((track) => {
                  const Icon = track.icon;
                  const isActive = activeTrack === track.id;
                  return (
                    <button
                      key={track.id}
                      onClick={() => handleToggleTrack(track.id)}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all text-xs font-bold ${
                        isActive 
                          ? 'bg-neon-cyan/20 border-neon-cyan/50 text-neon-cyan' 
                          : 'border-transparent text-gray-400 hover:text-white'
                      }`}
                    >
                      <Icon size={16} /> {track.label}
                    </button>
                  );
                })}
              </div>

              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-[8px] font-black uppercase text-gray-500">Volume</span>
                  <span className="text-[8px] font-mono text-neon-cyan">{Math.round(volume * 100)}%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Volume1 size={14} className="text-gray-500" />
                  <input 
                    type="range" 
                    min="0" 
                    max="1" 
                    step="0.01" 
                    value={volume}
                    onChange={handleVolumeChange}
                    className="flex-1 accent-neon-cyan bg-white/10 rounded-full h-1 appearance-none cursor-pointer"
                  />
                  <Volume2 size={14} className="text-gray-500" />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
