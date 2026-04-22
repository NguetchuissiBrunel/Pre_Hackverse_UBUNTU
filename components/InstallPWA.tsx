"use client";

import { useState, useEffect } from "react";
import { Download, X, Smartphone } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export default function InstallPWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (typeof window !== "undefined" && window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    // Check if iOS
    const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as Window & { MSStream?: unknown }).MSStream;
    setIsIOS(ios);

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      
      // Check if user dismissed it recently
      const dismissed = localStorage.getItem("pwa-prompt-dismissed");
      if (!dismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);

    // For iOS, we show it manually if not standalone
    if (ios && !localStorage.getItem("pwa-prompt-dismissed")) {
       setIsVisible(true);
    }

    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsVisible(false);
    }
  };

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem("pwa-prompt-dismissed", "true");
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-24 left-4 right-4 z-[100] md:left-auto md:right-8 md:w-80"
        >
          <div className="bg-[#050510]/90 border-2 border-neon-cyan/50 p-6 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(0,243,255,0.2)] relative overflow-hidden">
            {/* Decorative scanline for the modal */}
            <div className="absolute inset-0 bg-grid-cyber opacity-10 pointer-events-none" />
            
            <button 
              onClick={handleDismiss}
              className="absolute top-3 right-3 text-gray-500 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 rounded-xl bg-neon-cyan/20 flex items-center justify-center text-neon-cyan border border-neon-cyan/30">
                <Download size={24} />
              </div>
              <div>
                <h3 className="font-orbitron text-sm font-black text-white uppercase tracking-wider">Lien Neural Requis</h3>
                <p className="text-[10px] text-neon-cyan/70 font-bold uppercase">Optimisation PWA Disponible</p>
              </div>
            </div>

            <p className="text-xs text-gray-400 mb-6 leading-relaxed font-rajdhani">
              Installez l&apos;interface FocusGrind sur votre terminal pour un accès direct et une immersion totale sans latence réseau.
            </p>

            {isIOS ? (
              <div className="flex items-start gap-3 bg-white/5 p-3 rounded-xl border border-white/10">
                <Smartphone size={16} className="text-neon-cyan shrink-0 mt-0.5" />
                <p className="text-[9px] text-gray-300 uppercase leading-tight font-bold">
                  Appuyez sur <span className="text-white">Partager</span> puis <span className="text-white">&quot;Sur l&apos;écran d&apos;accueil&quot;</span> pour établir la connexion.
                </p>
              </div>
            ) : (
              <button 
                onClick={handleInstall}
                className="w-full py-3 bg-neon-cyan text-oled-black font-black uppercase text-xs rounded-xl hover:shadow-[0_0_20px_#00f3ff] transition-all animate-pulse"
              >
                Établir la Connexion
              </button>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
