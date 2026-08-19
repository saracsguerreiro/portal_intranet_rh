import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Newspaper, Calendar, FolderOpen,
  Heart, User, Settings, LogOut, X,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NAV = [
  { to: '/',          icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/noticias',  icon: Newspaper,       label: 'Notícias' },
  { to: '/eventos',   icon: Calendar,        label: 'Agenda de Eventos' },
  { to: '/documentos',icon: FolderOpen,      label: 'Documentos' },
  { to: '/mural',     icon: Heart,           label: 'Mural Social' },
  { to: '/perfil',    icon: User,            label: 'O Meu Perfil' },
];

export default function Sidebar({ open, onClose }) {
  const { user, logout, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const roleLabel = {
    admin: 'Administrador RH',
    manager: 'Responsável de Departamento',
    employee: 'Colaborador TIS',
  }[user?.role] ?? '';

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-tis-950 text-white z-30 flex flex-col
          transform transition-transform duration-300
          ${open ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static lg:z-auto`}
      >
        <div className="flex items-center justify-between px-5 py-5 border-b border-tis-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-tis-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              TIS
            </div>
            <span className="font-semibold text-white text-sm leading-tight">
              Intranet RH
            </span>
          </div>
          <button onClick={onClose} className="lg:hidden text-tis-300 hover:text-white">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto scrollbar-thin">
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive
                  ? 'bg-tis-700 text-white'
                  : 'text-tis-300 hover:bg-tis-800 hover:text-white'}`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}

          {(isAdmin || isManager) && (
            <>
              <div className="pt-4 pb-1 px-3">
                <span className="text-xs text-tis-500 uppercase tracking-wider font-semibold">
                  Administração
                </span>
              </div>
              <NavLink
                to="/admin"
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-tis-700 text-white'
                    : 'text-tis-300 hover:bg-tis-800 hover:text-white'}`
                }
              >
                <Settings size={18} />
                Painel de Administração
              </NavLink>
            </>
          )}
        </nav>

        <div className="px-3 py-4 border-t border-tis-800">
          <div className="flex items-center gap-3 px-3 py-2 mb-2">
            <div className="w-8 h-8 rounded-full bg-tis-600 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.avatar}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white truncate">{user?.name}</p>
              <p className="text-xs text-tis-400 truncate">{roleLabel}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-tis-300 hover:bg-tis-800 hover:text-white transition-all"
          >
            <LogOut size={18} />
            Terminar Sessão
          </button>
        </div>
      </aside>
    </>
  );
}
