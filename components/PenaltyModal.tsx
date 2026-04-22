"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CopyX } from "lucide-react";

// Lexique pour générer des phrases aléatoires
const WORDS = [
  "discipline", "volonte", "focus", "concentration", "grind", 
  "echec", "abandon", "faiblesse", "victoire", "objectif", 
  "temps", "perte", "avenir", "procrastination", "regret", 
  "douleur", "effort", "reussite", "maitrise", "esprit",
  "durete", "courage", "paresse", "travail", "constance",
  "honneur", "promesse", "engagement", "lachete", "fuite"
];

function generatePhrase() {
  const array = new Uint32Array(20);
  window.crypto.getRandomValues(array);
  return Array.from(array)
    .map((val) => WORDS[val % WORDS.length])
    .join(" ");
}

interface PenaltyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirmAbandon: () => void;
}

export default function PenaltyModal({ isOpen, onClose, onConfirmAbandon }: PenaltyModalProps) {
  const [targetPhrase, setTargetPhrase] = useState("");
  const [userInput, setUserInput] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setTargetPhrase(generatePhrase());
      setUserInput("");
      setError(false);
    }
  }, [isOpen]);

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault(); // Interdire le copier-coller
  };

  const checkPhrase = () => {
    if (userInput.trim() === targetPhrase) {
      onConfirmAbandon();
    } else {
      setError(true);
      setTimeout(() => setError(false), 500);
      setUserInput(""); // Punitive approach: reset on fail
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start md:items-center justify-center p-4 bg-oled-black/95 backdrop-blur-md overflow-y-auto"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="w-full max-w-lg bg-glass-dark border border-neon-magenta/50 rounded-2xl p-6 shadow-[0_0_50px_rgba(255,0,255,0.2)] flex flex-col items-center"
          >
            <div className="w-16 h-16 rounded-full bg-neon-magenta/20 flex items-center justify-center mb-4">
              <CopyX size={32} className="text-neon-magenta drop-shadow-[0_0_10px_#ff00ff]" />
            </div>
            
            <h2 className="text-xl font-bold text-white uppercase tracking-widest mb-2 text-center text-glow-magenta">Abandonner la session ?</h2>
            <p className="text-gray-400 text-sm text-center mb-6">
              L&apos;abandon entraînera une perte totale d&apos;XP pour cette session et comptera pour la Penalty Box. Pour confirmer votre abandon, vous devez prouver votre détermination en tapant la phrase suivante **sans erreur** (copier-coller désactivé).
            </p>

            <div className="w-full bg-oled-black/50 p-4 border border-white/10 rounded-lg mb-6 select-none font-mono text-sm leading-relaxed text-neon-cyan/70">
              {targetPhrase}
            </div>

            <motion.textarea
              animate={error ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onPaste={handlePaste}
              onCopy={handlePaste}
              spellCheck={false}
              autoComplete="off"
              rows={3}
              className={`w-full bg-oled-black/30 border-2 rounded-xl outline-none p-4 text-center font-mono text-sm focus:border-neon-magenta transition-colors resize-none ${error ? 'border-red-500 text-red-400' : 'border-white/10 text-white'}`}
              placeholder="Tapez la phrase exactement ici..."
            />

            <div className="flex gap-4 w-full mt-8">
              <button 
                onClick={onClose}
                className="flex-1 py-3 border border-neon-cyan/50 text-neon-cyan rounded-lg font-bold uppercase tracking-widest hover:bg-neon-cyan/10 transition-colors"
              >
                Retourner Grind
              </button>
              <button 
                onClick={checkPhrase}
                className="flex-1 py-3 bg-neon-magenta text-white rounded-lg font-bold uppercase tracking-widest shadow-[0_0_15px_#ff00ff] hover:bg-neon-magenta/80 transition-colors"
              >
                Confirmer l&apos;Échec
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
