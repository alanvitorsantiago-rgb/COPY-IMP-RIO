import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Shield, CreditCard, LogOut, Bell, Zap,
  ChevronRight, Check, Crown, Lock, Infinity, Star,
  Globe, Moon, Palette, ToggleLeft, ToggleRight, Activity,
  Brain, Trash2, Plus
} from 'lucide-react';
import useAppStore from '../store/useAppStore';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../utils/supabase';
import useUIStore from '../store/useUIStore';


// --- Toggle Component ---
function Toggle({ enabled, onToggle, color = '#ff0080' }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: '48px',
        height: '26px',
        borderRadius: '99px',
        border: 'none',
        background: enabled ? color : 'rgba(255,255,255,0.06)',
        position: 'relative',
        cursor: 'pointer',
        transition: 'background 0.3s',
        flexShrink: 0,
        boxShadow: enabled ? `0 0 12px ${color}60` : 'none',
      }}
    >
      <motion.div
        animate={{ x: enabled ? 22 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        style={{
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: '#fff',
          position: 'absolute',
          top: '3px',
        }}
      />
    </button>
  );
}

// --- Section Header ---
function SectionHeader({ icon: Icon, label, color = '#ff0080' }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
      <div style={{
        width: '34px', height: '34px', borderRadius: '10px',
        background: `${color}18`, border: `1px solid ${color}30`,
        display: 'flex', alignItems: 'center', justifyContent: 'center', color
      }}>
        <Icon size={16} />
      </div>
      <span style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.25em', color: 'rgba(255,255,255,0.5)' }}>
        {label}
      </span>
    </div>
  );
}

export default function SettingsScreen() {
  const { user, logout } = useAppStore();
  const { showToast } = useUIStore();
  const navigate = useNavigate();
  const isPro = user?.plan === 'pro' || user?.plan === 'lifetime';

  const [toggles, setToggles] = useState({
    neural: true,
    notifications: false,
    darkMode: true,
    autosave: true,
    analytics: false,
  });

  const [showDanger, setShowDanger] = useState(false);
  const [trainingExamples, setTrainingExamples] = useState([]);
  const [newExample, setNewExample] = useState('');
  const [loadingTraining, setLoadingTraining] = useState(false);

  useEffect(() => {
    if (user?.id) fetchTraining();
  }, [user?.id]);

  const fetchTraining = async () => {
    const { data, error } = await supabase
      .from('user_training')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) console.error('Error fetching training:', error);
    else setTrainingExamples(data || []);
  };

  const handleAddTraining = async () => {
    if (!newExample.trim()) return;
    if (!isPro) {
      showToast('O Modo Espelho é exclusivo para membros PRO.', 'error');
      return;
    }
    
    setLoadingTraining(true);
    const { data, error } = await supabase
      .from('user_training')
      .insert([{ user_id: user.id, content: newExample.trim() }])
      .select();

    if (error) {
      showToast('Erro ao salvar treinamento.', 'error');
    } else {
      setTrainingExamples([data[0], ...trainingExamples]);
      setNewExample('');
      showToast('Estilo aprendido com sucesso!', 'success');
    }
    setLoadingTraining(false);
  };

  const handleDeleteTraining = async (id) => {
    const { error } = await supabase
      .from('user_training')
      .delete()
      .eq('id', id);

    if (error) {
      showToast('Erro ao excluir treinamento.', 'error');
    } else {
      setTrainingExamples(trainingExamples.filter(ex => ex.id !== id));
      showToast('Exemplo removido.', 'success');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/auth');
  };

  const flip = (key) => setToggles(t => ({ ...t, [key]: !t[key] }));

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '??';


  return (
    <div className="settings-module">
      <style>{`
        .settings-module {
          max-width: 1100px;
          margin: 0 auto;
          padding: 40px 20px 80px;
          font-family: 'Outfit', sans-serif;
          color: #fff;
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 300px 1fr;
          gap: 24px;
          align-items: start;
        }

        @media (max-width: 768px) {
          .settings-grid { grid-template-columns: 1fr; }
        }

        .settings-card {
          background: rgba(255,255,255,0.025);
          border: 1px solid rgba(255,255,255,0.06);
          border-radius: 24px;
          padding: 28px;
          backdrop-filter: blur(20px);
        }

        .settings-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 0;
          border-bottom: 1px solid rgba(255,255,255,0.04);
        }
        .settings-row:last-child { border-bottom: none; padding-bottom: 0; }
        .settings-row:first-child { padding-top: 0; }

        .row-label { font-size: 12px; font-weight: 800; color: rgba(255,255,255,0.75); }
        .row-sub   { font-size: 10px; font-weight: 600; color: rgba(255,255,255,0.28); margin-top: 2px; }
        .row-value { font-size: 11px; font-weight: 700; color: rgba(255,255,255,0.4); text-align: right; }

        .avatar-ring {
          width: 80px; height: 80px; border-radius: 50%;
          background: linear-gradient(135deg, #ff0080, #7928ca, #22d3ee);
          padding: 2px;
          margin: 0 auto 16px;
        }
        .avatar-inner {
          width: 100%; height: 100%; border-radius: 50%;
          background: #0a0a12;
          display: flex; align-items: center; justify-content: center;
          font-size: 24px; font-weight: 900; letter-spacing: -1px;
          background-clip: padding-box;
        }

        .plan-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 99px;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.12em;
          margin-top: 4px;
        }

        .status-dot {
          width: 6px; height: 6px; border-radius: 50%;
          display: inline-block;
          animation: pulse-dot 1.5s ease-in-out infinite;
        }
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.8); }
        }

        .danger-btn {
          width: 100%;
          padding: 14px;
          border-radius: 14px;
          border: 1px solid rgba(239, 68, 68, 0.25);
          background: rgba(239, 68, 68, 0.05);
          color: #ef4444;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.15em;
          cursor: pointer;
          transition: all 0.25s;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .danger-btn:hover {
          background: rgba(239, 68, 68, 0.12);
          border-color: rgba(239, 68, 68, 0.5);
          box-shadow: 0 0 20px rgba(239, 68, 68, 0.15);
        }

        .confirm-btn {
          flex: 1;
          padding: 12px;
          border-radius: 12px;
          border: none;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          transition: all 0.2s;
        }

        .upgrade-nudge {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.05), rgba(184, 134, 11, 0.08));
          border: 1px solid rgba(255, 215, 0, 0.2);
          border-radius: 18px;
          padding: 20px;
          text-align: center;
          cursor: pointer;
          transition: all 0.3s;
        }
        .upgrade-nudge:hover {
          background: linear-gradient(135deg, rgba(255, 215, 0, 0.1), rgba(184, 134, 11, 0.15));
          box-shadow: 0 0 30px rgba(255, 215, 0, 0.08);
        }
      `}</style>

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '36px' }}
      >
        <p style={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', color: '#ff0080', marginBottom: '8px' }}>
          Painel de Controle
        </p>
        <h1 style={{ fontSize: 'clamp(28px, 5vw, 48px)', fontWeight: 900, lineHeight: 1, marginBottom: '8px' }}>
          Configurações do <span style={{ background: 'linear-gradient(90deg, #ff0080, #7928ca)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Sistema</span>
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', fontWeight: 600 }}>
          Gerencie identidade, preferências e segurança da sua conta.
        </p>
      </motion.div>

      <div className="settings-grid">
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Avatar Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="settings-card"
            style={{ textAlign: 'center' }}
          >
            <div className="avatar-ring">
              <div className="avatar-inner">{userInitials}</div>
            </div>
            <p style={{ fontWeight: 900, fontSize: '17px', marginBottom: '2px' }}>{user?.name || 'Usuário'}</p>
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, marginBottom: '10px' }}>{user?.email}</p>

            <span className={`plan-badge`} style={
              isPro
                ? { background: 'rgba(255, 215, 0, 0.1)', color: '#FFD700', border: '1px solid rgba(255,215,0,0.3)' }
                : { background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.08)' }
            }>
              {isPro ? <><Crown size={11} fill="currentColor" /> PRO Ativo</> : <><Activity size={11} /> Plano Free</>}
            </span>

            <div style={{
              marginTop: '20px',
              padding: '12px',
              borderRadius: '14px',
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(255,255,255,0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className="status-dot" style={{ background: '#25d366' }} />
                <span style={{ fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Sistema Online</span>
              </div>
              <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(255,255,255,0.2)' }}>v2.0</span>
            </div>
          </motion.div>

          {/* Upgrade Nudge for free users */}
          {!isPro && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="upgrade-nudge"
              onClick={() => navigate('/upgrade')}
            >
              <Star size={28} color="#FFD700" fill="#FFD700" style={{ margin: '0 auto 12px' }} />
              <p style={{ fontWeight: 900, fontSize: '14px', marginBottom: '6px' }}>Desbloqueie o PRO</p>
              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', fontWeight: 600, lineHeight: 1.5, marginBottom: '14px' }}>
                Gerações ilimitadas, Protocolo Omega e muito mais.
              </p>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '99px',
                background: 'rgba(255, 215, 0, 0.1)',
                border: '1px solid rgba(255, 215, 0, 0.3)',
                color: '#FFD700',
                fontSize: '10px',
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}>
                <Zap size={12} /> Ver Planos
              </div>
            </motion.div>
          )}

          {/* Plan Status for PRO users */}
          {isPro && (
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="settings-card"
              style={{ background: 'rgba(255, 215, 0, 0.03)', border: '1px solid rgba(255, 215, 0, 0.15)' }}
            >
              <SectionHeader icon={Crown} label="Seu Plano" color="#FFD700" />
              <div className="settings-row">
                <div>
                  <div className="row-label" style={{ color: '#FFD700' }}>👑 PRO Ativo</div>
                  <div className="row-sub">Gerações ilimitadas</div>
                </div>
                <Check size={16} color="#25d366" />
              </div>
              <div className="settings-row">
                <div>
                  <div className="row-label">Protocolo Omega</div>
                  <div className="row-sub">IA de elite desbloqueada</div>
                </div>
                <Check size={16} color="#25d366" />
              </div>
              <div className="settings-row">
                <div>
                  <div className="row-label">Suporte Prioritário</div>
                  <div className="row-sub">Resposta em até 2h</div>
                </div>
                <Check size={16} color="#25d366" />
              </div>
            </motion.div>
          )}
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

          {/* Profile Info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="settings-card"
          >
            <SectionHeader icon={User} label="Perfil do Usuário" color="#22d3ee" />
            <div className="settings-row">
              <div>
                <div className="row-label">Nome de Exibição</div>
                <div className="row-sub">Visível em copies geradas</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="row-value">{user?.name || '—'}</span>
                <button style={{ background: 'rgba(34, 211, 238, 0.08)', border: '1px solid rgba(34,211,238,0.2)', color: '#22d3ee', padding: '5px 12px', borderRadius: '8px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>
                  Editar
                </button>
              </div>
            </div>
            <div className="settings-row">
              <div>
                <div className="row-label">E-mail da Conta</div>
                <div className="row-sub">Login e notificações</div>
              </div>
              <span className="row-value">{user?.email || '—'}</span>
            </div>
            <div className="settings-row">
              <div>
                <div className="row-label">Idioma da Interface</div>
                <div className="row-sub">Língua dos prompts de IA</div>
              </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.35)', fontSize: '11px', fontWeight: 700 }}>
                <Globe size={14} /> Português BR
              </div>
            </div>
          </motion.div>

          {/* AI Training / Mirror Mode */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.18 }}
            className="settings-card"
            style={!isPro ? { opacity: 0.6, position: 'relative', overflow: 'hidden' } : {}}
          >
            {!isPro && (
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
                background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                zIndex: 10, textAlign: 'center', padding: '20px'
              }}>
                <Lock size={32} color="#FFD700" style={{ marginBottom: '15px' }} />
                <p style={{ fontWeight: 900, fontSize: '14px', color: '#FFD700' }}>MODO ESPELHO EXCLUSIVO</p>
                <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.6)', marginTop: '5px' }}>Faça upgrade para a IA aprender seu estilo pessoal.</p>
              </div>
            )}
            
            <SectionHeader icon={Brain} label="Treinamento IA (Modo Espelho)" color="#ff0080" />
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', marginBottom: '20px', lineHeight: 1.5 }}>
              Cole aqui exemplos das suas melhores copies. Nossa rede neural vai analisar seu padrão de escrita, gírias e tom de voz para te replicar com perfeição.
            </p>

            <div style={{ position: 'relative', marginBottom: '20px' }}>
              <textarea
                value={newExample}
                onChange={(e) => setNewExample(e.target.value)}
                placeholder="Cole um exemplo de copy que você escreveu e que converteu muito..."
                style={{
                  width: '100%', height: '120px', background: 'rgba(0,0,0,0.2)',
                  border: '1px solid rgba(255,255,255,0.1)', borderRadius: '15px',
                  padding: '15px', color: '#fff', fontSize: '13px', resize: 'none',
                  outline: 'none', fontFamily: 'inherit'
                }}
              />
              <button
                onClick={handleAddTraining}
                disabled={loadingTraining || !newExample.trim()}
                style={{
                  position: 'absolute', bottom: '15px', right: '15px',
                  background: 'linear-gradient(90deg, #ff0080, #7928ca)',
                  border: 'none', borderRadius: '10px', padding: '8px 15px',
                  color: '#fff', fontSize: '10px', fontWeight: 900,
                  textTransform: 'uppercase', letterSpacing: '0.1em',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  opacity: (loadingTraining || !newExample.trim()) ? 0.5 : 1
                }}
              >
                {loadingTraining ? 'Analisando...' : <><Plus size={14} /> Aprender Estilo</>}
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {trainingExamples.map((ex) => (
                <div key={ex.id} style={{
                  background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)',
                  padding: '12px 15px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'
                }}>
                  <div style={{ 
                    fontSize: '11px', color: 'rgba(255,255,255,0.6)', 
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '80%' 
                  }}>
                    "{ex.content}"
                  </div>
                  <button 
                    onClick={() => handleDeleteTraining(ex.id)}
                    style={{ background: 'transparent', border: 'none', color: 'rgba(239, 68, 68, 0.4)', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          </motion.div>


          {/* Preferences Toggles */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="settings-card"
          >
            <SectionHeader icon={Palette} label="Preferências" color="#7928ca" />
            {[
              { key: 'neural', label: 'Predição Neural', sub: 'Sugestões inteligentes em tempo real', color: '#7928ca' },
              { key: 'notifications', label: 'Notificações Push', sub: 'Alertas de novos modelos e estratégias', color: '#ff0080' },
              { key: 'darkMode', label: 'Modo Escuro Permanente', sub: 'Interface no padrão cyber-noir', color: '#22d3ee' },
              { key: 'autosave', label: 'Auto-Salvar Copies', sub: 'Salva automaticamente na biblioteca', color: '#25d366' },
              { key: 'analytics', label: 'Analytics de Uso', sub: 'Melhora os modelos da IA com seus dados', color: '#FFD700' },
            ].map(({ key, label, sub, color }) => (
              <div key={key} className="settings-row">
                <div>
                  <div className="row-label">{label}</div>
                  <div className="row-sub">{sub}</div>
                </div>
                <Toggle enabled={toggles[key]} onToggle={() => flip(key)} color={color} />
              </div>
            ))}
          </motion.div>

          {/* Security */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.25 }}
            className="settings-card"
          >
            <SectionHeader icon={Shield} label="Segurança da Conta" color="#25d366" />
            <div className="settings-row">
              <div>
                <div className="row-label">Senha de Acesso</div>
                <div className="row-sub">Última alteração: nunca</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span className="row-value">••••••••</span>
                <button style={{ background: 'rgba(37,211,102,0.08)', border: '1px solid rgba(37,211,102,0.2)', color: '#25d366', padding: '5px 12px', borderRadius: '8px', fontSize: '9px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.1em', cursor: 'pointer' }}>
                  Alterar
                </button>
              </div>
            </div>
            <div className="settings-row">
              <div>
                <div className="row-label">Autenticação em 2 Etapas</div>
                <div className="row-sub">Proteção extra para sua conta</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'rgba(255,255,255,0.25)', fontSize: '11px', fontWeight: 700 }}>
                <Lock size={13} /> Em breve
              </div>
            </div>
            <div className="settings-row">
              <div>
                <div className="row-label">Sessões Ativas</div>
                <div className="row-sub">Dispositivos conectados</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#25d366', fontSize: '11px', fontWeight: 700 }}>
                <span className="status-dot" style={{ background: '#25d366' }} /> 1 Dispositivo
              </div>
            </div>
          </motion.div>

          {/* Danger Zone */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="settings-card"
            style={{ border: '1px solid rgba(239,68,68,0.15)' }}
          >
            <SectionHeader icon={LogOut} label="Zona de Perigo" color="#ef4444" />
            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', fontWeight: 600, lineHeight: 1.6, marginBottom: '20px' }}>
              Ao encerrar a sessão, você será redirecionado para a tela de acesso. Seus dados e copies salvos permanecerão intactos.
            </p>

            {!showDanger ? (
              <button className="danger-btn" onClick={() => setShowDanger(true)}>
                <LogOut size={14} /> Encerrar Sessão
              </button>
            ) : (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  <p style={{ fontSize: '11px', fontWeight: 800, color: '#ef4444', textAlign: 'center', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                    Confirmar saída?
                  </p>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      className="confirm-btn"
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.5)' }}
                      onClick={() => setShowDanger(false)}
                    >
                      Cancelar
                    </button>
                    <button
                      className="confirm-btn"
                      style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239,68,68,0.4)', color: '#ef4444' }}
                      onClick={handleLogout}
                    >
                      <LogOut size={13} style={{ display: 'inline', marginRight: '6px' }} />
                      Confirmar Saída
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}
