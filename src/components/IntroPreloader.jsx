import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

import './IntroPreloader.css';

const SESSION_KEY = 'acm_intro_seen_v1';

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

function ParticlesCanvas() {
  // Keep the animation lightweight: small number of dots, low alpha, requestAnimationFrame.
  // It should not block main thread; we also stop drawing once unmounted.
  const [mounted, setMounted] = useState(false);
  const canvasId = useMemo(() => `preloader-canvas-${Math.random().toString(16).slice(2)}`, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const canvas = document.getElementById(canvasId);
    if (!canvas) return;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let w = 0;
    let h = 0;
    const resize = () => {
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const rand = (min, max) => min + Math.random() * (max - min);

    const particleCount = Math.max(18, Math.min(60, Math.floor((w * h) / 35000)));
    const particles = Array.from({ length: particleCount }, () => ({
      x: rand(0, w),
      y: rand(0, h),
      r: rand(0.6, 1.6),
      vx: rand(-0.25, 0.25),
      vy: rand(-0.25, 0.25),
      a: rand(0.15, 0.55),
      phase: rand(0, Math.PI * 2),
    }));

    const animate = () => {
      // If canvas is hidden/unmounted, bail.
      if (!canvas.isConnected) return;

      ctx.clearRect(0, 0, w, h);

      // Subtle vignette
      const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) * 0.7);
      g.addColorStop(0, 'rgba(56,189,248,0.10)');
      g.addColorStop(0.45, 'rgba(56,189,248,0.04)');
      g.addColorStop(1, 'rgba(0,0,0,0.0)');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, w, h);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;

        // wrap
        if (p.x < -10) p.x = w + 10;
        if (p.x > w + 10) p.x = -10;
        if (p.y < -10) p.y = h + 10;
        if (p.y > h + 10) p.y = -10;

        // shimmer
        p.phase += 0.02;
        const alpha = p.a + Math.sin(p.phase) * 0.12;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56,189,248,${Math.max(0, Math.min(0.75, alpha))})`;
        ctx.fill();
      }

      raf = window.requestAnimationFrame(animate);
    };

    let raf = window.requestAnimationFrame(() => {
      resize();
      // Recreate particles after measuring size.
      particles.length = 0;
      const count = Math.max(18, Math.min(60, Math.floor((w * h) / 35000)));
      for (let i = 0; i < count; i += 1) {
        particles.push({
          x: rand(0, w),
          y: rand(0, h),
          r: rand(0.6, 1.6),
          vx: rand(-0.25, 0.25),
          vy: rand(-0.25, 0.25),
          a: rand(0.15, 0.55),
          phase: rand(0, Math.PI * 2),
        });
      }
      animate();
    });

    window.addEventListener('resize', resize, { passive: true });

    return () => {
      window.removeEventListener('resize', resize);
      if (raf) window.cancelAnimationFrame(raf);
      // ensure canvas cleared
      try {
        ctx.clearRect(0, 0, w, h);
      } catch {
        // ignore
      }
    };
  }, [mounted, canvasId]);

  return (
    <canvas
      id={canvasId}
      className="intro-preloader__canvas"
      aria-hidden="true"
    />
  );
}

export default function IntroPreloader() {
  const prefersReducedMotion = usePrefersReducedMotion();

  // Whether we should show the overlay.
  const [shouldShow, setShouldShow] = useState(false);
  // Controls when we remove it after animation.
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Only show once per browser session.
    const seen = sessionStorage.getItem(SESSION_KEY);
    if (seen) return;

    sessionStorage.setItem(SESSION_KEY, '1');
    setShouldShow(true);
  }, []);

  useEffect(() => {
    if (!shouldShow) return;

    // Duration around 2–3 seconds.
    const totalMs = prefersReducedMotion ? 350 : 2400;

    const t = window.setTimeout(() => {
      setIsDone(true);
    }, totalMs);

    return () => window.clearTimeout(t);
  }, [shouldShow, prefersReducedMotion]);

  if (!shouldShow) return null;

  const logoShadow = '0 0 32px rgba(56,189,248,0.65), 0 0 70px rgba(56,189,248,0.28)';

  return (
    <AnimatePresence>
      {!isDone ? (
        <motion.div
          className="intro-preloader"
          role="status"
          aria-live="polite"
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.45, ease: 'easeOut' }}
        >
          <div className="intro-preloader__bg" aria-hidden="true">
            <ParticlesCanvas />
            <div className="intro-preloader__gradient" />
            <div className="intro-preloader__grid" />
          </div>

          <div className="intro-preloader__center">
            {/* Glowing frame */}
            <motion.div
              className="intro-preloader__frame"
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.85, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Logo */}
            <motion.div
              className="intro-preloader__logoWrap"
              initial={{ opacity: 0, scale: 0.86, y: 10, filter: 'blur(4px)' }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
                filter: 'blur(0px)',
              }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 1.05, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
            >
              <img
                src="/Images/acmrscoelogo.png"
                alt="ACM RSCOE"
                className="intro-preloader__logo"
                style={{ filter: `drop-shadow(${logoShadow})` }}
              />
            </motion.div>

            {/* Tiny spark/beam */}
            <motion.div
              className="intro-preloader__beam"
              initial={{ opacity: 0, scaleX: 0.7 }}
              animate={{ opacity: 1, scaleX: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.85, ease: 'easeOut', delay: 0.25 }}
            />

            <motion.div
              className="intro-preloader__name"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.8, ease: 'easeOut', delay: 0.35 }}
            >
              <span className="intro-preloader__nameTop">ACM</span>
              <span className="intro-preloader__nameBottom">RSCOE Student Chapter</span>
            </motion.div>

            <motion.div
              className="intro-preloader__progressTrack"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: prefersReducedMotion ? 0.01 : 0.5, ease: 'easeOut', delay: 0.5 }}
              aria-hidden="true"
            >
              <motion.div
                className="intro-preloader__progressFill"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: prefersReducedMotion ? 0.01 : 1.8, ease: [0.16, 1, 0.3, 1] }}
              />
            </motion.div>
          </div>

          {/* Smooth fade into homepage happens when unmounting overlay */}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

