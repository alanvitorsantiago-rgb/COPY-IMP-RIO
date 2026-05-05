import { motion } from 'framer-motion';
import { Crown, Sparkles } from 'lucide-react';

export default function PlanetaryLogo() {
  return (
    <div className="relative w-32 h-32 flex items-center justify-center mx-auto mb-2">
      {/* Premium Circular Container */}
      <div className="absolute inset-0 rounded-full bg-white/[0.03] border border-white/10 shadow-[inset_0_0_20px_rgba(255,255,255,0.05)] backdrop-blur-md" />
      
      {/* Outer Neon Ring */}
      <motion.div 
        animate={{ rotate: 360 }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[-4px] border border-primary/30 rounded-full border-dashed"
      />

      {/* The Planet (Yellow Sphere) */}
      <motion.div 
        animate={{ 
          scale: [1, 1.05, 1],
          boxShadow: [
            "0 0 15px rgba(251, 191, 36, 0.4)",
            "0 0 25px rgba(251, 191, 36, 0.7)",
            "0 0 15px rgba(251, 191, 36, 0.4)"
          ]
        }}
        transition={{ duration: 3, repeat: Infinity }}
        className="w-12 h-12 bg-gradient-to-br from-yellow-300 via-yellow-500 to-orange-600 rounded-full relative z-10 border border-yellow-200/30"
      >
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.5),transparent)] rounded-full" />
      </motion.div>

      {/* The Ring (Orange) */}
      <motion.div 
        animate={{ rotateX: [70, 70], rotateY: [0, 360] }}
        transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
        style={{ perspective: 1000, transformStyle: 'preserve-3d' }}
        className="absolute w-24 h-24 border-[4px] border-orange-500/90 rounded-full z-20"
      >
         <div className="absolute inset-[-2px] border-[2px] border-orange-400 blur-[1px] rounded-full" />
      </motion.div>

      {/* The Crown (Green) */}
      <motion.div 
        animate={{ y: -30 }}
        className="absolute z-30"
      >
        <div className="relative">
          <Crown size={24} className="text-emerald-400 fill-emerald-500/80 drop-shadow-[0_0_12px_#10b981]" />
        </div>
      </motion.div>

      {/* Sparkles */}
      <div className="absolute inset-0 overflow-hidden rounded-full">
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0, 1, 0],
              y: [0, -40],
              x: (i - 1) * 20
            }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
            className="absolute bottom-4 left-1/2 text-white/40"
          >
            <Sparkles size={8} />
          </motion.div>
        ))}
      </div>
    </div>
  );
}
