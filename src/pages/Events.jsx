import { useState } from 'react';
import { MapPin, Clock, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { EVENTS } from '../data/mockData';

const CATEGORY_COLORS = {
  'Bem-Estar': 'bg-green-100 text-green-700 border-green-200',
  Empresa:     'bg-blue-100 text-blue-700 border-blue-200',
  Formação:    'bg-amber-100 text-amber-700 border-amber-200',
  Reunião:     'bg-red-100 text-red-700 border-red-200',
};

const DOT_COLORS = {
  'Bem-Estar': 'bg-green-400',
  Empresa:     'bg-blue-400',
  Formação:    'bg-amber-400',
  Reunião:     'bg-red-400',
};

const MONTHS_PT = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
const WEEKDAYS = ['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('pt-PT', {
    day: '2-digit', month: 'long', year: 'numeric',
  });
}

export default function Events() {
  const today = new Date();
  const [view, setView] = useState('list');
  const [calYear, setCalYear] = useState(today.getFullYear());
  const [calMonth, setCalMonth] = useState(today.getMonth());

  const sorted = [...EVENTS].sort((a, b) => new Date(a.date) - new Date(b.date));
  const upcoming = sorted.filter(e => new Date(e.date) >= new Date(today.toDateString()));

  function prevMonth() {
    if (calMonth === 0) { setCalMonth(11); setCalYear(y => y - 1); }
    else setCalMonth(m => m - 1);
  }
  function nextMonth() {
    if (calMonth === 11) { setCalMonth(0); setCalYear(y => y + 1); }
    else setCalMonth(m => m + 1);
  }

  const firstDay = new Date(calYear, calMonth, 1).getDay();
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();

  const eventsByDate = {};
  EVENTS.forEach(e => {
    const d = new Date(e.date);
    if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
      const key = d.getDate();
      if (!eventsByDate[key]) eventsByDate[key] = [];
      eventsByDate[key].push(e);
    }
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* View toggle */}
      <div className="flex gap-2">
        {[
          { id: 'list', label: 'Lista' },
          { id: 'calendar', label: 'Calendário' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setView(id)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              view === id ? 'bg-tis-700 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {view === 'list' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming */}
          <div className="lg:col-span-2 space-y-4">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide">Próximos eventos</h3>
            {upcoming.map(ev => (
              <div key={ev.id} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 text-center w-14">
                    <div className="bg-tis-50 border border-tis-100 rounded-xl px-2 py-2">
                      <p className="text-2xl font-bold text-tis-700 leading-none">
                        {new Date(ev.date).getDate()}
                      </p>
                      <p className="text-xs text-tis-500 uppercase mt-0.5">
                        {new Date(ev.date).toLocaleDateString('pt-PT', { month: 'short' })}
                      </p>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-start justify-between gap-2 mb-1">
                      <h4 className="font-semibold text-gray-900 text-base">{ev.title}</h4>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium border ${CATEGORY_COLORS[ev.category] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                        {ev.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">{ev.description}</p>
                    <div className="flex flex-wrap gap-4 text-xs text-gray-500">
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} /> {ev.time}{ev.endTime ? ` – ${ev.endTime}` : ''}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} /> {ev.location}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* All events */}
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800 text-sm">Todos os eventos</h3>
            </div>
            <div className="divide-y divide-gray-50">
              {sorted.map(ev => (
                <div key={ev.id} className="flex items-start gap-3 px-4 py-3">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${DOT_COLORS[ev.category] || 'bg-gray-400'}`} />
                  <div>
                    <p className="text-sm font-medium text-gray-800 leading-snug">{ev.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{formatDate(ev.date)} · {ev.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <button onClick={prevMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronLeft size={18} className="text-gray-600" />
            </button>
            <h3 className="font-semibold text-gray-800">
              {MONTHS_PT[calMonth]} {calYear}
            </h3>
            <button onClick={nextMonth} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
              <ChevronRight size={18} className="text-gray-600" />
            </button>
          </div>

          <div className="p-4">
            <div className="grid grid-cols-7 mb-2">
              {WEEKDAYS.map(d => (
                <div key={d} className="text-center text-xs font-semibold text-gray-400 py-2">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const isToday = today.getDate() === day && today.getMonth() === calMonth && today.getFullYear() === calYear;
                const hasEvents = eventsByDate[day];
                return (
                  <div
                    key={day}
                    className={`min-h-[52px] rounded-xl p-1 text-center
                      ${isToday ? 'bg-tis-50 border border-tis-200' : 'hover:bg-gray-50'}
                    `}
                  >
                    <p className={`text-sm font-medium ${isToday ? 'text-tis-700' : 'text-gray-700'}`}>{day}</p>
                    {hasEvents && (
                      <div className="space-y-0.5 mt-0.5">
                        {hasEvents.slice(0, 2).map(ev => (
                          <div
                            key={ev.id}
                            className={`text-xs px-1 py-0.5 rounded truncate ${
                              DOT_COLORS[ev.category]?.replace('bg-', 'bg-').replace('-400', '-100') + ' text-' + (ev.category === 'Bem-Estar' ? 'green' : ev.category === 'Empresa' ? 'blue' : ev.category === 'Formação' ? 'amber' : 'red') + '-700'
                            }`}
                            title={ev.title}
                          >
                            {ev.title}
                          </div>
                        ))}
                        {hasEvents.length > 2 && (
                          <p className="text-xs text-gray-400">+{hasEvents.length - 2}</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-6 pb-4 flex flex-wrap gap-3">
            {Object.entries(DOT_COLORS).map(([cat, cls]) => (
              <div key={cat} className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className={`w-2 h-2 rounded-full ${cls}`} />
                {cat}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
