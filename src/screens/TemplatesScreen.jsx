import { motion } from 'framer-motion';
import { FileText, Search, Play, Star, Sparkles, Filter, Lock, Target, Activity } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { TEMPLATES } from '../utils/constants';
import useAppStore from '../store/useAppStore';

export default function TemplatesScreen() {
  const navigate = useNavigate();
  const { user } = useAppStore();

  const handleUseTemplate = (tpl) => {
    navigate('/generator', { state: { platform: tpl.platform, niche: tpl.niche } });
  };

  return (
    <div className="templates-module">
      <style>{`
        .templates-module {
          max-width: 1400px;
          margin: 0 auto;
          padding: 20px 40px;

          font-family: 'Outfit', sans-serif;
          color: #fff;
        }

        .header-section {
          margin-bottom: 40px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 30px;
        }

        @media (max-width: 900px) {
          .header-section {
            flex-direction: column;
            align-items: flex-start;
          }
        }

        .search-row {
          display: flex;
          gap: 12px;
          width: 100%;
          max-width: 500px;
        }

        .metallic-title {
          font-size: clamp(32px, 6vw, 64px);
          font-weight: 900;
          text-transform: uppercase;
          line-height: 1;
          background: linear-gradient(180deg, #FFF9C4 0%, #FFD700 40%, #B8860B 60%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 10px rgba(255, 138, 0, 0.3));
        }

        .search-row {
          display: flex;
          gap: 20px;
        }

        .search-wrapper {
          flex: 1;
          position: relative;
          padding: 1px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
        }

        .search-input {
          width: 100%;
          background: #0d0d0d !important;
          border: none !important;
          border-radius: 15px;
          padding: 15px 20px 15px 50px;
          color: #fff !important;
          font-size: 15px;
          outline: none !important;
        }

        .template-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
          width: 100%;
        }

        @media (max-width: 768px) {
          .template-grid {
            grid-template-columns: 1fr;
          }
        }

        .template-card-wrapper {
          position: relative;
          padding: 1px;
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.4s cubic-bezier(0.23, 1, 0.32, 1);
        }

        .template-card-wrapper:hover {
          background: linear-gradient(135deg, #FF0080, #7928ca);
          transform: translateY(-8px) scale(1.01);
          box-shadow: 0 30px 60px rgba(0, 0, 0, 0.6);
          z-index: 10;
        }

        .template-card-inner {
          background: #0a0a0c !important;
          border-radius: 27px;
          padding: 24px;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.03);
        }


        .pro-badge {
          position: absolute;
          top: 30px;
          right: 30px;
          padding: 4px 12px;
          background: rgba(255, 0, 128, 0.2);
          border: 1px solid rgba(255, 0, 128, 0.4);
          border-radius: 99px;
          font-size: 9px;
          font-weight: 900;
          color: #ff0080;
          letter-spacing: 0.1em;
        }

        .icon-box {
          width: 54px;
          height: 54px;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff0080;
          margin-bottom: 25px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .card-title {
          font-size: 20px;
          font-weight: 900;
          margin-bottom: 12px;
          color: #fff;
        }

        .tag-row {
          display: flex;
          gap: 8px;
          margin-bottom: 25px;
        }

        .tag {
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          padding: 4px 10px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.4);
        }

        .tag.niche {
          background: rgba(34, 211, 238, 0.1);
          border-color: rgba(34, 211, 238, 0.2);
          color: #22d3ee;
        }

        .preview-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 20px;
          font-size: 13px;
          line-height: 1.6;
          color: rgba(255, 255, 255, 0.4);
          font-style: italic;
          margin-bottom: 30px;
          flex: 1;
        }

        .use-btn {
          width: 100%;
          height: 54px;
          border-radius: 16px;
          border: none;
          background: #fff;
          color: #000;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
        }

        .use-btn:hover {
          transform: scale(1.02);
        }

        .use-btn.locked {
          background: rgba(255, 255, 255, 0.05);
          color: rgba(255, 255, 255, 0.2);
          cursor: not-allowed;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }
      `}</style>

      <header className="header-section">
        <div>
          <p style={{ color: '#ff0080', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '10px', marginBottom: '10px' }}>Biblioteca de Protocolos</p>
          <h1 className="metallic-title">Estratégias</h1>
        </div>
        
        <div className="search-row">
          <div className="search-wrapper">
             <Search style={{ position: 'absolute', left: '18px', top: '16px', color: 'rgba(255,255,255,0.2)' }} size={20} />
             <input className="search-input" placeholder="Buscar protocolos validados..." />
          </div>
          <button className="use-btn" style={{ width: '60px', background: 'rgba(255,255,255,0.03)', color: '#fff' }}><Filter size={20} /></button>
        </div>
      </header>

      <div className="template-grid">
        {TEMPLATES.map((tpl, i) => (
          <motion.div key={tpl.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="template-card-wrapper">
            <div className="template-card-inner">
              {tpl.isPro && <div className="pro-badge">PRO</div>}
              
              <div className="icon-box">
                {tpl.platform === 'instagram' ? <Sparkles size={24} /> : tpl.platform === 'whatsapp' ? <Play size={24} /> : <Target size={24} />}
              </div>

              <h3 className="card-title">{tpl.label}</h3>

              <div className="tag-row">
                <span className="tag">{tpl.platform}</span>
                <span className="tag niche">{tpl.niche}</span>
              </div>

              <div className="preview-box">
                "{tpl.preview}"
              </div>

              <button 
                onClick={() => handleUseTemplate(tpl)}
                disabled={tpl.isPro && user?.plan !== 'pro'}
                className={`use-btn ${tpl.isPro && user?.plan !== 'pro' ? 'locked' : ''}`}
              >
                {tpl.isPro && user?.plan !== 'pro' ? (
                  <><Lock size={14} /> BLOQUEADO</>
                ) : 'USAR PROTOCOLO'}
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
