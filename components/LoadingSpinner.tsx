import { Hourglass } from "lucide-react";

export default function LoadingSpinner() {
  return (
    <div className="fixed inset-0 bg-oled-black/90 backdrop-blur-md z-[100] flex flex-col items-center justify-center">
      <div className="relative flex flex-col items-center justify-center">
        {/* Glow behind the icon */}
        <div className="absolute w-24 h-24 bg-neon-cyan/20 blur-[30px] rounded-full animate-pulse" />
        
        {/* Spinning Hourglass */}
        <Hourglass 
          size={48} 
          className="text-neon-cyan drop-shadow-[0_0_15px_rgba(0,243,255,0.8)] animate-[spin_3s_linear_infinite]" 
          strokeWidth={1.5}
        />
      </div>
      
      {/* Cyberpunk Loading Text */}
      <div className="mt-6 flex flex-col items-center">
        <p className="text-neon-cyan font-black tracking-[0.4em] uppercase text-xs drop-shadow-[0_0_5px_#00f3ff] animate-pulse">
          Séquence de Saut
        </p>
        <div className="flex gap-1 mt-2">
          <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-1.5 h-1.5 bg-neon-cyan rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
}
