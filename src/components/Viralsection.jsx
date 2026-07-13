import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Play, ArrowUpRight, ChevronUp, ChevronDown } from 'lucide-react';

/* lucide-react no longer ships brand icons, so small inline SVGs are used. */
function InstagramIcon({ size = 14, color = '#7db8ff' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
        </svg>
    );
}
function YoutubeIcon({ size = 14, color = '#7db8ff' }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
            <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" />
        </svg>
    );
}
function PlatformIcon({ platform, size, color }) {
    return platform === 'youtube' ? <YoutubeIcon size={size} color={color} /> : <InstagramIcon size={size} color={color} />;
}

/* ── Data — add a reel by adding an object here ───────────── */
const REELS = [
    {
        id: 'r1',
        title: 'ACM RSCOE Chapter Highlights',
        thumb: '/Images/events/reeel1.jpeg',
        category: 'Chapter',
        views: '—',
        date: 'Jun 2026',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DXFHrqQjaQ4',
    },
    {
        id: 'r2',
        title: 'ACM Event Moments',
        thumb: '/Images/events/reeel4.jpeg',
        category: 'Events',
        views: '—',
        date: 'Jun 2026',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DW4ImuQDY8E',
    },
    {
        id: 'r3',
        title: 'ACM Team in Action',
        thumb: '/Images/events/reeel3.jpeg',
        category: 'Team',
        views: '—',
        date: 'Jun 2026',
        platform: 'instagram',
        url: 'https://www.instagram.com/reel/DV6WfoRjd3D',
    },

];

const AUTOPLAY_MS = 5500;

/* Single reel face used in the cube stack. `depth` = 0 current, -1 prev, 1 next, etc. */
function ReelFace({ reel, depth, dir, parallax }) {
    const [hasError, setHasError] = useState(false);
    const isActive = depth === 0;

    const px = useTransform(parallax.x, (v) => v * (isActive ? 10 : 4));
    const py = useTransform(parallax.y, (v) => v * (isActive ? -8 : -3));

    return (
        <motion.div
            className={`reel-face ${isActive ? 'reel-face--active' : 'reel-face--ghost'}`}
            style={{
                zIndex: 10 - Math.abs(depth),
                x: isActive ? px : 0,
                rotateX: isActive ? py : 0,
            }}
            initial={{
                rotateY: dir * 70,
                z: -260,
                opacity: 0,
                scale: 0.82,
                filter: 'blur(6px)',
            }}
            animate={
                isActive
                    ? { rotateY: 0, z: 0, opacity: 1, scale: 1, filter: 'blur(0px)' }
                    : depth < 0
                        ? { rotateY: -26, z: -180 - 60 * (Math.abs(depth) - 1), x: -54 - 20 * (Math.abs(depth) - 1), opacity: 0.45 / Math.abs(depth), scale: 0.86 - 0.05 * (Math.abs(depth) - 1), filter: 'blur(2px)' }
                        : { rotateY: 26, z: -180 - 60 * (depth - 1), x: 54 + 20 * (depth - 1), opacity: 0.45 / depth, scale: 0.86 - 0.05 * (depth - 1), filter: 'blur(2px)' }
            }
            exit={{ rotateY: -dir * 70, z: -260, opacity: 0, scale: 0.82, filter: 'blur(6px)' }}
            transition={{ type: 'spring', stiffness: 220, damping: 26, mass: 0.9 }}
        >
            <span className="reel-face__shine" aria-hidden="true" />
            <div className="reel-face__thumb">
                {hasError ? (
                    <div className="reel-face__fallback" aria-hidden="true">
                        <Play size={44} color="#7db8ff" />
                    </div>
                ) : (
                    <img src={reel.thumb} alt={reel.title} onError={() => setHasError(true)} draggable={false} />
                )}
                <span className="reel-face__gradient" />
            </div>

            {isActive && (
                <motion.span
                    className="reel-face__play"
                    animate={{ scale: [1, 1.06, 1] }}
                    transition={{ duration: 2.4, repeat: Infinity, ease: 'easeInOut' }}
                >
                    <Play size={26} fill="#0a0d14" color="#0a0d14" />
                </motion.span>
            )}

            <span className="reel-face__badge">
                <PlatformIcon platform={reel.platform} size={13} />
            </span>
        </motion.div>
    );
}

export default function ViralsSection() {
    const [index, setIndex] = useState(0);
    const [dir, setDir] = useState(1);
    const [paused, setPaused] = useState(false);
    const wrapRef = useRef(null);
    const touchX = useRef(null);

    const px = useMotionValue(0);
    const py = useMotionValue(0);
    const sx = useSpring(px, { stiffness: 120, damping: 18 });
    const sy = useSpring(py, { stiffness: 120, damping: 18 });

    const go = useCallback((d) => {
        setDir(d);
        setIndex((i) => (i + d + REELS.length) % REELS.length);
    }, []);

    useEffect(() => {
        if (paused) return;
        const t = setInterval(() => go(1), AUTOPLAY_MS);
        return () => clearInterval(t);
    }, [paused, go]);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === 'ArrowUp') go(-1);
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') go(1);
            if (e.key === 'ArrowLeft') go(-1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [go]);

    const handleMove = (e) => {
        const r = wrapRef.current?.getBoundingClientRect();
        if (!r) return;
        px.set((e.clientX - r.left) / r.width - 0.5);
        py.set((e.clientY - r.top) / r.height - 0.5);
    };
    const handleLeave = () => {
        px.set(0);
        py.set(0);
    };

    const handleTouchStart = (e) => {
        touchX.current = e.touches[0].clientY;
    };
    const handleTouchEnd = (e) => {
        if (touchX.current == null) return;
        const dy = e.changedTouches[0].clientY - touchX.current;
        if (Math.abs(dy) > 40) go(dy < 0 ? 1 : -1);
        touchX.current = null;
    };

    const active = REELS[index];

    const offsets = REELS.length <= 3 ? [-1, 0, 1] : [-1, 0, 1, 2];
    const visible = offsets.map((off) => {
        const i = (index + off + REELS.length) % REELS.length;
        return { reel: REELS[i], depth: off };
    });

    return (
        <section
            id="virals"
            aria-label="View Our Virals section"
            style={{ position: 'relative', padding: '110px 0', overflow: 'hidden' }}
        >
            <div className="virals-bg" aria-hidden="true">
                <div className="virals-bg__glow virals-bg__glow--a" />
                <div className="virals-bg__glow virals-bg__glow--b" />
                <svg className="virals-bg__grid" aria-hidden="true">
                    <defs>
                        <pattern id="virGrid" width="48" height="48" patternUnits="userSpaceOnUse">
                            <path d="M 48 0 L 0 0 0 48" fill="none" stroke="rgba(59,130,246,0.08)" strokeWidth="1" />
                        </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#virGrid)" />
                </svg>
                {[...Array(10)].map((_, i) => (
                    <span
                        key={i}
                        className="virals-bg__dot"
                        style={{ left: `${(i * 41) % 100}%`, top: `${(i * 29) % 100}%`, animationDelay: `${(i % 5) * 0.7}s` }}
                    />
                ))}
            </div>

            <div className="virals-grid">
                {/* ── Left: copy ───────────────────────── */}
                <div className="virals-left">
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                        <span style={{ width: '24px', height: '1px', background: '#3b82f6' }} />
                        <p className="virals-eyebrow">On Camera</p>
                    </div>

                    <h2 className="virals-heading">
                        VIEW OUR<br />
                        <span className="virals-heading__accent">VIRALS</span>
                    </h2>
                    <p className="virals-sub">
                        Reels, shorts, and highlights from our hackathons, workshops, and podcasts — captured live, cut fast.
                    </p>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={active.id}
                            className="virals-info"
                            initial={{ opacity: 0, y: 16 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -16 }}
                            transition={{ duration: 0.4, ease: [0.2, 0.7, 0.3, 1] }}
                        >
                            <span className="virals-info__category">{active.category}</span>
                            <h3 className="virals-info__title">{active.title}</h3>
                            <div className="virals-info__meta">
                                <span>{active.views} views</span>
                                <span className="virals-info__dot" />
                                <span>{active.date}</span>
                                <span className="virals-info__dot" />
                                <span className="virals-info__platform">
                                    <PlatformIcon platform={active.platform} size={13} />
                                    {active.platform === 'youtube' ? 'YouTube' : 'Instagram'}
                                </span>
                            </div>

                            <a
                                href={active.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="virals-watch"
                            >
                                Watch Reel
                                <ArrowUpRight size={16} style={{ marginLeft: 8 }} />
                            </a>
                        </motion.div>
                    </AnimatePresence>

                    <div className="virals-progress">
                        <span className="virals-progress__count">
                            {String(index + 1).padStart(2, '0')} / {String(REELS.length).padStart(2, '0')}
                        </span>
                        <div className="virals-progress__track">
                            <motion.div
                                className="virals-progress__fill"
                                animate={{ width: `${((index + 1) / REELS.length) * 100}%` }}
                                transition={{ type: 'spring', stiffness: 160, damping: 24 }}
                            />
                        </div>
                    </div>
                </div>

                {/* ── Right: 3D stack ──────────────────── */}
                <div
                    className="virals-right"
                    ref={wrapRef}
                    onMouseMove={handleMove}
                    onMouseLeave={handleLeave}
                    onMouseEnter={() => setPaused(true)}
                    onTouchStart={(e) => { setPaused(true); handleTouchStart(e); }}
                    onTouchEnd={(e) => { handleTouchEnd(e); setPaused(false); }}
                >
                    <div className="reel-stack">
                        <AnimatePresence custom={dir} initial={false}>
                            {visible.map(({ reel, depth }) => (
                                <ReelFace
                                    key={reel.id}
                                    reel={reel}
                                    depth={depth}
                                    dir={dir}
                                    parallax={{ x: sx, y: sy }}
                                />
                            ))}
                        </AnimatePresence>

                        <a
                            className="reel-stack__hitarea"
                            href={active.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`Watch ${active.title} on ${active.platform}`}
                        />
                    </div>

                    <div className="virals-nav">
                        <button type="button" className="virals-nav__btn" onClick={() => go(-1)} aria-label="Previous reel">
                            <ChevronUp size={18} />
                        </button>
                        <div className="virals-nav__dots">
                            {REELS.map((r, i) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    className={`virals-nav__dot ${i === index ? 'is-active' : ''}`}
                                    onClick={() => { setDir(i > index ? 1 : -1); setIndex(i); }}
                                    aria-label={`Go to ${r.title}`}
                                />
                            ))}
                        </div>
                        <button type="button" className="virals-nav__btn" onClick={() => go(1)} aria-label="Next reel">
                            <ChevronDown size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <style>{`
        .virals-bg { position: absolute; inset: 0; pointer-events: none; z-index: 0; }
        .virals-bg__grid { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0.5; }
        .virals-bg__glow { position: absolute; border-radius: 50%; filter: blur(100px); opacity: 0.22; }
        .virals-bg__glow--a { width: 460px; height: 460px; top: -100px; right: -140px; background: radial-gradient(circle, #3b82f6, transparent 70%); }
        .virals-bg__glow--b { width: 520px; height: 520px; bottom: -160px; left: -180px; background: radial-gradient(circle, #1c3a66, transparent 70%); }
        .virals-bg__dot { position: absolute; width: 3px; height: 3px; border-radius: 50%; background: #7db8ff; box-shadow: 0 0 6px #3b82f6; animation: virDotFloat 4.5s ease-in-out infinite; opacity: 0.45; }
        @keyframes virDotFloat { 0%, 100% { transform: translateY(0); opacity: 0.25; } 50% { transform: translateY(-14px); opacity: 0.75; } }

        .virals-grid {
          position: relative; z-index: 1;
          max-width: 1200px; margin: 0 auto; padding: 0 24px;
          display: grid; grid-template-columns: 40% 60%;
          gap: 48px; align-items: center;
        }

        .virals-eyebrow { color: #7db8ff; font-size: 0.7rem; letter-spacing: 0.35em; text-transform: uppercase; font-weight: 700; margin: 0; font-family: 'Inter', sans-serif; }
        .virals-heading { font-family: 'Orbitron', sans-serif; font-size: clamp(2rem, 3.6vw, 3.2rem); font-weight: 900; letter-spacing: 0.06em; text-transform: uppercase; color: #fff; margin: 0 0 18px; line-height: 1.08; }
        .virals-heading__accent { color: #7db8ff; text-shadow: 0 0 22px rgba(59,130,246,0.6); }
        .virals-sub { color: rgba(255,255,255,0.55); font-family: 'Inter', sans-serif; font-size: 0.95rem; max-width: 420px; margin: 0 0 36px; line-height: 1.6; }

        .virals-info { min-height: 150px; }
        .virals-info__category { display: inline-block; font-family: 'Inter', sans-serif; font-size: 0.65rem; letter-spacing: 0.14em; text-transform: uppercase; color: #7db8ff; font-weight: 700; margin-bottom: 8px; }
        .virals-info__title { font-family: 'Orbitron', sans-serif; font-size: 1.5rem; font-weight: 700; color: #fff; margin: 0 0 14px; line-height: 1.25; }
        .virals-info__meta { display: flex; align-items: center; flex-wrap: wrap; gap: 8px; color: rgba(255,255,255,0.5); font-family: 'Inter', sans-serif; font-size: 0.78rem; margin-bottom: 26px; }
        .virals-info__dot { width: 3px; height: 3px; border-radius: 50%; background: rgba(255,255,255,0.35); }
        .virals-info__platform { display: inline-flex; align-items: center; gap: 5px; }

        .virals-watch {
          display: inline-flex; align-items: center;
          padding: 14px 28px; border-radius: 999px;
          background: linear-gradient(135deg, rgba(59,130,246,0.18), rgba(125,184,255,0.08));
          border: 1px solid rgba(125,184,255,0.55);
          color: #cfe6ff; font-family: 'Inter', sans-serif; font-weight: 700; font-size: 0.85rem;
          letter-spacing: 0.03em; text-decoration: none;
          box-shadow: 0 0 24px rgba(59,130,246,0.25);
          transition: box-shadow 0.3s ease, transform 0.3s ease, background 0.3s ease;
        }
        .virals-watch:hover { box-shadow: 0 0 40px rgba(59,130,246,0.5); transform: translateY(-2px); background: rgba(59,130,246,0.28); }

        .virals-progress { display: flex; align-items: center; gap: 14px; margin-top: 40px; }
        .virals-progress__count { font-family: 'Orbitron', sans-serif; font-size: 0.75rem; color: #7db8ff; letter-spacing: 0.08em; min-width: 64px; }
        .virals-progress__track { flex: 1; max-width: 160px; height: 2px; background: rgba(59,130,246,0.18); border-radius: 2px; overflow: hidden; }
        .virals-progress__fill { height: 100%; background: linear-gradient(90deg, #3b82f6, #7db8ff); box-shadow: 0 0 8px rgba(59,130,246,0.7); }

        .virals-right { position: relative; display: flex; align-items: center; justify-content: center; gap: 28px; perspective: 1400px; }
        .reel-stack { position: relative; width: 260px; aspect-ratio: 9 / 16; transform-style: preserve-3d; }
        .reel-stack__hitarea { position: absolute; inset: 0; z-index: 11; border-radius: 28px; }

        .reel-face {
          position: absolute; inset: 0;
          border-radius: 28px; overflow: hidden;
          background: rgba(17,21,31,0.6);
          backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(59,130,246,0.25);
          transform-style: preserve-3d;
          will-change: transform, opacity, filter;
        }
        .reel-face--active { border-color: rgba(125,184,255,0.65); box-shadow: 0 30px 80px -20px rgba(59,130,246,0.5), 0 0 0 1px rgba(125,184,255,0.15); animation: reelFloat 5s ease-in-out infinite; }
        @keyframes reelFloat { 0%, 100% { translate: 0 0; } 50% { translate: 0 -8px; } }

        .reel-face__shine { position: absolute; inset: 0; z-index: 3; pointer-events: none; background: linear-gradient(120deg, transparent 35%, rgba(255,255,255,0.14) 50%, transparent 65%); transform: translateX(-130%); animation: virShine 5.5s ease-in-out infinite; }
        @keyframes virShine { 0%, 65% { transform: translateX(-130%); } 100% { transform: translateX(130%); } }

        .reel-face__thumb { position: absolute; inset: 0; }
        .reel-face__thumb img { width: 100%; height: 100%; object-fit: cover; }
        .reel-face__fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: linear-gradient(160deg, #161b27 0%, #0a0d14 100%); }
        .reel-face__gradient { position: absolute; inset: 0; background: linear-gradient(to top, rgba(10,13,20,0.9) 0%, rgba(10,13,20,0.15) 50%, rgba(10,13,20,0.4) 100%); }

        .reel-face__play {
          position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
          width: 56px; height: 56px; border-radius: 50%;
          background: linear-gradient(135deg, #7db8ff, #3b82f6);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 0 22px rgba(59,130,246,0.65);
          z-index: 4;
        }
        .reel-face__badge {
          position: absolute; top: 14px; right: 14px; z-index: 4;
          width: 30px; height: 30px; border-radius: 50%;
          background: rgba(10,13,20,0.7); border: 1px solid rgba(125,184,255,0.35);
          display: flex; align-items: center; justify-content: center;
        }

        .virals-nav { display: flex; flex-direction: column; align-items: center; gap: 16px; }
        .virals-nav__btn {
          all: unset; cursor: pointer; width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          background: rgba(59,130,246,0.1); border: 1px solid rgba(125,184,255,0.4);
          color: #cfe6ff; transition: box-shadow 0.25s ease, transform 0.25s ease, background 0.25s ease;
        }
        .virals-nav__btn:hover { box-shadow: 0 0 22px rgba(59,130,246,0.5); background: rgba(59,130,246,0.22); transform: scale(1.06); }
        .virals-nav__dots { display: flex; flex-direction: column; gap: 8px; }
        .virals-nav__dot { all: unset; cursor: pointer; width: 6px; height: 6px; border-radius: 50%; background: rgba(125,184,255,0.3); transition: all 0.25s ease; }
        .virals-nav__dot.is-active { background: #7db8ff; box-shadow: 0 0 8px rgba(59,130,246,0.8); height: 20px; border-radius: 3px; }

        @media (max-width: 980px) {
          .virals-grid { grid-template-columns: 1fr; gap: 56px; }
          .virals-left { text-align: center; }
          .virals-sub { margin-left: auto; margin-right: auto; }
          .virals-progress { justify-content: center; }
          .reel-stack { width: 230px; }
        }
        @media (max-width: 560px) {
          .reel-stack { width: 200px; }
          .virals-right { gap: 18px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .reel-face--active, .reel-face__shine, .virals-bg__dot { animation: none !important; }
        }
      `}</style>
        </section>
    );
}