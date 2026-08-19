import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Clock, User, Search } from 'lucide-react';
import { NEWS } from '../data/mockData';
import PageHeader from '../components/PageHeader';

const CATEGORY_COLORS = {
  RH: 'bg-purple-100 text-purple-700',
  Empresa: 'bg-blue-100 text-blue-700',
  Tecnologia: 'bg-cyan-100 text-cyan-700',
};

const COVER_GRADIENTS = {
  wellness:  'from-green-400 to-teal-500',
  results:   'from-blue-500 to-indigo-600',
  mentoring: 'from-purple-400 to-pink-500',
  office:    'from-amber-400 to-orange-500',
  security:  'from-red-400 to-rose-600',
};

const COVER_ICONS = {
  wellness:  '🧘',
  results:   '📈',
  mentoring: '🤝',
  office:    '🏢',
  security:  '🔒',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-PT', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

const ALL_CATEGORIES = ['Todos', ...new Set(NEWS.map(n => n.category))];

export function NewsDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const news = NEWS.find(n => n.id === Number(id));

  if (!news) return (
    <div className="text-center py-20">
      <p className="text-gray-500">Notícia não encontrada.</p>
      <button onClick={() => navigate('/noticias')} className="mt-4 text-tis-600 hover:underline text-sm">
        ← Voltar às notícias
      </button>
    </div>
  );

  const gradient = COVER_GRADIENTS[news.image] || 'from-tis-500 to-tis-700';
  const icon = COVER_ICONS[news.image] || '📰';

  return (
    <div className="max-w-3xl mx-auto">
      <button
        onClick={() => navigate('/noticias')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 mb-4 transition-colors"
      >
        <ArrowLeft size={16} /> Voltar às notícias
      </button>

      <div className={`bg-gradient-to-r ${gradient} rounded-2xl h-48 flex items-center justify-center text-6xl mb-6`}>
        {icon}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8">
        <div className="flex flex-wrap gap-2 mb-4">
          <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[news.category] || 'bg-gray-100 text-gray-600'}`}>
            {news.category}
          </span>
          {news.featured && (
            <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-red-100 text-red-600">
              Destaque
            </span>
          )}
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-4 leading-tight">{news.title}</h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
          <span className="flex items-center gap-1.5"><Clock size={14} /> {formatDate(news.date)}</span>
          <span className="flex items-center gap-1.5"><User size={14} /> {news.author}</span>
          <span className="text-gray-400">·</span>
          <span>{news.department}</span>
        </div>

        <p className="text-gray-600 text-base leading-relaxed">{news.content}</p>
      </div>
    </div>
  );
}

export default function News() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const filtered = NEWS.filter(n => {
    const matchCat = category === 'Todos' || n.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || n.title.toLowerCase().includes(q) || n.excerpt.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  return (
    <div>
      <PageHeader tag="Portal TIS" title="Notícias" description="Fique a par de tudo o que acontece na TIS" />
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
      {/* Search and filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar notícias…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tis-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {ALL_CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                category === cat
                  ? 'bg-tis-700 text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Featured */}
      {category === 'Todos' && !search && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {NEWS.filter(n => n.featured).map(n => {
            const gradient = COVER_GRADIENTS[n.image] || 'from-tis-500 to-tis-700';
            const icon = COVER_ICONS[n.image] || '📰';
            return (
              <Link
                key={n.id}
                to={`/noticias/${n.id}`}
                className="relative bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow group"
              >
                <div className={`bg-gradient-to-r ${gradient} h-32 flex items-center justify-center text-4xl`}>
                  {icon}
                </div>
                <div className="p-5">
                  <div className="flex gap-2 mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[n.category] || 'bg-gray-100 text-gray-600'}`}>
                      {n.category}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-red-100 text-red-600">Destaque</span>
                  </div>
                  <h3 className="font-bold text-gray-900 group-hover:text-tis-700 transition-colors leading-snug">{n.title}</h3>
                  <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{n.excerpt}</p>
                  <div className="flex items-center gap-3 mt-3 text-xs text-gray-400">
                    <span>{formatDate(n.date)}</span>
                    <span>·</span>
                    <span>{n.author}</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* All news list */}
      <div>
        {category === 'Todos' && !search && (
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Todas as notícias</h3>
        )}
        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
            <p className="text-gray-400 text-sm">Nenhuma notícia encontrada.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(n => {
              const icon = COVER_ICONS[n.image] || '📰';
              const gradient = COVER_GRADIENTS[n.image] || 'from-tis-500 to-tis-700';
              return (
                <Link
                  key={n.id}
                  to={`/noticias/${n.id}`}
                  className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-shadow group"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex-shrink-0 flex items-center justify-center text-2xl`}>
                    {icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap gap-1.5 mb-1">
                      <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[n.category] || 'bg-gray-100 text-gray-600'}`}>
                        {n.category}
                      </span>
                    </div>
                    <h4 className="font-semibold text-gray-900 group-hover:text-tis-700 transition-colors text-sm leading-snug">{n.title}</h4>
                    <p className="text-xs text-gray-500 mt-1 line-clamp-1">{n.excerpt}</p>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(n.date)} · {n.author}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
      </div>
    </div>
  );
}
