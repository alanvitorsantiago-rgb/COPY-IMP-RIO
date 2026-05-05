import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { 
  Sparkles, Layers, MessageSquare, ChevronRight, Copy, Save, Check, RefreshCw, Zap, Activity, Dna, Target, ArrowRight
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import useUIStore from '../store/useUIStore';
import AIPrediction from '../components/AIPrediction';
import HeatmapText from '../components/HeatmapText';
import { PLATFORMS, TONES, EMOTIONAL_INTENTS, DAILY_LIMIT } from '../utils/constants';
import { supabase } from '../utils/supabase';

export default function GeneratorScreen() {
  const location = useLocation();
  const { user, addHistory, getTodayUsage } = useAppStore();
  const { showToast } = useUIStore();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const [formData, setFormData] = useState({
    platform: location.state?.platform || 'instagram',
    niche: '',
    product: '',
    audience: '',
    tone: 'persuasive',
    mode: 'viral',
    intent: 'curiosity'
  });

  const todayUsage = getTodayUsage();

  const handleGenerate = async () => {
    if (!formData.product || !formData.niche) {
      showToast('Por favor, preencha o produto e o nicho.', 'error');
      return;
    }

    if (todayUsage >= DAILY_LIMIT && user?.plan === 'free') {
      showToast('Limite diário atingido. Faça upgrade para continuar!', 'error');
      return;
    }

    setLoading(true);
    setStep(3);

    try {
      // 1. Call Generation API
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          mode: formData.mode,
          niche: formData.niche,
          tone: formData.tone,
          platform: formData.platform,
          topic: formData.product,
          intent: formData.intent,
          isPro: user?.plan === 'pro'
        })
      });

      if (!response.ok) throw new Error('Falha na geração das cópias.');

      const data = await response.json();
      
      // Data format from API: { copies: [ { copy, score } ] or [ string ] }
      const formattedResults = data.copies.map((c, idx) => ({
        id: Date.now() + idx,
        text: typeof c === 'object' ? c.copy : c,
        score: typeof c === 'object' ? c.score : (85 + Math.floor(Math.random() * 10))
      }));

      setResults(formattedResults);

      // 2. Save to Supabase (if logged in)
      if (user?.id) {
        const generationsToInsert = formattedResults.map(res => ({
          user_id: user.id,
          content: res.text,
          platform: formData.platform,
          tone: formData.tone,
          niche: formData.niche,
          is_favorite: false
        }));

        const { error: dbError } = await supabase
          .from('generations')
          .insert(generationsToInsert);

        if (dbError) console.error('Error saving to DB:', dbError);
      }

      // 3. Update local state (legacy support)
      addHistory({
        ...formData,
        date: new Date().toLocaleDateString(),
        copies: formattedResults.map(r => r.text)
      });

      showToast('Copies geradas com sucesso!', 'success');
    } catch (error) {
      console.error(error);
      showToast(error.message || 'Erro ao gerar cópias.', 'error');
      setStep(2); // Go back if error
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Copiado para a área de transferência!', 'success');
  };

  return (
    <div className="generator-module">
      <style>{`
        .generator-module {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Outfit', sans-serif;
          color: #fff;
        }

        .gen-header {
          margin-bottom: 60px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
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

        .step-pill-box {
          display: flex;
          gap: 8px;
          background: rgba(255, 255, 255, 0.03);
          padding: 10px;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .step-pill {
          height: 4px;
          border-radius: 2px;
          transition: all 0.5s;
        }

        .form-card {
          background: #0d0d0d !important;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 40px;
          padding: 50px;
          box-shadow: 0 40px 80px rgba(0, 0, 0, 0.5);
          max-width: 600px;
        }

        .input-group {
          margin-bottom: 30px;
        }

        .input-label {
          display: block;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.3);
          margin-bottom: 12px;
          padding-left: 5px;
        }

        .neon-input-wrapper {
          position: relative;
          padding: 1px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.3s;
        }

        .neon-input-wrapper:focus-within {
          background: linear-gradient(90deg, #ff0080, #7928ca, #22d3ee);
          box-shadow: 0 0 20px rgba(121, 40, 202, 0.3);
        }

        .cyber-input {
          width: 100%;
          background: #050507 !important;
          border: none !important;
          border-radius: 15px;
          padding: 18px 25px;
          color: #fff !important;
          font-size: 15px;
          font-weight: 600;
          outline: none !important;
        }

        .next-btn {
          width: 100%;
          height: 64px;
          background: #fff;
          color: #000;
          border: none;
          border-radius: 20px;
          font-size: 14px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: all 0.3s;
        }

        .next-btn:hover {
          transform: scale(1.02);
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.1);
        }

        .result-card-wrapper {
          position: relative;
          padding: 1px;
          border-radius: 40px;
          background: rgba(255, 255, 255, 0.05);
          margin-bottom: 40px;
        }

        .result-card-inner {
          background: #0d0d0d !important;
          border-radius: 39px;
          padding: 40px;
        }

        .copy-output-box {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 30px;
          margin: 30px 0;
          color: #fff;
          font-size: 16px;
          line-height: 1.6;
          font-weight: 500;
        }

        .score-badge {
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid rgba(34, 211, 238, 0.2);
          padding: 8px 15px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .score-value {
          font-size: 14px;
          font-weight: 900;
          color: #22d3ee;
        }
      `}</style>

      <header className="gen-header">
        <div>
          <p style={{ color: '#ff0080', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '10px', marginBottom: '10px' }}>Arquitetura de Conversão</p>
          <h1 className="metallic-title">Gerador IA</h1>
        </div>
        <div className="step-pill-box">
          {[1, 2, 3].map(s => (
            <div 
              key={s} 
              className="step-pill" 
              style={{ 
                width: step === s ? '40px' : '10px', 
                background: step === s ? '#ff0080' : 'rgba(255,255,255,0.1)',
                boxShadow: step === s ? '0 0 10px #ff0080' : 'none'
              }} 
            />
          ))}
        </div>
      </header>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="form-card">
              <div className="input-group">
                <label className="input-label">Plataforma</label>
                <div className="neon-input-wrapper">
                  <select className="cyber-input" value={formData.platform} onChange={(e) => setFormData({...formData, platform: e.target.value})}>
                    {PLATFORMS.map(p => <option key={p.id} value={p.id} style={{ background: '#050507' }}>{p.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Nicho de Atuação</label>
                <div className="neon-input-wrapper">
                  <input className="cyber-input" placeholder="Ex: Emagrecimento, Dropshipping..." value={formData.niche} onChange={(e) => setFormData({...formData, niche: e.target.value})} />
                </div>
              </div>
              <div className="input-group">
                <label className="input-label">Nome do Produto</label>
                <div className="neon-input-wrapper">
                  <input className="cyber-input" placeholder="Ex: Método Seca Barriga" value={formData.product} onChange={(e) => setFormData({...formData, product: e.target.value})} />
                </div>
              </div>
              <button onClick={() => setStep(2)} className="next-btn">Próximo Passo <ChevronRight size={20} /></button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
            <div className="form-card">
              <div className="input-group">
                <label className="input-label">Público Alvo</label>
                <div className="neon-input-wrapper">
                  <input className="cyber-input" placeholder="Ex: Mães 30+ ansiosas" value={formData.audience} onChange={(e) => setFormData({...formData, audience: e.target.value})} />
                </div>
              </div>
              <div className="input-group" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="input-label">Tom de Voz</label>
                  <div className="neon-input-wrapper">
                    <select className="cyber-input" value={formData.tone} onChange={(e) => setFormData({...formData, tone: e.target.value})}>
                      {TONES.map(t => <option key={t.id} value={t.id} style={{ background: '#050507' }}>{t.label}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="input-label">Gatilho</label>
                  <div className="neon-input-wrapper">
                    <select className="cyber-input" value={formData.intent} onChange={(e) => setFormData({...formData, intent: e.target.value})}>
                      {EMOTIONAL_INTENTS.map(i => <option key={i.id} value={i.id} style={{ background: '#050507' }}>{i.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '20px', marginTop: '10px' }}>
                <button onClick={() => setStep(1)} style={{ flex: 1, height: '64px', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Voltar</button>
                <button onClick={handleGenerate} style={{ flex: 2, height: '64px', borderRadius: '20px', border: 'none', background: 'linear-gradient(90deg, #ff0080, #7928ca)', color: '#fff', cursor: 'pointer', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', boxShadow: '0 10px 30px rgba(255, 0, 128, 0.3)' }}>Gerar Copy</button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
             {loading ? (
               <div style={{ padding: '100px', textAlign: 'center' }}>
                 <div style={{ width: '80px', height: '80px', border: '8px solid rgba(255,255,255,0.05)', borderTopColor: '#ff0080', borderRadius: '50%', margin: '0 auto 40px', animation: 'spin 1s linear infinite' }} />
                 <h2 style={{ fontSize: '32px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em' }}>Processando DNA...</h2>
                 <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
               </div>
             ) : (
               <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '40px' }}>
                 <div className="results-list">
                    {results.map((res, i) => (
                      <div key={res.id} className="result-card-wrapper">
                        <div className="result-card-inner">
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                              <div style={{ width: '50px', height: '50px', borderRadius: '15px', background: 'rgba(34, 211, 238, 0.1)', display: 'flex', alignItems: 'center', justifyCenter: 'center', color: '#22d3ee', display: 'flex', justifyContent: 'center' }}>
                                <Target size={24} />
                              </div>
                              <p style={{ fontWeight: 900, fontSize: '18px' }}>Variação #{i+1}</p>
                            </div>
                            <div style={{ display: 'flex', gap: '10px' }}>
                              <button onClick={() => copyToClipboard(res.text)} style={{ width: '44px', height: '44px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Copy size={20} /></button>
                            </div>
                          </div>
                          
                          <div className="copy-output-box">
                            <HeatmapText text={res.text} />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                             <div className="score-badge">
                                <Activity size={16} color="#22d3ee" />
                                <span className="score-value">Score: {res.score}%</span>
                             </div>
                             <button style={{ background: 'transparent', border: 'none', color: '#ff0080', fontWeight: 900, fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                               <Dna size={18} /> Mutação Genética
                             </button>
                          </div>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setStep(1)} style={{ width: '100%', padding: '40px', border: '2px dashed rgba(255,255,255,0.1)', borderRadius: '40px', background: 'transparent', color: 'rgba(255,255,255,0.3)', fontWeight: 900, fontSize: '16px', textTransform: 'uppercase', letterSpacing: '0.2em', cursor: 'pointer' }}>Gerar Novas Variações</button>
                 </div>
                 <div className="sidebar-stats">
                    <div className="form-card" style={{ padding: '30px', width: '100%', marginBottom: '30px' }}>
                       <h3 style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: '30px' }}>Performance IA</h3>
                       <AIPrediction />
                    </div>
                    <div className="form-card" style={{ padding: '30px', width: '100%', background: 'linear-gradient(135deg, rgba(255,0,128,0.1), transparent)' }}>
                       <Zap size={32} color="#ff0080" style={{ marginBottom: '20px' }} />
                       <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '10px' }}>Upgrade PRO</h3>
                       <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', lineHeight: '1.5' }}>Desbloqueie o motor Omega para gerar variações ilimitadas.</p>
                       <button onClick={() => navigate('/upgrade')} style={{ width: '100%', height: '50px', borderRadius: '15px', border: 'none', background: '#fff', color: '#000', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px', letterSpacing: '0.1em', cursor: 'pointer' }}>Ver Vantagens</button>
                    </div>
                 </div>
               </div>
             )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
