"use client";

import TimerDisplay from "@/components/TimerDisplay";
import { useTimerStore } from "@/lib/store/useTimerStore";
import { useUser } from "@/hooks/useUser";
import { DUNGEONS } from "@/lib/gamification/dungeonData";
import { Zap, Swords } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function Home() {
  const { activeDungeonId } = useTimerStore();
  const { user, stats } = useUser();
  const currentDungeon = DUNGEONS.find(d => d.id === activeDungeonId) || DUNGEONS[0];

  return (
    <main className={`min-h-screen bg-oled-black ${currentDungeon.bgClass} flex flex-col items-center relative overflow-y-auto pt-24 pb-32 transition-all duration-700 p-6`}>
      
      {/* Background Glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full blur-[100px] pointer-events-none transition-colors duration-1000 opacity-20" 
        style={{ backgroundColor: `rgba(${activeDungeonId === 'neon_city' ? '0, 243, 255' : activeDungeonId === 'cyber_forest' ? '0, 255, 100' : '255, 0, 255'}, 0.5)` }}
      />
      
      {/* Top Bar: XP & Coins */}
      <div className="absolute top-8 left-0 w-full px-6 flex justify-between items-start z-10">
        <div className="flex flex-col gap-1">
          <h1 className="text-2xl font-black tracking-[0.2em] uppercase text-white">
            Focus<span className={`text-${currentDungeon.accentColor} drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]`}>Grind</span>
          </h1>
          <div className="flex items-center gap-2">
            <div className="px-2 py-0.5 bg-neon-cyan/20 border border-neon-cyan/30 rounded text-[10px] font-black text-neon-cyan uppercase">
              Niv. {user?.level || 1}
            </div>
            <div className="text-[10px] text-gray-500 uppercase font-bold">{currentDungeon.name} Mode</div>
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-glass-dark border border-white/5 px-3 py-1 rounded-full text-xs font-bold text-white">
            <Zap size={14} className="text-yellow-400" />
            {user?.coins || 0}
          </div>
          {stats && (
            <div className="w-24 h-1.5 bg-white/5 rounded-full overflow-hidden border border-white/5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${stats.progressPercentage}%` }}
                className="h-full bg-neon-cyan shadow-[0_0_8px_#00f3ff]"
              />
            </div>
          )}
        </div>
      </div>

      {/* Main UI */}
      <div className="flex flex-col items-center gap-6 w-full max-w-sm mt-12 relative z-10 transition-all">
        <TimerDisplay />

        {/* Boss Raid Banner */}
        <Link href="/boss" className="w-full">
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="p-4 bg-gradient-to-r from-red-900/40 to-neon-magenta/20 border border-neon-magenta/30 rounded-2xl flex items-center justify-between group overflow-hidden relative shadow-lg"
          >
            <div className="absolute inset-0 bg-neon-magenta/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="w-10 h-10 rounded-lg bg-neon-magenta/20 flex items-center justify-center text-neon-magenta shadow-[0_0_10px_#ff00ff]">
                <Swords size={20} />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Raid du Kraken</h3>
                <p className="text-[8px] text-gray-400 uppercase tracking-tighter">Infligez des dégâts avec votre focus</p>
              </div>
            </div>
            <div className="flex flex-col items-end relative z-10">
              <span className="text-[9px] font-black text-neon-magenta animate-pulse tracking-widest">RAID ACTIF</span>
              <span className="text-[8px] text-gray-500 uppercase">Fin Dimanche</span>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Footer Navigation spacers etc could be handled by Navigation component */}
      
    </main>
  );
}
