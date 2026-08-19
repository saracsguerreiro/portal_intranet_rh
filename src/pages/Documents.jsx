import { useState } from 'react';
import { FileText, File, Search, Download, ChevronRight, FolderOpen } from 'lucide-react';
import { DOCUMENTS } from '../data/mockData';

const CATEGORIES = ['Todos', 'Políticas', 'Formulários', 'Benefícios'];

const CATEGORY_COLORS = {
  Políticas:   'bg-blue-100 text-blue-700',
  Formulários: 'bg-amber-100 text-amber-700',
  Benefícios:  'bg-green-100 text-green-700',
};

const TYPE_COLORS = {
  PDF:  'bg-red-100 text-red-700',
  DOCX: 'bg-blue-100 text-blue-700',
  XLSX: 'bg-green-100 text-green-700',
};

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-PT', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

export default function Documents() {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('Todos');

  const filtered = DOCUMENTS.filter(d => {
    const matchCat = category === 'Todos' || d.category === category;
    const q = search.toLowerCase();
    const matchSearch = !q || d.title.toLowerCase().includes(q) || d.description.toLowerCase().includes(q);
    return matchCat && matchSearch;
  });

  const grouped = CATEGORIES.slice(1).reduce((acc, cat) => {
    acc[cat] = filtered.filter(d => d.category === cat);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Search + filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Pesquisar documentos…"
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-tis-500"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map(cat => (
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

      {filtered.length === 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 py-16 text-center">
          <FolderOpen size={32} className="text-gray-300 mx-auto mb-2" />
          <p className="text-gray-400 text-sm">Nenhum documento encontrado.</p>
        </div>
      )}

      {category === 'Todos' && !search ? (
        CATEGORIES.slice(1).map(cat => {
          const docs = grouped[cat];
          if (!docs || docs.length === 0) return null;
          return (
            <section key={cat}>
              <div className="flex items-center gap-2 mb-3">
                <FolderOpen size={16} className="text-tis-600" />
                <h3 className="font-semibold text-gray-800">{cat}</h3>
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  {docs.length}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {docs.map(doc => <DocCard key={doc.id} doc={doc} />)}
              </div>
            </section>
          );
        })
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map(doc => <DocCard key={doc.id} doc={doc} />)}
        </div>
      )}
    </div>
  );
}

function DocCard({ doc }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow group">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
          <FileText size={20} className="text-red-500" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-semibold text-gray-900 text-sm leading-snug group-hover:text-tis-700 transition-colors">
              {doc.title}
            </h4>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium flex-shrink-0 ${TYPE_COLORS[doc.type] || 'bg-gray-100 text-gray-600'}`}>
              {doc.type}
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">{doc.description}</p>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span>v{doc.version}</span>
              <span>·</span>
              <span>{doc.size}</span>
              <span>·</span>
              <span>{new Date(doc.date).toLocaleDateString('pt-PT', { month: 'short', year: 'numeric' })}</span>
            </div>
            <button className="flex items-center gap-1 text-xs text-tis-600 hover:text-tis-800 font-medium transition-colors">
              <Download size={13} />
              Descarregar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
