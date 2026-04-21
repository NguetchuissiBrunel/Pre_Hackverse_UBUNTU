"use client";

import { useEffect, useState } from "react";
import { CURRENT_WEEK_BOSS, getWeeklyFocusMinutes } from "@/lib/gamification/bossEngine";
import { Swords, Zap, Skull, Trophy, History, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function BossPage() {
  const [focusMinutes, setFocusMinutes] = useState(0);
  const boss = CURRENT_WEEK_BOSS;

  useEffect(() => {
    // Initialiser les minutes de focus réelles depuis Dexie
    const loadStats = async () => {
      const mins = await getWeeklyFocusMinutes();
      setFocusMinutes(mins);
    };
    loadStats();
  }, []);

  const progress = Math.min(100, (focusMinutes / boss.targetMinutes) * 100);
  const isDefeated = focusMinutes >= boss.targetMinutes;

  return (
    <main className="min-h-screen pb-40 bg-oled-black bg-grid-cyber p-6 pt-12 relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className={`absolute top-0 left-0 w-full h-[600px] transition-colors duration-1000 ${isDefeated ? 'bg-neon-cyan/5' : 'bg-red-900/10'} blur-[120px] pointer-events-none`} />

      {/* Header */}
      <div className="flex flex-col items-center mb-12 relative z-10">
        <div className="flex items-center gap-2 px-4 py-1 bg-red-500/20 border border-red-500/30 rounded-full mb-4">
          <Swords size={14} className="text-red-500 animate-pulse" />
          <span className="text-[10px] font-black text-red-500 uppercase tracking-widest">Raid de Boss Hebdomadaire</span>
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter text-center leading-none">
          {boss.name}
        </h1>
        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">Semaine 16 • Grille de Combat</p>
      </div>

      {/* Boss Visualizer */}
      <div className="relative z-10 flex flex-col items-center mb-8">
        <motion.div 
          animate={!isDefeated ? { 
            y: [0, -10, 0],
            rotate: [-1, 1, -1]
          } : {}}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="relative"
        >
          {/* Monster Silhouette / Icon */}
          <div className={`w-48 h-48 rounded-full flex items-center justify-center border-4 transition-colors ${isDefeated ? 'border-neon-cyan/50' : 'border-neon-magenta/50'} bg-glass-dark relative overflow-hidden shadow-2xl`}>
             <Skull size={100} className={isDefeated ? 'text-gray-600' : 'text-neon-magenta drop-shadow-[0_0_20px_#ff00ff]'} />
             
             {/* Damage Particles (Visual only) */}
             {!isDefeated && (
               <div className="absolute inset-0 bg-red-500/5 animate-pulse" />
             )}
          </div>

          {/* Level Badge */}
          <div className="absolute -bottom-2 right-0 bg-neon-magenta text-white text-[10px] font-black px-3 py-1 rounded-lg shadow-lg">
            BOSS NIV. 50
          </div>
        </motion.div>

        <div className="mt-6 text-center">
          <h2 className={`text-2xl font-black uppercase tracking-widest ${isDefeated ? 'text-gray-400' : 'text-white'}`}>{boss.name}</h2>
          <p className="text-xs text-gray-500 max-w-xs mx-auto mt-2 italic">&quot;{boss.description}&quot;</p>
        </div>
      </div>

      {/* HP Bar */}
      <div className="relative z-10 w-full max-w-md mx-auto mb-12">
        <div className="flex justify-between items-end mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Barre de Vie du Boss</span>
          <span className="text-[10px] font-black uppercase tracking-widest text-white">
            {isDefeated ? '0' : boss.targetMinutes - focusMinutes} min restantes
          </span>
        </div>
        <div className="w-full h-8 bg-black/50 border border-white/10 rounded-full overflow-hidden p-1">
           <motion.div 
             initial={{ width: 0 }}
             animate={{ width: `${100 - progress}%` }}
             className={`h-full rounded-full shadow-[0_0_15px_rgba(255,0,255,0.5)] ${isDefeated ? 'bg-gray-700' : 'bg-gradient-to-r from-neon-magenta to-red-600'}`}
           />
        </div>
        <div className="flex justify-between mt-2 px-2">
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-yellow-400" />
              <span className="text-[10px] text-gray-400 uppercase font-black">{focusMinutes} Infligés</span>
            </div>
            <span className="text-[10px] text-gray-500 uppercase font-bold">{progress.toFixed(1)}% ÉLIMINÉ</span>
        </div>
      </div>

      {/* Rewards Info */}
      <div className="relative z-10 w-full max-w-md mx-auto grid grid-cols-2 gap-4">
        <div className="bg-glass-dark border border-white/5 p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Trophy size={16} className="text-yellow-400" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Récompense</span>
          </div>
          <p className="text-xl font-black text-neon-cyan">+{boss.rewardXp} XP</p>
        </div>
        <div className="bg-glass-dark border border-white/5 p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <History size={16} className="text-neon-magenta" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest">Temps</span>
          </div>
          <p className="text-xl font-black text-white">Fin Dimanche</p>
        </div>
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto mt-8 p-4 bg-neon-cyan/5 border border-neon-cyan/20 rounded-2xl flex items-start gap-3">
        <Info size={18} className="text-neon-cyan shrink-0 mt-0.5" />
        <p className="text-gray-400 text-[10px] uppercase tracking-widest leading-relaxed">
          Le Kraken se nourrit de votre distraction. Chaque minute de focus est un coup d&apos;épée dans son ego.
        </p>
      </div>

    </main>
  );
}
