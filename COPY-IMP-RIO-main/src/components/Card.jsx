import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = true }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className={`glass-card ${className} ${hover ? 'hover:scale-[1.01]' : ''}`}
    >
      {children}
    </motion.div>
  );
}
