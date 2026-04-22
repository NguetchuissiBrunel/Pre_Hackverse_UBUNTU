"use client";

import { useQuests } from "@/hooks/useQuests";
import { CheckCircle, Coins, Star, Target } from "lucide-react";
import { motion } from "framer-motion";

export function QuestsView({ isNested = false }: { isNested?: boolean }) {
  const { quests, claimQuest } = useQuests();
  
  const dailyQuests = quests.filter(q => q.type === 'daily');

  return (
    <main className={`min-h-screen pb-40 bg-oled-black bg-grid-cyber flex flex-col items-center relative overflow-x-hidden p-6 ${isNested ? 'pt-24' : 'pt-12'}`}>
      
      {/* Background decorations */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-neon-cyan/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Header */}
      <div className="w-full max-w-md flex flex-col items-start mb-8 z-10">
        <h1 className="text-3xl font-black uppercase tracking-widest text-white text-glow-cyan mb-2 flex items-center gap-2">
          <Target /> Contrats
        </h1>
        <p className="text-gray-400 text-sm">Accomplissez vos objectifs quotidiens pour gagner de l&apos;XP et des Pomocoins supplémentaires.</p>
      </div>

      {/* Dailies */}
      <div className="w-full max-w-md z-10 flex flex-col gap-4">
        <h3 className="text-neon-orange uppercase tracking-widest font-bold mb-2 flex items-center gap-2">
          Quêtes Journalières
          <div className="flex-1 h-[1px] bg-neon-orange/30"></div>
        </h3>
        
        {dailyQuests.map((q) => {
          const isCompletable = q.progress >= q.target && !q.done;
          const progressPercent = Math.min(100, Math.round((q.progress / q.target) * 100));

          return (
            <div key={q.id} className={`p-4 rounded-xl border relative overflow-hidden transition-all ${
              q.done ? 'bg-white/5 border-white/10 opacity-50' : 
              isCompletable ? 'bg-neon-cyan/10 border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.2)]' : 
              'bg-glass-dark border-white/20'
            }`}>
              
              {/* Progress Background */}
              {!q.done && (
                <div 
                  className="absolute left-0 top-0 bottom-0 bg-white/5 transition-all duration-1000" 
                  style={{ width: `${progressPercent}%` }}
                />
              )}

              <div className="relative z-10 flex justify-between items-center">
                <div>
                  <h4 className={`font-bold ${q.done ? 'text-gray-400 line-through' : 'text-white'}`}>
                    {q.description}
                  </h4>
                  <div className="flex gap-3 text-xs mt-2 font-black">
                    <span className="flex items-center gap-1 text-neon-cyan"><Star size={12}/> {q.rewardXp}</span>
                    <span className="flex items-center gap-1 text-yellow-500"><Coins size={12}/> {q.rewardCoins}</span>
                  </div>
                </div>
                
                <div className="flex flex-col items-end gap-2">
                  <span className="text-sm font-mono text-gray-400">{q.progress} / {q.target}</span>
                  
                  {isCompletable && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => claimQuest(q.id)}
                      className="bg-neon-cyan text-oled-black px-4 py-1 rounded font-black uppercase text-xs shadow-neon-cyan"
                    >
                      Réclamer
                    </motion.button>
                  )}
                  {q.done && (
                    <div className="text-neon-cyan flex items-center gap-1 text-xs uppercase font-bold">
                      <CheckCircle size={14} /> Terminé
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

    </main>
  );
}
