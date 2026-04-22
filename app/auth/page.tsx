"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { motion } from "framer-motion";
import { UserPlus, Mail, Lock, ShieldCheck, ArrowRight, Zap, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: { username }
          }
        });
        if (error) throw error;
        alert("Veuillez vérifier votre email pour confirmer l'inscription !");
      }
      router.push("/");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-oled-black bg-grid-cyber flex items-center justify-center p-6 relative overflow-hidden">
      
      {/* Glow Effects */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-neon-cyan/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-neon-magenta/10 rounded-full blur-[100px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-glass-dark border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative z-10 shadow-2xl"
      >
        {/* Header Icons */}
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 rounded-2xl bg-neon-cyan/20 flex items-center justify-center text-neon-cyan shadow-[0_0_20px_rgba(0,243,255,0.3)]">
            <Zap size={32} />
          </div>
        </div>

        <h1 className="text-3xl font-black text-center uppercase tracking-widest text-white mb-2">
          {isLogin ? "Connexion" : "Inscription"}
        </h1>
        <p className="text-gray-400 text-center text-xs mb-8 uppercase tracking-tighter">
          {isLogin ? "Rejoignez la grille du Focus" : "Créez votre profil de Cyber-Héros"}
        </p>

        <form onSubmit={handleAuth} className="space-y-4">
          {!isLogin && (
            <div className="relative">
              <UserPlus className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" 
                placeholder="PSEUDONYME" 
                required 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-neon-cyan focus:outline-none transition-colors"
              />
            </div>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="email" 
              placeholder="EMAIL" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-neon-cyan focus:outline-none transition-colors"
            />
          </div>

          <div className="relative">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="MOT DE PASSE" 
              required 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-12 text-white text-sm focus:border-neon-cyan focus:outline-none transition-colors"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-neon-cyan transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-red-500 text-[10px] uppercase font-bold text-center tracking-widest bg-red-500/10 py-2 rounded-lg border border-red-500/20"
            >
              {error}
            </motion.div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(0,243,255,0.4)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full bg-neon-cyan text-oled-black py-4 rounded-xl font-black uppercase tracking-widest flex items-center justify-center gap-2 mt-6 shadow-neon-cyan transition-all"
            disabled={loading}
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-oled-black border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? "Entrer dans la Grille" : "Initialiser le Profil"}
                <ArrowRight size={18} />
              </>
            )}
          </motion.button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/5 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-gray-400 text-[10px] uppercase tracking-widest hover:text-neon-cyan transition-colors"
          >
            {isLogin ? "Pas de compte ? Inscrivez-vous" : "Déjà membre ? Connectez-vous"}
          </button>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-1 mt-6 opacity-30">
          <ShieldCheck size={12} className="text-neon-cyan" />
          <span className="text-[8px] text-white uppercase tracking-tighter">Sécurisé par le protocole Supabase</span>
        </div>
      </motion.div>
    </main>
  );
}
