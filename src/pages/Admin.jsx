import { useState } from 'react';
import {
  Newspaper, Calendar, FolderOpen, Users,
  Plus, Trash2, Edit3, Check, X, Shield,
} from 'lucide-react';
import { NEWS, EVENTS, USERS } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

const TABS = [
  { id: 'news',      label: 'Notícias',       icon: Newspaper },
  { id: 'events',    label: 'Eventos',         icon: Calendar },
  { id: 'users',     label: 'Utilizadores',    icon: Users },
];

const ROLE_LABELS = {
  admin:    { label: 'Admin RH',      color: 'bg-purple-100 text-purple-700' },
  manager:  { label: 'Responsável',   color: 'bg-blue-100 text-blue-700' },
  employee: { label: 'Colaborador',   color: 'bg-green-100 text-green-700' },
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short', year: 'numeric' });
}

export default function Admin() {
  const { isAdmin } = useAuth();
  const [tab, setTab] = useState('news');
  const [news, setNews] = useState(NEWS);
  const [events, setEvents] = useState(EVENTS);
  const [newNewsForm, setNewNewsForm] = useState({ title: '', category: 'RH', excerpt: '' });
  const [showNewNews, setShowNewNews] = useState(false);
  const [newEventForm, setNewEventForm] = useState({ title: '', date: '', location: '', category: 'Empresa' });
  const [showNewEvent, setShowNewEvent] = useState(false);

  function addNews(e) {
    e.preventDefault();
    setNews(prev => [{
      id: Date.now(),
      ...newNewsForm,
      date: new Date().toISOString().split('T')[0],
      author: 'Admin',
      department: 'RH',
      image: 'results',
      featured: false,
      content: newNewsForm.excerpt,
    }, ...prev]);
    setNewNewsForm({ title: '', category: 'RH', excerpt: '' });
    setShowNewNews(false);
  }

  function deleteNews(id) {
    setNews(prev => prev.filter(n => n.id !== id));
  }

  function addEvent(e) {
    e.preventDefault();
    setEvents(prev => [{
      id: Date.now(),
      ...newEventForm,
      time: '09:00',
      description: 'Descrição a completar.',
      department: 'RH',
    }, ...prev]);
    setNewEventForm({ title: '', date: '', location: '', category: 'Empresa' });
    setShowNewEvent(false);
  }

  function deleteEvent(id) {
    setEvents(prev => prev.filter(e => e.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-5">
      {!isAdmin && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3 text-amber-800 text-sm">
          <Shield size={18} />
          <span>Acesso limitado: apenas pode gerir conteúdo do seu departamento.</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 bg-white border border-gray-200 rounded-xl p-1 w-fit">
        {TABS.filter(t => isAdmin || t.id !== 'users').map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === id ? 'bg-tis-700 text-white' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      {/* News tab */}
      {tab === 'news' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Gestão de Notícias</h3>
            <button
              onClick={() => setShowNewNews(v => !v)}
              className="flex items-center gap-2 bg-tis-700 hover:bg-tis-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <Plus size={15} /> Nova Notícia
            </button>
          </div>

          {showNewNews && (
            <form onSubmit={addNews} className="bg-white rounded-2xl border border-tis-200 p-5 space-y-4">
              <h4 className="font-semibold text-gray-800 text-sm">Nova Notícia</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
                  <input
                    required
                    type="text"
                    value={newNewsForm.title}
                    onChange={e => setNewNewsForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Título da notícia"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tis-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Categoria</label>
                  <select
                    value={newNewsForm.category}
                    onChange={e => setNewNewsForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tis-500"
                  >
                    {['RH', 'Empresa', 'Tecnologia', 'Marketing'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Texto / Resumo</label>
                  <textarea
                    required
                    value={newNewsForm.excerpt}
                    onChange={e => setNewNewsForm(p => ({ ...p, excerpt: e.target.value }))}
                    rows={3}
                    placeholder="Escreva o conteúdo ou resumo da notícia…"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tis-500 resize-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowNewNews(false)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">Cancelar</button>
                <button type="submit" className="flex items-center gap-1.5 bg-tis-700 hover:bg-tis-800 text-white text-sm font-medium px-5 py-2 rounded-xl">
                  <Check size={14} /> Publicar
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Título</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Categoria</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Data</th>
                  <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {news.map(n => (
                  <tr key={n.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs">
                      <span className="line-clamp-1">{n.title}</span>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">{n.category}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">{formatDate(n.date)}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-tis-600 hover:bg-tis-50 rounded-lg transition-colors" title="Editar">
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteNews(n.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Apagar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Events tab */}
      {tab === 'events' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-gray-800">Gestão de Eventos</h3>
            <button
              onClick={() => setShowNewEvent(v => !v)}
              className="flex items-center gap-2 bg-tis-700 hover:bg-tis-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <Plus size={15} /> Novo Evento
            </button>
          </div>

          {showNewEvent && (
            <form onSubmit={addEvent} className="bg-white rounded-2xl border border-tis-200 p-5 space-y-4">
              <h4 className="font-semibold text-gray-800 text-sm">Novo Evento</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Título</label>
                  <input required type="text" value={newEventForm.title}
                    onChange={e => setNewEventForm(p => ({ ...p, title: e.target.value }))}
                    placeholder="Nome do evento"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tis-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Data</label>
                  <input required type="date" value={newEventForm.date}
                    onChange={e => setNewEventForm(p => ({ ...p, date: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tis-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Categoria</label>
                  <select value={newEventForm.category}
                    onChange={e => setNewEventForm(p => ({ ...p, category: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tis-500"
                  >
                    {['Empresa', 'Formação', 'Bem-Estar', 'Reunião'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-gray-600 mb-1">Local</label>
                  <input type="text" value={newEventForm.location}
                    onChange={e => setNewEventForm(p => ({ ...p, location: e.target.value }))}
                    placeholder="Local do evento"
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tis-500"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowNewEvent(false)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">Cancelar</button>
                <button type="submit" className="flex items-center gap-1.5 bg-tis-700 hover:bg-tis-800 text-white text-sm font-medium px-5 py-2 rounded-xl">
                  <Check size={14} /> Criar Evento
                </button>
              </div>
            </form>
          )}

          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Evento</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Data</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Local</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {events.map(ev => (
                  <tr key={ev.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-800 max-w-xs">
                      <span className="line-clamp-1">{ev.title}</span>
                    </td>
                    <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{formatDate(ev.date)}</td>
                    <td className="px-4 py-3 text-gray-500 hidden md:table-cell">
                      <span className="line-clamp-1">{ev.location}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button className="p-1.5 text-gray-400 hover:text-tis-600 hover:bg-tis-50 rounded-lg transition-colors" title="Editar">
                          <Edit3 size={14} />
                        </button>
                        <button
                          onClick={() => deleteEvent(ev.id)}
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Apagar"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Users tab (admin only) */}
      {tab === 'users' && isAdmin && (
        <div className="space-y-4">
          <h3 className="font-semibold text-gray-800">Gestão de Utilizadores e Permissões</h3>
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Nome</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden sm:table-cell">Departamento</th>
                  <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Perfil</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {USERS.map(u => {
                  const role = ROLE_LABELS[u.role];
                  return (
                    <tr key={u.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-tis-100 flex items-center justify-center text-xs font-bold text-tis-700">
                            {u.avatar}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{u.name}</p>
                            <p className="text-xs text-gray-400">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-500 hidden sm:table-cell">{u.department}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${role?.color}`}>
                          {role?.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-center">
                          <button className="p-1.5 text-gray-400 hover:text-tis-600 hover:bg-tis-50 rounded-lg transition-colors" title="Editar permissões">
                            <Shield size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="bg-tis-50 border border-tis-100 rounded-2xl p-4 text-sm text-tis-700">
            A gestão completa de permissões e convites de novos utilizadores estará disponível na Fase 2 do portal.
          </div>
        </div>
      )}
    </div>
  );
}
