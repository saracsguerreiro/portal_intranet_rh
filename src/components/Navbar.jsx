import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, X, LogOut, ChevronDown, Settings, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const NAV = [
  { to: '/',           label: 'Início',       end: true  },
  { to: '/noticias',   label: 'Notícias',     end: false },
  { to: '/eventos',    label: 'Eventos',      end: false },
  { to: '/documentos', label: 'Documentos',   end: false },
  { to: '/mural',      label: 'Mural Social', end: false },
];

export default function Navbar() {
  const { user, logout, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen]   = useState(false);
  const [userOpen, setUserOpen]   = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  const roleLabel = {
    admin:    'Administrador RH',
    manager:  'Responsável de Departamento',
    employee: 'Colaborador TIS',
  }[user?.role] ?? '';

  return (
    <>
      {/* ── Pill branca flutuante ─────────────────────────────────────── */}
      <header className="fixed top-3 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-3rem)] max-w-6xl">
        <div className="bg-white rounded-full shadow-xl px-5 py-2.5 flex items-center justify-between gap-4">

          {/* Logo TIS */}
          <NavLink to="/" className="flex-shrink-0 flex items-center">
            <img
              src={`${import.meta.env.BASE_URL}tis-logo-01.svg`}
              alt="TIS"
              className="h-8 w-auto"
            />
          </NavLink>

          {/* Navegação desktop */}
          <nav className="hidden md:flex items-center gap-1 flex-1 justify-center">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `px-4 py-1.5 rounded-full text-sm font-medium transition-all
                   ${isActive
                     ? 'bg-gray-100 text-gray-900'
                     : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
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
                  `px-4 py-1.5 rounded-full text-sm font-medium transition-all
                   ${isActive
                     ? 'bg-gray-100 text-gray-900'
                     : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                   }`
                }
              >
                Administração
              </NavLink>
            )}
          </nav>

          {/* Lado direito */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* Notificações */}
            <button className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 transition-all hidden sm:flex">
              <Bell size={17} />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-400 rounded-full" />
            </button>

            {/* Botão "Abrir CHAT" */}
            <button className="hidden sm:flex items-center bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold px-4 py-1.5 rounded-full transition-colors">
              Abrir CHAT
            </button>

            {/* User dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserOpen(v => !v)}
                className="flex items-center gap-2 px-2 py-1 rounded-full hover:bg-gray-100 transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                  {user?.avatar}
                </div>
                <span className="text-sm text-gray-800 font-medium hidden sm:block">{user?.name?.split(' ')[0]}</span>
                <ChevronDown size={14} className="text-gray-400 hidden sm:block" />
              </button>

              {userOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 z-20 overflow-hidden">
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

            {/* Hamburger mobile */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              className="md:hidden p-2 rounded-full text-gray-600 hover:bg-gray-100 transition-all"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Menu mobile */}
        {menuOpen && (
          <div className="mt-2 bg-white rounded-2xl shadow-xl border border-gray-100 px-4 py-3 space-y-1">
            {NAV.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                   ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`
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
                  `block px-4 py-2.5 rounded-xl text-sm font-medium transition-all
                   ${isActive ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-100'}`
                }
              >
                Administração
              </NavLink>
            )}
            <div className="pt-2 border-t border-gray-100 space-y-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-xl"
              >
                <LogOut size={15} />
                Terminar Sessão
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
