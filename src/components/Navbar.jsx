import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, Bell, LogOut, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NAV = [
  { to: '/',           label: 'Início' },
  { to: '/noticias',   label: 'Notícias' },
  { to: '/eventos',    label: 'Eventos' },
  { to: '/documentos', label: 'Documentos' },
  { to: '/mural',      label: 'Mural Social' },
];

export default function Navbar() {
  const { user, logout, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300
        ${scrolled
          ? 'bg-tis-950/95 backdrop-blur-md shadow-lg'
          : 'bg-tis-950'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-8 h-8 bg-tis-500 rounded-lg flex items-center justify-center font-bold text-white text-sm">
              TIS
            </div>
            <span className="text-white font-semibold text-sm hidden sm:block">Intranet RH</span>
          </NavLink>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                end={to === '/'}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-white/15 text-white'
                    : 'text-tis-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                {label}
              </NavLink>
            ))}
            {(isAdmin || isManager) && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-medium transition-all
                  ${isActive
                    ? 'bg-white/15 text-white'
                    : 'text-tis-300 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                Administração
              </NavLink>
            )}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button className="relative p-2 rounded-lg text-tis-300 hover:bg-white/10 hover:text-white transition-all">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
            </button>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserOpen(v => !v)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-white/10 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-tis-500 flex items-center justify-center text-xs font-bold text-white">
                  {user?.avatar}
                </div>
                <span className="text-sm text-white hidden sm:block">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className="text-tis-400 hidden sm:block" />
              </button>

              {userOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-gray-100 z-20 overflow-hidden">
                    <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
                      <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{roleLabel}</p>
                    </div>
                    <div className="py-1">
                      <NavLink
                        to="/perfil"
                        onClick={() => setUserOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        O Meu Perfil
                      </NavLink>
                      {(isAdmin || isManager) && (
                        <NavLink
                          to="/admin"
                          onClick={() => setUserOpen(false)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Settings size={15} className="text-gray-400" />
                          Administração
                        </NavLink>
                      )}
                    </div>
                    <div className="border-t border-gray-100 py-1">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50"
                      >
                        <LogOut size={15} />
                        Terminar Sessão
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden p-2 rounded-lg text-tis-300 hover:bg-white/10 hover:text-white transition-all"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-tis-900 border-t border-tis-800 px-4 py-3 space-y-1">
          {NAV.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive ? 'bg-white/15 text-white' : 'text-tis-300 hover:bg-white/10 hover:text-white'}`
              }
            >
              {label}
            </NavLink>
          ))}
          {(isAdmin || isManager) && (
            <NavLink
              to="/admin"
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-2.5 rounded-lg text-sm font-medium transition-all
                ${isActive ? 'bg-white/15 text-white' : 'text-tis-300 hover:bg-white/10 hover:text-white'}`
              }
            >
              Administração
            </NavLink>
          )}
        </div>
      )}
    </header>
  );
}
