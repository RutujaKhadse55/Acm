import { useEffect, useMemo, useState } from 'react';

import './IntroLoader.css';

const SESSION_KEY = 'acm_intro_seen_v2';

// When used through introLoaderGate, we should not pre-set sessionStorage here.
// The gate will start the loader only when needed.
function shouldSkipFromSessionStorage(sessionKey) {
  try {
    const key = sessionKey || SESSION_KEY;
    return window.sessionStorage?.getItem(key);
  } catch {
    return null;
  }
}


function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia?.('(prefers-reduced-motion: reduce)');
    if (!mq) return;
    const update = () => setReduced(!!mq.matches);
    update();

    // Safari compatibility
    if (mq.addEventListener) mq.addEventListener('change', update);
    else mq.addListener(update);

    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', update);
      else mq.removeListener(update);
    };
  }, []);

  return reduced;
}

function ParticlesCanvas({ enabled }) {
  const canvasId = useMemo(
    () => `intro-loader-canvas-${Math.random().toString(16).slice(2)}`,
    [],
  );

  useEffect(() => {
    if (!enabled) return;

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    let raf = 0;

    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rand = (min, max) => min + Math.random() * (max - min);
    const count = Math.max(28, Math.min(110, Math.floor((w * h) / 22000)));

    const particles = Array.from({ length: count }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.7, 2.0),
      vx: rand(-0.18, 0.18),
      vy: rand(-0.12, 0.12),
      a: rand(0.12, 0.35),
      tw: rand(0, Math.PI * 2),
    }));

    const draw = () => {
      if (!canvas.isConnected) return;

      ctx.clearRect(0, 0, w, h);

      // Ambient glow
      const g = ctx.createRadialGradient(w * 0.5, h * 0.42, 0, w * 0.5, h * 0.42, Math.max(w, h) * 0.7);
      g.addColorStop(0, 'rgba(56,189,248,0.10)');
      g.addColorStop(0.45, 'rgba(56,189,248,0.04)');
      g.addColorStop(1, 'rgba(0,0,0,0.0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.tw += 0.035;

        if (p.x < -20) p.x = w + 20;
        if (p.x > w + 20) p.x = -20;
        if (p.y < -20) p.y = h + 20;
        if (p.y > h + 20) p.y = -20;

        const alpha = Math.max(0, p.a + Math.sin(p.tw) * 0.11);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${alpha})`;
        ctx.fill();
      }

      raf = window.requestAnimationFrame(draw);
    };

    raf = window.requestAnimationFrame(() => {
      resize();
      // Recreate after resize
      particles.splice(0, particles.length);
      const newCount = Math.max(28, Math.min(110, Math.floor((w * h) / 22000)));
      for (let i = 0; i < newCount; i += 1) {
        particles.push({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(0.7, 2.0),
          vx: rand(-0.18, 0.18),
          vy: rand(-0.12, 0.12),
          a: rand(0.12, 0.35),
          tw: rand(0, Math.PI * 2),
        });
      }
      draw();
    });

    window.addEventListener('resize', resize, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      if (raf) window.cancelAnimationFrame(raf);
      try {
        ctx.clearRect(0, 0, w, h);
      } catch {
        // ignore
      }
    };
  }, [enabled, canvasId]);

  return <canvas id={canvasId} className="intro-loader__canvas" aria-hidden="true" />;
}

function splitToLetters(text) {
  return text.split('').map((ch, idx) => ({ ch, idx }));
}

export default function IntroLoader({ onDone, sessionKey } = {}) {
  const prefersReducedMotion = usePrefersReducedMotion();

  const [shouldShow, setShouldShow] = useState(false);
  const [phase, setPhase] = useState('init'); // init | running | done

  const [didNotifyDone, setDidNotifyDone] = useState(false);


  useEffect(() => {
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen) return;
    sessionStorage.setItem(SESSION_KEY, '1');
    setShouldShow(true);
  }, []);

  useEffect(() => {
    if (!shouldShow) return;

    const totalMs = prefersReducedMotion ? 1200 : 4200;




    // Stage timeline (sum ~4.2s; cinematic feel)
    const timers = [];

    timers.push(
      window.setTimeout(() => setPhase('running'), prefersReducedMotion ? 10 : 0),
    );
    // Ensure final fade-out begins before unmount
    timers.push(
      window.setTimeout(() => setPhase('done'), totalMs - (prefersReducedMotion ? 200 : 550)),
    );

    const t = window.setTimeout(() => {
      // Notify gate exactly once so the real site mounts.
      if (!didNotifyDone) {
        setDidNotifyDone(true);
        try {
          onDone?.();
        } catch {
          // ignore
        }
      }

      // Once done, stop showing.
      setShouldShow(false);
    }, totalMs);


    timers.push(t);

    return () => {
      timers.forEach(clearTimeout);
    };
  }, [shouldShow, prefersReducedMotion, onDone, didNotifyDone]);


  useEffect(() => {
    if (!shouldShow) return;

    // Use rAF + WAAPI for cinematic sequencing without adding runtime deps.
    // Requirement says GSAP preferred; however package installation may be blocked,
    // so we implement premium buttery transitions using WAAPI.

    const root = document.querySelector('.intro-loader');
    if (!root) return;


    const logo = root.querySelector('.intro-loader__logo');
    const frame = root.querySelector('.intro-loader__frame');
    const lines = root.querySelectorAll('.intro-loader__line');
    const letterEls = root.querySelectorAll('[data-letter]');
    const sweep = root.querySelector('.intro-loader__sweep');

    if (prefersReducedMotion) {
      root.animate(
        [
          { opacity: 1, transform: 'translateZ(0) scale(1)' },
          { opacity: 0, transform: 'translateZ(0) scale(0.99)' },
        ],
        { duration: 900, easing: 'ease-out', fill: 'forwards' },
      );
      return;
    }

    // Make sure starting state
    root.style.opacity = '1';

    // Stage 1: dark -> ambient glow
    frame.animate(
      [
        { opacity: 0, filter: 'blur(10px)', transform: 'scale(0.985)' },
        { opacity: 1, filter: 'blur(0px)', transform: 'scale(1)' },
      ],
      { duration: 720, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' },
    );

    // Stage 2: lines appear slowly
    lines.forEach((el, i) => {
      el.animate(
        [
          { opacity: 0, transform: `translate3d(0, ${10 + i * 2}px, 0) scaleX(0.9)` },
          { opacity: 1, transform: 'translate3d(0,0,0) scaleX(1)' },
        ],
        {
          duration: 950,
          delay: 520 + i * 110,
          easing: 'cubic-bezier(.16,1,.3,1)',
          fill: 'forwards',
        },
      );
    });

    // Stage 3: logo emerge blur->focus + float
    logo.animate(
      [
        { opacity: 0, filter: 'blur(14px)', transform: 'translate3d(0,10px,0) scale(0.92)' },
        { opacity: 1, filter: 'blur(0px)', transform: 'translate3d(0,0,0) scale(1)' },
      ],
      { duration: 1050, delay: 650, easing: 'cubic-bezier(.16,1,.3,1)', fill: 'forwards' },
    );

    // Stage 4: shimmer sweep across logo
    sweep.animate(
      [
        { transform: 'translate3d(-140%, -10px, 0) rotate(-12deg)', opacity: 0 },
        { transform: 'translate3d(10%, -10px, 0) rotate(-12deg)', opacity: 1 },
        { transform: 'translate3d(140%, -10px, 0) rotate(-12deg)', opacity: 0 },
      ],
      { duration: 900, delay: 1550, easing: 'cubic-bezier(.2,1,.2,1)', fill: 'forwards' },
    );

    // Stage 5: reveal website name letter-by-letter
    const letters = splitToLetters('ACM  RSCOE Student Chapter');
    // Map to existing nodes count (avoid mismatch)
    if (letterEls.length === letters.length) {
      letterEls.forEach((el, idx) => {
        el.animate(
          [
            { opacity: 0, transform: 'translate3d(0,10px,0)', filter: 'blur(4px)' },
            { opacity: 1, transform: 'translate3d(0,0,0)', filter: 'blur(0px)' },
          ],
          {
            duration: 520,
            delay: 2050 + idx * 28,
            easing: 'cubic-bezier(.16,1,.3,1)',
            fill: 'forwards',
          },
        );
      });
    }

    // Stage 6: cinematic zoom-out + fade
    root.animate(
      [
        { opacity: 1, transform: 'translateZ(0) scale(1)' },
        { opacity: 1, transform: 'translateZ(0) scale(1.03)' },
        { opacity: 0, transform: 'translateZ(0) scale(0.985)' },
      ],
      {
        duration: 700,
        delay: 3450,
        easing: 'cubic-bezier(.16,1,.3,1)',
        fill: 'forwards',
      },
    );
  }, [shouldShow, prefersReducedMotion, phase]);

  if (!shouldShow) return null;

  return (
    <div className="intro-loader" role="status" aria-live="polite">
      <div className="intro-loader__bg">
        <div className="intro-loader__vignette" aria-hidden="true" />
        <div className="intro-loader__light" aria-hidden="true" />
        <ParticlesCanvas enabled={!prefersReducedMotion} />

        {/* Thin geometric lines */}
        <div className="intro-loader__lines" aria-hidden="true">
          <span className="intro-loader__line" style={{ top: '22%', left: '10%' }} />
          <span className="intro-loader__line" style={{ top: '38%', left: '72%' }} />
          <span className="intro-loader__line" style={{ top: '60%', left: '18%' }} />
          <span className="intro-loader__line" style={{ top: '74%', left: '64%' }} />
        </div>
      </div>

      <div className="intro-loader__center">
        <div className="intro-loader__frame" aria-hidden="true" />

        <div className="intro-loader__logoStage">
          <div className="intro-loader__logoGlow" aria-hidden="true" />
          <div className="intro-loader__sweep" aria-hidden="true" />

          <img
            className="intro-loader__logo"
            src="/Images/acmrscoelogo.png"
            alt="ACM RSCOE"
            draggable={false}
          />
        </div>

        <div className="intro-loader__name" aria-label="ACM RSCOE Student Chapter">
          {splitToLetters('ACM  RSCOE Student Chapter').map(({ ch, idx }) => (
            <span
              key={`${idx}-${ch}`}
              data-letter
              className="intro-loader__letter"
              aria-hidden="true"
            >
              {ch === ' ' ? '\u00A0' : ch}
            </span>
          ))}
        </div>
      </div>

      {/* Keep this for accessibility users; screen readers get live region */}
      <span className="intro-loader__srOnly">Loading…</span>

      {/* When phase becomes done, we still render until timeout ends */}
    </div>
  );
}

