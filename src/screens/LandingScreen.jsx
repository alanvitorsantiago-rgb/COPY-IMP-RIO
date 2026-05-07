import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Zap, Sparkles, Rocket, ShieldCheck, ArrowRight, Star, Check, Globe, Layout, Smartphone, MessageSquare } from 'lucide-react';

export default function LandingScreen() {
  const navigate = useNavigate();

  return (
    <div className="landing-root">
      <style>{`
        .landing-root {
          background: #030303;
          color: #fff;
          font-family: 'Outfit', sans-serif;
          overflow-x: hidden;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 30px 10%;
          position: fixed;
          top: 0;
          width: 100%;
          z-index: 1000;
          backdrop-filter: blur(10px);
          background: rgba(3, 3, 3, 0.7);
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .logo {
          font-size: 24px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          background: linear-gradient(90deg, #ff0080, #7928ca);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-section {
          padding: 180px 10% 100px;
          text-align: center;
          position: relative;
        }

        .hero-glow {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(121, 40, 202, 0.15) 0%, transparent 70%);
          z-index: -1;
          filter: blur(50px);
        }

        .pre-title {
          font-size: 12px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.5em;
          color: #ff0080;
          margin-bottom: 20px;
          display: block;
        }

        .hero-title {
          font-size: clamp(40px, 8vw, 90px);
          font-weight: 900;
          line-height: 0.9;
          margin-bottom: 30px;
          letter-spacing: -0.02em;
        }

        .hero-title span {
          display: block;
          background: linear-gradient(180deg, #fff 0%, rgba(255, 255, 255, 0.4) 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .hero-desc {
          font-size: 18px;
          color: rgba(255, 255, 255, 0.5);
          max-width: 700px;
          margin: 0 auto 50px;
          line-height: 1.6;
          font-weight: 500;
        }

        .cta-group {
          display: flex;
          justify-content: center;
          gap: 20px;
        }

        .primary-btn {
          padding: 20px 40px;
          border-radius: 99px;
          background: #fff;
          color: #000;
          font-size: 14px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: none;
          cursor: pointer;
          transition: all 0.3s;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .primary-btn:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 30px rgba(255, 255, 255, 0.2);
        }

        .secondary-btn {
          padding: 20px 40px;
          border-radius: 99px;
          background: transparent;
          color: #fff;
          font-size: 14px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          border: 1px solid rgba(255, 255, 255, 0.1);
          cursor: pointer;
          transition: all 0.3s;
        }

        .secondary-btn:hover {
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.3);
        }

        /* Demo Section */
        .demo-window {
          max-width: 1000px;
          margin: 100px auto;
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 30px;
          padding: 40px;
          box-shadow: 0 50px 100px rgba(0, 0, 0, 0.5);
          position: relative;
          overflow: hidden;
        }

        .demo-header {
          display: flex;
          gap: 10px;
          margin-bottom: 30px;
        }

        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .dot-red { background: #ff5f56; }
        .dot-yellow { background: #ffbd2e; }
        .dot-green { background: #27c93f; }

        .demo-content {
          display: grid;
          grid-template-columns: 1fr 1.5fr;
          gap: 30px;
          text-align: left;
        }

        .demo-input {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 15px;
          padding: 20px;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.3);
        }

        .demo-output {
          background: #050507;
          border-radius: 20px;
          padding: 30px;
          font-size: 15px;
          line-height: 1.6;
          border: 1px solid rgba(121, 40, 202, 0.2);
          position: relative;
        }

        /* Feature Section */
        .features-section {
          padding: 100px 10%;
          text-align: center;
        }

        .feature-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 30px;
          margin-top: 60px;
        }

        .feature-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 30px;
          padding: 40px;
          transition: all 0.3s;
          text-align: left;
        }

        .feature-card:hover {
          background: rgba(255, 255, 255, 0.04);
          border-color: rgba(121, 40, 202, 0.3);
          transform: translateY(-10px);
        }

        .feature-icon {
          width: 50px;
          height: 50px;
          border-radius: 15px;
          background: rgba(121, 40, 202, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #7928ca;
          margin-bottom: 25px;
        }

        .feature-title {
          font-size: 20px;
          font-weight: 800;
          margin-bottom: 15px;
        }

        .feature-desc {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.4);
          line-height: 1.6;
        }

        /* Testimonials */
        .testimonial-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 24px;
          margin-top: 60px;
        }

        .testimonial-card {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 30px;
          text-align: left;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .user-avatar {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: linear-gradient(135deg, #ff0080, #7928ca);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 14px;
        }

        /* FAQ */
        .faq-section {
          padding: 100px 10%;
          max-width: 800px;
          margin: 0 auto;
        }

        .faq-item {
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
          padding: 24px 0;
          text-align: left;
          cursor: pointer;
        }

        .faq-question {
          font-size: 18px;
          font-weight: 700;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .faq-answer {
          font-size: 14px;
          color: rgba(255, 255, 255, 0.4);
          margin-top: 12px;
          line-height: 1.6;
        }

        /* Floating CTA */
        .floating-cta {
          position: fixed;
          bottom: 30px;
          right: 30px;
          z-index: 1001;
          box-shadow: 0 10px 30px rgba(255, 0, 128, 0.4);
        }

        /* Footer */
        .footer {
          padding: 80px 10%;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
          text-align: center;
          color: rgba(255, 255, 255, 0.2);
          font-size: 13px;
        }

      `}</style>

      <nav className="navbar">
        <div className="flex items-center gap-3">
          <img 
            src="/imperio-logo.jpg" 
            alt="Logo" 
            className="h-16 w-auto" 
            style={{
              maskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
              WebkitMaskImage: 'radial-gradient(circle at center, black 40%, transparent 80%)',
              filter: 'contrast(1.1) brightness(1.2) drop-shadow(0 0 15px rgba(255, 0, 128, 0.4))'
            }}
          />
        </div>
        <button onClick={() => navigate('/auth')} className="secondary-btn" style={{ padding: '12px 25px', fontSize: '11px' }}>Entrar</button>
      </nav>



      <header className="hero-section">
        <div className="hero-glow" />
        <motion.span 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="pre-title"
        >
          O Futuro do Copywriting Chegou
        </motion.span>
        <motion.h1 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="hero-title"
        >
          <span>DOMINE O MERCADO</span>
          <span style={{ color: '#ff0080', WebkitTextFillColor: '#ff0080' }}>COM IA DE ELITE</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="hero-desc"
        >
          Não perca mais horas batendo a cabeça. Deixe nossa inteligência neural criar copies que vendem enquanto você foca no lucro.
        </motion.p>
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3 }}
          className="cta-group"
        >
          <button onClick={() => navigate('/auth')} className="primary-btn">
            Começar Agora Grátis <ArrowRight size={18} />
          </button>
          <button onClick={() => {
            document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
          }} className="secondary-btn">
            Explorar Tecnologia
          </button>
        </motion.div>

        {/* Demo Window */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="demo-window"
        >
          <div className="demo-header">
            <div className="dot dot-red" />
            <div className="dot dot-yellow" />
            <div className="dot dot-green" />
          </div>
          <div className="demo-content">
            <div className="demo-input">
              <p style={{ marginBottom: '10px' }}><strong>Nicho:</strong> Dropshipping</p>
              <p style={{ marginBottom: '10px' }}><strong>Produto:</strong> Smartwatch V8</p>
              <p><strong>Público:</strong> Homens 20-35 anos...</p>
            </div>
            <div className="demo-output">
              <Sparkles size={24} color="#ff0080" style={{ position: 'absolute', top: '20px', right: '20px' }} />
              <p style={{ color: '#22d3ee', fontSize: '10px', fontWeight: 900, marginBottom: '10px', textTransform: 'uppercase' }}>Protocolo Omega Ativado</p>
              "Pare de perder tempo com relógios comuns. O Smartwatch V8 é a extensão da sua produtividade. Imagine ter o controle total do seu dia no seu pulso..."
              <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
                <span style={{ fontSize: '10px', background: 'rgba(255,0,128,0.1)', color: '#ff0080', padding: '4px 8px', borderRadius: '5px' }}>Viral Score: 98%</span>
                <span style={{ fontSize: '10px', background: 'rgba(34,211,238,0.1)', color: '#22d3ee', padding: '4px 8px', borderRadius: '5px' }}>Tom: Persuasivo</span>
              </div>
            </div>
          </div>
        </motion.div>
      </header>

      <section id="features" className="features-section">
        <span className="pre-title">Poder Infinito</span>
        <h2 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '20px' }}>Tecnologia Além da Galáxia</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '600px', margin: '0 auto' }}>
          Desenvolvemos algoritmos proprietários que analisam milhões de padrões de conversão.
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon"><Zap size={24} /></div>
            <h3 className="feature-title">Motor Neural V4</h3>
            <p className="feature-desc">Copies gerados com base em padrões psicológicos de alta conversão usados pelos maiores do mercado.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Globe size={24} /></div>
            <h3 className="feature-title">Multi-Plataforma</h3>
            <p className="feature-desc">Otimização específica para Instagram, WhatsApp, TikTok, Facebook Ads e muito mais.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Smartphone size={24} /></div>
            <h3 className="feature-title">Mobile First</h3>
            <p className="feature-desc">Interface ultra-veloz feita para você trabalhar de qualquer lugar, direto do seu celular.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><ShieldCheck size={24} /></div>
            <h3 className="feature-title">Escudo de Criativos</h3>
            <p className="feature-desc">Suas estratégias são criptografadas e protegidas. Ninguém copia o que você cria.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><MessageSquare size={24} /></div>
            <h3 className="feature-title">Análise de Sentimento</h3>
            <p className="feature-desc">Nossa IA detecta a emoção exata que seu texto vai causar no cliente final.</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon"><Star size={24} /></div>
            <h3 className="feature-title">VIP Empire</h3>
            <p className="feature-desc">Suporte exclusivo para membros do Império, ajudando você a escalar seus resultados.</p>
          </div>
        </div>
      </section>

      <section className="features-section" style={{ background: 'rgba(255,255,255,0.01)' }}>
        <span className="pre-title">Depoimentos</span>
        <h2 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '20px' }}>Império de Resultados</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', maxWidth: '600px', margin: '0 auto' }}>
          Veja o que dizem os empreendedores que já automatizaram seu marketing.
        </p>

        <div className="testimonial-grid">
          {[
            { name: "Lucas Almeida", role: "Drop-shipper", initial: "L", text: "O Calendário de 30 dias me economiza 4 horas por semana. É bizarro o quanto a IA entende do meu nicho." },
            { name: "Bruna Silva", role: "Infoprodutora", initial: "B", text: "O Modo Espelho é a melhor função que já vi. Meus e-mails agora parecem que foram escritos por mim, só que 10x melhores." },
            { name: "Ricardo Santos", role: "Agência Digital", initial: "R", text: "Uso em todos os clientes. O Score de Conversão me ajuda a provar para o cliente que a copy vai vender." }
          ].map((t, idx) => (
            <motion.div 
              key={idx}
              whileHover={{ scale: 1.05 }}
              className="testimonial-card"
            >
              <div className="user-info">
                <div className="user-avatar">{t.initial}</div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '15px' }}>{t.name}</div>
                  <div style={{ fontSize: '10px', color: '#ff0080', fontWeight: 900, textTransform: 'uppercase' }}>{t.role}</div>
                </div>
              </div>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6 }}>"{t.text}"</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="faq-section">
        <span className="pre-title" style={{ textAlign: 'center', width: '100%' }}>FAQ</span>
        <h2 style={{ fontSize: '40px', fontWeight: 900, marginBottom: '40px', textAlign: 'center' }}>Dúvidas Frequentes</h2>
        
        {[
          { q: "A IA escreve como eu mesmo?", a: "Sim! Com o nosso exclusivo 'Modo Espelho' (PRO), você treina a IA com seus próprios textos e ela aprende seu vocabulário e tom de voz." },
          { q: "Posso cancelar a assinatura quando quiser?", a: "Sem pegadinhas. Você pode cancelar sua assinatura mensal ou anual a qualquer momento direto pelo seu painel de configurações." },
          { q: "Funciona para qualquer nicho?", a: "Absolutamente. Nossa IA foi treinada em mais de 12 nichos diferentes, do Dropshipping à Advocacia, garantindo termos técnicos corretos." },
          { q: "O pagamento é seguro?", a: "Utilizamos o Mercado Pago como processador oficial. Seus dados estão 100% protegidos por criptografia de ponta a ponta." }
        ].map((item, idx) => (
          <div key={idx} className="faq-item">
            <div className="faq-question">
              {item.q} <ArrowRight size={16} color="#ff0080" />
            </div>
            <div className="faq-answer">{item.a}</div>
          </div>
        ))}
      </section>

      <section className="trust-section" style={{ padding: '100px 10%', background: 'rgba(121, 40, 202, 0.02)', textAlign: 'center' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '80px', marginBottom: '100px' }}>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '48px', fontWeight: 900, display: 'block' }}>500k+</span>
            <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>Copies Gerados</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '48px', fontWeight: 900, display: 'block' }}>12k+</span>
            <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>Membros Ativos</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <span style={{ fontSize: '48px', fontWeight: 900, display: 'block' }}>98%</span>
            <span style={{ fontSize: '12px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.2em', color: 'rgba(255,255,255,0.3)' }}>Aprovação IA</span>
          </div>
        </div>

        <h2 style={{ fontSize: '32px', fontWeight: 900, marginBottom: '40px' }}>Pronto para o Próximo Nível?</h2>
        <button onClick={() => navigate('/auth')} className="primary-btn" style={{ margin: '0 auto' }}>
          Criar Meu Império Agora <Rocket size={18} />
        </button>
      </section>

      <footer className="footer">
        <p>© 2024 Império Copy — Inteligência Artificial para Empreendedores.</p>
        <p style={{ marginTop: '10px' }}>Feito com ❤️ por quem entende de escala.</p>
      </footer>

      <motion.button 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.1 }}
        onClick={() => navigate('/auth')}
        className="primary-btn floating-cta"
      >
        <Zap size={18} /> Começar Grátis
      </motion.button>
    </div>
  );
}

