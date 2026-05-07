import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

export default function AIPrediction({ score = 80, radarData = [], tip = '' }) {
  // Axis: Psychology, Urgency, Clarity, Value, Social Proof
  const defaultData = [
    { subject: 'PSICOLOGIA', A: score - 5, fullMark: 100 },
    { subject: 'URGÊNCIA', A: score + 10, fullMark: 100 },
    { subject: 'CLAREZA', A: score - 15, fullMark: 100 },
    { subject: 'VALOR', A: score + 5, fullMark: 100 },
    { subject: 'PROVA', A: score - 10, fullMark: 100 },
  ];

  const chartData = radarData.length > 0 ? radarData : defaultData;


  return (
    <div className="ai-prediction-module">
      <style>{`
        .ai-prediction-module {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          font-family: 'Outfit', sans-serif;
        }

        .chart-container {
          width: 100%;
          height: 220px;
          position: relative;
          margin-bottom: 30px;
        }

        .score-overlay {
          position: absolute;
          inset: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          pointer-events: none;
          z-index: 10;
        }

        .score-value {
          font-size: 32px;
          font-weight: 900;
          color: #fff;
          line-height: 1;
        }

        .score-label {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #ff0080;
          margin-top: 5px;
        }

        .stats-grid {
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-top: 10px;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.03) !important;
          border: 1px solid rgba(255, 255, 255, 0.05) !important;
          border-radius: 16px;
          padding: 15px;
          text-align: center;
        }

        .stat-name {
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.3);
          margin-bottom: 5px;
        }

        .stat-status {
          font-size: 13px;
          font-weight: 900;
          text-transform: uppercase;
        }

        .status-high { color: #22d3ee; }
        .status-optimal { color: #ff0080; }
      `}</style>

      <div className="chart-container">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="65%" data={chartData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.05)" />
            <PolarAngleAxis 
              dataKey="subject" 
              tick={{ fill: 'rgba(255,255,255,0.2)', fontSize: 8, fontWeight: 700 }} 
            />
            <Radar
              name="Conversion"
              dataKey="A"
              stroke="#ff0080"
              fill="#ff0080"
              fillOpacity={0.2}
            />
          </RadarChart>
        </ResponsiveContainer>
        
        <div className="score-overlay">
          <motion.span 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="score-value"
          >
            {score}%
          </motion.span>
          <span className="score-label">Potencial</span>
        </div>
      </div>

      <div className="stats-grid">
         <div className="stat-card">
            <p className="stat-name">PROBABILIDADE</p>
            <p className="stat-status status-high">ALTA</p>
         </div>
         <div className="stat-card">
            <p className="stat-name">ESTABILIDADE</p>
            <p className="stat-status status-optimal">ÓTIMA</p>
         </div>
      </div>

      {tip && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            marginTop: '20px',
            padding: '12px 15px',
            background: 'rgba(255, 0, 128, 0.05)',
            border: '1px solid rgba(255, 0, 128, 0.1)',
            borderRadius: '12px',
            width: '100%',
            display: 'flex',
            gap: '10px'
          }}
        >
          <div style={{ color: '#ff0080', flexShrink: 0, marginTop: '2px' }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
          </div>
          <div>
            <p style={{ fontSize: '9px', fontWeight: 900, color: '#ff0080', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '4px' }}>Dica de Otimização</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.7)', lineHeight: 1.4, fontWeight: 500 }}>{tip}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

