import { motion } from 'framer-motion';
import { Search, Filter, Calendar, FileText, Copy, Trash2, ExternalLink, Activity } from 'lucide-react';
import useAppStore from '../store/useAppStore';
import useUIStore from '../store/useUIStore';
import { supabase } from '../utils/supabase';
import { useState, useEffect } from 'react';

export default function LibraryScreen() {
  const { user } = useAppStore();
  const { showToast } = useUIStore();
  const [generations, setGenerations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (user?.id) {
      fetchGenerations();
    }
  }, [user]);

  const fetchGenerations = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('generations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setGenerations(data || []);
    } catch (error) {
      console.error('Error fetching generations:', error);
      showToast('Erro ao carregar histórico.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    showToast('Registro copiado para a área de transferência.', 'success');
  };

  const handleDelete = async (id) => {
    try {
      const { error } = await supabase
        .from('generations')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setGenerations(generations.filter(g => g.id !== id));
      showToast('Registro excluído com sucesso.', 'success');
    } catch (error) {
      console.error('Error deleting:', error);
      showToast('Erro ao excluir registro.', 'error');
    }
  };

  const filteredGenerations = generations.filter(g => 
    g.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.niche?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    g.platform?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="library-module">
      <style>{`
        .library-module {
          max-width: 1200px;
          margin: 0 auto;
          padding: 40px 20px;
          font-family: 'Outfit', sans-serif;
          color: #fff;
        }

        .lib-header {
          margin-bottom: 60px;
          display: flex;
          flex-direction: column;
          gap: 20px;
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
          align-items: center;
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

        .history-card {
          background: #0d0d0d !important;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 40px;
          padding: 40px;
          margin-bottom: 30px;
          display: flex;
          gap: 40px;
          transition: all 0.3s;
        }

        .history-card:hover {
          border-color: rgba(34, 211, 238, 0.2);
          transform: translateY(-5px);
        }

        .history-content {
          flex: 1;
        }

        .history-meta {
          display: flex;
          align-items: center;
          gap: 20px;
          margin-bottom: 25px;
        }

        .meta-icon {
          width: 50px;
          height: 50px;
          background: rgba(34, 211, 238, 0.1);
          border-radius: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #22d3ee;
        }

        .history-title {
          font-size: 22px;
          font-weight: 900;
          text-transform: uppercase;
          margin-bottom: 5px;
          color: #fff;
        }

        .history-subtitle {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          color: rgba(255, 255, 255, 0.3);
        }

        .copy-preview {
          background: rgba(255, 255, 255, 0.02);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 24px;
          padding: 30px;
          color: rgba(255, 255, 255, 0.6);
          font-size: 15px;
          line-height: 1.6;
        }

        .history-actions {
          width: 200px;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .action-btn {
          width: 100%;
          height: 50px;
          border-radius: 15px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          background: rgba(255, 255, 255, 0.03);
          color: #fff;
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

        .action-btn.primary {
          background: #fff;
          color: #000;
          border: none;
        }

        .action-btn:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .action-btn.primary:hover {
          background: #f0f0f0;
          transform: scale(1.02);
        }

        .delete-btn {
          background: transparent;
          border: none;
          color: rgba(255, 0, 80, 0.3);
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.2em;
          cursor: pointer;
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }

        .delete-btn:hover {
          color: #ff0050;
        }

        @media (max-width: 768px) {
          .history-card { flex-direction: column; gap: 30px; }
          .history-actions { width: 100%; flex-direction: row; }
        }
      `}</style>

      <header className="lib-header">
        <div>
          <p style={{ color: '#22d3ee', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.4em', fontSize: '10px', marginBottom: '10px' }}>Banco de Dados Neural</p>
          <h1 className="metallic-title">Arquivo Memória</h1>
        </div>
        
        <div className="search-row">
          <div className="search-wrapper">
             <Search style={{ position: 'absolute', left: '18px', top: '16px', color: 'rgba(255,255,255,0.2)' }} size={20} />
             <input 
              className="search-input" 
              placeholder="Localizar protocolo pelo conteúdo ou nicho..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
             />
          </div>
          <button className="action-btn" style={{ width: '60px' }}><Filter size={20} /></button>
        </div>
      </header>

      <div className="history-list">
        {loading ? (
          <div style={{ padding: '100px', textAlign: 'center' }}>
            <Activity size={40} className="spin-icon" style={{ color: '#22d3ee' }} />
            <p style={{ marginTop: '20px', color: 'rgba(255,255,255,0.4)', fontWeight: 800 }}>Sincronizando arquivo...</p>
          </div>
        ) : filteredGenerations.length > 0 ? filteredGenerations.map((item, i) => (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} key={item.id} className="history-card">
            <div className="history-content">
              <div className="history-meta">
                <div className="meta-icon"><FileText size={24} /></div>
                <div style={{ flex: 1 }}>
                  <h3 className="history-title">{item.niche}</h3>
                  <p className="history-subtitle">{item.platform} // {item.tone}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '8px 15px', borderRadius: '10px', fontSize: '10px', fontWeight: 800, color: 'rgba(255,255,255,0.2)' }}>
                  <Calendar size={12} style={{ marginRight: '8px', verticalAlign: 'middle' }} /> {new Date(item.created_at).toLocaleDateString()}
                </div>
              </div>
              <div className="copy-preview">
                {item.content}
              </div>
            </div>
            <div className="history-actions">
              <button onClick={() => copyToClipboard(item.content)} className="action-btn primary"><Copy size={16} /> Copiar</button>
              <button className="action-btn"><ExternalLink size={16} /> Detalhes</button>
              <button onClick={() => handleDelete(item.id)} className="delete-btn"><Trash2 size={14} /> Excluir Registro</button>
            </div>
          </motion.div>
        )) : (
          <div style={{ padding: '100px', textAlign: 'center', border: '2px dashed rgba(255,255,255,0.05)', borderRadius: '40px' }}>
            <FileText size={48} color="rgba(255,255,255,0.05)" style={{ marginBottom: '20px' }} />
            <h3 style={{ fontSize: '18px', fontWeight: 900, textTransform: 'uppercase', color: 'rgba(255,255,255,0.2)' }}>Arquivo Vazio</h3>
          </div>
        )}
      </div>
    </div>
  );
}
