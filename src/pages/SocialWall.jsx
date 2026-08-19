import { useState } from 'react';
import { Heart, Award, Cake, Briefcase, Send } from 'lucide-react';
import { KUDOS, BIRTHDAYS, VACANCIES } from '../data/mockData';
import { useAuth } from '../contexts/AuthContext';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-PT', {
    day: '2-digit', month: 'long',
  });
}

const BADGE_COLORS = {
  '🏆 Excelência':       'bg-yellow-50 border-yellow-200 text-yellow-700',
  '🚀 Liderança':        'bg-blue-50 border-blue-200 text-blue-700',
  '💙 Espírito de Equipa':'bg-pink-50 border-pink-200 text-pink-700',
};

export default function SocialWall() {
  const { user } = useAuth();
  const [kudos, setKudos] = useState(KUDOS);
  const [kudoForm, setKudoForm] = useState({ to: '', badge: '🏆 Excelência', message: '' });
  const [showForm, setShowForm] = useState(false);
  const [liked, setLiked] = useState({});

  const BADGES = ['🏆 Excelência', '🚀 Liderança', '💙 Espírito de Equipa', '💡 Inovação', '⚡ Energia'];

  function submitKudo(e) {
    e.preventDefault();
    if (!kudoForm.to || !kudoForm.message) return;
    setKudos(prev => [{
      id: Date.now(),
      from: user.name,
      fromAvatar: user.avatar,
      to: kudoForm.to,
      toAvatar: kudoForm.to.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase(),
      message: kudoForm.message,
      date: new Date().toISOString().split('T')[0],
      badge: kudoForm.badge,
    }, ...prev]);
    setKudoForm({ to: '', badge: '🏆 Excelência', message: '' });
    setShowForm(false);
  }

  function toggleLike(id) {
    setLiked(prev => ({ ...prev, [id]: !prev[id] }));
  }

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kudos */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={18} className="text-amber-500" />
              <h3 className="font-semibold text-gray-800">Kudos — Reconhecimentos</h3>
            </div>
            <button
              onClick={() => setShowForm(v => !v)}
              className="flex items-center gap-2 bg-tis-700 hover:bg-tis-800 text-white text-sm font-medium px-4 py-2 rounded-xl transition-colors"
            >
              <Award size={14} />
              Dar Kudos
            </button>
          </div>

          {showForm && (
            <form onSubmit={submitKudo} className="bg-white rounded-2xl border border-tis-200 p-5 space-y-4">
              <h4 className="font-semibold text-gray-800 text-sm">Reconhece um colega 🏆</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Para quem?</label>
                  <input
                    type="text"
                    value={kudoForm.to}
                    onChange={e => setKudoForm(p => ({ ...p, to: e.target.value }))}
                    placeholder="Nome do colega"
                    required
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tis-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-600 mb-1">Distinção</label>
                  <select
                    value={kudoForm.badge}
                    onChange={e => setKudoForm(p => ({ ...p, badge: e.target.value }))}
                    className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tis-500"
                  >
                    {BADGES.map(b => <option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Mensagem</label>
                <textarea
                  value={kudoForm.message}
                  onChange={e => setKudoForm(p => ({ ...p, message: e.target.value }))}
                  placeholder="Escreve uma mensagem de reconhecimento…"
                  required
                  rows={3}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-tis-500 resize-none"
                />
              </div>
              <div className="flex gap-2 justify-end">
                <button type="button" onClick={() => setShowForm(false)} className="text-sm text-gray-500 hover:text-gray-700 px-4 py-2">
                  Cancelar
                </button>
                <button type="submit" className="flex items-center gap-2 bg-tis-700 hover:bg-tis-800 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors">
                  <Send size={14} /> Publicar
                </button>
              </div>
            </form>
          )}

          <div className="space-y-3">
            {kudos.map(kudo => (
              <div key={kudo.id} className="bg-white rounded-2xl border border-gray-100 p-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-tis-100 flex items-center justify-center text-xs font-bold text-tis-700 flex-shrink-0">
                    {kudo.fromAvatar}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="text-sm font-semibold text-gray-800">{kudo.from}</span>
                      <span className="text-gray-400 text-xs">→</span>
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">
                          {kudo.toAvatar}
                        </div>
                        <span className="text-sm font-semibold text-tis-700">{kudo.to}</span>
                      </div>
                    </div>
                    <div className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border mb-3 ${BADGE_COLORS[kudo.badge] || 'bg-gray-50 border-gray-200 text-gray-600'}`}>
                      {kudo.badge}
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">{kudo.message}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs text-gray-400">{formatDate(kudo.date)}</span>
                      <button
                        onClick={() => toggleLike(kudo.id)}
                        className={`flex items-center gap-1.5 text-xs font-medium transition-colors ${liked[kudo.id] ? 'text-red-500' : 'text-gray-400 hover:text-red-400'}`}
                      >
                        <Heart size={14} fill={liked[kudo.id] ? 'currentColor' : 'none'} />
                        {liked[kudo.id] ? 'Gostei' : 'Gosto'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right sidebar */}
        <div className="space-y-4">
          {/* Birthdays */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Cake size={16} className="text-pink-500" />
              <h3 className="font-semibold text-gray-800 text-sm">Próximos Aniversários</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {BIRTHDAYS.map(b => (
                <div key={b.name} className="flex items-center gap-3 px-4 py-3">
                  <div className="w-9 h-9 rounded-full bg-pink-100 flex items-center justify-center text-xs font-bold text-pink-600 flex-shrink-0">
                    {b.avatar}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-800">{b.name}</p>
                    <p className="text-xs text-gray-500">
                      🎂 {formatDate(b.date)}
                      {b.years && <span className="ml-1 text-amber-600">· {b.years} anos TIS</span>}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vacancies */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center gap-2">
              <Briefcase size={16} className="text-tis-600" />
              <h3 className="font-semibold text-gray-800 text-sm">Vagas Internas</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {VACANCIES.map(v => (
                <div key={v.id} className="px-4 py-3">
                  <p className="text-sm font-semibold text-gray-800">{v.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{v.department} · {v.location}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-400">Candidatura até {new Date(v.deadline).toLocaleDateString('pt-PT', { day: '2-digit', month: 'short' })}</span>
                    <button className="text-xs text-tis-600 hover:text-tis-800 font-medium">
                      Candidatar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
