import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import MuralFotografico from '../components/MuralFotografico';
import { ChevronRight, Clock, MapPin, Award, ArrowRight } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { NEWS, EVENTS, BIRTHDAYS, KUDOS } from '../data/mockData';

const CATEGORY_COLORS = {
  RH:         'bg-purple-100 text-purple-700',
  Empresa:    'bg-blue-100 text-blue-700',
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
  wellness: '🧘', results: '📈', mentoring: '🤝', office: '🏢', security: '🔒',
};

function formatDate(d) {
  return new Date(d).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long', year: 'numeric' });
}
function formatShort(d) {
  const dt = new Date(d);
  return { day: dt.getDate(), month: dt.toLocaleDateString('pt-PT', { month: 'short' }) };
}

function useAnim(cls = 'scroll-fade', delay = '') {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (delay) el.classList.add(delay);
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('animate-in'); obs.unobserve(el); }
    }, { threshold: 0.12 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, className: cls };
}

function AnimBlock({ children, cls = 'scroll-fade', delay = '', as: Tag = 'div', ...props }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (delay) el.classList.add(delay);
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add('animate-in'); obs.unobserve(el); }
    }, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return <Tag ref={ref} className={cls} {...props}>{children}</Tag>;
}

export default function Dashboard() {
  const { user } = useAuth();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Bom dia' : hour < 18 ? 'Boa tarde' : 'Boa noite';
  const latestNews = NEWS.filter(n => n.featured).slice(0, 2);
  const moreNews = NEWS.filter(n => !n.featured).slice(0, 3);
  const upcoming = [...EVENTS].sort((a, b) => new Date(a.date) - new Date(b.date)).slice(0, 4);

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO — Mural fotográfico animado + identidade ── */}
      <section className="relative min-h-[calc(100vh-4rem)] flex items-center overflow-hidden">

        {/* Mural GSAP (substitui people-mosaic.png estático) */}
        <MuralFotografico className="absolute inset-0 w-full h-full" />

        {/* Overlay — gradient mesh roxo/magenta → azul (replicar imagem de referência) */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              'radial-gradient(ellipse at 12% 18%, rgba(212,0,255,0.82) 0%, transparent 55%)',
              'radial-gradient(ellipse at 88% 6%,  rgba(30,120,255,0.80) 0%, transparent 52%)',
              'radial-gradient(ellipse at 8%  88%, rgba(204,0,255,0.75) 0%, transparent 50%)',
              'radial-gradient(ellipse at 82% 92%, rgba(107,0,153,0.80) 0%, transparent 55%)',
              '#9900cc',
            ].join(', '),
          }}
        />

        {/* Blob decorativo esquerdo — tamanho reduzido */}
        <img
          src={`${import.meta.env.BASE_URL}blob.png`}
          alt="" aria-hidden="true"
          className="absolute -left-6 bottom-0 h-[72%] w-auto pointer-events-none select-none"
        />

        {/* Conteúdo do hero */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16
                        flex flex-col lg:flex-row items-center gap-10 lg:gap-20 py-14 lg:py-24">

          {/* Logo "Juntos somos TIS" — tamanho reduzido ~25% */}
          <div className="flex-shrink-0 w-40 sm:w-48 xl:w-56 drop-shadow-2xl">
            <img
              src={`${import.meta.env.BASE_URL}logo-juntos.png`}
              alt="Juntos somos TIS"
              className="w-full h-auto object-contain"
            />
          </div>

          {/* Texto institucional — alinhado à direita */}
          <div className="flex-1 text-white text-center lg:text-right">
            <p className="text-lg sm:text-xl xl:text-2xl font-light text-white/80 mb-2 tracking-wide">
              Portal da Direcção de
            </p>
            <h1 className="text-4xl sm:text-5xl xl:text-6xl font-black text-white leading-tight mb-7 uppercase tracking-tight">
              Cultura &amp; Pessoas
            </h1>
            <p className="text-base sm:text-xl text-white/75 mb-1">
              Informação. Respostas. Recursos.
            </p>
            <p className="text-base sm:text-xl font-bold text-white">
              Tudo num só lugar.
            </p>
          </div>
        </div>
      </section>

      {/* ── FEATURED NEWS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <AnimBlock cls="scroll-fade flex items-end justify-between mb-8">
          <div>
            <p className="text-tis-600 text-sm font-semibold uppercase tracking-widest mb-1">Em Destaque</p>
            <h2 className="text-3xl font-bold text-gray-900">Últimas Notícias</h2>
          </div>
          <Link to="/noticias" className="flex items-center gap-1.5 text-sm font-semibold text-tis-600 hover:text-tis-700 transition-colors">
            Ver todas <ArrowRight size={16} />
          </Link>
        </AnimBlock>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestNews.map((n, i) => {
            const gradient = COVER_GRADIENTS[n.image] || 'from-tis-500 to-tis-700';
            const icon = COVER_ICONS[n.image] || '📰';
            return (
              <AnimBlock key={n.id} cls={`scroll-fade${i === 1 ? ' delay-100' : ''}`}>
                <Link
                  to={`/noticias/${n.id}`}
                  className="group block bg-white rounded-2xl overflow-hidden border border-gray-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className={`bg-gradient-to-r ${gradient} h-44 flex items-center justify-center text-5xl`}>
                    {icon}
                  </div>
                  <div className="p-6">
                    <div className="flex gap-2 mb-3">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${CATEGORY_COLORS[n.category] || 'bg-gray-100 text-gray-600'}`}>
                        {n.category}
                      </span>
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-red-100 text-red-600">Destaque</span>
                    </div>
                    <h3 className="font-bold text-gray-900 text-xl group-hover:text-tis-700 transition-colors leading-snug mb-2">{n.title}</h3>
                    <p className="text-gray-500 text-sm line-clamp-2">{n.excerpt}</p>
                    <div className="flex items-center gap-3 mt-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={11} /> {formatDate(n.date)}</span>
                      <span>· {n.author}</span>
                    </div>
                  </div>
                </Link>
              </AnimBlock>
            );
          })}
        </div>

        {/* More news */}
        <div className="mt-6 space-y-3">
          {moreNews.map((n, i) => {
            const icon = COVER_ICONS[n.image] || '📰';
            const gradient = COVER_GRADIENTS[n.image] || 'from-tis-500 to-tis-700';
            return (
              <AnimBlock key={n.id} cls="scroll-fade" style={{ transitionDelay: `${i * 80}ms` }}>
                <Link
                  to={`/noticias/${n.id}`}
                  className="flex gap-4 bg-white rounded-2xl border border-gray-100 p-4 hover:shadow-md transition-all duration-300 group hover:-translate-y-0.5"
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${gradient} rounded-xl flex-shrink-0 flex items-center justify-center text-2xl`}>
                    {icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${CATEGORY_COLORS[n.category] || 'bg-gray-100 text-gray-600'}`}>
                      {n.category}
                    </span>
                    <h4 className="font-semibold text-gray-900 group-hover:text-tis-700 transition-colors text-sm mt-1 leading-snug">{n.title}</h4>
                    <p className="text-xs text-gray-400 mt-1">{formatDate(n.date)} · {n.author}</p>
                  </div>
                  <ChevronRight size={18} className="text-gray-300 group-hover:text-tis-500 flex-shrink-0 self-center transition-colors" />
                </Link>
              </AnimBlock>
            );
          })}
        </div>
      </section>

      {/* ── EVENTS ── */}
      <section className="bg-tis-950 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimBlock cls="scroll-fade flex items-end justify-between mb-8">
            <div>
              <p className="text-tis-400 text-sm font-semibold uppercase tracking-widest mb-1">Agenda</p>
              <h2 className="text-3xl font-bold text-white">Próximos Eventos</h2>
            </div>
            <Link to="/eventos" className="flex items-center gap-1.5 text-sm font-semibold text-tis-300 hover:text-white transition-colors">
              Ver agenda <ArrowRight size={16} />
            </Link>
          </AnimBlock>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {upcoming.map((ev, i) => {
              const { day, month } = formatShort(ev.date);
              const dotColors = { 'Bem-Estar':'bg-green-400','Empresa':'bg-blue-400','Formação':'bg-amber-400','Reunião':'bg-red-400' };
              return (
                <AnimBlock key={ev.id} cls="scroll-fade" style={{ transitionDelay: `${i * 80}ms` }}>
                  <div className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all duration-300 h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="text-center bg-tis-700/60 rounded-xl px-3 py-2 min-w-[52px]">
                        <p className="text-2xl font-bold text-white leading-none">{day}</p>
                        <p className="text-xs text-tis-300 uppercase mt-0.5">{month}</p>
                      </div>
                      <div className={`w-2 h-2 rounded-full flex-shrink-0 ${dotColors[ev.category] || 'bg-gray-400'}`} />
                      <span className="text-xs text-tis-400">{ev.category}</span>
                    </div>
                    <h4 className="font-semibold text-white text-sm leading-snug mb-3">{ev.title}</h4>
                    <p className="flex items-center gap-1.5 text-xs text-tis-400">
                      <Clock size={12} /> {ev.time}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-tis-400 mt-1">
                      <MapPin size={12} /> {ev.location}
                    </p>
                  </div>
                </AnimBlock>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── KUDOS + BIRTHDAYS ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Kudos */}
          <div className="lg:col-span-2">
            <AnimBlock cls="scroll-fade-left mb-6">
              <p className="text-tis-600 text-sm font-semibold uppercase tracking-widest mb-1">Reconhecimentos</p>
              <h2 className="text-3xl font-bold text-gray-900">Mural de Kudos</h2>
            </AnimBlock>
            <div className="space-y-4">
              {KUDOS.map((k, i) => (
                <AnimBlock key={k.id} cls="scroll-fade" style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition-all">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-9 h-9 rounded-full bg-tis-100 flex items-center justify-center text-xs font-bold text-tis-700">{k.fromAvatar}</div>
                      <span className="text-sm font-semibold text-gray-700">{k.from}</span>
                      <span className="text-gray-300">→</span>
                      <div className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center text-xs font-bold text-amber-700">{k.toAvatar}</div>
                      <span className="text-sm font-semibold text-tis-700">{k.to}</span>
                    </div>
                    <div className="inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full bg-yellow-50 border border-yellow-200 text-yellow-700 mb-2">
                      {k.badge}
                    </div>
                    <p className="text-sm text-gray-600 leading-relaxed">{k.message}</p>
                  </div>
                </AnimBlock>
              ))}
            </div>
            <AnimBlock cls="scroll-fade mt-4">
              <Link to="/mural" className="flex items-center gap-2 text-sm font-semibold text-tis-600 hover:text-tis-700 transition-colors">
                Ver mural completo <ArrowRight size={16} />
              </Link>
            </AnimBlock>
          </div>

          {/* Birthdays + quick links */}
          <div className="space-y-5">
            <AnimBlock cls="scroll-fade-right">
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 rounded-2xl p-5">
                <p className="font-semibold text-gray-800 mb-4 flex items-center gap-2">🎂 Próximos Aniversários</p>
                <div className="space-y-3">
                  {BIRTHDAYS.map(b => (
                    <div key={b.name} className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-pink-200 flex items-center justify-center text-xs font-bold text-pink-700 flex-shrink-0">{b.avatar}</div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">{b.name}</p>
                        <p className="text-xs text-gray-500">
                          {new Date(b.date).toLocaleDateString('pt-PT', { day: '2-digit', month: 'long' })}
                          {b.years && <span className="ml-1 text-amber-600">· {b.years} anos TIS 🎉</span>}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </AnimBlock>

            <AnimBlock cls="scroll-fade-right delay-200">
              <div className="bg-white rounded-2xl border border-gray-100 p-5">
                <p className="font-semibold text-gray-800 mb-4">⚡ Acessos Rápidos</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { to: '/documentos', label: '📄 Formulários' },
                    { to: '/mural',      label: '🏆 Dar Kudos' },
                    { to: '/eventos',    label: '📅 Calendário' },
                    { to: '/documentos', label: '📋 Políticas' },
                  ].map(({ to, label }) => (
                    <Link key={label} to={to}
                      className="bg-gray-50 hover:bg-tis-50 border border-gray-100 hover:border-tis-200 rounded-xl p-3 text-center text-sm font-medium text-gray-700 hover:text-tis-700 transition-all"
                    >
                      {label}
                    </Link>
                  ))}
                </div>
              </div>
            </AnimBlock>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-tis-950 border-t border-tis-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-tis-500 rounded-lg flex items-center justify-center font-bold text-white text-xs">TIS</div>
            <span className="text-tis-400 text-sm">Portal Intranet RH · Uso interno</span>
          </div>
          <p className="text-tis-500 text-xs">© {new Date().getFullYear()} TIS — Acesso restrito a colaboradores</p>
        </div>
      </footer>
    </div>
  );
}
