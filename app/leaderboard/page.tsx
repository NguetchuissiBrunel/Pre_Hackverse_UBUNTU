"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useUser } from "@/hooks/useUser";
import { Trophy, Users, Shield, Medal, Globe, Ghost, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LeaderboardEntry {
  id: string;
  username: string;
  level: number;
  xp: number;
  title: string;
}

const NPC_RIVALS: LeaderboardEntry[] = [
  { id: 'npc_1', username: 'Shadow_Runner', level: 42, xp: 8500, title: 'Maître du Focus' },
  { id: 'npc_2', username: 'Neon_Ninja', level: 38, xp: 7200, title: 'Cyber Samouraï' },
  { id: 'npc_3', username: 'Data_Ghost', level: 25, xp: 4500, title: 'Spectre' },
  { id: 'npc_4', username: 'Bit_Warrior', level: 18, xp: 2800, title: 'Codeur' },
  { id: 'npc_5', username: 'Giga_Mind', level: 50, xp: 12000, title: 'Légende Vivante' },
];

export default function LeaderboardPage() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState<'global' | 'friends'>('global');
  const [onlineUsers, setOnlineUsers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('id, username, level, xp, title')
          .order('xp', { ascending: false })
          .limit(10);

        if (error) throw error;
        setOnlineUsers(data || []);
      } catch (err) {
        console.warn("Supabase non configuré ou erreur reseau, utilisation des PNJ.");
        setOnlineUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const displayedUsers = [...onlineUsers, ...NPC_RIVALS]
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10);

  return (
    <main className="min-h-screen pb-40 bg-oled-black bg-grid-cyber p-6 pt-12 relative overflow-x-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-neon-cyan/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="flex flex-col items-start mb-8 relative z-10">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white text-glow-cyan flex items-center gap-3">
          <Trophy className="text-yellow-400" /> Rangs du Focus
        </h1>
        <p className="text-gray-400 text-xs mt-1 uppercase tracking-tighter">Comparez votre puissance avec les héros de la grille</p>
      </div>

      <div className="flex bg-glass-dark border border-white/10 p-1 rounded-xl mb-6 relative z-10">
        <button 
          onClick={() => setActiveTab('global')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'global' ? 'bg-neon-cyan text-oled-black shadow-neon-cyan' : 'text-gray-500 hover:text-white'}`}
        >
          <Globe size={14} /> Global
        </button>
        <button 
          onClick={() => setActiveTab('friends')}
          className={`flex-1 flex items-center justify-center gap-2 py-3 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all ${activeTab === 'friends' ? 'bg-neon-magenta text-white shadow-neon-magenta' : 'text-gray-500 hover:text-white'}`}
        >
          <Users size={14} /> Amis
        </button>
      </div>

      <div className="flex flex-col gap-3 relative z-10">
        <AnimatePresence mode="popLayout">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-20 flex flex-col items-center justify-center"
            >
              <div className="w-10 h-10 border-4 border-neon-cyan border-t-transparent rounded-full animate-spin mb-4" />
              <span className="text-[10px] text-neon-cyan uppercase font-bold tracking-widest">Connexion à la grille...</span>
            </motion.div>
          ) : (
            displayedUsers.map((u, index) => {
              const isCurrentUser = user?.id === u.id || (u.username === 'Shadow_Runner' && !user);
              const rank = index + 1;
              const isNpc = u.id.startsWith('npc_');

              return (
                <motion.div
                  key={u.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-2xl border flex items-center justify-between transition-all ${
                    isCurrentUser 
                      ? 'bg-neon-cyan/20 border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.2)]' 
                      : 'bg-glass-dark border-white/10 hover:border-white/30'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 flex justify-center">
                      {rank === 1 ? <Medal className="text-yellow-400" /> : 
                       rank === 2 ? <Medal className="text-gray-400" /> :
                       rank === 3 ? <Medal className="text-orange-500" /> :
                       <span className="font-mono text-gray-500 text-lg">#{rank}</span>}
                    </div>

                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className={`font-bold uppercase tracking-tight ${isCurrentUser ? 'text-neon-cyan' : 'text-white'}`}>
                          {u.username}
                        </h4>
                        {isNpc && <Ghost size={12} className="text-gray-600" title="Bot" />}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 text-gray-400 uppercase font-black tracking-tighter border border-white/5">
                          {u.title}
                        </span>
                        <span className="text-[9px] text-neon-cyan font-bold italic">Niv. {u.level}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-white italic tracking-tighter">{u.xp.toLocaleString()} <span className="text-[8px] text-neon-cyan not-italic uppercase ml-0.5">XP</span></div>
                    {isCurrentUser && (
                      <div className="text-[8px] text-neon-cyan uppercase font-bold tracking-widest mt-0.5 animate-pulse">VOUS</div>
                    )}
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {!onlineUsers.length && !loading && (
        <div className="mt-8 p-4 bg-white/5 border border-white/5 rounded-2xl flex items-center gap-3 opacity-60">
          <Info size={20} className="text-gray-400 shrink-0" />
          <p className="text-[10px] text-gray-400 uppercase tracking-tighter leading-relaxed">
            Mode hors ligne actif. Vous voyez actuellement les <span className="text-white">Rivaux Holographiques</span>. Connectez-vous pour voir les vrais héros de FocusGrind.
          </p>
        </div>
      )}
    </main>
  );
}
