"use client";

import { useQuests } from "@/hooks/useQuests";
import { Target, Zap, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function QuestsPage() {
  const { quests, claimQuest } = useQuests();

  return (
    <main className="min-h-screen pb-40 bg-oled-black bg-grid-cyber p-6 pt-12 relative overflow-x-hidden">
      
      {/* Header */}
      <div className="flex flex-col items-center mb-10 relative z-10">
        <div className="w-16 h-16 rounded-2xl bg-neon-cyan/20 flex items-center justify-center text-neon-cyan mb-4 shadow-[0_0_20px_rgba(0,243,255,0.3)]">
          <Target size={32} />
        </div>
        <h1 className="text-3xl font-black text-white uppercase tracking-widest text-center leading-none">
          Contrats de Focus
        </h1>
        <p className="text-gray-400 text-xs mb-8 uppercase tracking-widest text-center mt-2">
          Accomplissez ces contrats pour gagner de l&apos;XP et des Pomocoins.
        </p>
      </div>

      {/* Quests List */}
      <div className="space-y-4 relative z-10 max-w-md mx-auto">
        <AnimatePresence mode="popLayout">
          {quests.map((quest) => {
            const isCompleted = quest.progress >= quest.target;
            
            return (
              <motion.div
                key={quest.id}
                layout
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`bg-glass-dark border ${quest.claimed ? 'border-gray-800 opacity-50' : isCompleted ? 'border-neon-cyan shadow-[0_0_15px_rgba(0,243,255,0.2)]' : 'border-white/5'} p-5 rounded-3xl relative overflow-hidden group transition-all`}
              >
                {/* Status Icon */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-neon-cyan uppercase tracking-[0.2em] mb-1">{quest.type}</span>
                    <h3 className="text-lg font-bold text-white leading-tight">{quest.title}</h3>
                  </div>
                  {quest.claimed && (
                    <ShieldCheck className="text-neon-cyan" size={20} />
                  )}
                </div>

                {/* Progress Bar */}
                {!quest.claimed && (
                  <>
                    <div className="w-full h-1.5 bg-white/5 rounded-full overflow-hidden mb-2">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${Math.min(100, (quest.progress / quest.target) * 100)}%` }}
                        className="h-full bg-neon-cyan"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-4 text-[10px] uppercase font-bold tracking-widest">
                      <span className="text-gray-500">{quest.progress} / {quest.target}</span>
                      <div className="flex items-center gap-1 text-yellow-400">
                        <Zap size={10} />
                        <span>+{quest.rewardXp} XP • +{quest.rewardCoins} CP</span>
                      </div>
                    </div>
                  </>
                )}

                {/* Action Button */}
                {isCompleted && !quest.claimed && (
                  <button 
                    onClick={() => claimQuest(quest.id)}
                    className="w-full py-3 bg-neon-cyan text-oled-black rounded-xl font-black uppercase tracking-widest text-xs shadow-neon-cyan hover:scale-[1.02] active:scale-[0.98] transition-all"
                  >
                    Récupérer la prime
                  </button>
                )}

                {quest.claimed && (
                  <div className="text-center py-2 text-[10px] font-black uppercase text-gray-500 tracking-widest">
                    Contrat Terminé
                  </div>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

    </main>
  );
}
