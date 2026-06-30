import { useState } from 'react';

const ABOUT_IMAGES = [
  '/Images/team/teamacm.jpg',
  '/Images/about2.jpg',
  '/Images/about3.jpg',
  '/Images/about4.jpg',
];

const FALLBACK_EMOJIS = ['🏫', '💻', '🤝', '🏆'];

function AboutImage({ src, alt, fallbackEmoji, isWide }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      style={{
        gridColumn: isWide ? 'span 2' : 'span 1',
        height: isWide ? '220px' : '150px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(56,189,248,0.12)',
        background: 'rgba(56,189,248,0.05)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {hasError ? (
        <div style={{ fontSize: '3rem', opacity: 0.25 }}>{fallbackEmoji}</div>
      ) : (
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)'; }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

function AcmLogo() {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    return <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.75rem', fontWeight: 900, color: '#38bdf8' }}>ACM</span>;
  }
  return (
    <img
      src="/Images/acmrscoelogo.png"
      alt="ACM Logo"
      style={{ width: '32px', height: '32px', objectFit: 'contain' }}
      onError={() => setHasError(true)}
    />
  );
}

export default function About() {
  return (
    <section
      id="about"
      aria-label="About section"
      style={{ position: 'relative', padding: '96px 0', overflow: 'hidden' }}
    >
      {/* Background accent */}
      <div
        style={{
          position: 'absolute',
          left: '-192px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(ellipse, #38bdf8, transparent)',
          opacity: 0.08,
          filter: 'blur(120px)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '64px',
            alignItems: 'center',
          }}
        >
          {/* Left: Photo Collage */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            {ABOUT_IMAGES.map((src, i) => (
              <AboutImage
                key={i}
                src={src}
                alt={`ACM RSCOE team photo ${i + 1}`}
                fallbackEmoji={FALLBACK_EMOJIS[i]}
                isWide={i === 0}
              />
            ))}
          </div>

          {/* Right: Text */}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            {/* ACM Logo */}
            <div
              style={{
                width: '56px',
                height: '56px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: '50%',
                background: 'rgba(56,189,248,0.08)',
                border: '1px solid rgba(56,189,248,0.3)',
                filter: 'drop-shadow(0 0 12px rgba(56,189,248,0.5))',
              }}
            >
              <AcmLogo />
            </div>

            <p style={{ color: '#38bdf8', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
              Who We Are
            </p>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.75rem, 3vw, 2.5rem)', fontWeight: 900, letterSpacing: '0.08em', textTransform: 'uppercase', color: '#fff', marginBottom: '8px' }}>
              ABOUT <span style={{ color: '#38bdf8' }}>ACM</span>
            </h2>
            <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.7rem', color: 'rgba(255,255,255,0.4)', letterSpacing: '0.2em', textTransform: 'uppercase', fontWeight: 300, marginBottom: '24px' }}>
              RSCOE ACM Student Chapter
            </h3>

            <div style={{ height: '1px', width: '64px', background: 'rgba(56,189,248,0.4)', marginBottom: '24px' }} />

            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: '16px' }}>
              The <span style={{ color: '#38bdf8', fontWeight: 600 }}>ACM RSCOE Student Chapter</span> at
              JSPM's Rajarshi Shahu College of Engineering is a student-run technical community
              affiliated with the Association for Computing Machinery — the world's largest computing society.
            </p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.875rem', lineHeight: 1.8, marginBottom: '24px' }}>
              Our mission is to bridge the gap between academia and industry by organizing
              hackathons, expert talks, coding contests, and hands-on workshops.
            </p>

            <ul style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '32px', listStyle: 'none', padding: 0 }}>
              {[
                'Technical Workshops & Bootcamps',
                'National & International Hackathons',
                'Industry Expert Guest Lectures',
                'Competitive Programming Contests',
              ].map(item => (
                <li key={item} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.875rem', color: 'rgba(255,255,255,0.7)' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 6px #38bdf8', flexShrink: 0 }} />
                  {item}
                </li>
              ))}
            </ul>

            <a
              href="/events"
              className="membership-btn-premium"
              style={{ alignSelf: 'flex-start', fontSize: '0.7rem' }}
            >
              View Events
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
