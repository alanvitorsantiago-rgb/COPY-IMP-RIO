import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Github, Link as LinkIcon, Eye, EyeOff, Activity } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import useUIStore from '../store/useUIStore';
import { supabase } from '../utils/supabase';

export default function AuthScreen() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [githubLoading, setGithubLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const setUser = useAppStore((state) => state.setUser);
  const showToast = useUIStore((state) => state.showToast);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const timeout = setTimeout(() => {
      setLoading(currentLoading => {
        if (currentLoading) {
          showToast('Tempo de sincronização excedido. Verifique sua conexão.', 'error');
          return false;
        }
        return currentLoading;
      });
    }, 15000); // 15s de segurança


    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        
        // Optimistic update: Set user immediately to trigger redirect
        setUser({
          id: data.user.id,
          email: data.user.email,
          name: data.user.user_metadata?.full_name || data.user.email?.split('@')[0] || 'Operador',
          plan: 'free' // App.jsx will update this to 'pro' if applicable in a moment
        });

        showToast('Credenciais Verificadas. Acessando...', 'success');
        navigate('/'); // Force immediate navigation
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
            },
          },
        });

        if (error) throw error;

        if (data.user && data.session) {
          setUser({
            id: data.user.id,
            email: data.user.email,
            name: name,
            plan: 'free'
          });
          showToast('Registro Completo. Bem-vindo!', 'success');
          navigate('/');
        } else {
          showToast('Verifique seu e-mail para confirmar o registro.', 'info');
        }
      }
    } catch (error) {

      console.error('Auth error:', error.message);
      showToast(error.message || 'Erro na autenticação.', 'error');
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }

  };

  const handleGithubLogin = async () => {
    setGithubLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'github',
        options: {
          redirectTo: window.location.origin
        }
      });
      if (error) throw error;
    } catch (error) {
      showToast('Erro ao iniciar login com GitHub.', 'error');
      setGithubLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <style>{`
        .auth-container {
          min-height: 100-screen;
          min-height: 100vh;
          background-color: #000;
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          position: relative;
          overflow: hidden;
          font-family: 'Outfit', sans-serif;
        }

        /* The Smoke/Nebula Effect */
        .nebula-bg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 70%;
          pointer-events: none;
          z-index: 0;
          background: 
            radial-gradient(circle at 20% 30%, rgba(255, 0, 85, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 50% 20%, rgba(0, 210, 255, 0.5) 0%, transparent 60%),
            radial-gradient(circle at 80% 30%, rgba(255, 138, 0, 0.4) 0%, transparent 50%),
            radial-gradient(circle at 50% 50%, rgba(0, 255, 136, 0.2) 0%, transparent 70%),
            radial-gradient(circle at 40% 10%, rgba(112, 0, 255, 0.4) 0%, transparent 40%);
          filter: blur(60px);
          opacity: 0.8;
        }

        .auth-content {
          width: 100%;
          max-width: 1000px;
          position: relative;
          z-index: 10;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .auth-title {
          font-size: clamp(60px, 10vw, 120px);
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 0;
          line-height: 1;
          background: linear-gradient(180deg, #FFF3B0 0%, #F5C518 30%, #D48C00 60%, #F5C518 80%, #FFF3B0 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          filter: drop-shadow(0px 0px 20px rgba(217, 70, 239, 0.4));
        }

        .auth-subtitle {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.5);
          letter-spacing: 0.3em;
          text-transform: uppercase;
          margin-top: 10px;
          margin-bottom: 40px;
          text-align: center;
        }

        /* The Main Card */
        .auth-card {
          width: 100%;
          background: #080808;
          border-radius: 24px;
          position: relative;
          padding: 1px; /* For the gradient border */
          background: linear-gradient(90deg, #ff0080, #7928ca, #ff8a00) border-box;
          border: 1px solid transparent;
          box-shadow: 0 0 40px rgba(255, 0, 128, 0.15);
        }

        .auth-card-inner {
          background: #0a0a0a;
          border-radius: 23px;
          padding: 40px;
          display: flex;
          flex-direction: column;
        }

        /* Tab Switcher */
        .tab-container {
          display: flex;
          background: rgba(255, 255, 255, 0.05);
          padding: 4px;
          border-radius: 12px;
          width: fit-content;
          margin-bottom: 30px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .tab-btn {
          padding: 8px 24px;
          border-radius: 8px;
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          background: transparent;
          color: rgba(255, 255, 255, 0.3);
        }

        .tab-btn.active {
          background: rgba(255, 255, 255, 0.1);
          color: #fff;
          box-shadow: 0 4px 12px rgba(0,0,0,0.5);
        }

        /* Input Fields */
        .form-group {
          margin-bottom: 24px;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-label {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: rgba(255, 255, 255, 0.6);
          margin-left: 4px;
        }

        .input-wrapper {
          position: relative;
          padding: 1px;
          border-radius: 12px;
          background: linear-gradient(90deg, #00d2ff, #3a7bd5, #ff0055);
          transition: all 0.3s;
        }

        .input-wrapper.alt {
          background: linear-gradient(90deg, #ff0055, #ff8a00, #f5c518);
        }

        .auth-input {
          width: 100%;
          height: 48px;
          background: #0d0d0d !important;
          border: none;
          border-radius: 11px;
          color: #fff !important;
          padding: 0 16px;
          font-size: 15px;
          outline: none;
        }

        .auth-input::placeholder {
          color: rgba(255, 255, 255, 0.2);
        }

        /* Submit Button */
        .submit-btn {
          width: 100%;
          height: 56px;
          border-radius: 14px;
          border: none;
          background: linear-gradient(90deg, #FF0080, #FF8C00);
          color: #fff;
          font-size: 15px;
          font-weight: 900;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          margin-top: 10px;
          box-shadow: 0 10px 30px rgba(255, 0, 128, 0.3);
          transition: all 0.3s;
        }

        .submit-btn:hover {
          transform: translateY(-2px);
          box-shadow: 0 15px 40px rgba(255, 0, 128, 0.4);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        .submit-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        /* Secondary Button */
        .github-btn {
          width: 100%;
          height: 50px;
          border-radius: 14px;
          border: 1px solid rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.03);
          color: rgba(255, 255, 255, 0.5);
          font-size: 13px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          margin-top: 16px;
          transition: all 0.3s;
        }

        .github-btn:hover {
          background: rgba(255, 255, 255, 0.06);
          color: #fff;
        }

        /* Footer */
        .auth-footer {
          margin-top: 40px;
          text-align: center;
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .footer-text-main {
          font-size: 13px;
          font-weight: 800;
          color: #fff;
        }

        .footer-text-sub {
          font-size: 11px;
          font-family: monospace;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.3);
          text-transform: uppercase;
        }

        @media (max-width: 768px) {
          .auth-title { font-size: 60px; }
          .auth-card-inner { padding: 24px; }
        }
      `}</style>

      <div className="nebula-bg" />

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="auth-content"
      >
        <div className="text-center mb-10 flex flex-col items-center">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative"
          >
            <img 
              src="/imperio-logo.jpg" 
              alt="Império Universo" 
              className="w-40 h-40 rounded-3xl shadow-[0_0_50px_rgba(255,0,128,0.3)] border border-white/5"
            />
            <div className="absolute -inset-4 bg-pink-500/10 blur-2xl rounded-full z-[-1] pulse-anim" />
          </motion.div>
          <p className="auth-subtitle mt-6">PROTOCOLO DE ACESSO UNIVERSO</p>
        </div>


        <div className="auth-card">
          <div className="auth-card-inner">
            <div className="tab-container">
              <button 
                onClick={() => setIsLogin(true)} 
                className={`tab-btn ${isLogin ? 'active' : ''}`}
              >
                Comando
              </button>
              <button 
                onClick={() => setIsLogin(false)} 
                className={`tab-btn ${!isLogin ? 'active' : ''}`}
              >
                Registro
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <AnimatePresence mode="wait">
                {!isLogin && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }} 
                    animate={{ height: 'auto', opacity: 1 }} 
                    exit={{ height: 0, opacity: 0 }}
                    className="form-group"
                  >
                    <label className="form-label">Identificação</label>
                    <div className="input-wrapper">
                      <input 
                        type="text" 
                        className="auth-input" 
                        placeholder="Nome do operador"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required={!isLogin}
                        autoComplete="off"
                      />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="form-group">
                <label className="form-label">E-mail de Acesso</label>
                <div className="input-wrapper">
                  <input 
                    type="email" 
                    className="auth-input" 
                    placeholder="acesso@imperio.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="off"
                  />
                </div>
              </div>

              <div className="form-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', paddingRight: '4px' }}>
                  <label className="form-label">Senha de Operação</label>
                  <button type="button" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <LinkIcon size={12} /> Recuperar
                  </button>
                </div>
                <div className="input-wrapper alt">
                  <input 
                    type={showPass ? 'text' : 'password'} 
                    className="auth-input" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoComplete="off"
                  />
                  <button 
                    type="button" 
                    onClick={() => setShowPass(!showPass)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer' }}
                  >
                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              <button type="submit" disabled={loading} className="submit-btn">
                {loading ? (
                  <>
                    <Activity size={20} className="spin-icon" />
                    Sincronizando...
                  </>
                ) : (
                  <>
                    <Activity size={20} />
                    Iniciar Comando
                  </>
                )}
              </button>
            </form>

            <button 
              type="button"
              className="github-btn" 
              onClick={handleGithubLogin}
              disabled={githubLoading || loading}
            >
              {githubLoading ? (
                <>
                  <Activity size={18} className="spin-icon" />
                  Sincronizando com GitHub...
                </>
              ) : (
                <>
                  <Github size={18} />
                  Github Authentication
                </>
              )}
            </button>
          </div>
        </div>

        <div className="auth-footer">
          <p className="footer-text-main">Ambiente Seguro & Criptografado</p>
          <p className="footer-text-sub">CORE_SYSTEM_v2.1.4 // PROTOCOLO_OMEGA</p>
        </div>
      </motion.div>
    </div>
  );
}
