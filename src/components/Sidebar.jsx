import { 
  LayoutDashboard, Sparkles, Library, FileText, Zap, Settings, LogOut, 
  ChevronRight, Compass, ShieldCheck, User as UserIcon, Activity
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import useAppStore from '../store/useAppStore';
import { motion } from 'framer-motion';

const MENU_GROUPS = [
  {
    title: 'Operações',
    items: [
      { path: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { path: '/generator', icon: Sparkles, label: 'Gerador de IA' },
    ]
  },
  {
    title: 'Protocolos',
    items: [
      { path: '/library', icon: Library, label: 'Biblioteca' },
      { path: '/templates', icon: FileText, label: 'Estratégias' },
    ]
  },
  {
    title: 'Configurações',
    items: [
      { path: '/upgrade', icon: Zap, label: 'Upgrade PRO' },
      { path: '/settings', icon: Settings, label: 'Preferências' },
    ]
  }
];

export default function Sidebar() {
  const { user, setUser } = useAppStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    setUser(null);
    navigate('/auth');
  };

  return (
    <aside className="chic-sidebar">
      <style>{`
        .chic-sidebar {
          width: 280px;
          height: 100vh;
          background: rgba(5, 5, 7, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-right: 1px solid rgba(255, 255, 255, 0.05);
          display: flex;
          flex-direction: column;
          position: sticky;
          top: 0;
          z-index: 100;
          font-family: 'Outfit', sans-serif;
          color: #fff;
          overflow: hidden;
        }

        /* Branding */
        .sidebar-brand {
          padding: 40px 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 15px;
        }

        .brand-logo-box {
          width: 60px;
          height: 60px;
          border-radius: 18px;
          background: linear-gradient(135deg, #FF0080, #7928ca, #22d3ee);
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 10px 20px rgba(121, 40, 202, 0.3);
          position: relative;
        }

        .brand-logo-box::after {
          content: '';
          position: absolute;
          inset: -2px;
          background: linear-gradient(135deg, #FF0080, #7928ca, #22d3ee);
          border-radius: 20px;
          z-index: -1;
          filter: blur(8px);
          opacity: 0.5;
        }

        .brand-name {
          font-size: 20px;
          font-weight: 900;
          letter-spacing: -0.02em;
          text-transform: uppercase;
          text-align: center;
          line-height: 1;
        }

        .brand-name span {
          background: linear-gradient(90deg, #FF0080, #FF8A00);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .brand-tag {
          font-size: 9px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.4em;
          color: rgba(255, 255, 255, 0.2);
          margin-top: 5px;
        }

        /* Navigation */
        .sidebar-nav {
          flex: 1;
          padding: 0 15px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .nav-group-title {
          font-size: 10px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.3em;
          color: rgba(255, 255, 255, 0.2);
          padding-left: 15px;
          margin-bottom: 15px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 18px;
          border-radius: 14px;
          text-decoration: none;
          color: rgba(255, 255, 255, 0.4);
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid transparent;
          margin-bottom: 4px;
        }

        .nav-item:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }

        .nav-item.active {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        }

        .nav-icon {
          width: 20px;
          height: 20px;
          transition: all 0.3s;
        }

        .active .nav-icon {
          color: #FF0080;
          filter: drop-shadow(0 0 8px rgba(255, 0, 128, 0.5));
        }

        .active-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #FF0080;
          box-shadow: 0 0 10px #FF0080;
          margin-left: auto;
        }

        /* Profile Section */
        .sidebar-footer {
          padding: 20px;
          margin-top: auto;
        }

        .user-card {
          background: rgba(255, 255, 255, 0.03);
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 20px;
          padding: 15px;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }

        .user-info {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .user-avatar {
          width: 40px;
          height: 40px;
          border-radius: 12px;
          background: linear-gradient(135deg, #FF0080, #7928ca);
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 900;
          font-size: 16px;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }

        .user-name {
          font-size: 14px;
          font-weight: 800;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .user-status {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 9px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: #22d3ee;
        }

        .status-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #22d3ee;
          box-shadow: 0 0 8px #22d3ee;
        }

        .logout-btn {
          width: 100%;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255, 0, 85, 0.1);
          border: 1px solid rgba(255, 0, 85, 0.2);
          color: #ff0055;
          font-size: 11px;
          font-weight: 900;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          transition: all 0.3s;
        }

        .logout-btn:hover {
          background: rgba(255, 0, 85, 0.2);
          color: #fff;
          border-color: #ff0055;
        }

        /* Scrollbar */
        .sidebar-nav::-webkit-scrollbar {
          width: 3px;
        }
        .sidebar-nav::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
      `}</style>

      {/* Header / Brand */}
      <div className="sidebar-brand">
        <div className="brand-logo-box">
          <Sparkles size={28} color="#fff" />
        </div>
        <div className="brand-info">
          <h1 className="brand-name">IMPÉRIO <span>COPY</span></h1>
          <p className="brand-tag">Cyber Command</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {MENU_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="nav-group-title">{group.title}</h3>
            <div className="nav-items">
              {group.items.map((item) => (
                <NavLink 
                  key={item.path} 
                  to={item.path} 
                  className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
                >
                  <item.icon className="nav-icon" />
                  <span>{item.label}</span>
                  <div className="active-marker" />
                </NavLink>
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Profile & Logout */}
      <div className="sidebar-footer">
        <div className="user-card">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="user-details">
              <p className="user-name">{user?.name}</p>
              <div className="user-status">
                <div className="status-dot" />
                <span>{user?.plan} Access</span>
              </div>
            </div>
          </div>
          
          <button onClick={handleLogout} className="logout-btn">
            <LogOut size={16} />
            Encerrar Comando
          </button>
        </div>
      </div>
    </aside>
  );
}
