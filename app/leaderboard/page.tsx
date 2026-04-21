"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Trophy, Users, Medal, Globe, Ghost, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@/hooks/useUser";

interface LeaderboardEntry {
  id: string;
  username: string;
  level: number;
  xp: number;
  title: string;
}

const NPC_DRIVERS: LeaderboardEntry[] = [
  { id: 'npc1', username: 'Kenz0_Focus', level: 42, xp: 42000, title: 'Légende' },
  { id: 'npc2', username: 'Sarah_99', level: 38, xp: 38500, title: 'Elite' },
  { id: 'npc3', username: 'Ghost_Runner', level: 35, xp: 35200, title: 'Vétéran' },
  { id: 'npc4', username: 'Néon_Knight', level: 31, xp: 31800, title: 'Samouraï' },
  { id: 'npc5', username: 'Zen_Master', level: 28, xp: 28900, title: 'Maître' },
];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, level, xp, title')
          .order('xp', { ascending: false })
          .limit(10);

        if (error) throw error;

        // Fusionner avec les PNJ pour remplir le classement si peu d'utilisateurs
        const allEntries = [...(data || []), ...NPC_DRIVERS]
          .sort((a, b) => b.xp - a.xp)
          .slice(0, 10);

        setLeaderboard(allEntries);
      } catch (err: unknown) {
        console.error("Erreur classement:", err);
        // En cas d'erreur (offline), on ne laisse que les PNJ
        setLeaderboard(NPC_DRIVERS.sort((a, b) => b.xp - a.xp));
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <main className="min-h-screen pb-40 bg-oled-black bg-grid-cyber p-6 pt-12 relative overflow-x-hidden text-white">
      
      {/* Header */}
      <div className="flex flex-col items-center mb-10 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-neon-cyan/20 flex items-center justify-center text-neon-cyan mb-4 shadow-[0_0_20px_rgba(0,243,255,0.3)]">
          <Globe size={32} />
        </div>
        <h1 className="text-3xl font-black uppercase tracking-widest text-center leading-none">
          Temple de la Gloire
        </h1>
        <p className="text-gray-400 text-[10px] uppercase tracking-widest text-center mt-2">Élite Mondiale du Focus</p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-glass-dark border border-white/10 rounded-3xl overflow-hidden relative z-10 max-w-md mx-auto shadow-2xl">
        <div className="p-4 border-b border-white/5 bg-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-neon-cyan" />
            <span className="text-[10px] font-black uppercase tracking-widest">Global Top 10</span>
          </div>
          <span className="text-[10px] text-gray-500 uppercase font-black">Saison 1</span>
        </div>

        <div className="divide-y divide-white/5">
          <AnimatePresence>
            {loading ? (
              <div className="p-12 flex justify-center">
                <div className="w-6 h-6 border-2 border-neon-cyan border-t-transparent rounded-full animate-spin" />
              </div>
            ) : (
              leaderboard.map((u, index) => {
                const isCurrentUser = user?.id === u.id;
                const isNpc = u.id.startsWith('npc');

                return (
                  <motion.div 
                    key={u.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 flex items-center gap-4 transition-colors ${isCurrentUser ? 'bg-neon-cyan/10' : 'hover:bg-white/5'}`}
                  >
                    <div className="w-8 flex justify-center shrink-0">
                      {index === 0 ? <Trophy className="text-yellow-400" size={20} /> :
                       index === 1 ? <Medal className="text-gray-300" size={18} /> :
                       index === 2 ? <Medal className="text-amber-600" size={18} /> :
                       <span className="text-gray-500 font-black italic">{index + 1}</span>}
                    </div>

                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold uppercase tracking-tight ${isCurrentUser ? 'text-neon-cyan' : 'text-white'}`}>
                          {u.username}
                        </h4>
                        {isNpc && <Ghost size={12} className="text-gray-600" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 uppercase font-black tracking-tighter border border-white/5">
                          {u.title}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="text-xs font-black text-neon-cyan uppercase">Niv. {u.level}</div>
                      <div className="text-[8px] text-gray-500 font-bold tracking-widest">{u.xp.toLocaleString()} XP</div>
                    </div>
                  </motion.div>
                );
              })
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="max-w-md mx-auto mt-6 px-6 flex items-start gap-3 opacity-50">
        <Info size={16} className="text-gray-400 shrink-0 mt-0.5" />
        <p className="text-[8px] uppercase tracking-widest leading-relaxed text-gray-400">
          Le classement est mis à jour toutes les 15 minutes. Les agents fantômes (PNJ) maintiennent la pression en cas d&apos;absence de réseau.
        </p>
      </div>

    </main>
  );
}
