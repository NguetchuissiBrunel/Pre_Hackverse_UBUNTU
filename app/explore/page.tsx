"use client";

import { useUser } from "@/hooks/useUser";
import { DUNGEONS } from "@/lib/gamification/dungeonData";
import { CURRENT_WEEK_BOSS, getWeeklyFocusMinutes } from "@/lib/gamification/bossEngine";
import { useTimerStore } from "@/lib/store/useTimerStore";
import { Map, Shield, Lock, Unlock, Zap, Swords } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function ExplorePage() {
  const { user } = useUser();
  const { activeDungeonId, setActiveDungeon } = useTimerStore();
  const [weeklyMinutes, setWeeklyMinutes] = useState(0);

  useEffect(() => {
    getWeeklyFocusMinutes().then(setWeeklyMinutes);
  }, []);

  if (!user) return null;

  const bossProgress = Math.min(100, Math.floor((weeklyMinutes / CURRENT_WEEK_BOSS.targetMinutes) * 100));

  return (
    <main className="min-h-screen pb-24 bg-oled-black bg-grid-cyber flex flex-col items-center relative overflow-x-hidden p-6 pt-12">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-md flex flex-col items-start mb-10 z-10">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white text-glow-cyan mb-2 flex items-center gap-2">
          <Map /> Explore
        </h1>
        <p className="text-gray-400 text-sm">Choisissez votre zone de grind et affrontez le Boss de la semaine.</p>
      </div>

      {/* Weekly Boss Section */}
      <div className="w-full max-w-md z-10 mb-10">
        <div className="bg-glass-dark border border-neon-magenta/50 rounded-2xl p-6 relative overflow-hidden shadow-[0_0_20px_rgba(255,0,255,0.1)]">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <Swords size={80} className="text-neon-magenta" />
          </div>
          
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="text-neon-magenta" size={20} />
              <span className="text-xs font-bold text-neon-magenta uppercase tracking-widest">Boss de la Semaine</span>
            </div>
            
            <h2 className="text-xl font-black text-white uppercase tracking-tight mb-2">{CURRENT_WEEK_BOSS.name}</h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">{CURRENT_WEEK_BOSS.description}</p>
            
            <div className="flex justify-between text-xs mb-2">
              <span className="text-neon-magenta font-bold">{weeklyMinutes} min</span>
              <span className="text-gray-500">{CURRENT_WEEK_BOSS.targetMinutes} min</span>
            </div>
            
            {/* Progress Bar */}
            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-4 border border-white/10">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${bossProgress}%` }}
                className="h-full bg-neon-magenta shadow-[0_0_10px_#ff00ff]"
              />
            </div>
            
            <div className="flex gap-4">
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                <span className="text-neon-magenta">XP:</span> +{CURRENT_WEEK_BOSS.rewardXp}
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-gray-400 uppercase">
                <span className="text-neon-magenta">PC:</span> +{CURRENT_WEEK_BOSS.rewardCoins}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dungeons List */}
      <div className="w-full max-w-md z-10">
        <h3 className="text-neon-cyan uppercase tracking-widest font-bold mb-6 flex items-center gap-2">
          Zones de Focus
          <div className="flex-1 h-[1px] bg-neon-cyan/30"></div>
        </h3>
        
        <div className="flex flex-col gap-4">
          {DUNGEONS.map((dungeon) => {
            const isUnlocked = user.level >= dungeon.unlockedLevel;
            const isActive = activeDungeonId === dungeon.id;
            
            return (
              <motion.div
                key={dungeon.id}
                whileTap={isUnlocked ? { scale: 0.98 } : {}}
                onClick={() => isUnlocked && setActiveDungeon(dungeon.id)}
                className={`p-5 rounded-2xl border transition-all relative overflow-hidden ${
                  isActive 
                    ? 'bg-neon-cyan/10 border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.2)]'
                    : isUnlocked 
                      ? 'bg-glass-dark border-white/20 cursor-pointer hover:border-white/40'
                      : 'bg-glass-dark border-white/5 opacity-50 cursor-not-allowed'
                }`}
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      {!isUnlocked ? <Lock size={16} className="text-gray-500" /> : <Unlock size={16} className={isActive ? 'text-neon-cyan' : 'text-gray-400'} />}
                      <h4 className={`font-black uppercase tracking-wider ${isActive ? 'text-neon-cyan' : 'text-white'}`}>{dungeon.name}</h4>
                    </div>
                    <p className="text-xs text-gray-500 max-w-[200px]">{dungeon.description}</p>
                  </div>
                  
                  <div className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${isActive ? 'bg-neon-cyan text-oled-black' : 'bg-white/10 text-gray-400'}`}>
                    {isActive ? 'ACTIF' : isUnlocked ? 'ENTRER' : `LVL ${dungeon.unlockedLevel}`}
                  </div>
                </div>
                
                {/* Visual Hint for Ambiance */}
                <div className="mt-4 flex gap-2">
                  <span className="text-[8px] font-bold text-gray-600 uppercase tracking-widest flex items-center gap-1">
                    <Zap size={10} /> Ambiance: {dungeon.ambiance}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

    </main>
  );
}
