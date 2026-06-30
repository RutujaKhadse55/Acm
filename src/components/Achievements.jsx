import { useState } from 'react';

const AWARDS = [
  {
    image: '/Images/award.png',
    title: 'Best Student Chapter Award',
    description:
      'Recognized as the Best Student Chapter for outstanding contributions to technical education, community outreach, and innovative events across Maharashtra region.',
    year: '2024',
    badge: '🏆 Gold',
  },
  {
    image: '/Images/award1.jpg',
    title: 'Excellence in Innovation',
    description:
      'Awarded for hosting cutting-edge hackathons, workshops, and seminars that fostered a culture of creativity and problem-solving among students.',
    year: '2024',
    badge: '🥇 Excellence',
  },
];

function AwardImage({ src, alt, badge }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="w-full rounded-xl overflow-hidden relative flex items-center justify-center shrink-0"
      style={{ height: '260px', background: 'rgba(56,189,248,0.05)' }}
    >
      {hasError ? (
        <div style={{ fontSize: '5rem', lineHeight: 1 }}>🏆</div>
      ) : (
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-contain"
          onError={() => setHasError(true)}
        />
      )}
      <span
        className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase"
        style={{
          background: 'rgba(56,189,248,0.12)',
          border: '1px solid rgba(56,189,248,0.4)',
          color: '#38bdf8',
          fontFamily: 'Inter, sans-serif',
        }}
      >
        {badge}
      </span>
    </div>
  );
}

export default function Achievements() {
  return (
    <section
      id="achievements"
      aria-label="Achievements section"
      style={{ position: 'relative', padding: '96px 0' }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%,-50%)',
          width: '700px',
          height: '400px',
          background: 'radial-gradient(ellipse, #38bdf8 0%, transparent 70%)',
          opacity: 0.08,
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px' }}>
        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
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
            What We've Earned
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
            OUR{' '}
            <span style={{ color: '#38bdf8', textShadow: '0 0 20px rgba(56,189,248,0.5)' }}>
              ACHIEVEMENTS
            </span>
          </h2>
          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ height: '1px', width: '96px', background: 'linear-gradient(to right, transparent, #38bdf8)', opacity: 0.5 }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
            <div style={{ height: '1px', width: '96px', background: 'linear-gradient(to left, transparent, #38bdf8)', opacity: 0.5 }} />
          </div>
        </div>

        {/* Cards wrapper — relative so the traveling beam lines can sit just outside it */}
        <div style={{ position: 'relative', padding: '28px 0' }}>
          {/* Traveling glow line — above the grid */}


          {/* Award rows — alternating image/text layout */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
            {AWARDS.map((award, i) => (
              <article
                key={award.title}
                className="glass-card hover-glow"
                style={{
                  padding: '28px',
                  background: '#0e1424',
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  gap: '32px',
                  cursor: 'default',
                  // reverse order for the 2nd award: description left, image right
                  flexDirection: 'row',
                }}
              >
                <div
                  style={{
                    flex: '1 1 320px',
                    order: i % 2 === 0 ? 0 : 2,
                  }}
                >
                  <AwardImage src={award.image} alt={award.title} badge={award.badge} />
                </div>

                <div style={{ flex: '1 1 320px', order: 1 }}>
                  <p
                    style={{
                      color: '#38bdf8',
                      fontSize: '0.7rem',
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      marginBottom: '8px',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {award.year}
                  </p>
                  <h3
                    style={{
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: '1.4rem',
                      fontWeight: 700,
                      color: '#fff',
                      marginBottom: '14px',
                      lineHeight: 1.35,
                    }}
                  >
                    {award.title}
                  </h3>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7 }}>
                    {award.description}
                  </p>

                  <div
                    style={{
                      height: '1px',
                      marginTop: '20px',
                      background: 'linear-gradient(to right, transparent, rgba(56,189,248,0.3), transparent)',
                    }}
                  />
                </div>
              </article>
            ))}
          </div>

          {/* Traveling glow line — below the grid */}

        </div>
      </div>


      {/* Beam animation styles */}
      <style>{`
        .acm-beam-track {
          position: absolute;
          left: -4%;
          width: 108%;
          height: 2px;
          overflow: hidden;
          background: rgba(56,189,248,0.08);
        }
        .acm-beam-track--top { top: 0; }
        .acm-beam-track--bottom { bottom: 0; }

        .acm-beam {
          position: absolute;
          top: 0;
          left: -20%;
          width: 20%;
          height: 100%;
          background: linear-gradient(to right, transparent, #38bdf8, transparent);
          box-shadow: 0 0 12px #38bdf8, 0 0 24px rgba(56,189,248,0.6);
          animation: acmBeamMove 4.5s linear infinite;
        }
        .acm-beam--reverse {
          animation: acmBeamMoveReverse 4.5s linear infinite;
        }

        @keyframes acmBeamMove {
          from { left: -20%; }
          to   { left: 100%; }
        }
        @keyframes acmBeamMoveReverse {
          from { left: 100%; }
          to   { left: -20%; }
        }

        @media (max-width: 768px) {
          article.glass-card {
            flex-direction: column !important;
          }
          article.glass-card > div {
            order: initial !important;
          }
        }
      `}</style>
    </section>
  );
}