import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  Instagram, MessageCircle, Twitter, ArrowRight, Activity,
  Target, Zap, TrendingUp, ShieldCheck, Heart, Sparkles,
  Music2, Facebook, Youtube, Mail, Crown, Clock, Flame,
  BarChart2, BookOpen, ChevronRight
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { supabase } from '../utils/supabase';

const PLATFORMS = [
  { id: 'instagram', label: 'Instagram', icon: Instagram, color: '#FF0080', desc: 'Legendas e anúncios virais', tag: 'Mais usado' },
  { id: 'whatsapp', label: 'WhatsApp', icon: MessageCircle, color: '#25D366', desc: 'Scripts de vendas diretas', tag: 'Hot' },
  { id: 'tiktok', label: 'TikTok', icon: Music2, color: '#00F2EA', desc: 'Roteiros de vídeos curtos', tag: null },
  { id: 'facebook', label: 'Facebook', icon: Facebook, color: '#1877F2', desc: 'Copywriting para ads', tag: null },
  { id: 'youtube', label: 'YouTube', icon: Youtube, color: '#FF0000', desc: 'Scripts de VSL e vídeo', tag: 'PRO' },
  { id: 'email', label: 'E-mail', icon: Mail, color: '#FFA500', desc: 'Sequências de vendas', tag: 'PRO' },
];

const QUICK_ACTIONS = [
  { label: 'Gerador', icon: Zap, path: '/generator', color: '#FF0080' },
  { label: 'Biblioteca', icon: BookOpen, path: '/library', color: '#7928ca' },
  { label: 'Upgrade', icon: Crown, path: '/upgrade', color: '#FFD700' },
  { label: 'Templates', icon: Sparkles, path: '/templates', color: '#22d3ee' },
];

export default function DashboardScreen() {
  const { user } = useAppStore();
  const navigate = useNavigate();
  const [todayUsage, setTodayUsage] = useState(0);
  const isPro = user?.plan === 'pro' || user?.plan === 'lifetime';
  const dailyLimit = isPro ? '∞' : 5;
  const usagePct = isPro ? 100 : Math.min((todayUsage / 5) * 100, 100);

  useEffect(() => {
    if (user?.id) fetchTodayUsage();
  }, [user]);

  const fetchTodayUsage = async () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    try {
      const { count } = await supabase
        .from('generations')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', user.id)
        .gte('created_at', today.toISOString());
      setTodayUsage(count || 0);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="dash-root">
      <style>{`
        .dash-root {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px 80px;
          font-family: 'Outfit', sans-serif;
          color: #fff;
        }

        /* ---- HEADER ---- */
        .dash-header-grid {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: end;
          gap: 30px;
          margin-bottom: 40px;
        }
        @media (max-width: 700px) {
          .dash-header-grid { grid-template-columns: 1fr; }
        }

        .command-tag {
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: #FF0080;
          margin-bottom: 12px;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .command-tag::before {
          content: '';
          width: 20px;
          height: 1px;
          background: #FF0080;
        }

        .welcome-title {
          font-size: clamp(30px, 5vw, 54px);
          font-weight: 900;
          line-height: 1.1;
          margin-bottom: 12px;
        }
        .name-gold {
          background: linear-gradient(180deg, #FFF9C4 0%, #FFD700 40%, #B8860B 60%, #FFD700 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0 0 10px rgba(255,138,0,0.3));
          text-transform: uppercase;
        }

        /* ---- STAT PANEL ---- */
        .stat-panel {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 22px;
          padding: 22px 28px;
          min-width: 220px;
        }
        .stat-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          gap: 10px;
        }
        .stat-lbl { font-size: 9px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.2em; color: rgba(255,255,255,0.25); }
        .stat-val { font-size: 22px; font-weight: 900; color: #fff; }
        .usage-track {
          height: 4px;
          background: rgba(255,255,255,0.05);
          border-radius: 99px;
          overflow: hidden;
          margin-top: 8px;
        }
        .usage-fill {
          height: 100%;
          border-radius: 99px;
          transition: width 1s cubic-bezier(0.4,0,0.2,1);
        }

        /* ---- QUICK ACTIONS ---- */
        .quick-row {
          display: flex;
          gap: 12px;
          margin-bottom: 48px;
          flex-wrap: wrap;
        }
        .quick-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 10px 18px;
          border-radius: 12px;
          background: rgba(255,255,255,0.03);
          border: 1px solid rgba(255,255,255,0.07);
          color: rgba(255,255,255,0.6);
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.25s;
        }
        .quick-btn:hover {
          background: rgba(255,255,255,0.07);
          border-color: rgba(255,255,255,0.15);
          color: #fff;
          transform: translateY(-2px);
        }

        /* ---- SECTION ---- */
        .section-hd {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 24px;
        }
        .section-title {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.25em;
          color: rgba(255,255,255,0.4);
        }
        .section-dot {
          width: 6px; height: 6px; border-radius: 50%;
          background: #FF0080;
          animation: pulse-dot 2s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%,100% { opacity:1; transform:scale(1); }
          50% { opacity:0.4; transform:scale(0.7); }
        }

        /* ---- PLATFORM GRID ---- */
        .platform-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 16px;
          margin-bottom: 48px;
        }
        @media (max-width: 900px) { .platform-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 580px) { .platform-grid { grid-template-columns: 1fr; } }

        .p-card {
          position: relative;
          padding: 1px;
          border-radius: 22px;
          background: rgba(255,255,255,0.05);
          cursor: pointer;
          transition: all 0.3s;
          overflow: hidden;
        }
        .p-card::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--card-grad);
          opacity: 0;
          transition: opacity 0.4s;
          border-radius: 22px;
        }
        .p-card:hover::before { opacity: 1; }
        .p-card:hover { transform: translateY(-4px); box-shadow: 0 20px 50px rgba(0,0,0,0.4); }

        .p-card-inner {
          background: #0c0c12;
          border-radius: 21px;
          padding: 24px;
          display: flex;
          flex-direction: column;
          gap: 14px;
          height: 100%;
          position: relative;
          z-index: 1;
        }

        .p-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }
        .p-icon {
          width: 48px; height: 48px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }
        .p-badge {
          font-size: 8px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 0.1em;
          padding: 3px 8px; border-radius: 6px;
        }
        .p-label {
          font-size: 17px; font-weight: 900; color: #fff;
        }
        .p-desc {
          font-size: 12px; font-weight: 600;
          color: rgba(255,255,255,0.35); line-height: 1.5;
        }
        .p-action {
          font-size: 9px; font-weight: 900;
          text-transform: uppercase; letter-spacing: 0.2em;
          display: flex; align-items: center; gap: 6px;
          opacity: 0; transform: translateX(-8px);
          transition: all 0.3s;
          margin-top: auto;
        }
        .p-card:hover .p-action { opacity: 1; transform: translateX(0); }

        /* ---- BOTTOM GRID ---- */
        .bottom-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 16px;
        }
        @media (max-width: 700px) { .bottom-grid { grid-template-columns: 1fr; } }

        .info-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 22px;
          padding: 24px;
        }

        .tip-item {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .tip-item:last-child { border-bottom: none; padding-bottom: 0; }
        .tip-icon {
          width: 32px; height: 32px; border-radius: 10px;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
        }

        @keyframes flow {
          0% { background-position: 0% 50%; }
          100% { background-position: 300% 50%; }
        }
      `}</style>

      {/* ── HEADER ── */}
      <motion.div className="dash-header-grid" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <div className="command-tag">Comando Central Ativado</div>
          <h1 className="welcome-title">
            Olá, <span className="name-gold">{user?.name?.split(' ')[0]}</span> 👋
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '15px', fontWeight: 600 }}>
            Seu arsenal de IA está pronto. Escolha o protocolo e converta.
          </p>
        </div>

        <div className="stat-panel">
          <div className="stat-row">
            <span className="stat-lbl">Plano Ativo</span>
            <span style={{
              background: isPro ? 'rgba(255,215,0,0.1)' : 'rgba(255,255,255,0.06)',
              color: isPro ? '#FFD700' : 'rgba(255,255,255,0.4)',
              border: `1px solid ${isPro ? 'rgba(255,215,0,0.3)' : 'rgba(255,255,255,0.08)'}`,
              padding: '3px 10px', borderRadius: '99px',
              fontSize: '9px', fontWeight: 900, textTransform: 'uppercase',
              display: 'flex', alignItems: 'center', gap: '5px'
            }}>
              {isPro && <Crown size={10} fill="currentColor" />} {user?.plan?.toUpperCase() || 'FREE'}
            </span>
          </div>
          <div className="stat-row" style={{ marginBottom: '6px' }}>
            <span className="stat-lbl">Gerações Hoje</span>
            <span className="stat-val">{todayUsage} <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.2)', fontWeight: 700 }}>/ {dailyLimit}</span></span>
          </div>
          <div className="usage-track">
            <motion.div
              className="usage-fill"
              initial={{ width: 0 }}
              animate={{ width: `${isPro ? 100 : usagePct}%` }}
              transition={{ duration: 1, delay: 0.3 }}
              style={{
                background: isPro
                  ? 'linear-gradient(90deg, #FFD700, #B8860B)'
                  : usagePct >= 80
                    ? 'linear-gradient(90deg, #ff4444, #ff0080)'
                    : 'linear-gradient(90deg, #ff0080, #7928ca)'
              }}
            />
          </div>
          <p style={{ fontSize: '9px', color: 'rgba(255,255,255,0.2)', fontWeight: 700, marginTop: '6px' }}>
            {isPro ? 'Gerações ilimitadas ativas' : `${5 - todayUsage} gerações restantes hoje`}
          </p>
        </div>
      </motion.div>

      {/* ── QUICK ACTIONS ── */}
      <motion.div className="quick-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        {QUICK_ACTIONS.map(({ label, icon: Icon, path, color }) => (
          <button key={label} className="quick-btn" onClick={() => navigate(path)}
            style={{ '--hover-color': color }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = `${color}40`; e.currentTarget.querySelector('svg').style.color = color; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.querySelector('svg').style.color = 'rgba(255,255,255,0.4)'; }}
          >
            <Icon size={14} style={{ color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s' }} />
            {label}
          </button>
        ))}
      </motion.div>

      {/* ── PLATFORM GRID ── */}
      <section style={{ marginBottom: '48px' }}>
        <div className="section-hd">
          <div className="section-title">
            <span className="section-dot" />
            Protocolos Disponíveis
          </div>
          <button onClick={() => navigate('/generator')}
            style={{ background: 'none', border: 'none', color: '#FF0080', fontSize: '11px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '5px' }}>
            Ver Todos <ChevronRight size={14} />
          </button>
        </div>

        <div className="platform-grid">
          {PLATFORMS.map((p, i) => (
            <motion.div
              key={p.id}
              className="p-card"
              style={{ '--card-grad': `linear-gradient(135deg, ${p.color}60, transparent)` }}
              onClick={() => navigate('/generator', { state: { platform: p.id } })}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * i }}
            >
              <div className="p-card-inner">
                <div className="p-top">
                  <div className="p-icon" style={{ background: `${p.color}12`, color: p.color }}>
                    <p.icon size={22} />
                  </div>
                  {p.tag && (
                    <span className="p-badge" style={{
                      background: p.tag === 'PRO' ? 'rgba(255,215,0,0.1)' : p.tag === 'Hot' ? 'rgba(255,0,128,0.1)' : 'rgba(34,211,238,0.1)',
                      color: p.tag === 'PRO' ? '#FFD700' : p.tag === 'Hot' ? '#FF0080' : '#22d3ee',
                      border: `1px solid ${p.tag === 'PRO' ? 'rgba(255,215,0,0.25)' : p.tag === 'Hot' ? 'rgba(255,0,128,0.25)' : 'rgba(34,211,238,0.25)'}`,
                    }}>
                      {p.tag === 'PRO' ? '👑 PRO' : p.tag === 'Hot' ? '🔥 Hot' : p.tag}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="p-label">{p.label}</h3>
                  <p className="p-desc">{p.desc}</p>
                </div>
                <div className="p-action" style={{ color: p.color }}>
                  Acessar Módulo <ArrowRight size={12} />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BOTTOM ── */}
      <div className="bottom-grid">

        {/* Dicas de Uso */}
        <motion.div className="info-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <div className="section-title" style={{ marginBottom: '20px' }}>
            <Flame size={14} color="#FF0080" />
            Estratégias de Alto Impacto
          </div>
          {[
            { icon: Target, color: '#FF0080', title: 'Gatilho da Escassez', sub: 'Use "Últimas vagas" no WhatsApp para aumentar urgência.' },
            { icon: Heart, color: '#7928ca', title: 'Copy Emocional', sub: 'Stories no Instagram convertem mais com emoção real.' },
            { icon: TrendingUp, color: '#22d3ee', title: 'VSL de Vendas', sub: 'YouTube + vídeo longo = maior ticket médio no funil.' },
          ].map(({ icon: Icon, color, title, sub }) => (
            <div key={title} className="tip-item">
              <div className="tip-icon" style={{ background: `${color}10` }}>
                <Icon size={16} color={color} />
              </div>
              <div>
                <p style={{ fontSize: '12px', fontWeight: 800, marginBottom: '3px' }}>{title}</p>
                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, lineHeight: 1.5 }}>{sub}</p>
              </div>
            </div>
          ))}
        </motion.div>

        {/* Status do Sistema */}
        <motion.div className="info-card" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}>
          <div className="section-title" style={{ marginBottom: '20px' }}>
            <BarChart2 size={14} color="#22d3ee" />
            Status do Sistema
          </div>
          {[
            { label: 'IA de Geração', val: 'Online', color: '#25d366' },
            { label: 'Protocolo Omega', val: isPro ? 'Ativo' : 'PRO Only', color: isPro ? '#25d366' : 'rgba(255,255,255,0.2)' },
            { label: 'Modelo de IA', val: 'v4.0 Elite', color: '#22d3ee' },
            { label: 'Copies Gerados', val: `${todayUsage} hoje`, color: '#FF0080' },
            { label: 'Plano Atual', val: isPro ? '👑 PRO Ativo' : 'Free — Limitado', color: isPro ? '#FFD700' : 'rgba(255,255,255,0.3)' },
          ].map(({ label, val, color }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '12px', fontWeight: 700, color: 'rgba(255,255,255,0.55)' }}>{label}</span>
              <span style={{ fontSize: '10px', fontWeight: 900, color, display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: color, display: 'inline-block' }} />
                {val}
              </span>
            </div>
          ))}

          {!isPro && (
            <button
              onClick={() => navigate('/upgrade')}
              style={{
                marginTop: '20px', width: '100%', padding: '12px',
                borderRadius: '12px', border: '1px solid rgba(255,215,0,0.25)',
                background: 'rgba(255,215,0,0.06)', color: '#FFD700',
                fontSize: '11px', fontWeight: 900, textTransform: 'uppercase',
                letterSpacing: '0.1em', cursor: 'pointer', display: 'flex',
                alignItems: 'center', justifyContent: 'center', gap: '8px',
                transition: 'all 0.25s'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,215,0,0.12)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,215,0,0.06)'}
            >
              <Crown size={13} fill="currentColor" /> Ativar Protocolo Omega
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
