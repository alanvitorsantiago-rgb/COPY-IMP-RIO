import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Cpu, Shield, Zap, Activity } from 'lucide-react';

const LOG_LINES = [
  'INITIALIZING OMEGA_PROTOCOL...',
  'ESTABLISHING NEURAL_LINK...',
  'BYPASSING FIREWALLS [OK]',
  'LOADING PERSUASION_MODELS...',
  'SYNCING DATA_ARCHIVE...',
  'CALIBRATING EMOTIONAL_FREQUENCY...',
  'SYSTEM_ONLINE // PROTOCOL_OMEGA ACTIVE'
];

export default function BootSequence({ onComplete }) {
  const [currentLine, setCurrentLine] = useState(0);

  useEffect(() => {
    if (currentLine < LOG_LINES.length) {
      const timer = setTimeout(() => {
        setCurrentLine(prev => prev + 1);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setTimeout(onComplete, 800);
    }
  }, [currentLine, onComplete]);

  return (
    <div className="fixed inset-0 z-[10000] bg-bg flex flex-col items-center justify-center p-8 font-mono">
      {/* Background Decor */}
      <div className="neural-bg" />
      <div className="scanlines" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="flex items-center justify-center gap-6 mb-12">
           <motion.div 
             animate={{ rotate: 360 }}
             transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
             className="w-16 h-16 border border-cyan flex items-center justify-center shadow-[0_0_20px_rgba(0,242,255,0.4)]"
           >
              <Cpu size={32} className="text-cyan glow-cyan" />
           </motion.div>
           <div>
              <h1 className="text-2xl font-black text-white tracking-tighter uppercase font-display leading-tight">Império <span className="text-cyan">HUD</span></h1>
              <p className="text-[10px] text-cyan/60 tracking-[0.4em] uppercase font-bold">Booting Alpha v2.0</p>
           </div>
        </div>

        <div className="space-y-2 mb-10 min-h-[160px]">
          {LOG_LINES.slice(0, currentLine + 1).map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <span className="text-[9px] text-cyan opacity-40">[{new Date().toLocaleTimeString([], { hour12: false })}]</span>
              <span className={`text-[10px] font-bold tracking-widest ${i === LOG_LINES.length - 1 ? 'text-emerald' : 'text-text-muted'}`}>
                {line}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="relative h-1 bg-white/5 w-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${(currentLine / LOG_LINES.length) * 100}%` }}
            className="h-full bg-cyan shadow-[0_0_15px_var(--cyan)]"
          />
        </div>
        <div className="flex justify-between mt-2 text-[8px] font-bold text-text-dim tracking-widest uppercase">
           <span>Core Loading</span>
           <span>{Math.round((currentLine / LOG_LINES.length) * 100)}%</span>
        </div>
      </motion.div>

      {/* Footer HUD Decor */}
      <div className="fixed bottom-10 flex gap-8 text-text-dim">
         <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.2em]">
            <Shield size={14} /> SECURITY_READY
         </div>
         <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.2em]">
            <Activity size={14} /> NEURAL_STABLE
         </div>
         <div className="flex items-center gap-2 text-[9px] font-bold tracking-[0.2em]">
            <Zap size={14} /> POWER_OPTIMIZED
         </div>
      </div>
    </div>
  );
}
