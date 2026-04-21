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
    <main className="min-h-screen pb-40 bg-oled-black bg-grid-cyber p-6 pt-12 relative overflow-x-hidden">
      
      {/* Background Neon Glows */}
      <div className="absolute top-[-100px] right-[-100px] w-80 h-80 bg-neon-cyan/10 blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[100px] left-[-100px] w-80 h-80 bg-neon-magenta/5 blur-[100px] pointer-events-none" />

      {/* Top Header / Player Info */}
      <div className="flex justify-between items-start mb-12 relative z-10">
        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-tighter leading-none mb-1">
            FocusGrind<span className="text-neon-cyan">.sys</span>
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
            className="w-full bg-gradient-to-r from-red-900/40 to-red-600/20 border border-red-500/30 rounded-2xl p-4 flex items-center justify-between group overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
            <div className="flex items-center gap-4 relative z-10">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-red-500 shadow-lg">
                <Swords size={20} />
              </div>
              <div>
                <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-white">Raid du Kraken</h3>
                <p className="text-[8px] text-gray-400 uppercase tracking-tighter">Infligez des dégâts avec votre focus</p>
              </div>
            </div>
            <div className="flex flex-col items-end relative z-10">
              <span className="text-[10px] font-black text-red-500 uppercase">Boss Actif</span>
              <div className="w-12 h-1 bg-red-500/20 rounded-full mt-1 overflow-hidden">
                <div className="w-3/4 h-full bg-red-500" />
              </div>
            </div>
          </motion.div>
        </Link>
      </div>

      {/* Ambient Text */}
      <div className="fixed bottom-24 left-6 pointer-events-none opacity-20">
        <p className="text-[8px] text-neon-cyan font-mono uppercase vertical-text tracking-[0.5em]">
          Protocol_Focus_Active // GRID_V.2.0
        </p>
      </div>

    </main>
  );
}
