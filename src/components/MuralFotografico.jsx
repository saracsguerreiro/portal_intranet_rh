import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

const COLS = 12;
const ROWS = 8;
const TOTAL = COLS * ROWS; // 96 células

// Baralhar array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Pool de 70 retratos (pravatar.cc) — substituir por fotos reais em produção
const POOL = shuffle(Array.from({ length: 70 }, (_, i) => i + 1));

export default function MuralFotografico({ className = '', style = {} }) {
  const containerRef = useRef(null);
  const gsapCtx = useRef(null);

  // Cada célula tem uma imagem atribuída (cicla pelo pool se TOTAL > pool)
  const cells = useMemo(
    () =>
      Array.from({ length: TOTAL }, (_, i) => ({
        id: i,
        src: `https://i.pravatar.cc/300?img=${POOL[i % POOL.length]}`,
      })),
    []
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let phase2Active = false;
    let pendingCall = null;

    gsapCtx.current = gsap.context(() => {
      const items = Array.from(container.querySelectorAll('[data-cell]'));

      // ── Estado inicial: invisível, pequeno, desfocado ──────────────────
      gsap.set(items, {
        opacity: 0,
        scale: () => gsap.utils.random(0.3, 0.5),
        filter: 'blur(14px)',
        transformOrigin: 'center center',
        willChange: 'transform, opacity, filter',
      });

      // ── FASE 1: Montagem do mural (~8 segundos no total) ───────────────
      // Ordem aleatória (from:'random') para efeito orgânico, não mecânico
      const assemblyTl = gsap.timeline({
        onComplete() {
          phase2Active = true;
          scheduleNext();
        },
      });

      assemblyTl.to(items, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: () => gsap.utils.random(0.8, 1.2),
        ease: 'power2.out',
        stagger: {
          each: 0.085,   // 96 × 0.085 ≈ 8.2 s de spread total
          from: 'random',
        },
      });

      // ── FASE 2: Loop contínuo suave ────────────────────────────────────
      function scheduleNext() {
        if (!phase2Active) return;
        // Próximo ciclo começa daqui a 2-4 segundos
        pendingCall = gsap.delayedCall(gsap.utils.random(2, 4), runCycle);
      }

      function runCycle() {
        if (!phase2Active) return;

        const count = Math.round(gsap.utils.random(3, 6));
        const selected = shuffle([...items]).slice(0, count);

        const cycleTl = gsap.timeline({ onComplete: scheduleNext });

        selected.forEach((cell, i) => {
          // Cada célula começa a sua animação num momento ligeiramente diferente
          const t0        = i * gsap.utils.random(0.2, 0.45);
          const fadeOut   = gsap.utils.random(1.2, 1.8);
          const holdPause = gsap.utils.random(0.2, 0.5);
          const fadeIn    = gsap.utils.random(1.2, 1.8);
          const minOpacity = gsap.utils.random(0.04, 0.12);

          cycleTl
            .to(cell, { opacity: minOpacity, duration: fadeOut,  ease: 'sine.inOut' }, t0)
            .to(cell, { opacity: 1,          duration: fadeIn,   ease: 'sine.inOut' }, t0 + fadeOut + holdPause);
        });
      }
    }, container);

    return () => {
      phase2Active = false;
      pendingCall?.kill();
      gsapCtx.current?.revert();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${COLS}, 1fr)`,
        gridTemplateRows: `repeat(${ROWS}, 1fr)`,
        gap: 0,
        ...style,
      }}
    >
      {cells.map(cell => (
        <div key={cell.id} data-cell className="overflow-hidden">
          <img
            src={cell.src}
            alt=""
            draggable={false}
            loading="eager"
            crossOrigin="anonymous"
            className="w-full h-full object-cover block select-none pointer-events-none"
          />
        </div>
      ))}
    </div>
  );
}
