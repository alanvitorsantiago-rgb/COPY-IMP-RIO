import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Instagram, MessageCircle, Twitter, ArrowRight, Activity, 
  Target, Zap, TrendingUp, ShieldCheck, Heart, Sparkles, LayoutDashboard
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { supabase } from '../utils/supabase';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#FF0080', desc: 'Legendas e anúncios virais' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25D366', desc: 'Scripts de vendas diretas' },
  { id: 'tiktok', label: 'TikTok', icon: Music2, color: '#00F2EA', desc: 'Roteiros de vídeos curtos' },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2', desc: 'Copywriting para ads' },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000', desc: 'Scripts de VSL e vídeo' },
  { id: 'email', label: 'E-mail', icon: Mail, color: '#FFA500', desc: 'Sequências de vendas' },
];

import { Music2, Facebook, Youtube, Mail } from 'lucide-react';

export default function DashboardScreen() {
  const { user } = useAppStore();
  const navigate = useNavigate();
  const [todayUsage, setTodayUsage] = useState(0);

  useEffect(() => {
    if (user?.id) {
      fetchTodayUsage();
    }
  }, [user]);

  const fetchTodayUsage = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    try {
      const { count, error } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());

      if (error) throw error;
      setTodayUsage(count || 0);
    } catch (error) {
      console.error('Error fetching usage:', error);
    }
  };

  const handlePlatformClick = (id) => {
    navigate('/generator', { state: { platform: id } });
  };

  return (
    <div className="dashboard-container">
      <style>{`
        .dashboard-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Outfit', sans-serif;
          color: #fff;
        }

        .dash-header {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-bottom: 60px;
        }

        .welcome-box {
          position: relative;
        }

        .command-tag {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: #FF0080;
          margin-bottom: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .command-tag::before {
          content: '';
          width: 20px;
          height: 1px;
          background: #FF0080;
        }

        .welcome-title {
          font-size: clamp(32px, 6vw, 64px);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 20px;
          color: #fff;
        }

        .user-name-metallic {
          background: linear-gradient(180deg, #FFF9C4 0%, #FFD700 40%, #B8860B 60%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 10px rgba(255, 138, 0, 0.3));
          text-transform: uppercase;
        }

        .stats-bar {
          display: flex;
          gap: 40px;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          padding: 25px 40px;
          border-radius: 24px;
          width: fit-content;
        }

        .stat-item {
          text-align: center;
        }

        .stat-label {
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.2);
          margin-bottom: 8px;
        }

        .stat-value {
          font-size: 24px;
          font-weight: 900;
          color: #fff;
        }

        .section-title-box {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 40px;
        }

        .section-title {
          font-size: 20px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.8);
        }

        .platform-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }

        .platform-card-wrapper {
          position: relative;
          padding: 1px;
          border-radius: 30px;
          background: linear-gradient(90deg, #ff0080, #7928ca, #22d3ee);
          background-size: 300% 300%;
          animation: flow 8s linear infinite;
          cursor: pointer;
          transition: transform 0.3s;
        }

        .platform-card-wrapper:hover {
          transform: translateY(-5px);
        }

        .platform-card-inner {
          background: #0d0d0d !important;
          border-radius: 29px;
          padding: 35px;
          height: 100%;
          position: relative;
          z-index: 1;
        }

        .icon-box {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 25px;
          border: 1px solid rgba(255, 255, 255, 0.05);
        }

        .card-label {
          font-size: 24px;
          font-weight: 900;
          margin-bottom: 10px;
          color: #fff;
        }

        .card-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.5;
          font-weight: 600;
        }

        .card-action {
          margin-top: 30px;
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: #FF0080;
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0;
          transform: translateX(-10px);
          transition: all 0.3s;
        }

        .platform-card-wrapper:hover .card-action {
          opacity: 1;
          transform: translateX(0);
        }

        @keyframes flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>

      <header className="dash-header">
        <div className="welcome-box">
          <div className="command-tag">Comando Central Ativado</div>
          <h1 className="welcome-title">
            Bem-vindo, <br />
            <span className="user-name-metallic">{user?.name}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '18px', fontWeight: 600 }}>
            Seu arsenal de inteligência está pronto para o combate.
          </p>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <p className="stat-label">Status Plano</p>
            <div style={{ background: 'rgba(34, 211, 238, 0.1)', color: '#22d3ee', padding: '4px 12px', borderRadius: '99px', fontSize: '11px', fontWeight: 900 }}>
              {user?.plan?.toUpperCase()}
            </div>
          </div>
          <div style={{ width: '1px', background: 'rgba(255,255,255,0.1)' }} />
          <div className="stat-item">
            <p className="stat-label">Cargas / Dia</p>
            <p className="stat-value">{todayUsage} <span style={{ color: 'rgba(255,255,255,0.1)' }}>/ 5</span></p>
          </div>
        </div>
      </header>

      <section>
        <div className="section-title-box">
          <Activity size={20} color="#FF0080" />
          <h2 className="section-title">Protocolos Disponíveis</h2>
        </div>

        <div className="platform-grid">
          {PLATFORMS.map((p) => (
            <div key={p.id} className="platform-card-wrapper" onClick={() => handlePlatformClick(p.id)}>
              <div className="platform-card-inner">
                <div className="icon-box" style={{ background: `${p.color}10`, color: p.color }}>
                  <p.icon size={28} />
                </div>
                <h3 className="card-label">{p.label}</h3>
                <p className="card-desc">{p.desc}</p>
                <div className="card-action">
                  Acessar Módulo <ArrowRight size={14} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
