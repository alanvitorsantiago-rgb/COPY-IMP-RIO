import { motion } from 'framer-motion';
import { Settings as SettingsIcon, User, Shield, CreditCard, LogOut, ChevronRight, Bell } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import GlassCard from '../components/GlassCard';
import Button from '../components/Button';
import { useNavigate } from 'react-router-dom';

export default function SettingsScreen() {
  const { user, setUser } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/auth');
  };

  const sections = [
    { 
      title: 'Perfil do Usuário', 
      icon: User, 
      items: [
        { label: 'Nome de Exibição', value: user?.name },
        { label: 'Endereço de E-mail', value: user?.email },
      ] 
    },
    { 
      title: 'Plano & Faturamento', 
      icon: CreditCard, 
      items: [
        { label: 'Plano Ativo', value: user?.plan === 'pro' ? '👑 PREMIUM PRO' : 'Plano Gratuito', color: user?.plan === 'pro' ? 'text-primary' : 'text-amber-500' },
        { label: 'Status da Assinatura', value: user?.plan === 'pro' ? 'Ativo' : 'N/A' },
      ] 
    },
    { 
      title: 'Segurança da Conta', 
      icon: Shield, 
      items: [
        { label: 'Senha', value: '••••••••••••' },
        { label: 'Proteção Neural', value: 'Ativado' },
      ] 
    },
  ];

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-4xl mx-auto space-y-12 pb-20">
      <header>
        <h1 className="text-3xl font-black mb-2">Configurações do <span className="text-primary">Sistema</span></h1>
        <p className="text-text-muted text-sm font-medium">Gerencie suas preferências e segurança da conta.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {sections.map((section) => (
            <GlassCard key={section.title} className="p-8 border-white/5">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                   <section.icon size={20} />
                </div>
                <h3 className="text-lg font-bold">{section.title}</h3>
              </div>
              
              <div className="space-y-6">
                {section.items.map((item) => (
                  <div key={item.label} className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-6 last:border-0 last:pb-0">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-text-dim uppercase tracking-widest mb-1">{item.label}</span>
                      <span className={`text-sm font-bold ${item.color || 'text-text'}`}>{item.value}</span>
                    </div>
                    <button className="text-[10px] font-black text-primary uppercase hover:underline tracking-widest">Alterar</button>
                  </div>
                ))}
              </div>
            </GlassCard>
          ))}
        </div>

        <div className="space-y-8">
          <GlassCard className="p-8 border-rose-500/20 bg-rose-500/[0.02]">
            <h3 className="text-sm font-bold text-rose-500 uppercase tracking-widest mb-4 flex items-center gap-2">
              <LogOut size={16} /> Encerrar Sessão
            </h3>
            <p className="text-xs text-text-muted mb-8 leading-relaxed">
              Deseja sair do sistema? Suas cópias salvas permanecerão seguras em nosso arquivo de dados.
            </p>
            <Button variant="ghost" className="w-full text-rose-500 hover:bg-rose-500/10 border-rose-500/20" onClick={handleLogout}>
              SAIR DA CONTA
            </Button>
          </GlassCard>

          <GlassCard className="p-8 flex flex-col items-center text-center">
            <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-6 text-text-dim">
              <Bell size={28} />
            </div>
            <h4 className="font-bold mb-2">Central de Alertas</h4>
            <p className="text-xs text-text-muted mb-8 leading-relaxed">Receba notificações sobre novas estratégias de copy e atualizações da IA.</p>
            <Button variant="ghost" className="w-full">CONFIGURAR</Button>
          </GlassCard>
        </div>
      </div>
    </motion.div>
  );
}
