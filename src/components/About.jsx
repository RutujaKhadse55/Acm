import { useState, useEffect, useRef } from 'react';

/* ── Palette (matches Achievements) ──────────────────────
   --black   : #07090F
   --navy    : #0C1730
   --navy-2  : #16244A
   --blue    : #3B6FE0
   --blue-lt : #8FB4FF
   --white   : #F5F7FA
   ──────────────────────────────────────────────────────── */

const ABOUT_IMAGES = [
  { src: '/Images/Pradyot_2.0/1.jpg', emoji: '🏫' },
  { src: '/Images/acmrscoelogo.png', emoji: '💻' },
  { src: '/Images/events/shortgrp.jpeg', emoji: '🤝' },
  { src: '/Images/events/grp.jpeg', emoji: '🏆' },
];

const HIGHLIGHTS = [
  'Technical Workshops & Bootcamps',
  'National & International Hackathons',
  'Industry Expert Guest Lectures',
  'Competitive Programming Contests',
];

function AboutImage({ src, alt, fallbackEmoji, className, delay }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className={`about-tile ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {hasError ? (
        <div className="about-tile__fallback">{fallbackEmoji}</div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="about-tile__img"
          onError={() => setHasError(true)}
        />
      )}
      <div className="about-tile__sheen" aria-hidden="true" />
    </div>
  );
}

function AcmLogo() {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    return (
      <span style={{ fontFamily: '"Fraunces", Georgia, serif', fontSize: '0.85rem', fontWeight: 700, color: '#8FB4FF' }}>
        ACM
      </span>
    );
  }
  return (
    <img
      src="/Images/acmrscoelogo.png"
      alt="ACM Logo"
      style={{ width: '30px', height: '30px', objectFit: 'contain', position: 'relative', zIndex: 1 }}
      onError={() => setHasError(true)}
    />
  );
}

export default function About() {
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      aria-label="About section"
      style={{
        position: 'relative',
        padding: '110px 0',
        background: '#07090F',
        overflow: 'hidden',
      }}
    >
      {/* ambient glows */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          left: '-220px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '560px',
          height: '560px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(59,111,224,0.20), transparent 70%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          right: '-160px',
          bottom: '-160px',
          width: '460px',
          height: '460px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(22,36,74,0.6), transparent 70%)',
          filter: 'blur(80px)',
          pointerEvents: 'none',
        }}
      />

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Left: mosaic collage */}
          <div className={`about-grid ${visible ? 'is-visible' : ''}`}>
            {ABOUT_IMAGES.map((img, i) => (
              <AboutImage
                key={i}
                src={img.src}
                alt={`ACM RSCOE photo ${i + 1}`}
                fallbackEmoji={img.emoji}
                className={`about-grid__tile--${i}`}
                delay={i * 110}
              />
            ))}

            {/* floating stat chip, signature element */}
            <div className={`about-stat-chip ${visible ? 'is-visible' : ''}`}>
              <span className="about-stat-chip__num">20+</span>
              <span className="about-stat-chip__label">Events Hosted</span>
            </div>
          </div>

          {/* Right: Text */}
          <div style={{ display: 'flex', flexDirection: 'column' }} className={`about-copy ${visible ? 'is-visible' : ''}`}>
            <div className="about-logo-ring">
              <AcmLogo />
            </div>

            <p
              style={{
                color: '#38bdf8',
                fontSize: '0.7rem',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                fontWeight: 600,
                marginBottom: '12px',
                fontFamily: 'Inter, sans-serif',
              }}
            >
              Who we are
            </p>

            <h2
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                fontWeight: 900,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: '#fff',
              }}
            >
              About{' '}
              <span style={{ color: '#38bdf8', textShadow: '0 0 20px rgba(56,189,248,0.5)' }}>
                ACM
              </span>
            </h2>
            <h3
              style={{
                fontFamily: '"Inter", sans-serif',
                fontSize: '0.72rem',
                color: 'rgba(245,247,250,0.4)',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                fontWeight: 500,
                marginBottom: '26px',
              }}
            >
              RSCOE ACM Student Chapter
            </h3>

            <div className="about-rule" />

            <p style={{ color: 'rgba(245,247,250,0.65)', fontSize: '0.92rem', lineHeight: 1.85, marginBottom: '16px', fontFamily: '"Inter", sans-serif' }}>
              The <span style={{ color: '#8FB4FF', fontWeight: 600 }}>ACM RSCOE Student Chapter</span> at
              JSPM's Rajarshi Shahu College of Engineering is a student-run technical community
              affiliated with the Association for Computing Machinery — the world's largest computing society.
            </p>
            <p style={{ color: 'rgba(245,247,250,0.65)', fontSize: '0.92rem', lineHeight: 1.85, marginBottom: '26px', fontFamily: '"Inter", sans-serif' }}>
              Our mission is to bridge the gap between academia and industry by organizing
              hackathons, expert talks, coding contests, and hands-on workshops.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '34px', listStyle: 'none', padding: 0 }}>
              {HIGHLIGHTS.map((item, i) => (
                <li key={item} className="about-highlight" style={{ transitionDelay: `${i * 80}ms` }}>
                  <span className="about-highlight__dot" />
                  <span style={{ fontSize: '0.875rem', color: 'rgba(245,247,250,0.75)', fontFamily: '"Inter", sans-serif' }}>
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            <a href="/events" className="about-cta">
              View Events
              <span className="about-cta__arrow">→</span>
            </a>
          </div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,500;0,600;1,500&family=Inter:wght@400;500;600;700&display=swap');

        /* ── Mosaic grid ───────────────────────────────── */
        .about-grid {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 170px 130px;
          gap: 12px;
        }
        .about-grid__tile--0 { grid-column: span 2; grid-row: 1; }
        .about-grid__tile--1 { grid-column: 1; grid-row: 2; }
        .about-grid__tile--2 { grid-column: 2; grid-row: 2; }
        .about-grid__tile--3 {
          grid-column: span 2;
          grid-row: 3;
          height: 110px;
        }

        .about-tile {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
          border: 1px solid rgba(143,180,255,0.14);
          background: linear-gradient(160deg, #16244A 0%, #0C1730 100%);
          opacity: 0;
          transform: translateY(28px) scale(0.96);
          transition: opacity 0.7s cubic-bezier(.2,.7,.3,1), transform 0.7s cubic-bezier(.2,.7,.3,1), border-color 0.3s ease, box-shadow 0.3s ease;
        }
        .about-grid.is-visible .about-tile {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
        .about-tile:hover {
          border-color: rgba(59,111,224,0.55);
          box-shadow: 0 16px 40px -16px rgba(59,111,224,0.4);
        }
        .about-tile__img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(.2,.7,.3,1), filter 0.6s ease;
          filter: saturate(0.9);
        }
        .about-tile:hover .about-tile__img {
          transform: scale(1.07);
          filter: saturate(1.1);
        }
        .about-tile__fallback {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.4rem;
          opacity: 0.3;
        }
        .about-tile__sheen {
          position: absolute;
          inset: 0;
          background: linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%);
          pointer-events: none;
        }

        /* floating stat chip — signature element */
        .about-stat-chip {
          position: absolute;
          bottom: -22px;
          left: -18px;
          display: flex;
          flex-direction: column;
          padding: 14px 20px;
          border-radius: 12px;
          background: linear-gradient(165deg, #0C1730, #07090F);
          border: 1px solid rgba(59,111,224,0.45);
          box-shadow: 0 20px 45px -16px rgba(0,0,0,0.6), 0 0 0 1px rgba(59,111,224,0.08);
          opacity: 0;
          transform: translateY(16px);
          transition: opacity 0.7s ease 0.5s, transform 0.7s ease 0.5s;
          animation: about-float 4.5s ease-in-out infinite;
        }
        .about-stat-chip.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        .about-stat-chip__num {
          font-family: "Fraunces", Georgia, serif;
          font-style: italic;
          font-size: 1.5rem;
          color: #8FB4FF;
          line-height: 1;
        }
        .about-stat-chip__label {
          margin-top: 4px;
          font-family: "Inter", sans-serif;
          font-size: 0.62rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: rgba(245,247,250,0.55);
        }
        @keyframes about-float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        .about-stat-chip.is-visible { transform: translateY(0); }

        /* ── Logo ring ─────────────────────────────────── */
        .about-logo-ring {
          position: relative;
          width: 56px;
          height: 56px;
          margin-bottom: 24px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(59,111,224,0.08);
        }
        .about-logo-ring::before {
          content: '';
          position: absolute;
          inset: -3px;
          border-radius: 50%;
          border: 1.5px solid transparent;
          border-top-color: #3B6FE0;
          border-right-color: rgba(59,111,224,0.3);
          animation: about-spin 6s linear infinite;
        }
        @keyframes about-spin {
          to { transform: rotate(360deg); }
        }

        /* ── Copy fade-in ──────────────────────────────── */
        .about-copy {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.8s ease 0.2s, transform 0.8s ease 0.2s;
        }
        .about-copy.is-visible {
          opacity: 1;
          transform: translateY(0);
        }

        .about-rule {
          height: 1px;
          width: 0;
          background: linear-gradient(to right, #3B6FE0, rgba(59,111,224,0.1));
          margin-bottom: 24px;
          transition: width 0.9s ease 0.4s;
        }
        .about-copy.is-visible .about-rule { width: 64px; }

        /* ── Highlights list ───────────────────────────── */
        .about-highlight {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 10px;
          margin-left: -10px;
          border-radius: 8px;
          opacity: 0;
          transform: translateX(-12px);
          transition: opacity 0.5s ease, transform 0.5s ease, background 0.25s ease;
        }
        .about-copy.is-visible .about-highlight {
          opacity: 1;
          transform: translateX(0);
        }
        .about-highlight:hover {
          background: rgba(59,111,224,0.08);
        }
        .about-highlight__dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #3B6FE0;
          box-shadow: 0 0 8px #3B6FE0;
          flex-shrink: 0;
        }

        /* ── CTA ───────────────────────────────────────── */
        .about-cta {
          align-self: flex-start;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 13px 26px;
          font-family: "Inter", sans-serif;
          font-size: 0.74rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #07090F;
          text-decoration: none;
          background: linear-gradient(120deg, #3973e7ff, #0f42b0ff);
          border-radius: 999px;
          box-shadow: 0 10px 30px -10px rgba(59,111,224,0.6);
          transition: transform 0.25s ease, box-shadow 0.25s ease, gap 0.25s ease;
        }
        .about-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 16px 38px -10px rgba(59,111,224,0.75);
          gap: 14px;
        }
        .about-cta__arrow {
          transition: transform 0.25s ease;
        }
        .about-cta:hover .about-cta__arrow {
          transform: translateX(2px);
        }

        @media (max-width: 480px) {
          .about-stat-chip { left: 0; bottom: -18px; padding: 10px 16px; }
        }
      `}</style>
    </section>
  );
}