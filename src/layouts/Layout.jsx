import { Outlet } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar from '../components/Sidebar';
import useUIStore from '../store/useUIStore';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

export default function Layout() {
  const { toast, hideToast } = useUIStore();

  return (
    <div className="flex min-h-screen bg-black text-white selection:bg-pink-500/30 font-outfit overflow-hidden">
      
      {/* Universal Cinematic Background (Shared with Login) */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden scale-110">
        {/* Colorful Nebula Blobs */}
        <div className="absolute top-[-10%] left-[-5%] w-[60%] h-[70%] bg-[radial-gradient(circle_at_center,rgba(0,194,255,0.15)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[60%] h-[70%] bg-[radial-gradient(circle_at_center,rgba(158,0,255,0.15)_0%,transparent_70%)] blur-[100px]" />
        <div className="absolute top-[20%] right-[10%] w-[40%] h-[50%] bg-[radial-gradient(circle_at_center,rgba(255,138,0,0.1)_0%,transparent_70%)] blur-[120px]" />
        
        {/* Deep Black Vignette */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,black_100%)] opacity-80" />
        
        {/* Animated Noise Texture */}
        <motion.div 
          animate={{ opacity: [0.05, 0.1, 0.05] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] mix-blend-overlay opacity-10" 
        />
      </div>

      {/* Sidebar - Positioned Over Background */}
      <div className="relative z-50">
        <Sidebar />
      </div>
      
      {/* Main Content Area */}
      <main className="flex-1 relative z-10 p-6 md:p-10 lg:p-12 overflow-y-auto h-screen custom-scrollbar">
        <div className="max-w-7xl mx-auto pt-4 pb-20">
          <Outlet />
        </div>
      </main>

      {/* Modern Cinematic Toast Notification */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-10 right-10 z-[100] p-[1px] rounded-[24px] bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center gap-5 px-8 py-5 bg-[#0A0A0A] backdrop-blur-3xl rounded-[23px] min-w-[380px]">
              <div className="flex-shrink-0">
                {toast.type === 'success' && <CheckCircle className="text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]" size={28} />}
                {toast.type === 'error' && <AlertCircle className="text-pink-500 drop-shadow-[0_0_10px_rgba(236,72,153,0.5)]" size={28} />}
                {toast.type === 'info' && <Info className="text-purple-400 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]" size={28} />}
              </div>
              
              <div className="flex-1">
                 <p className="text-[11px] font-black uppercase tracking-[0.2em] text-white/40 mb-1">Notificação do Sistema</p>
                 <p className="text-sm font-bold text-white tracking-wide">{toast.message}</p>
              </div>

              <button 
                onClick={hideToast}
                className="p-2 hover:bg-white/10 rounded-xl transition-all hover:scale-110 active:scale-95"
              >
                <X size={18} className="text-white/30" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
