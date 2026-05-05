import { motion } from 'framer-motion';

export default function Button({ 
  children, 
  onClick, 
  variant = 'primary', 
  className = '', 
  disabled = false, 
  type = 'button',
  loading = false
}) {
  const variants = {
    primary: 'bg-primary text-white shadow-lg',
    secondary: 'bg-secondary text-white shadow-lg',
    ghost: 'bg-white/5 text-white hover:bg-white/10 border border-white/10',
    outline: 'bg-transparent border border-white/20 text-white hover:border-primary hover:text-primary',
    danger: 'bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20'
  };

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.02, y: -2 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative overflow-hidden flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
        font-black text-sm transition-all duration-200 active:scale-95 uppercase tracking-widest
        ${variants[variant]}
        ${disabled ? 'opacity-40 cursor-not-allowed grayscale' : 'cursor-pointer'}
        ${className}
      `}
    >
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
          <span className="text-white">Aguarde...</span>
        </div>
      ) : children}
      
      {/* Gloss effect on hover */}
      {!disabled && !loading && (variant === 'primary' || variant === 'secondary') && (
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] hover:translate-x-[100%] transition-transform duration-1000" />
      )}
    </motion.button>
  );
}
