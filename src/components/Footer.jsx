import { useState } from 'react';
import { Link } from 'react-router-dom';

const FOOTER_LINKS = ['Home', 'Events', 'Achievements', 'Team', 'About'];
const LINK_MAP = {
  Home: '/',
  Events: '/events',
  Achievements: '/achievements',
  Team: '/team',
  About: '/#about',
};

const SOCIALS = [
  {
    name: 'LinkedIn',
    href: 'https://www.linkedin.com/company/acm-rscoe/',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S.02 4.88.02 3.5C.02 2.12 1.13 1 2.5 1s2.48 1.12 2.48 2.5zM.5 8.5h4V24h-4V8.5zm6.5 0h3.8v2.1h.05c.53-1 1.82-2.1 3.75-2.1 4 0 4.74 2.64 4.74 6.07V24h-4v-8.6c0-2.05-.04-4.7-2.86-4.7-2.87 0-3.31 2.24-3.31 4.55V24H7V8.5z" />
      </svg>
    ),
  },
  {
    name: 'Instagram',
    href: 'https://www.instagram.com/acm.rscoe?igsh=MXVram54ZDNwNWgydQ==',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.31.975.975 1.247 2.242 1.31 3.608.058 1.265.069 1.645.069 4.849s-.011 3.584-.069 4.85c-.063 1.366-.335 2.633-1.31 3.608-.975.975-2.242 1.247-3.608 1.31-1.266.058-1.646.069-4.85.069s-3.584-.011-4.85-.069c-1.366-.063-2.633-.335-3.608-1.31-.975-.975-1.247-2.242-1.31-3.608C2.175 15.584 2.163 15.204 2.163 12s.012-3.584.07-4.85c.063-1.366.335-2.633 1.31-3.608.975-.975 2.242-1.247 3.608-1.31C8.416 2.175 8.796 2.163 12 2.163zm0-2.163C8.741 0 8.333.014 7.053.072 5.775.13 4.602.333 3.635 1.3 2.668 2.267 2.465 3.44 2.408 4.717 2.35 5.997 2.337 6.405 2.337 12s.013 6.003.071 7.283c.057 1.277.26 2.45 1.227 3.417.967.967 2.14 1.17 3.417 1.228C8.333 23.986 8.741 24 12 24s3.667-.014 4.947-.072c1.277-.058 2.45-.261 3.417-1.228.967-.967 1.17-2.14 1.228-3.417.058-1.28.071-1.688.071-7.283s-.013-6.003-.071-7.283c-.058-1.277-.261-2.45-1.228-3.417C19.397.333 18.224.13 16.947.072 15.667.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z" />
      </svg>
    ),
  },
  {
    name: 'Telegram',
    href: 'https://telegram.org',
    icon: (
      <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
      </svg>
    ),
  },
];

function FooterLogo() {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    return (
      <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1.1rem', fontWeight: 900, color: '#38bdf8' }}>ACM</span>
    );
  }
  return (
    <img
      src="/Images/acmrscoelogo.png"
      alt="ACM Logo"
      style={{ width: '40px', height: '40px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px #38bdf8)' }}
      onError={() => setHasError(true)}
    />
  );
}

export default function Footer() {
  const handleHashLink = (e, to) => {
    if (to.startsWith('/#') && window.location.pathname === '/') {
      e.preventDefault();
      document.getElementById(to.slice(2))?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer
      aria-label="Footer"
      style={{
        position: 'relative',
        background: 'rgba(3,7,18,0.98)',
        borderTop: '1px solid rgba(56,189,248,0.12)',
        padding: '56px 0 0',
      }}
    >
      {/* Top grid */}
      <div
        style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '0 24px 48px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '40px',
        }}
      >
        {/* Brand */}
        <div style={{ gridColumn: 'span 1' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
            <FooterLogo />
            <div>
              <p style={{ fontFamily: 'Orbitron, sans-serif', color: '#fff', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '2px' }}>
                ACM RSCOE
              </p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                Student Chapter
              </p>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', lineHeight: 1.7, maxWidth: '220px' }}>
            Empowering the next generation of computing professionals at JSPM RSCOE, Pune.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 style={{ fontFamily: 'Orbitron, sans-serif', color: '#fff', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Quick Links
          </h4>
          <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {FOOTER_LINKS.map(item => (
              <li key={item}>
                <Link
                  to={LINK_MAP[item]}
                  onClick={e => handleHashLink(e, LINK_MAP[item])}
                  style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem', textDecoration: 'none', transition: 'color 0.2s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.color = '#38bdf8'; }}
                  onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.5)'; }}
                >
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 style={{ fontFamily: 'Orbitron, sans-serif', color: '#fff', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Contact
          </h4>
          <address style={{ fontStyle: 'normal', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>JSPM's RSCOE, Pune</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.875rem' }}>Maharashtra, India 411033</p>
            <a
              href="mailto:acm@rscoe.edu.in"
              style={{ color: '#38bdf8', fontSize: '0.875rem', textDecoration: 'none', transition: 'text-decoration 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.textDecoration = 'underline'; }}
              onMouseLeave={e => { e.currentTarget.style.textDecoration = 'none'; }}
            >
              acm@rscoe.edu.in
            </a>
          </address>
        </div>

        {/* Socials */}
        <div>
          <h4 style={{ fontFamily: 'Orbitron, sans-serif', color: '#fff', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: '16px' }}>
            Follow Us
          </h4>
          <div style={{ display: 'flex', gap: '12px' }}>
            {SOCIALS.map(social => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.name}
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'rgba(255,255,255,0.5)',
                  background: 'rgba(56,189,248,0.06)',
                  border: '1px solid rgba(56,189,248,0.12)',
                  textDecoration: 'none',
                  transition: 'color 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.color = '#38bdf8';
                  e.currentTarget.style.boxShadow = '0 0 16px rgba(56,189,248,0.3)';
                  e.currentTarget.style.borderColor = 'rgba(56,189,248,0.4)';
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.5)';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.borderColor = 'rgba(56,189,248,0.12)';
                }}
              >
                {social.icon}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          maxWidth: '1152px',
          margin: '0 auto',
          padding: '20px 24px',
          borderTop: '1px solid rgba(56,189,248,0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '8px',
        }}
      >
        <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', letterSpacing: '0.05em' }}>
          © 2026 ACM RSCOE CHAPTER. All rights reserved.
        </p>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.75rem' }}>
          Built with ❤️ by ACM RSCOE Web Team
        </p>
      </div>
    </footer>
  );
}
