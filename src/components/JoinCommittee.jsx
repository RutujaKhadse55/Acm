import { Link } from 'react-router-dom';

const ROLES = [
  { icon: '💡', title: 'Technical Lead', desc: 'Drive workshops, hackathons, and tech initiatives.' },
  { icon: '🎨', title: 'Design Team', desc: 'Craft branding, posters, and visual identity.' },
  { icon: '📢', title: 'PR & Outreach', desc: 'Manage social media, communication, and partnerships.' },
  { icon: '⚙️', title: 'Web & Development', desc: 'Build and maintain chapter websites and tools.' },
  { icon: '🏅', title: 'Event Management', desc: 'Plan and execute seamless chapter events.' },
  { icon: '🤝', title: 'Sponsorship', desc: 'Secure industry sponsorships and collaborations.' },
];

export default function JoinCommittee() {
  return (
    <section
      id="join"
      aria-label="Join committee section"
      style={{ position: 'relative', padding: '96px 0', overflow: 'hidden' }}
    >
      {/* Background glow */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          right: 0,
          width: '600px',
          height: '400px',
          background: 'radial-gradient(ellipse, #38bdf8, transparent)',
          opacity: 0.08,
          filter: 'blur(100px)',
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      />

      <div style={{ maxWidth: '1152px', margin: '0 auto', padding: '0 24px', position: 'relative', zIndex: 1 }}>
        {/* Heading */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ color: '#38bdf8', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
            Be Part of Something Big
          </p>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', marginBottom: '20px' }}>
            JOIN OUR <span style={{ color: '#38bdf8', textShadow: '0 0 20px rgba(56,189,248,0.5)' }}>COMMITTEE</span>
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', maxWidth: '560px', margin: '0 auto 32px', fontSize: '0.875rem', lineHeight: 1.7 }}>
            Become a driving force behind one of the most active ACM student chapters. Collaborate
            with like-minded peers, build industry connections, and shape the future of technology at RSCOE.
          </p>
          <Link
            to="/apply"
            className="membership-btn-premium"
            style={{ display: 'inline-block', fontSize: '0.72rem' }}
            aria-label="Apply to join the committee"
          >
            Apply Now
          </Link>
        </div>


      </div>
    </section>
  );
}
