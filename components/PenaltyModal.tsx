"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, Info, Skull } from "lucide-react";

interface PenaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAbandon: () => void;
}

export default function PenaltyModal({ isOpen, onClose, onConfirmAbandon }: PenaltyModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal */}
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="relative w-full max-w-sm bg-glass-dark border border-red-500/30 rounded-3xl p-8 shadow-[0_0_50px_rgba(255,0,0,0.2)] overflow-hidden"
          >
            {/* Background warning effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 animate-pulse" />
            
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500 mb-6 drop-shadow-[0_0_15px_rgba(255,0,0,0.5)]">
                <ShieldAlert size={40} />
              </div>

              <h2 className="text-2xl font-black text-white uppercase tracking-tighter mb-4">
                ALERTE D&apos;ABANDON
              </h2>

              <p className="text-gray-400 text-xs mb-8 uppercase tracking-widest leading-relaxed">
                Quitter maintenant brisera votre <span className="text-red-500 font-black">série de focus</span>. 
                Une pénalité de temps sera appliquée à votre prochaine tentative.
              </p>

              <div className="w-full space-y-3">
                <button 
                  onClick={onConfirmAbandon}
                  className="w-full py-4 bg-red-600 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-red-700 transition-all flex items-center justify-center gap-2"
                >
                  <Skull size={16} /> Confirmer l&apos;Abandon
                </button>
                <button 
                  onClick={onClose}
                  className="w-full py-4 bg-white/5 border border-white/10 text-white rounded-xl font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all"
                >
                  Retourner au Combat
                </button>
              </div>

              <div className="mt-8 flex items-start gap-2 text-left p-3 bg-red-900/10 border border-red-500/10 rounded-xl">
                 <Info size={14} className="text-red-500 shrink-0 mt-0.5" />
                 <p className="text-[8px] text-gray-500 uppercase tracking-tighter">
                   Protégez votre honneur, Cyber-Héros. L&apos;abandon régulier pourra entraîner un verrouillage prolongé de la grille.
                 </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
