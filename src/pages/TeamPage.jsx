import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { useInView } from '../hooks/useInView';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useTilt } from '../hooks/useTilt';


/* ============================================================
   DATA — adding a new member only requires editing these arrays
   ============================================================ */

const facultyCoordinator = {
  name: 'Dr. Name Surname',
  role: 'Faculty Coordinator',
  department: 'Department of Computer Engineering',
  image: '/Images/niraj.jpg',
  linkedin: '#',
  bio: 'Guiding the chapter with a steady hand — turning curious students into builders, and builders into leaders.',
};

const coreTeam = [
  { name: 'Name', role: 'Chair', department: 'Core Team', image: '/image/coreteam/chair.jpg', linkedin: '#', github: '#', email: 'chair@acm.org', portfolio: '#', bio: 'Sets the chapter\u2019s direction and keeps every team rowing in sync.' },
  { name: 'Name', role: 'Vice Chair', department: 'Core Team', image: '/image/coreteam/vice-chair.jpg', linkedin: '#', github: '#', email: 'vicechair@acm.org', portfolio: '#', bio: 'Right hand to the Chair, owns execution across all department leads.' },
  { name: 'Name', role: 'President', department: 'Core Team', image: '/image/coreteam/president.jpg', linkedin: '#', github: '#', email: 'president@acm.org', portfolio: '#', bio: 'Represents the chapter externally and drives long-term strategy.' },
  { name: 'Name', role: 'Secretary', department: 'Core Team', image: '/image/coreteam/secretary.jpg', linkedin: '#', github: '#', email: 'secretary@acm.org', portfolio: '#', bio: 'Keeps records, minutes, and communication airtight.' },
  { name: 'Name', role: 'Treasurer', department: 'Core Team', image: '/image/coreteam/treasurer.jpg', linkedin: '#', github: '#', email: 'treasurer@acm.org', portfolio: '#', bio: 'Manages budgets, sponsorships, and every rupee in between.' },
  { name: 'Name', role: 'Joint Secretary', department: 'Core Team', image: '/image/coreteam/joint-secretary.jpg', linkedin: '#', github: '#', email: 'jointsec@acm.org', portfolio: '#', bio: 'Supports the Secretary and keeps documentation moving.' },
];

const leadsTeam = [
  { name: 'Name', role: 'Lead', domain: 'Web Development', image: '/image/webteam/lead.jpg', linkedin: '#', github: '#', email: 'web@acm.org' },
  { name: 'Name', role: 'Lead', domain: 'Design', image: '/image/designteam/lead.jpg', linkedin: '#', github: '#', email: 'design@acm.org' },
  { name: 'Name', role: 'Lead', domain: 'Video Editing', image: '/image/videoeditingteam/lead.jpg', linkedin: '#', github: '#', email: 'video@acm.org' },
  { name: 'Name', role: 'Lead', domain: 'Content', image: '/image/contentteam/lead.jpg', linkedin: '#', github: '#', email: 'content@acm.org' },
  { name: 'Name', role: 'Lead', domain: 'Event Management', image: '/image/eventmanagementteam/lead.jpg', linkedin: '#', github: '#', email: 'events@acm.org' },
  { name: 'Name', role: 'Lead', domain: 'Social Media', image: '/image/socialmediateam/lead.jpg', linkedin: '#', github: '#', email: 'social@acm.org' },
];

const teamHeroImage = 'Images/teamacm.jpg';

const maleMembers = [
  { name: 'Rohan Sharma', role: 'Web Development Lead', image: '/image/webteam/lead.jpg', linkedin: '#', github: '#', email: 'web@acm.org', bio: 'Architecting fast, responsive web systems and state-of-the-art interactive platforms.' },
  { name: 'Aditya Patel', role: 'Video Editing Lead', image: '/image/videoeditingteam/lead.jpg', linkedin: '#', github: '#', email: 'video@acm.org', bio: 'Bringing stories to life through high-impact, cinematic edits and motion design.' },
  { name: 'Ishaan Deshmukh', role: 'Content Lead', image: '/image/contentteam/lead.jpg', linkedin: '#', github: '#', email: 'content@acm.org', bio: 'Crafting compelling narratives, newsletters, and engaging documentation.' },
  { name: 'Kabir Verma', role: 'Treasurer', image: '/image/coreteam/treasurer.jpg', linkedin: '#', github: '#', email: 'treasurer@acm.org', bio: 'Directing resource allocation, budgeting, and sponsorship relations.' },
  { name: 'Aarav Nair', role: 'Web Developer', image: '/image/webteam/member1.jpg', linkedin: '#', github: '#', email: 'aarav@acm.org', bio: 'Coding pixel-perfect UI elements and solid client-side logic.' },
  { name: 'Siddharth Rao', role: 'Design Co-Lead', image: '/image/designteam/member1.jpg', linkedin: '#', github: '#', email: 'siddharth@acm.org', bio: 'Creating sleek visual style guides and premium graphic assets.' }
];

const femaleMembers = [
  { name: 'Ananya Iyer', role: 'Vice Chair', image: '/image/coreteam/vice-chair.jpg', linkedin: '#', github: '#', email: 'vicechair@acm.org', bio: 'Managing execution workflows and coordinating tech operations across team leads.' },
  { name: 'Diya Sen', role: 'Secretary', image: '/image/coreteam/secretary.jpg', linkedin: '#', github: '#', email: 'secretary@acm.org', bio: 'Owning organizational records, documentation, and external relations.' },
  { name: 'Meera Kulkarni', role: 'Design Lead', image: '/image/designteam/lead.jpg', linkedin: '#', github: '#', email: 'design@acm.org', bio: 'Shaping the visual aesthetic and user-centered design directions.' },
  { name: 'Riya Patil', role: 'Social Media Lead', image: '/image/socialmediateam/lead.jpg', linkedin: '#', github: '#', email: 'social@acm.org', bio: 'Driving viral engagement campaigns and brand outreach.' },
  { name: 'Kiara Joshi', role: 'Joint Secretary', image: '/image/coreteam/joint-secretary.jpg', linkedin: '#', github: '#', email: 'jointsec@acm.org', bio: 'Driving internal communications, chapter events, and team bonding.' },
  { name: 'Neha Gupta', role: 'Event Management Lead', image: '/image/eventmanagementteam/lead.jpg', linkedin: '#', github: '#', email: 'events@acm.org', bio: 'Planning and executing hackathons, tech talks, and premium workshops.' }
];


/* ============================================================
   SHARED PRIMITIVES
   ============================================================ */

function FadeInSection({ children, className = '', delay = 0 }) {
  const [ref, inView] = useInView({ threshold: 0.12, once: true });
  return (
    <section
      ref={ref}
      className={`${inView ? 'section-visible' : 'section-hidden'} ${className}`.trim()}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </section>
  );
}

function SectionTitle({ eyebrow, title, accentWord }) {
  return (
    <div className="team-section-title" aria-label={eyebrow}>
      <p className="team-section-title__eyebrow">{eyebrow}</p>
      <h2 className="team-section-title__h2">
        {title} <span className="team-section-title__accent">{accentWord}</span>
      </h2>
    </div>
  );
}

function PlaceholderImg({ src, alt, className = '', fallbackBg = true, rounded = false }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: rounded ? 999 : 16,
          background: fallbackBg ? 'rgba(56,189,248,0.08)' : 'transparent',
          border: '1px solid rgba(56,189,248,0.20)',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      draggable={false}
      onError={() => setBroken(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  );
}

function IconLink({ href, label, kind }) {
  const isValid = Boolean(href && href !== '#');
  const icons = {
    linkedin: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M6.94 8.5H4V20H6.94V8.5Z" fill="currentColor" />
        <path d="M5.47 4C4.63 4 4 4.7 4 5.52C4 6.34 4.63 7.04 5.47 7.04C6.31 7.04 6.94 6.34 6.94 5.52C6.94 4.7 6.31 4 5.47 4Z" fill="currentColor" />
        <path d="M20 20H17.06V14.35C17.06 13.03 16.78 12.19 15.48 12.19C14.36 12.19 13.98 12.95 13.98 14.2V20H11.04V8.5H13.87V9.99H13.91C14.29 9.27 15.24 8.32 16.64 8.32C19.04 8.32 20 9.86 20 12.52V20Z" fill="currentColor" />
      </svg>
    ),
    github: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.486 2 12.02c0 4.425 2.865 8.18 6.839 9.504.5.094.683-.219.683-.485 0-.24-.009-.876-.014-1.72-2.782.607-3.369-1.345-3.369-1.345-.455-1.158-1.11-1.467-1.11-1.467-.908-.623.069-.61.069-.61 1.004.07 1.532 1.034 1.532 1.034.892 1.532 2.341 1.09 2.91.834.091-.649.35-1.09.636-1.341-2.221-.254-4.555-1.115-4.555-4.962 0-1.096.39-1.993 1.029-2.696-.103-.254-.446-1.276.098-2.659 0 0 .84-.27 2.75 1.029A9.534 9.534 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.299 2.747-1.029 2.747-1.029.546 1.383.203 2.405.1 2.659.64.703 1.028 1.6 1.028 2.696 0 3.857-2.337 4.705-4.566 4.953.359.31.679.92.679 1.855 0 1.338-.012 2.418-.012 2.747 0 .268.18.583.688.484A10.02 10.02 0 0 0 22 12.02C22 6.486 17.523 2 12 2Z"
          fill="currentColor"
        />
      </svg>
    ),
    email: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.6" />
        <path d="m4.5 6.5 7.5 6 7.5-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
    portfolio: (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
        <path d="M3 12h18M12 3c2.4 2.6 3.6 5.6 3.6 9s-1.2 6.4-3.6 9c-2.4-2.6-3.6-5.6-3.6-9s1.2-6.4 3.6-9Z" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    ),
  };

  return (
    <a
      href={isValid ? href : undefined}
      target={isValid ? '_blank' : undefined}
      rel={isValid ? 'noreferrer' : undefined}
      aria-label={label}
      className={`social-icon ${isValid ? '' : 'social-icon--disabled'}`}
      onClick={(e) => {
        if (!isValid) e.preventDefault();
      }}
    >
      {icons[kind]}
    </a>
  );
}

/* ============================================================
   HERO — panoramic banner that morphs into a vertical portrait
   ============================================================ */

function ParticleField({ count = 18 }) {
  const particles = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.round(Math.random() * 100),
        size: 2 + Math.round(Math.random() * 4),
        duration: 9 + Math.random() * 10,
        delay: -Math.random() * 14,
        drift: (Math.random() - 0.5) * 60,
      })),
    [count]
  );

  return (
    <div className="particle-field" aria-hidden="true">
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle-field__dot"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            animationDuration: `${p.duration}s`,
            animationDelay: `${p.delay}s`,
            '--drift': `${p.drift}px`,
          }}
        />
      ))}
    </div>
  );
}

/**
 * TeamHero
 * Unfolding sliding panels on mount, camera focus pull, scale zoom,
 * and scroll-driven container shrink upward.
 */
function TeamHero() {
  const cardRef = useRef(null);
  const [glow, setGlow] = useState({ x: 50, y: 50 });
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const [unfolded, setUnfolded] = useState(false);
  const [focusZoom, setFocusZoom] = useState(false);
  const [showSweep, setShowSweep] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1, once: true });

  const [scrollRef, progress] = useScrollProgress({ range: 0.85 });

  useEffect(() => {
    if (inView) {
      const t1 = setTimeout(() => setUnfolded(true), 200);      // open sliding panels
      const t2 = setTimeout(() => setFocusZoom(true), 2400);    // zoom + camera focus
      const t3 = setTimeout(() => setShowSweep(true), 2900);    // soft light sweep
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [inView]);

  const onMouseMove = (e) => {
    if (!focusZoom) return;
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    setGlow({ x: px * 100, y: py * 100 });
    setTilt({ rx: (0.5 - py) * 3.2, ry: (px - 0.5) * 3.2 });
  };

  const onMouseLeave = () => {
    setTilt({ rx: 0, ry: 0 });
  };

  const widthVal = 100 - progress * 18;
  const heightVal = 80 - progress * 20;
  const radiusVal = progress * 24;

  return (
    <div ref={scrollRef} className="team-hero-wrap" style={{ height: '', position: 'relative' }}>
      <div
        ref={ref}
        className="team-hero-sticky"
        style={{
          position: 'sticky',
          top: '80px',
          height: '80vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          zIndex: 10,
        }}
      >
        <div
          ref={cardRef}
          className={`team-hero-card ${unfolded ? 'team-hero-card--unfolded' : ''}`}
          onMouseMove={onMouseMove}
          onMouseLeave={onMouseLeave}
          style={{
            width: `${widthVal}vw`,
            height: `${heightVal}vh`,
            borderRadius: `${radiusVal}px`,
            position: 'relative',
            overflow: 'hidden',
            boxShadow: `0 0 ${progress * 50}px rgba(56, 189, 248, ${0.15 * progress})`,
            border: progress > 0.05 ? `${progress * 1.5}px solid rgba(56, 189, 248, 0.2)` : 'none',
            '--gx': `${glow.x}%`,
            '--gy': `${glow.y}%`,
            transition: 'border-radius 0.08s ease, width 0.08s ease, height 0.08s ease, border 0.08s ease',
          }}
        >
          <div className="hero-morph__glowBg" />
          <ParticleField count={16} />
          <div className="hero-light-rays" />

          {/* Sliding panels */}
          <div
            className="hero-curtain hero-curtain--left"
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '50%',
              height: '100%',
              background: '#030712',
              zIndex: 10,
              transform: unfolded ? 'translateX(-100%)' : 'translateX(0)',
              transition: 'transform 2.2s cubic-bezier(0.25, 1, 0.3, 1)',
            }}
          />
          <div
            className="hero-curtain hero-curtain--right"
            style={{
              position: 'absolute',
              right: 0,
              top: 0,
              width: '50%',
              height: '100%',
              background: '#030712',
              zIndex: 10,
              transform: unfolded ? 'translateX(100%)' : 'translateX(0)',
              transition: 'transform 2.2s cubic-bezier(0.25, 1, 0.3, 1)',
            }}
          />
          <div
            className="hero-seam"
            style={{
              position: 'absolute',
              left: '50%',
              top: 0,
              bottom: 0,
              width: '2px',
              background: '#38bdf8',
              boxShadow: '0 0 15px #38bdf8, 0 0 30px #0ea5e9',
              zIndex: 11,
              transform: 'translateX(-50%)',
              opacity: unfolded ? 0 : 1,
              transition: 'opacity 0.8s ease-in-out',
              pointerEvents: 'none',
            }}
          />

          <img
            className="hero-image"
            src={teamHeroImage}
            alt="The ACM RSCOE team"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transform: `scale(${focusZoom ? 1.05 : 1.0}) translate(${tilt.rx * -3}px, ${tilt.ry * -3}px)`,
              filter: unfolded ? 'blur(0px)' : 'blur(8px)',
              transition: 'transform 1.8s cubic-bezier(0.25, 1, 0.5, 1), filter 2.0s ease',
            }}
          />

          {showSweep && (
            <div
              className="hero-sweep-overlay"
              style={{
                position: 'absolute',
                inset: 0,
                background: 'linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.08) 50%, transparent 100%)',
                zIndex: 5,
                pointerEvents: 'none',
                animation: 'sweepOnce 1.6s ease-in-out forwards',
              }}
            />
          )}

          <div className="hero-morph__overlay" />
          <div className="hero-morph__vignette" />

          <div className={`hero-morph__panel ${unfolded ? 'hero-morph__panel--in' : ''}`} style={{ transitionDelay: '2.0s' }}>
            <div className="hero-morph__panel-inner" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(56, 189, 248, 0.18)' }}>
              <div className="hero-morph__title">OUR TEAM</div>
              <div className="hero-morph__subtitle">
                Meet the passionate students behind the RSCOE ACM Student Chapter.
              </div>
            </div>
          </div>
        </div>

        <div className={`hero-morph__hint ${unfolded ? 'hero-morph__hint--in' : ''}`} style={{ opacity: unfolded ? 1 - progress * 1.4 : 0 }}>

        </div>
      </div>
    </div>
  );
}

/* ============================================================
   SPLIT COMMUNITY — ACM Boys / ACM Girls
   ============================================================ */

function SplitCard({ label, image, side, onClick }) {
  const { ref: tiltRef, onMouseMove, onMouseLeave } = useTilt(3);

  return (
    <article
      ref={tiltRef}
      className={`split-card split-card--${side}`}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
      role="button"
      aria-label={`View ${label}`}
      style={{
        position: 'relative',
        borderRadius: '24px',
        border: '1px solid rgba(56, 189, 248, 0.18)',
        background: 'rgba(255, 255, 255, 0.03)',
        overflow: 'hidden',
        boxShadow: '0 0 25px rgba(56, 189, 248, 0.08)',
        cursor: 'pointer',
        aspectRatio: '21/9',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.4s cubic-bezier(0.25, 1, 0.5, 1)',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
        e.currentTarget.style.boxShadow = '0 0 35px rgba(56, 189, 248, 0.28)';
      }}
      onMouseLeave={(e) => {
        onMouseLeave();
        e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.18)';
        e.currentTarget.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.08)';
      }}
    >
      <div className="split-card__shine" aria-hidden="true" />
      <ParticleField count={8} />

      <div style={{ width: '100%', height: '100%', overflow: 'hidden', position: 'relative' }}>
        <PlaceholderImg src={image} alt={label} className="split-card__img" />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3, 7, 18, 0.8) 0%, rgba(3, 7, 18, 0.2) 70%, transparent 100%)' }} />
      </div>

      <div className="split-card__meta" style={{
        position: 'absolute',
        bottom: '20px',
        left: '24px',
        zIndex: 2,
        textAlign: 'left'
      }}>
        <div className="split-card__label" style={{
          fontFamily: 'Orbitron, sans-serif',
          fontWeight: 900,
          color: '#fff',
          fontSize: '1.25rem',
          letterSpacing: '0.06em',
          textShadow: '0 0 15px rgba(56, 189, 248, 0.5)'
        }}>
          {label}
        </div>
      </div>
    </article>
  );
}

function SplitCommunity({ onSelectTeam }) {
  const [ref, inView] = useInView({ threshold: 0.15, once: true });

  return (
    <div
      ref={ref}
      className={`container-1300 split-community ${inView ? 'split-community--in' : ''}`}
      style={{ padding: '60px 20px', position: 'relative' }}
    >
      <SectionTitle eyebrow="THE COMMUNITY" title="ACM" accentWord="COMMUNITY" />

      <div className="split-community__grid" style={{ marginTop: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', position: 'relative' }}>
        <div className="split-connector" />

        <SplitCard
          label="Male Team"
          image="/Images/boylead.jpeg"
          side="left"
          onClick={() => onSelectTeam('male')}
        />

        <SplitCard
          label="Female Team"
          image="/Images/girllead.jpeg"
          side="right"
          onClick={() => onSelectTeam('female')}
        />
      </div>
    </div>
  );
}

/* ============================================================
   TEAM DETAIL MODAL (full-screen dive-in view)
   ============================================================ */

function TeamDetailModal({ team, onClose }) {
  const membersList = team === 'male' ? maleMembers : femaleMembers;
  const teamTitle = team === 'male' ? 'ACM BOYS' : 'ACM GIRLS';
  const teamBanner = team === 'male' ? '/Images/boylead.jpeg' : '/Images/girllead.jpeg';

  return (
    <motion.div
      className="team-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'rgba(3, 7, 18, 0.98)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        overflowY: 'auto',
        padding: '60px 20px',
      }}
    >
      <div className="container-1300" style={{ position: 'relative' }}>
        <button
          onClick={onClose}
          aria-label="Close details"
          style={{
            position: 'absolute',
            top: '-20px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(56, 189, 248, 0.3)',
            color: '#38bdf8',
            borderRadius: '999px',
            width: '44px',
            height: '44px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.2)',
            zIndex: 10002,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(56, 189, 248, 0.15)';
            e.currentTarget.style.transform = 'scale(1.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
            e.currentTarget.style.transform = 'scale(1.0)';
          }}
        >
          ✕
        </button>

        <div style={{ overflow: 'hidden', borderRadius: '24px', position: 'relative', width: '100%', height: '360px', border: '1px solid rgba(56, 189, 248, 0.25)', boxShadow: '0 0 35px rgba(56, 189, 248, 0.15)' }}>
          <motion.img
            src={teamBanner}
            alt={teamTitle}
            initial={{ scale: 1.3, filter: 'blur(8px)' }}
            animate={{ scale: 1.0, filter: 'blur(0px)' }}
            transition={{ duration: 0.8, cubicBezier: [0.25, 1, 0.5, 1] }}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3, 7, 18, 0.9) 0%, rgba(3, 7, 18, 0.2) 60%, transparent 100%)' }} />

          <div style={{ position: 'absolute', bottom: '30px', left: '30px' }}>
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, color: '#fff', fontSize: '2.5rem', letterSpacing: '0.08em', textShadow: '0 0 20px rgba(56, 189, 248, 0.6)' }}>
                {teamTitle}
              </h1>
              <p style={{ color: 'rgba(56, 189, 248, 0.9)', fontWeight: 600, marginTop: '8px', letterSpacing: '0.04em' }}>
                ACM STUDENT CHAPTER
              </p>
            </motion.div>
          </div>
        </div>

        <motion.div
          className="modal-members-grid"
          initial="hidden"
          animate="show"
          variants={{
            hidden: { opacity: 0 },
            show: {
              opacity: 1,
              transition: {
                staggerChildren: 0.08,
              },
            },
          }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '24px',
            marginTop: '50px',
          }}
        >
          {membersList.map((person, idx) => (
            <motion.article
              key={person.name}
              variants={{
                hidden: { y: 30, opacity: 0 },
                show: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 120, damping: 15 } }
              }}
              style={{
                borderRadius: '22px',
                border: '1px solid rgba(56, 189, 248, 0.18)',
                background: 'rgba(255, 255, 255, 0.02)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                overflow: 'hidden',
                boxShadow: '0 0 25px rgba(56, 189, 248, 0.05)',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px) scale(1.03)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.5)';
                e.currentTarget.style.boxShadow = '0 0 35px rgba(56, 189, 248, 0.25)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1.0)';
                e.currentTarget.style.borderColor = 'rgba(56, 189, 248, 0.18)';
                e.currentTarget.style.boxShadow = '0 0 25px rgba(56, 189, 248, 0.05)';
              }}
            >
              <div style={{ width: '100%', aspectRatio: '4/3', overflow: 'hidden', background: 'rgba(56, 189, 248, 0.05)' }}>
                <PlaceholderImg src={person.image} alt={person.name} />
              </div>
              <div style={{ padding: '20px' }}>
                <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, color: '#fff', fontSize: '1.1rem', letterSpacing: '0.04em' }}>
                  {person.name}
                </div>
                <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem', marginTop: '6px' }}>
                  {person.role}
                </div>
                <p style={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: '0.85rem', lineHeight: '1.5', marginTop: '12px' }}>
                  {person.bio}
                </p>
                <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
                  <IconLink href={person.linkedin} label="LinkedIn" kind="linkedin" />
                  <IconLink href={person.github} label="GitHub" kind="github" />
                  <IconLink href={person.email ? `mailto:${person.email}` : null} label="Email" kind="email" />
                </div>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>

      <ParticleField count={10} />
    </motion.div>
  );
}

/* ============================================================
   FACULTY SPOTLIGHT
   ============================================================ */

function FacultySpotlight({ data }) {
  const cardRef = useRef(null);
  const [spot, setSpot] = useState({ x: 50, y: 50 });
  const [ref, inView] = useInView({ threshold: 0.25, once: true });

  const onMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpot({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  return (
    <div className="container-1300" style={{ padding: '26px 0 18px' }}>
      <div
        ref={ref}
        className={`faculty-spotlight ${inView ? 'faculty-spotlight--in' : ''}`}
      >
        <div className="faculty-spotlight__blueprint" aria-hidden="true" />
        <div
          ref={cardRef}
          className="faculty-spotlight__card glass-card"
          onMouseMove={onMouseMove}
          style={{ '--sx': `${spot.x}%`, '--sy': `${spot.y}%` }}
        >
          <div className="faculty-spotlight__photoWrap">
            <div className="faculty-spotlight__ring" />
            <PlaceholderImg src={data.image} alt={data.name} rounded className="faculty-spotlight__photo" />
          </div>

          <div className="faculty-spotlight__meta">
            <div className="faculty-spotlight__name">{data.name}</div>
            <div className="faculty-spotlight__role">{data.role}</div>
            <div className="faculty-spotlight__dept">{data.department}</div>
            <p className="faculty-spotlight__bio">{data.bio}</p>
            <div className="faculty-spotlight__social">
              <IconLink href={data.linkedin} label="LinkedIn" kind="linkedin" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PREMIUM PROFILE CARD (core + leads)
   ============================================================ */

function PremiumCard({ person, index, variant }) {
  const { ref, onMouseMove, onMouseLeave } = useTilt(7);
  const [inViewRef, inView] = useInView({ threshold: 0.15, once: true });

  const setRefs = (el) => {
    ref.current = el;
    inViewRef.current = el;
  };

  return (
    <article
      ref={setRefs}
      className={`premium-card premium-card--${variant} ${inView ? 'premium-card--in' : ''}`}
      style={{ transitionDelay: `${Math.min(index, 8) * 70}ms` }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      role="group"
      aria-label={`${person.name}, ${person.role}`}
    >
      <div className="premium-card__shine" aria-hidden="true" />
      <div className="premium-card__imgWrap">
        <PlaceholderImg src={person.image} alt={person.name} className="premium-card__img" />
      </div>

      <div className="premium-card__body">
        <div className="premium-card__name">{person.name}</div>
        <div className="premium-card__role">{person.role}</div>
        {person.domain && <div className="premium-card__domain">{person.domain}</div>}
        {person.bio && <p className="premium-card__bio">{person.bio}</p>}

        <div className="premium-card__social">
          <IconLink href={person.linkedin} label="LinkedIn" kind="linkedin" />
          <IconLink href={person.github} label="GitHub" kind="github" />
          <IconLink href={person.email ? `mailto:${person.email}` : null} label="Email" kind="email" />
          {person.portfolio && <IconLink href={person.portfolio} label="Portfolio" kind="portfolio" />}
        </div>
      </div>
    </article>
  );
}

function PremiumGrid({ people, variant }) {
  return (
    <div className={`premium-grid premium-grid--${variant}`}>
      {people.map((p, idx) => (
        <PremiumCard key={`${p.name}-${idx}`} person={p} index={idx} variant={variant} />
      ))}
    </div>
  );
}

/* ============================================================
   DEPARTMENTS (extended membership, kept below leads team)
   ============================================================ */

function MemberCard({ name, role, photo, linkedinHref }) {
  return (
    <article className="member-card" aria-label={`${name} ${role}`} role="group">
      <div className="member-card__avatar" aria-hidden="true">
        <PlaceholderImg src={photo} alt={name} rounded className="member-card__img" />
      </div>
      <div className="member-card__name">{name}</div>
      <div className="member-card__role">{role}</div>
      <div className="member-card__social">
        <IconLink href={linkedinHref} label="LinkedIn" kind="linkedin" />
      </div>
    </article>
  );
}

function HeadCard({ genderLabel, name, photo, linkedinHref }) {
  return (
    <article className="head-card" aria-label={`${genderLabel} ${name}`} role="group">
      <div className="head-card__photo" aria-hidden="true">
        <PlaceholderImg src={photo} alt={name} rounded className="head-card__img" />
      </div>
      <div className="head-card__meta">
        <div className="head-card__label">{genderLabel}</div>
        <div className="head-card__name">{name}</div>
        <div className="head-card__title">Team Lead</div>
        <div className="head-card__social">
          <IconLink href={linkedinHref} label="LinkedIn" kind="linkedin" />
        </div>
      </div>
    </article>
  );
}

function MembersGrid({ members }) {
  return (
    <div className="members-grid" role="list" aria-label="Team members">
      {members.map((m, idx) => (
        <div key={`${m.name}-${idx}`} role="listitem" className="members-grid__item">
          <MemberCard {...m} />
        </div>
      ))}
    </div>
  );
}

function MembersCarousel({ members }) {
  const [page, setPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const viewportRef = useRef(null);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w <= 640) setCardsPerPage(1);
      else if (w <= 860) setCardsPerPage(2);
      else if (w <= 1024) setCardsPerPage(3);
      else setCardsPerPage(4);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  const totalPages = Math.max(1, Math.ceil(members.length / cardsPerPage));

  useEffect(() => {
    setPage((p) => Math.max(0, Math.min(totalPages - 1, p)));
  }, [totalPages]);

  const go = (p) => setPage(Math.max(0, Math.min(totalPages - 1, p)));
  const pageMembers = (p) => members.slice(p * cardsPerPage, p * cardsPerPage + cardsPerPage);
  const trackStyle = useMemo(() => ({ transform: `translateX(-${page * 100}%)` }), [page]);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;
    let startX = 0;
    let dx = 0;
    const onTouchStart = (e) => { startX = e.touches[0].clientX; dx = 0; };
    const onTouchMove = (e) => { dx = e.touches[0].clientX - startX; };
    const onTouchEnd = () => {
      if (dx < -50) go(page + 1);
      if (dx > 50) go(page - 1);
    };
    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);
    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [page]);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="carousel" aria-label="Members carousel">
      <div className="carousel__viewport" ref={viewportRef}>
        <div className="carousel__track" style={trackStyle}>
          {Array.from({ length: totalPages }).map((_, p) => (
            <div className="carousel__page" key={p}>
              {pageMembers(p).map((m, idx) => (
                <MemberCard key={`${m.name}-${idx}`} {...m} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <button className="carousel__arrow" disabled={!canPrev} onClick={() => go(page - 1)} aria-label="Previous">‹</button>
      <button className="carousel__arrow carousel__arrow--next" disabled={!canNext} onClick={() => go(page + 1)} aria-label="Next">›</button>

      <div className="carousel__dots" role="tablist" aria-label="Pagination dots">
        {Array.from({ length: totalPages }).map((_, p) => (
          <button
            key={p}
            className={`carousel__dot ${p === page ? 'is-active' : ''}`}
            onClick={() => go(p)}
            aria-label={`Go to page ${p + 1}`}
            aria-selected={p === page}
          />
        ))}
      </div>
    </div>
  );
}

function DepartmentSection({ title, headMale, headFemale, members }) {
  const useCarousel = members.length > 5;
  return (
    <section className="dept-wrap">
      <div className="dept-header">
        <div className="dept-eyebrow">DEPARTMENT</div>
        <h3 className="dept-title">{title}</h3>
      </div>

      <div className="dept-glass glass-card" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(56,189,248,0.18)' }}>
        <div className="dept-inner">
          <FadeInSection>
            <div className="heads-grid">
              <HeadCard genderLabel="Male Head" {...headMale} />
              <HeadCard genderLabel="Female Head" {...headFemale} />
            </div>
          </FadeInSection>

          <div className="dept-members">
            <FadeInSection>
              {useCarousel ? <MembersCarousel members={members} /> : <MembersGrid members={members} />}
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
}

const departments = [

].map((d) => ({
  ...d,
  headMale: { name: 'Name', photo: `/image/${d.key}/male-head.jpg`, linkedinHref: '#' },
  headFemale: { name: 'Name', photo: `/image/${d.key}/female-head.jpg`, linkedinHref: '#' },
  members: Array.from({ length: 8 }).map((_, i) => ({
    name: `Member ${i + 1}`,
    role: 'Member',
    photo: `/image/${d.key}/member${i + 1}.jpg`,
    linkedinHref: '#',
  })),
}));

/* ============================================================
   PAGE
   ============================================================ */

export default function TeamPage() {
  const [activeTeam, setActiveTeam] = useState(null);

  useEffect(() => {
    if (activeTeam) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [activeTeam]);

  return (
    <main
      style={{
        minHeight: '100vh',
        paddingTop: '80px',
        background: 'linear-gradient(180deg, #030712 0%, #060d1f 100%)',
        position: 'relative',
        overflowX: 'hidden',
      }}
      aria-label="Team page"
    >
      <style>{`
        /* ---------------- HERO LIGHT RAYS & SWEEP ---------------- */
        .hero-light-rays {
          position: absolute;
          inset: 0;
          background: repeating-linear-gradient(
            45deg,
            rgba(56, 189, 248, 0.025) 0px,
            rgba(56, 189, 248, 0.025) 2px,
            transparent 2px,
            transparent 12px
          );
          pointer-events: none;
          z-index: 2;
        }

        @keyframes sweepOnce {
          0% { transform: translateX(-100%) skewX(-15deg); }
          100% { transform: translateX(200%) skewX(-15deg); }
        }

        /* ---------------- SPLIT COMMUNITY STYLES ---------------- */
        .split-community .split-card--left {
          opacity: 0;
          transform: translateX(-50px) scale(0.97);
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
        }
        .split-community .split-card--right {
          opacity: 0;
          transform: translateX(50px) scale(0.97);
          transition: opacity 0.8s cubic-bezier(0.25, 1, 0.5, 1), transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
          transition-delay: 0.15s;
        }
        .split-community--in .split-card--left,
        .split-community--in .split-card--right {
          opacity: 1;
          transform: translateX(0) scale(1);
        }

        .split-connector {
          position: absolute;
          left: 50%;
          top: 55%;
          width: 32px;
          height: 2px;
          background: #38bdf8;
          box-shadow: 0 0 12px #38bdf8, 0 0 24px #0ea5e9;
          transform: translate(-50%, -50%);
          z-index: 1;
          opacity: 0;
          transition: opacity 0.8s ease;
          transition-delay: 0.4s;
        }
        .split-community--in .split-connector {
          opacity: 0.8;
        }

        @media (max-width: 768px) {
          .split-community__grid {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
          .split-connector {
            display: none;
          }
          .split-card {
            aspect-ratio: 16/7 !important;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.001ms !important; animation-iteration-count: 1 !important; transition-duration: 0.001ms !important; scroll-behavior: auto !important; }
        }

        .team-section-title{margin:0 auto;text-align:center;}
        .team-section-title__eyebrow{color:#38bdf8;font-size:0.7rem;letter-spacing:0.35em;text-transform:uppercase;font-weight:600;margin-bottom:12px;font-family:'Inter',sans-serif;}
        .team-section-title__h2{font-family:'Orbitron',sans-serif;font-size:clamp(2rem,4vw,3.5rem);font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#fff;margin:0;}
        .team-section-title__accent{color:#38bdf8;text-shadow:0 0 20px rgba(56,189,248,0.5);}

        .container-1300{max-width:1320px;margin:0 auto;padding:0 20px;}
        .premium-center-card{max-width:1080px;margin:0 auto;}

        .section-hidden{opacity:0;transform:translateY(28px);}
        .section-visible{opacity:1;transform:translateY(0);transition:opacity 700ms cubic-bezier(.2,.9,.2,1), transform 700ms cubic-bezier(.2,.9,.2,1);}

        /* ---------------- HERO MORPH ---------------- */
        .hero-morph{position:relative;}
        .hero-morph__spacer{height:70vh;}
        .hero-morph__sticky{
          position:sticky; top:84px;
          display:flex; flex-direction:column; align-items:center; gap:14px;
          padding:18px 0 6px;
          z-index:1;
        }
        .hero-morph__card{
          position:relative; overflow:hidden; isolation:isolate;
          box-shadow:0 0 60px rgba(56,189,248,0.18), 0 30px 80px rgba(0,0,0,0.55);
          border:1px solid rgba(56,189,248,0.25);
          will-change:width,border-radius,aspect-ratio;
        }
        .hero-morph__img{width:100%;height:100%;object-fit:cover;display:block;transition:transform 60ms linear;}
        .hero-morph__overlay{
          position:absolute;inset:0;
          background:linear-gradient(110deg, rgba(56,189,248,0.22) 0%, rgba(56,189,248,0.06) 40%, rgba(3,7,18,0.7) 100%);
        }
        .hero-morph__vignette{position:absolute;inset:0;box-shadow:inset 0 0 120px rgba(0,0,0,0.55);pointer-events:none;}
        .hero-morph__glowBg{
          position:absolute; inset:0; z-index:-1;
          background:radial-gradient(420px circle at var(--gx,50%) var(--gy,50%), rgba(56,189,248,0.35), transparent 60%);
          opacity:0.9; filter:blur(6px); pointer-events:none;
        }
        .hero-morph__sweep{
          position:absolute; top:-20%; width:16%; height:140%;
          background:linear-gradient(100deg, transparent, rgba(255,255,255,0.18), transparent);
          transform:skewX(-18deg); pointer-events:none; mix-blend-mode:screen;
          transition:left 60ms linear;
        }
        .hero-morph__panel{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:min(92%, 760px);transition:opacity 200ms linear;}
        .hero-morph__panel-inner{padding:20px 22px;border-radius:18px;background:rgba(255,255,255,0.05);border:1px solid rgba(56,189,248,0.22);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 0 28px rgba(56,189,248,0.12);text-align:center;}
        .hero-morph__title{font-family:'Orbitron',sans-serif;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#fff;font-size:clamp(1.6rem,4vw,2.6rem);margin:0;}
        .hero-morph__subtitle{margin-top:10px;color:rgba(255,255,255,0.7);font-size:clamp(0.92rem,2vw,1.05rem);line-height:1.6;}
        .hero-morph__hint{display:flex;flex-direction:column;align-items:center;gap:8px;color:rgba(56,189,248,0.85);font-family:'Inter',sans-serif;font-size:0.7rem;letter-spacing:0.3em;text-transform:uppercase;transition:opacity 200ms linear;}
        .hero-morph__hint-line{width:1px;height:34px;background:linear-gradient(180deg, rgba(56,189,248,0.9), transparent);animation:hintPulse 1.8s ease-in-out infinite;}
        @keyframes hintPulse{0%,100%{opacity:0.3;transform:scaleY(0.7);}50%{opacity:1;transform:scaleY(1);}}

        .particle-field{position:absolute;inset:0;overflow:hidden;pointer-events:none;}
        .particle-field__dot{
          position:absolute; bottom:-10px; border-radius:999px;
          background:radial-gradient(circle, rgba(125,211,252,0.95), rgba(56,189,248,0.1));
          box-shadow:0 0 8px rgba(56,189,248,0.7);
          animation-name:particleFloat; animation-timing-function:ease-in; animation-iteration-count:infinite;
        }
        @keyframes particleFloat{
          0%{transform:translate(0,0);opacity:0;}
          10%{opacity:0.9;}
          100%{transform:translate(var(--drift), -340px);opacity:0;}
        }

        /* ---------------- FACULTY SPOTLIGHT ---------------- */
        .faculty-spotlight{position:relative;}
        .faculty-spotlight__blueprint{
          position:absolute;inset:-30px;z-index:-1;opacity:0.18;pointer-events:none;
          background-image:linear-gradient(rgba(56,189,248,0.5) 1px, transparent 1px),linear-gradient(90deg, rgba(56,189,248,0.5) 1px, transparent 1px);
          background-size:42px 42px;
          -webkit-mask-image:radial-gradient(circle at 50% 50%, black, transparent 70%);
                  mask-image:radial-gradient(circle at 50% 50%, black, transparent 70%);
        }
        .faculty-spotlight__card{
          max-width:920px;margin:0 auto;padding:30px;border-radius:24px;
          display:flex;gap:26px;align-items:center;flex-wrap:wrap;justify-content:center;
          position:relative;overflow:hidden;
          opacity:0;transform:translateY(30px) scale(0.97);
          transition:opacity 800ms cubic-bezier(.2,.9,.2,1), transform 800ms cubic-bezier(.2,.9,.2,1);
        }
        .faculty-spotlight--in .faculty-spotlight__card{opacity:1;transform:translateY(0) scale(1);animation:facultyFloat 6s ease-in-out 800ms infinite;}
        @keyframes facultyFloat{0%,100%{transform:translateY(0);}50%{transform:translateY(-7px);}}
        .faculty-spotlight__card::before{
          content:'';position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(280px circle at var(--sx,50%) var(--sy,50%), rgba(56,189,248,0.28), transparent 65%);
        }
        .faculty-spotlight__photoWrap{position:relative;width:150px;height:150px;flex:0 0 auto;}
        .faculty-spotlight__ring{position:absolute;inset:-10px;border-radius:999px;border:1px solid rgba(56,189,248,0.4);box-shadow:0 0 30px rgba(56,189,248,0.25);animation:ringPulse 3.2s ease-in-out infinite;}
        @keyframes ringPulse{0%,100%{opacity:0.5;transform:scale(1);}50%{opacity:1;transform:scale(1.04);}}
        .faculty-spotlight__photo{border-radius:999px;border:1px solid rgba(56,189,248,0.3);box-shadow:0 0 28px rgba(56,189,248,0.18);}
        .faculty-spotlight__meta{text-align:left;min-width:280px;max-width:480px;}
        .faculty-spotlight__name{font-family:'Orbitron',sans-serif;font-weight:900;color:#fff;letter-spacing:0.06em;font-size:1.4rem;}
        .faculty-spotlight__role{margin-top:8px;color:rgba(56,189,248,0.95);font-family:'Inter',sans-serif;font-weight:800;font-size:1rem;}
        .faculty-spotlight__dept{margin-top:6px;color:rgba(255,255,255,0.65);font-family:'Inter',sans-serif;font-weight:600;font-size:0.92rem;}
        .faculty-spotlight__bio{margin:12px 0 0;color:rgba(255,255,255,0.72);font-family:'Inter',sans-serif;font-size:0.92rem;line-height:1.6;}
        .faculty-spotlight__social{margin-top:14px;}

        /* ---------------- PREMIUM GRID (core + leads) ---------------- */
        .premium-grid{margin-top:24px;display:grid;gap:20px;grid-template-columns:repeat(3, minmax(0, 1fr));}
        @media (max-width:980px){.premium-grid{grid-template-columns:repeat(2, minmax(0, 1fr));}}
        @media (max-width:600px){.premium-grid{grid-template-columns:1fr;}}

        .premium-card{
          position:relative;border-radius:22px;border:1px solid rgba(56,189,248,0.16);
          background:rgba(255,255,255,0.025);overflow:hidden;
          box-shadow:0 0 26px rgba(56,189,248,0.08);
          transition:transform .35s cubic-bezier(.2,.9,.2,1), box-shadow .35s ease, border-color .35s ease, opacity .6s ease;
          opacity:0; transform:translateY(34px) scale(0.96);
        }
        .premium-card--in{opacity:1;transform:translateY(0) scale(1);}
        .premium-card:hover{box-shadow:0 0 44px rgba(56,189,248,0.28);border-color:rgba(56,189,248,0.5);}
        .premium-card__shine{
          position:absolute;inset:0;pointer-events:none;opacity:0;
          background:radial-gradient(220px circle at var(--mx,50%) var(--my,50%), rgba(56,189,248,0.30), transparent 60%);
          transition:opacity .3s ease;
        }
        .premium-card:hover .premium-card__shine{opacity:1;}
        .premium-card__imgWrap{width:100%;aspect-ratio:4/3;overflow:hidden;background:rgba(56,189,248,0.06);}
        .premium-card__img{transition:transform .5s ease;}
        .premium-card:hover .premium-card__img{transform:scale(1.06);}
        .premium-card__body{padding:18px 18px 20px;}
        .premium-card__name{font-family:'Orbitron',sans-serif;font-weight:900;color:#fff;font-size:1.05rem;letter-spacing:0.04em;}
        .premium-card__role{margin-top:6px;color:rgba(56,189,248,0.95);font-family:'Inter',sans-serif;font-weight:700;font-size:0.9rem;}
        .premium-card__domain{margin-top:4px;color:rgba(255,255,255,0.6);font-family:'Inter',sans-serif;font-weight:600;font-size:0.82rem;text-transform:uppercase;letter-spacing:0.06em;}
        .premium-card__bio{margin:10px 0 0;color:rgba(255,255,255,0.65);font-family:'Inter',sans-serif;font-size:0.85rem;line-height:1.55;}
        .premium-card__social{margin-top:14px;display:flex;gap:8px;flex-wrap:wrap;}

        .premium-card--in:nth-child(odd){animation:cardBurst .6s cubic-bezier(.2,.9,.2,1) both;}
        .premium-card--in:nth-child(even){animation:cardBurst .6s cubic-bezier(.2,.9,.2,1) both;}
        @keyframes cardBurst{0%{filter:drop-shadow(0 0 0 rgba(56,189,248,0));}60%{filter:drop-shadow(0 0 18px rgba(56,189,248,0.35));}100%{filter:drop-shadow(0 0 0 rgba(56,189,248,0));}}

        /* ---------------- SOCIAL ICONS ---------------- */
        .social-icon{width:30px;height:30px;border-radius:999px;border:1px solid rgba(56,189,248,0.25);background:rgba(56,189,248,0.06);box-shadow:0 0 18px rgba(56,189,248,0.1);color:#38bdf8;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease;}
        .social-icon:hover{transform:translateY(-3px) scale(1.07);box-shadow:0 0 26px rgba(56,189,248,0.32);border-color:rgba(56,189,248,0.6);background:rgba(56,189,248,0.12);}
        .social-icon--disabled{opacity:0.45;}

        /* ---------------- DEPARTMENTS ---------------- */
        .dept-wrap{padding:54px 0;}
        .dept-header{text-align:center;margin-bottom:18px;}
        .dept-eyebrow{color:#38bdf8;font-size:0.65rem;letter-spacing:0.35em;text-transform:uppercase;font-weight:600;margin-bottom:10px;font-family:'Inter',sans-serif;}
        .dept-title{font-family:'Orbitron',sans-serif;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#fff;font-size:clamp(1.5rem,3.6vw,2.2rem);margin:0;}
        .dept-glass{border-radius:22px;box-shadow:0 0 28px rgba(56,189,248,0.10);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}
        .dept-inner{padding:22px;max-width:1250px;margin:0 auto;}
        .dept-members{margin-top:22px;}

        .heads-grid{display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:16px;justify-content:center;}
        .head-card{border-radius:20px;border:1px solid rgba(56,189,248,0.20);background:rgba(0,0,0,0.12);overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:18px 14px;box-shadow:0 0 26px rgba(56,189,248,0.10);transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;}
        .head-card:hover{transform:translateY(-3px);box-shadow:0 0 34px rgba(56,189,248,0.22);border-color:rgba(56,189,248,0.48);}
        .head-card__photo{width:118px;height:118px;border-radius:999px;border:1px solid rgba(56,189,248,0.26);background:rgba(56,189,248,0.06);overflow:hidden;box-shadow:0 0 24px rgba(56,189,248,0.12);}
        .head-card__meta{text-align:center;margin-top:14px;}
        .head-card__label{color:rgba(56,189,248,0.95);font-family:'Inter',sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:0.03em;}
        .head-card__name{margin-top:8px;font-family:'Orbitron',sans-serif;font-weight:900;color:#fff;font-size:1.15rem;letter-spacing:0.06em;}
        .head-card__title{margin-top:8px;color:rgba(255,255,255,0.7);font-family:'Inter',sans-serif;font-weight:600;font-size:0.9rem;}
        .head-card__social{margin-top:12px;display:flex;justify-content:center;}
        @media (max-width:640px){.heads-grid{grid-template-columns:1fr;}.head-card__photo{width:108px;height:108px;}}

        .members-grid{display:grid;gap:16px;justify-content:center;grid-template-columns:repeat(4, minmax(0, 1fr));}
        @media (max-width:1100px){.members-grid{grid-template-columns:repeat(3, minmax(0, 1fr));}}
        @media (max-width:860px){.members-grid{grid-template-columns:repeat(2, minmax(0, 1fr));}}
        @media (max-width:640px){.members-grid{grid-template-columns:repeat(1, minmax(0, 1fr));}}

        .member-card{border-radius:16px;border:1px solid rgba(56,189,248,0.14);background:rgba(255,255,255,0.02);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);padding:14px 12px;box-shadow:0 0 22px rgba(56,189,248,0.08);transition:transform .25s ease, border-color .25s ease, box-shadow .25s ease;display:flex;flex-direction:column;align-items:center;}
        .member-card:hover{transform:translateY(-3px);border-color:rgba(56,189,248,0.45);box-shadow:0 0 34px rgba(56,189,248,0.22);}
        .member-card__avatar{width:78px;height:78px;border-radius:999px;border:1px solid rgba(56,189,248,0.22);background:rgba(56,189,248,0.06);overflow:hidden;box-shadow:0 0 18px rgba(56,189,248,0.12);}
        .member-card__name{text-align:center;margin-top:12px;font-family:'Orbitron',sans-serif;font-weight:900;color:#fff;font-size:0.98rem;letter-spacing:0.04em;}
        .member-card__role{text-align:center;margin-top:8px;color:rgba(56,189,248,0.95);font-family:'Inter',sans-serif;font-weight:700;font-size:0.85rem;}
        .member-card__social{margin-top:12px;display:flex;justify-content:center;min-height:28px;}

        .carousel{position:relative;max-width:1200px;margin:0 auto;}
        .carousel__viewport{overflow:hidden;border-radius:18px;}
        .carousel__track{display:flex;transition:transform 500ms cubic-bezier(.2,.9,.2,1);}
        .carousel__page{min-width:100%;padding:10px 6px;display:grid;gap:16px;justify-content:center;grid-template-columns:repeat(4, minmax(0, 1fr));}
        @media (max-width:1100px){.carousel__page{grid-template-columns:repeat(3, minmax(0, 1fr));}}
        @media (max-width:860px){.carousel__page{grid-template-columns:repeat(2, minmax(0, 1fr));}}
        @media (max-width:640px){.carousel__page{grid-template-columns:repeat(1, minmax(0, 1fr));}}

        .carousel__arrow{position:absolute;top:50%;transform:translateY(-50%);left:6px;width:44px;height:44px;border-radius:999px;border:1px solid rgba(56,189,248,0.22);background:rgba(0,0,0,0.25);color:#38bdf8;font-size:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 0 24px rgba(56,189,248,0.14);transition:transform .2s ease, box-shadow .2s ease, opacity .2s ease;}
        .carousel__arrow:hover{transform:translateY(-50%) scale(1.04);box-shadow:0 0 34px rgba(56,189,248,0.22);}
        .carousel__arrow:disabled{opacity:0.35;cursor:not-allowed;box-shadow:none;}
        .carousel__arrow--next{left:auto;right:6px;}

        .carousel__dots{display:flex;gap:10px;justify-content:center;margin-top:14px;}
        .carousel__dot{width:10px;height:10px;border-radius:999px;border:1px solid rgba(56,189,248,0.35);background:rgba(56,189,248,0.12);cursor:pointer;transition:transform .2s ease, background .2s ease, box-shadow .2s ease;}
        .carousel__dot.is-active{background:rgba(56,189,248,0.85);box-shadow:0 0 18px rgba(56,189,248,0.35);transform:scale(1.2);}
      `}</style>

      <TeamHero />

      <SplitCommunity onSelectTeam={setActiveTeam} />

      <AnimatePresence>
        {activeTeam && (
          <TeamDetailModal
            team={activeTeam}
            onClose={() => setActiveTeam(null)}
          />
        )}
      </AnimatePresence>

      <FacultySpotlight data={facultyCoordinator} />

      <div style={{ padding: '36px 0 10px' }}>
        <div className="container-1300">
          <SectionTitle eyebrow="CORE TEAM" title="CORE" accentWord="TEAM" />
          <PremiumGrid people={coreTeam} variant="core" />
        </div>
      </div>

      <div style={{ padding: '54px 0 10px' }}>
        <div className="container-1300">
          <SectionTitle eyebrow="LEADS TEAM" title="LEADS" accentWord="TEAM" />
          <PremiumGrid people={leadsTeam} variant="leads" />
        </div>
      </div>

      {departments.map((d) => (
        <DepartmentSection
          key={d.title}
          title={d.title}
          headMale={d.headMale}
          headFemale={d.headFemale}
          members={d.members}
        />
      ))}

      <div style={{ height: 64 }} />
    </main>
  );
}