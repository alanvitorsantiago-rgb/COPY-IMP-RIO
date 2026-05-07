import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Check, Sparkles, ShieldCheck, Rocket, Infinity, Activity, Lock, Calendar, Star } from 'lucide-react';
import useAppStore from '../store/useAppStore';

export default function UpgradeScreen() {
  const { user } = useAppStore();
  const [billingCycle, setBillingCycle] = useState('monthly'); // 'monthly' or 'annual'
  const isPro = user?.plan === 'pro';

  const [loading, setLoading] = useState(false);

  const handleUpgrade = async (planType) => {
    setLoading(true);
    try {
      const response = await fetch('/api/create-preference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.email,
          userName: user?.name,
          planType: planType,
          userId: user?.id
        }),

      });

      const data = await response.json();

      if (data.init_point) {
        window.location.href = data.init_point;
      } else {
        alert('Erro ao iniciar pagamento. Tente novamente mais tarde.');
        console.error('API Error:', data);
      }
    } catch (err) {
      console.error('Checkout error:', err);
      alert('Erro de conexão. Verifique sua internet.');
    } finally {
      setLoading(false);
    }
  };


  const features = [
    { icon: Infinity, text: 'Gerações Ilimitadas de Alta Precisão' },
    { icon: Sparkles, text: 'Acesso ao Protocolo Omega (IA Elite)' },
    { icon: Rocket, text: 'Velocidade de Processamento Prioritária' },
    { icon: ShieldCheck, text: 'Proteção de Criativos & Criptografia' },
    { icon: Zap, text: 'Atualizações Mensais de Estratégias' },
  ];

  return (
    <div className="upgrade-module">
      <style>{`
        .upgrade-module {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Outfit', sans-serif;
          color: #fff;
        }

        .upgrade-header {
          text-align: center;
          margin-bottom: 60px;
        }

        .metallic-title {
          font-size: clamp(35px, 7vw, 80px);
          font-weight: 900;
          text-transform: uppercase;
          line-height: 1;
          margin-bottom: 20px;
          background: linear-gradient(180deg, #FFF9C4 0%, #FFD700 40%, #B8860B 60%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 15px rgba(255, 138, 0, 0.3));
        }

        /* Billing Switcher */
        .billing-switcher {
          display: flex;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 6px;
          border-radius: 99px;
          width: fit-content;
          margin: 0 auto 50px;
          position: relative;
        }

        .switch-btn {
          padding: 10px 25px;
          border-radius: 99px;
          border: none;
          background: transparent;
          color: rgba(255, 255, 255, 0.4);
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.3s;
          position: relative;
          z-index: 2;
        }

        .switch-btn.active {
          color: #fff;
        }

        .switch-bg {
          position: absolute;
          height: calc(100% - 12px);
          top: 6px;
          background: #ff0080;
          border-radius: 99px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          z-index: 1;
          box-shadow: 0 0 15px rgba(255, 0, 128, 0.4);
        }

        .upgrade-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          max-width: 1100px;
          margin: 0 auto;
        }

        .card-wrapper {
          position: relative;
          padding: 1px;
          border-radius: 40px;
          background: rgba(255, 255, 255, 0.05);
          transition: all 0.5s;
        }

        .card-wrapper.active {
          background: linear-gradient(135deg, #FF0080, #7928ca, #22d3ee);
          box-shadow: 0 0 40px rgba(121, 40, 202, 0.15);
        }

        .card-inner {
          background: #050507 !important;
          border-radius: 39px;
          padding: 45px 35px;
          height: 100%;
          display: flex;
          flex-direction: column;
          position: relative;
          overflow: hidden;
        }

        .card-tag {
          position: absolute;
          top: 25px;
          right: 25px;
          padding: 5px 12px;
          background: rgba(34, 211, 238, 0.1);
          border: 1px solid rgba(34, 211, 238, 0.3);
          border-radius: 99px;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #22d3ee;
        }

        .card-label {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: #ff0080;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .card-price {
          font-size: 42px;
          font-weight: 900;
          color: #fff;
          display: flex;
          align-items: baseline;
          gap: 8px;
          margin-bottom: 5px;
        }

        .price-old {
          text-decoration: line-through;
          color: rgba(255, 255, 255, 0.15);
          font-size: 18px;
          font-weight: 700;
        }

        .price-sub {
          font-size: 13px;
          color: rgba(255, 255, 255, 0.3);
          font-weight: 700;
        }

        .feature-list {
          list-style: none;
          padding: 0;
          margin: 40px 0;
          flex: 1;
        }

        .feature-item {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          font-size: 13px;
          font-weight: 700;
          color: rgba(255, 255, 255, 0.7);
        }

        .feature-icon {
          width: 22px;
          height: 22px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 7px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ff0080;
        }

        .upgrade-btn {
          width: 100%;
          height: 60px;
          border-radius: 18px;
          border: none;
          background: #fff;
          color: #000 !important;
          font-size: 12px;
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

        .card-wrapper.active .upgrade-btn {
          background: linear-gradient(90deg, #22d3ee, #7928ca, #FF0080);
          background-size: 200% auto;
          color: #fff !important;
          animation: flow 4s linear infinite;
        }

        @keyframes flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }

        .savings-badge {
          background: #25d366;
          color: #000;
          font-size: 9px;
          font-weight: 900;
          padding: 3px 8px;
          border-radius: 5px;
          margin-left: 10px;
        }

        .footer-note {
          text-align: center;
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.15);
          margin-top: 20px;
        }
      `}</style>

      <header className="upgrade-header">
        <p style={{ color: '#ff0080', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '10px', marginBottom: '15px' }}>Oferta de Lançamento</p>
        <h1 className="metallic-title">Escolha seu Poder</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '17px', maxWidth: '600px', margin: '0 auto', lineHeight: '1.6' }}>
          Menos que um café por dia para ter a IA mais poderosa do mercado trabalhando por você.
        </p>
      </header>

      <div className="billing-switcher">
        <div className="switch-bg" style={{ 
          width: billingCycle === 'monthly' ? '110px' : '100px', 
          left: billingCycle === 'monthly' ? '6px' : '116px' 
        }} />
        <button className={`switch-btn ${billingCycle === 'monthly' ? 'active' : ''}`} onClick={() => setBillingCycle('monthly')}>Mensal</button>
        <button className={`switch-btn ${billingCycle === 'annual' ? 'active' : ''}`} onClick={() => setBillingCycle('annual')}>Anual</button>
      </div>

      <div className="upgrade-grid">
        {/* Free Plan */}
        <div className="card-wrapper" style={{ opacity: 0.4, filter: 'grayscale(1)' }}>
          <div className="card-inner">
            <div className="card-label">
              <Activity size={14} /> CORE_BASE_v1
            </div>
            <div className="card-price">GRÁTIS</div>
            <ul className="feature-list">
              <li className="feature-item"><Check size={14} /> 5 Gerações / Dia</li>
              <li className="feature-item"><Check size={14} /> Biblioteca Básica</li>
              <li className="feature-item" style={{ opacity: 0.2 }}><Lock size={14} /> Predição Neural</li>
              <li className="feature-item" style={{ opacity: 0.2 }}><Lock size={14} /> Protocolo Omega</li>
            </ul>
            <button disabled className="upgrade-btn">Módulo Ativo</button>
          </div>
        </div>

        {/* Pro Plan */}
        <div className="card-wrapper active">
          <div className="card-inner">
            <div className="card-tag">Recomendado</div>
            <div className="card-label">
              <Zap size={14} /> Protocolo_Omega
            </div>
            
            <div className="card-price">
              <span className="price-old">
                {billingCycle === 'monthly' ? 'R$ 97' : 'R$ 497'}
              </span>
              {billingCycle === 'monthly' ? (
                <>R$ 24,90 <span className="price-sub">/ MÊS</span></>
              ) : (
                <>R$ 197 <span className="price-sub">/ ANO</span> <span className="savings-badge">ECONOMIZE 60%</span></>
              )}
            </div>

            
            <p style={{ color: '#25d366', fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '-20px', marginTop: '5px' }}>
              {billingCycle === 'monthly' ? 'Acesso imediato e vitalício à versão 4.0' : 'Melhor custo-benefício p/ profissionais'}
            </p>

            <ul className="feature-list">
              {features.map((f, i) => (
                <li key={i} className="feature-item">
                  <div className="feature-icon"><f.icon size={12} /></div>
                  {f.text}
                </li>
              ))}
            </ul>
            
            <button onClick={() => handleUpgrade(billingCycle)} disabled={isPro || loading} className="upgrade-btn">
              {loading ? 'PROCESSANDO...' : (isPro ? 'System Optimized' : (billingCycle === 'monthly' ? 'Ativar Mensal' : 'Ativar Anual PRO'))}
            </button>

            <p className="footer-note">Garantia de 7 dias // Mercado Pago</p>
          </div>
        </div>

        {/* Agency / Lifetime Plan */}
        <div className="card-wrapper active" style={{ 
          background: 'linear-gradient(135deg, #FFD700, #B8860B, #FFD700)',
          boxShadow: '0 0 50px rgba(184, 134, 11, 0.2)'
        }}>
          <div className="card-inner" style={{ border: '1px solid rgba(255, 215, 0, 0.1)' }}>
             <div className="card-tag" style={{ background: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', borderColor: 'rgba(255, 215, 0, 0.3)' }}>LIFETIME ACCESS</div>
             <div className="card-label" style={{ color: '#FFD700' }}>
                <Star size={14} fill="#FFD700" /> EMPIRE_LIFETIME_v2
             </div>
             
             <div className="card-price">
                <span className="price-old">R$ 1.997</span>
                R$ 497 <span className="price-sub">/ ÚNICO</span>
             </div>

             <div style={{ 
               background: 'rgba(255, 215, 0, 0.05)', 
               padding: '10px', 
               borderRadius: '12px', 
               marginTop: '15px',
               border: '1px dashed rgba(255, 215, 0, 0.3)'
             }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', marginBottom: '5px', color: '#FFD700' }}>
                  <span>Vagas Limitadas</span>
                  <span>12/100 DISPONÍVEIS</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '12%' }}
                    transition={{ duration: 2, delay: 0.5 }}
                    style={{ height: '100%', background: '#FFD700' }} 
                  />
                </div>
             </div>

             <ul className="feature-list" style={{ marginTop: '30px' }}>
                <li className="feature-item"><Check size={14} color="#FFD700" /> Acesso Vitalício (Sem Mensalidades)</li>
                <li className="feature-item"><Check size={14} color="#FFD700" /> Dashboard para 5 Sub-contas</li>
                <li className="feature-item"><Check size={14} color="#FFD700" /> Suporte VIP via WhatsApp</li>
                <li className="feature-item"><Check size={14} color="#FFD700" /> Treinamento: "Império de Vendas"</li>
                <li className="feature-item"><Check size={14} color="#FFD700" /> White-label (Sua Marca na IA)</li>
             </ul>

             <button onClick={() => handleUpgrade('lifetime')} disabled={loading} className="upgrade-btn" style={{ 
               background: 'linear-gradient(90deg, #B8860B, #FFD700, #B8860B)', 
               backgroundSize: '200% auto',
               color: '#000 !important',
               animation: 'flow 3s linear infinite'
             }}>
                {loading ? 'PROCESSANDO...' : 'RESERVAR MINHA VAGA'}
             </button>
             <p className="footer-note" style={{ color: 'rgba(255, 215, 0, 0.4)' }}>Oferta única de upgrade vitalício</p>
          </div>
        </div>

      </div>
    </div>
  );
}
