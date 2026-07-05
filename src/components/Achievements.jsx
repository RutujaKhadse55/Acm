import { useState } from 'react';

/* ── Palette (matches circuit BackgroundBlobs) ───────────
   --bg       : #0a0d14
   --panel    : #11151f
   --blue     : #3b82f6
   --blue-lt  : #7db8ff
   --blue-dim : #1c3a66
   ──────────────────────────────────────────────────────── */

const AWARDS = [

  {
    image: '/Images/award1.jpg',
    title: 'Outstanding Emerging Chapter Award 2022',
    description:
      'The JSPM RSCOE ACM Student Chapter was honored with the Outstanding Emerging Chapter Award 2022 by the Association for Computing Machinery (ACM India) in recognition of its exceptional contributions to innovation, technical excellence, and student engagement. This prestigious national award reflects our commitment to fostering learning, leadership, and a thriving computing community, inspiring us to achieve even greater milestones in the future.',
    year: '2022',
    badge: 'Excellence',
  },
];

function AwardImage({ src, alt, badge }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div className="ach-img-frame">
      {/* corner circuit pin */}
      <span className="ach-img-frame__pin" aria-hidden="true" />

      <div className="ach-img-frame__badge">{badge}</div>

      {hasError ? (
        <div style={{ fontSize: '4.5rem', opacity: 0.85 }} aria-hidden="true">
          🏆
        </div>
      ) : (
        <img src={src} alt={alt} onError={() => setHasError(true)} className="ach-img-frame__img" />
      )}
    </div>
  );
}

export default function Achievements() {
  return (
    <section
      id="achievements"
      aria-label="Achievements section"
      style={{ position: 'relative', padding: '110px 0', overflow: 'hidden' }}
    >
      {/* faint connecting circuit line behind the heading, ties into the global bg */}
      <svg
        aria-hidden="true"
        style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '2px', height: '90px', opacity: 0.5 }}
      >
        <line x1="1" y1="0" x2="1" y2="90" stroke="#1c3a66" strokeWidth="2" />
      </svg>

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px', position: 'relative' }}>
        {/* Section heading */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
            <span style={{ width: '24px', height: '1px', background: '#3b82f6' }} />
            <p
              style={{
                color: '#7db8ff',
                fontSize: '0.7rem',
                letterSpacing: '0.35em',
                textTransform: 'uppercase',
                fontWeight: 700,
                margin: 0,
                fontFamily: 'Inter, sans-serif',
              }}
            >
              What We've Earned
            </p>
            <span style={{ width: '24px', height: '1px', background: '#3b82f6' }} />
          </div>

          <h2
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 'clamp(2rem, 4vw, 3.5rem)',
              fontWeight: 900,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: '#fff',
              margin: 0,
            }}
          >
            OUR{' '}
            <span style={{ color: '#7db8ff', textShadow: '0 0 22px rgba(59,130,246,0.6)' }}>
              ACHIEVEMENTS
            </span>
          </h2>

          <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ height: '1px', width: '96px', background: 'linear-gradient(to right, transparent, #3b82f6)', opacity: 0.5 }} />
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7db8ff', boxShadow: '0 0 8px #3b82f6' }} />
            <div style={{ height: '1px', width: '96px', background: 'linear-gradient(to left, transparent, #3b82f6)', opacity: 0.5 }} />
          </div>
        </div>

        {/* Award rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {AWARDS.map((award, i) => (
            <article key={award.title} className="ach-card">
              {/* trace running along the top edge of each card */}
              <span className="ach-card__trace" aria-hidden="true" />
              <span className="ach-card__serial">No. {String(i + 1).padStart(2, '0')}</span>

              <div style={{ flex: '1 1 320px', order: i % 2 === 0 ? 0 : 2 }}>
                <AwardImage src={award.image} alt={award.title} badge={award.badge} />
              </div>

              <div style={{ flex: '1 1 320px', order: 1 }}>
                <p
                  style={{
                    color: '#7db8ff',
                    fontSize: '0.7rem',
                    letterSpacing: '0.25em',
                    textTransform: 'uppercase',
                    fontWeight: 700,
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
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem', lineHeight: 1.7, fontFamily: 'Inter, sans-serif' }}>
                  {award.description}
                </p>

                <div
                  style={{
                    height: '1px',
                    marginTop: '20px',
                    background: 'linear-gradient(to right, #3b82f6 0, #3b82f6 36px, rgba(59,130,246,0.15) 36px)',
                  }}
                />
              </div>
            </article>
          ))}
        </div>
      </div>

      <style>{`
        .ach-card {
          position: relative;
          padding: 28px;
          background: rgba(17,21,31,0.55);
          backdrop-filter: blur(14px);
          -webkit-backdrop-filter: blur(14px);
          border: 1px solid rgba(59,130,246,0.18);
          border-radius: 14px;
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          align-items: center;
          gap: 32px;
          cursor: default;
          overflow: hidden;
          transition: border-color 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease;
        }
        .ach-card:hover {
          border-color: rgba(125,184,255,0.5);
          box-shadow: 0 20px 50px -20px rgba(59,130,246,0.4);
          transform: translateY(-3px);
        }

        .ach-card__serial {
          position: absolute;
          top: 18px;
          right: 24px;
          font-family: 'Inter', sans-serif;
          font-size: 0.72rem;
          letter-spacing: 0.1em;
          color: rgba(125,184,255,0.4);
        }

        /* traveling trace along the top edge of each card */
        .ach-card__trace {
          position: absolute;
          top: 0;
          left: -20%;
          width: 30%;
          height: 2px;
          background: linear-gradient(to right, transparent, #7db8ff, transparent);
          box-shadow: 0 0 10px #3b82f6, 0 0 18px rgba(59,130,246,0.6);
          animation: achTraceMove 5s linear infinite;
        }
        .ach-card:nth-child(2) .ach-card__trace {
          animation-direction: reverse;
          animation-duration: 6s;
        }
        @keyframes achTraceMove {
          from { left: -20%; }
          to   { left: 100%; }
        }

        /* image frame, circuit-pin styling */
        .ach-img-frame {
          position: relative;
          width: 100%;
          height: 260px;
          border-radius: 10px;
          overflow: hidden;
          background: linear-gradient(160deg, #161b27 0%, #0a0d14 100%);
          border: 1px solid rgba(59,130,246,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .ach-img-frame__img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          padding: 14px;
        }
        .ach-img-frame__badge {
          position: absolute;
          top: 12px;
          right: 12px;
          padding: 5px 14px;
          border-radius: 999px;
          background: rgba(59,130,246,0.12);
          border: 1px solid rgba(125,184,255,0.4);
          color: #7db8ff;
          font-family: 'Inter', sans-serif;
          font-weight: 700;
          font-size: 0.66rem;
          letter-spacing: 0.12em;
          text-transform: uppercase;
        }
        .ach-img-frame__pin {
          position: absolute;
          bottom: 10px;
          left: 10px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #7db8ff;
          box-shadow: 0 0 6px #3b82f6;
          animation: achPinPulse 2.6s ease-in-out infinite;
        }
        @keyframes achPinPulse {
          0%, 100% { opacity: 0.35; }
          50%      { opacity: 1; }
        }

        @media (max-width: 768px) {
          article.ach-card {
            flex-direction: column !important;
            padding: 22px !important;
          }
          article.ach-card > div {
            order: initial !important;
          }
        }
      `}</style>
    </section>
  );
}