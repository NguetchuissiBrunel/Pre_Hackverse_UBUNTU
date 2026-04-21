"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Timer, BarChart2, ShoppingCart, Target, Trophy, User, RefreshCw } from "lucide-react";
import { useSyncStore } from "@/lib/store/useSyncStore";
import { motion } from "framer-motion";

export default function Navigation() {
  const pathname = usePathname();
  const { isSyncing } = useSyncStore();

  const links = [
    { href: "/", label: "Focus", icon: Timer },
    { href: "/stats", label: "Stats", icon: BarChart2 },
    { href: "/leaderboard", label: "Rangs", icon: Trophy },
    { href: "/quests", label: "Contrats", icon: Target },
    { href: "/shop", label: "Marché", icon: ShoppingCart },
    { href: "/profile", label: "Profil", icon: User },
  ];

  return (
    <nav className="fixed bottom-0 left-0 w-full h-20 bg-oled-black/80 backdrop-blur-lg border-t border-neon-cyan/20 z-50 flex items-center justify-around px-4">
      {links.map((link) => {
        const isActive = pathname === link.href;
        const Icon = link.icon;

        return (
          <Link
            key={link.href}
            href={link.href}
            className={`flex flex-col items-center justify-center w-20 h-full transition-all duration-300 ${
              isActive
                ? "text-neon-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.8)] -translate-y-2"
                : "text-white/40 hover:text-white/80"
            }`}
          >
            <div className="relative">
              <Icon size={24} className="mb-1" />
              {link.href === "/profile" && isSyncing && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1.2 }}
                  className="absolute -top-1 -right-1 text-neon-cyan drop-shadow-[0_0_5px_#00f3ff]"
                >
                  <RefreshCw size={10} className="animate-spin" />
                </motion.div>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-widest">{link.label}</span>
            {/* Active Indication Dot */}
            {isActive && (
              <div className="absolute bottom-2 w-1 h-1 rounded-full bg-neon-cyan shadow-neon-cyan" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
