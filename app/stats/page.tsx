"use client";

import { useUser } from "@/hooks/useUser";
import { Flame, Coins, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { useLiveQuery } from "dexie-react-hooks";
import { db } from "@/lib/db/dexie";
import HeatMapDisplay from "@/components/HeatMapDisplay";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function StatsPage() {
  const { user, stats } = useUser();
  const recentSessions = useLiveQuery(() => db.sessions.orderBy('dateEnd').reverse().limit(5).toArray(), []);

  if (!user || !stats) {
    return <LoadingSpinner />;
  }

  return (
    <main className="min-h-screen pb-40 bg-oled-black bg-grid-cyber flex flex-col items-center relative overflow-x-hidden p-6 pt-12">
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neon-magenta/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-20 left-0 w-[300px] h-[300px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header Level & Title */}
      <div className="w-full max-w-md flex flex-col items-center mb-10 z-10">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative w-32 h-32 flex items-center justify-center rounded-full border-4 border-neon-cyan/30 shadow-[0_0_30px_rgba(0,243,255,0.2)] mb-4 bg-glass-dark"
        >
          <div className="absolute inset-0 rounded-full border-t-4 border-neon-cyan animate-spin" style={{ animationDuration: '3s' }} />
          <div className="flex flex-col items-center">
            <span className="text-4xl font-bold text-white text-glow-cyan">{user.level}</span>
            <span className="text-xs text-neon-cyan uppercase tracking-widest">Niveau</span>
          </div>
        </motion.div>
        
        <h2 className={`text-2xl font-black uppercase tracking-widest ${stats.titleColor}`}>{stats.title}</h2>
        <p className="text-gray-400 mt-2 text-sm">{Math.floor(stats.currentLevelXp)} / {stats.requiredForNextLevel} XP</p>
        
        {/* XP Bar */}
        <div className="w-full h-3 bg-white/10 rounded-full mt-3 overflow-hidden shadow-inner">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${stats.progressPercentage}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full bg-neon-cyan shadow-[0_0_10px_#00f3ff]"
          />
        </div>
      </div>

      {/* Stat Cards */}
      <div className="w-full max-w-md grid grid-cols-2 gap-4 mb-10 z-10">
        <div className="bg-glass-dark border border-neon-orange/30 p-4 rounded-2xl flex flex-col items-center justify-center shadow-inner">
          <Flame className="text-neon-orange mb-2 drop-shadow-[0_0_8px_#ffaa00]" size={32} />
          <span className="text-2xl font-bold text-white">{user.streak}</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider text-center mt-1">Jours de<br/>Streak</span>
        </div>
        
        <div className="bg-glass-dark border border-yellow-400/30 p-4 rounded-2xl flex flex-col items-center justify-center shadow-inner">
          <Coins className="text-yellow-400 mb-2 drop-shadow-[0_0_8px_#facc15]" size={32} />
          <span className="text-2xl font-bold text-white">{user.coins}</span>
          <span className="text-xs text-gray-400 uppercase tracking-wider text-center mt-1">Pomocoins<br/>(PC)</span>
        </div>
      </div>

      {/* Recent History */}
      <div className="w-full max-w-md z-10">
        <h3 className="text-neon-magenta text-sm font-bold uppercase tracking-widest mb-4">Dernières Sessions</h3>
        {recentSessions?.length === 0 ? (
          <div className="text-gray-500 text-center py-8">Aucune session enregistrée. Allez grind !</div>
        ) : (
          <div className="flex flex-col gap-3">
            {recentSessions?.map(session => (
              <div key={session.id} className="bg-glass-dark border border-white/5 p-4 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neon-cyan/20 flex items-center justify-center text-neon-cyan">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="text-white font-bold capitalize">{session.type}</h4>
                    <p className="text-xs text-gray-400">
                      {session.dateStart.toLocaleDateString()} • {Math.floor(session.duration / 60)} min
                    </p>
                  </div>
                </div>
                <div className="text-neon-cyan font-black">
                  +{session.xp} XP
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="w-full max-w-md z-10">
        <HeatMapDisplay />
      </div>

    </main>
  );
}
