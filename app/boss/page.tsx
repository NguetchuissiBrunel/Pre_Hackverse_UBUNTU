"use client";

import { useEffect, useState } from "react";
import { CURRENT_WEEK_BOSS, getWeeklyFocusMinutes } from "@/lib/gamification/bossEngine";
import { Swords, Zap, Skull, Trophy, History, Info } from "lucide-react";
import { motion } from "framer-motion";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function BossPage() {
  const [focusMinutes, setFocusMinutes] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const mins = await getWeeklyFocusMinutes();
      setFocusMinutes(mins);
      setLoading(false);
    };
    loadData();
  }, []);

  const boss = CURRENT_WEEK_BOSS;
  const progress = Math.min(100, (focusMinutes / boss.targetMinutes) * 100);
  const isDefeated = focusMinutes >= boss.targetMinutes;

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen pb-40 bg-oled-black bg-grid-cyber p-6 pt-12 relative overflow-x-hidden">
      
      {/* Background Ambience */}
      <div className={`absolute top-0 left-0 w-full h-[600px] transition-colors duration-1000 ${isDefeated ? 'bg-neon-cyan/5' : 'bg-red-900/10'} blur-[120px] pointer-events-none`} />

      {/* Header */}
      <div className="relative z-10 mb-8 text-center">
        <h1 className="text-3xl font-black uppercase tracking-[0.3em] text-white text-glow-magenta mb-2">Raid Hebdomadaire</h1>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest font-bold">Unissez votre focus pour terrasser la bête</p>
      </div>

      {/* Boss Avatar Area */}
      <div className="relative z-10 flex flex-col items-center mb-12">
        <motion.div
           animate={!isDefeated ? { 
             scale: [1, 1.05, 1],
             filter: ["hue-rotate(0deg)", "hue-rotate(10deg)", "hue-rotate(0deg)"]
           } : { scale: 0.8, opacity: 0.5, filter: "grayscale(100%)" }}
           transition={{ repeat: Infinity, duration: 4 }}
           className="relative flex items-center justify-center"
        >
          {/* Monster Silhouette / Icon */}
          <div className={`w-48 h-48 rounded-full flex items-center justify-center border-4 transition-colors ${isDefeated ? 'border-neon-cyan/50' : 'border-neon-magenta/50'} bg-glass-dark relative overflow-hidden shadow-2xl`}>
             <Skull size={100} className={isDefeated ? 'text-gray-600' : 'text-neon-magenta drop-shadow-[0_0_20px_#ff00ff]'} />
             
             {/* Damage Particles (Visual only) */}
             {!isDefeated && (
               <motion.div 
                 animate={{ y: [-10, -100], opacity: [0, 1, 0] }}
                 transition={{ repeat: Infinity, duration: 1 }}
                 className="absolute bottom-10 text-red-500 font-black text-xl"
               >
                 -1 HP
               </motion.div>
             )}
          </div>

          {/* Defeated Overlay */}
          {isDefeated && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-4 -right-4 bg-yellow-400 text-black p-3 rounded-2xl shadow-xl rotate-12 flex items-center gap-2 font-black uppercase text-xs"
            >
              <Trophy size={16} /> Terrassé !
            </motion.div>
          )}
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
             className={`h-full rounded-full transition-all duration-1000 ${isDefeated ? 'bg-gray-600' : 'bg-gradient-to-r from-red-600 to-neon-magenta shadow-[0_0_15px_#ff00ff]'}`}
           />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-[8px] text-gray-600 uppercase font-bold tracking-widest">Fragilité</span>
          <span className="text-[8px] text-gray-600 uppercase font-bold tracking-widest">Immortalité</span>
        </div>
      </div>

      {/* Stats & Actions */}
      <div className="grid grid-cols-2 gap-4 relative z-10 max-w-md mx-auto">
        <div className="bg-glass-dark border border-white/5 p-4 rounded-2xl flex flex-col items-center">
          <Zap className="text-yellow-400 mb-2" size={20} />
          <span className="text-[8px] text-gray-500 uppercase font-bold">Dégâts Infligés</span>
          <span className="text-xl font-black text-white">{focusMinutes} <span className="text-xs">MIN</span></span>
        </div>
        <div className="bg-glass-dark border border-white/5 p-4 rounded-2xl flex flex-col items-center text-center">
          <Swords className="text-neon-cyan mb-2" size={20} />
          <span className="text-[8px] text-gray-500 uppercase font-bold">Récompense Loot</span>
          <span className="text-sm font-black text-neon-cyan">+{boss.rewardXp} XP</span>
          <span className="text-[8px] text-yellow-400 font-bold tracking-tighter">+{boss.rewardCoins} COINS</span>
        </div>
      </div>

      {/* Raid Tips */}
      <div className="mt-8 p-4 bg-neon-magenta/5 border border-neon-magenta/20 rounded-2xl relative z-10 max-w-md mx-auto flex gap-3 shadow-inner">
         <Info className="text-neon-magenta shrink-0" size={20} />
         <p className="text-[10px] text-gray-400 uppercase leading-relaxed tracking-tighter">
           Chaque minute de <span className="text-white">Pomodoro, Sprint ou Deepwork</span> inflige 1 point de dégât. Vainquez le boss avant dimanche minuit pour réclamer le butin légendaire !
         </p>
      </div>

      {/* Footer / Back */}
      <div className="mt-12 text-center relative z-10">
        <motion.button 
          whileHover={{ x: -4 }}
          onClick={() => window.history.back()}
          className="text-[10px] text-gray-500 uppercase font-bold flex items-center justify-center gap-2 mx-auto hover:text-white transition-colors"
        >
          <History size={14} /> Retour au Hub
        </motion.button>
      </div>

    </main>
  );
}
