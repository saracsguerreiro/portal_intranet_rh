import { useEffect, useRef, useMemo } from 'react';
import gsap from 'gsap';

const COLS = 12;
const ROWS = 8;
const TOTAL = COLS * ROWS;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const POOL = shuffle(Array.from({ length: 70 }, (_, i) => i + 1));

export default function MuralFotografico({ className = '', style = {} }) {
  const containerRef = useRef(null);
  const gsapCtx = useRef(null);

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
    const animating = new Set();

    gsapCtx.current = gsap.context(() => {
      const items = Array.from(container.querySelectorAll('[data-cell]'));

      // ── Estado inicial ──────────────────────────────────────────────────
      gsap.set(items, {
        opacity: 0,
        scale: () => gsap.utils.random(0.3, 0.5),
        filter: 'blur(14px)',
        transformOrigin: 'center center',
      });

      // ── FASE 1: Montagem (~8 s) ─────────────────────────────────────────
      const assemblyTl = gsap.timeline({
        onComplete() {
          phase2Active = true;
          // Arrancar 4 threads com desfasagem inicial para criar sobreposição
          for (let t = 0; t < 4; t++) {
            gsap.delayedCall(t * 0.9, launchNext);
          }
        },
      });

      assemblyTl.to(items, {
        opacity: 1,
        scale: 1,
        filter: 'blur(0px)',
        duration: () => gsap.utils.random(0.8, 1.2),
        ease: 'power2.out',
        stagger: { each: 0.085, from: 'random' },
      });

      // ── FASE 2: Loop contínuo com sobreposições ─────────────────────────
      // Lança 1-2 células a cada 0.5-1.5 s → sempre há movimento no ecrã
      function launchNext() {
        if (!phase2Active) return;

        const available = items.filter(cell => !animating.has(cell));
        if (available.length > 0) {
          const count = Math.min(1 + Math.floor(Math.random() * 2), available.length);
          const picked = shuffle([...available]).slice(0, count);

          picked.forEach(cell => {
            animating.add(cell);
            const fadeOut    = gsap.utils.random(2.0, 4.0);
            const hold       = gsap.utils.random(0.2, 0.6);
            const fadeIn     = gsap.utils.random(2.0, 4.0);
            const minOpacity = gsap.utils.random(0.04, 0.13);

            gsap.timeline()
              .to(cell, { opacity: minOpacity, duration: fadeOut, ease: 'sine.inOut' })
              .to(cell, { opacity: 1, duration: fadeIn, ease: 'sine.inOut', delay: hold })
              .call(() => { animating.delete(cell); });
          });
        }

        // Próximo lançamento em 0.5-1.5 s — garante movimento contínuo
        pendingCall = gsap.delayedCall(gsap.utils.random(0.5, 1.5), launchNext);
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
            className="w-full h-full object-cover block select-none pointer-events-none"
          />
        </div>
      ))}
    </div>
  );
}
