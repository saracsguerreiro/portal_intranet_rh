import { Link } from 'react-router-dom';
import {
  Users, Newspaper, Calendar, FolderOpen,
  Heart, ChevronRight, TrendingUp, Clock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NEWS, EVENTS, BIRTHDAYS } from '../data/mockData';

const CATEGORY_COLORS = {
  RH: 'bg-purple-100 text-purple-700',
  Empresa: 'bg-blue-100 text-blue-700',
  Tecnologia: 'bg-cyan-100 text-cyan-700',
  'Bem-Estar': 'bg-green-100 text-green-700',
  Formação: 'bg-amber-100 text-amber-700',
  Reunião: 'bg-red-100 text-red-700',
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

function formatDateShort(dateStr) {
  const d = new Date(dateStr);
  return { day: d.getDate(), month: d.toLocaleDateString('pt-PT', { month: 'short' }) };
}

export default function Dashboard() {
  const { user } = useAuth();
  const latestNews = NEWS.slice(0, 3);
  const upcomingEvents = EVENTS
    .sort((a, b) => new Date(a.date) - new Date(b.date))
    .slice(0, 4);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Welcome banner */}
      <div className="bg-gradient-to-r from-tis-700 to-tis-500 rounded-2xl p-6 text-white">
        <p className="text-tis-200 text-sm mb-1">{greeting},</p>
        <h2 className="text-2xl font-bold mb-1">{user?.name} 👋</h2>
        <p className="text-tis-200 text-sm">{user?.position} · {user?.department}</p>
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="bg-white/20 text-white text-xs px-3 py-1 rounded-full">
            📅 {new Date().toLocaleDateString('pt-PT', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Notícias',     value: NEWS.length,    icon: Newspaper, color: 'text-blue-600',   bg: 'bg-blue-50',   to: '/noticias' },
          { label: 'Eventos',      value: EVENTS.length,  icon: Calendar,  color: 'text-purple-600', bg: 'bg-purple-50', to: '/eventos' },
          { label: 'Documentos',   value: 8,              icon: FolderOpen,color: 'text-amber-600',  bg: 'bg-amber-50',  to: '/documentos' },
          { label: 'Colaboradores',value: 127,            icon: Users,     color: 'text-green-600',  bg: 'bg-green-50',  to: '/mural' },
        ].map(({ label, value, icon: Icon, color, bg, to }) => (
          <Link key={label} to={to} className="bg-white rounded-xl p-4 border border-gray-100 hover:shadow-md transition-shadow group">
            <div className={`w-10 h-10 ${bg} rounded-lg flex items-center justify-center mb-3`}>
              <Icon size={20} className={color} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{value}</p>
            <p className="text-sm text-gray-500 mt-0.5">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Latest news */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Newspaper size={18} className="text-tis-600" />
              <h3 className="font-semibold text-gray-800">Últimas Notícias</h3>
            </div>
            <Link to="/noticias" className="text-sm text-tis-600 hover:text-tis-700 flex items-center gap-1">
              Ver todas <ChevronRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {latestNews.map(n => (
              <Link
                key={n.id}
                to={`/noticias/${n.id}`}
                className="flex gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[n.category] || 'bg-gray-100 text-gray-600'}`}>
                      {n.category}
                    </span>
                    {n.featured && (
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-600">
                        Destaque
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-gray-800 group-hover:text-tis-700 transition-colors line-clamp-2">
                    {n.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-1">{n.excerpt}</p>
                  <div className="flex items-center gap-3 mt-2 text-xs text-gray-400">
                    <span className="flex items-center gap-1"><Clock size={11} /> {formatDate(n.date)}</span>
                    <span>{n.author}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Upcoming events */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-tis-600" />
                <h3 className="font-semibold text-gray-800">Próximos Eventos</h3>
              </div>
              <Link to="/eventos" className="text-sm text-tis-600 hover:text-tis-700 flex items-center gap-1">
                <ChevronRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-gray-50">
              {upcomingEvents.map(ev => {
                const { day, month } = formatDateShort(ev.date);
                return (
                  <div key={ev.id} className="flex gap-3 px-4 py-3">
                    <div className="w-10 flex-shrink-0 text-center">
                      <p className="text-lg font-bold text-tis-700 leading-none">{day}</p>
                      <p className="text-xs text-gray-400 uppercase">{month}</p>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">{ev.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{ev.time} · {ev.location}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Birthdays */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Heart size={18} className="text-pink-500" />
              <h3 className="font-semibold text-gray-800">Próximos Aniversários</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {BIRTHDAYS.map(b => (
                <div key={b.name} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600 flex-shrink-0">
                    {b.avatar}
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-800">{b.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatDate(b.date)}
                      {b.years && <span className="ml-1 text-amber-600">· {b.years} anos na TIS 🎉</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h3 className="font-semibold text-gray-800 mb-3 text-sm">Acessos Rápidos</h3>
            <div className="grid grid-cols-2 gap-2">
              {[
                { to: '/documentos', label: '📄 Formulários', sub: 'Pedidos e requerimentos' },
                { to: '/mural',      label: '🏆 Dar Kudos',   sub: 'Reconhecer colegas' },
                { to: '/eventos',    label: '📅 Calendário',  sub: 'Ver todos os eventos' },
                { to: '/documentos', label: '📋 Políticas',   sub: 'Regulamentos internos' },
              ].map(({ to, label, sub }) => (
                <Link
                  key={label}
                  to={to}
                  className="bg-gray-50 hover:bg-tis-50 border border-gray-100 hover:border-tis-200 rounded-xl p-3 transition-colors group"
                >
                  <p className="text-sm font-medium text-gray-700 group-hover:text-tis-700">{label}</p>
                  <p className="text-xs text-gray-400 mt-0.5 leading-tight">{sub}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
