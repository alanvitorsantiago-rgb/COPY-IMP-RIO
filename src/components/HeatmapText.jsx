import { motion } from 'framer-motion';

const POWER_WORDS = [
  'agora', 'hoje', 'últimas', 'vagas', 'limitado', 'grátis', 'exclusivo', 
  'transforme', 'conquiste', 'segredo', 'revelado', 'lucro', 'sucesso',
  'resultados', 'garantido', 'fácil', 'rápido', 'você', 'novo', 'incrível',
  'poderoso', 'clique', 'acesse', 'compre', 'aproveite'
];

export default function HeatmapText({ text }) {
  if (!text) return null;

  const words = text.split(/(\s+)/);

  return (
    <div className="heatmap-container">
      <style>{`
        .heatmap-container {
          width: 100%;
          line-height: 1.8;
          font-family: 'Outfit', sans-serif;
          color: rgba(255, 255, 255, 0.6);
          font-size: 16px;
          white-space: pre-wrap;
          font-weight: 500;
        }

        .power-word-box {
          position: relative;
          display: inline-block;
          margin: 0 1px;
          padding: 0 2px;
        }

        .power-word-text {
          position: relative;
          z-index: 2;
          color: #fff;
          font-weight: 800;
        }

        .power-word-glow {
          position: absolute;
          inset: 0;
          background: rgba(255, 0, 128, 0.15);
          border-bottom: 2px solid rgba(255, 0, 128, 0.4);
          border-radius: 4px;
          z-index: 1;
          filter: blur(1px);
        }
      `}</style>
      
      {words.map((word, i) => {
        const cleanWord = word.toLowerCase().replace(/[.,!?;:]/g, '').trim();
        const isPower = POWER_WORDS.includes(cleanWord);

        if (isPower) {
          return (
            <motion.span
              key={i}
              whileHover={{ scale: 1.05 }}
              className="power-word-box"
            >
              <span className="power-word-text">{word}</span>
              <div className="power-word-glow" />
            </motion.span>
          );
        }

        return <span key={i}>{word}</span>;
      })}
    </div>
  );
}
