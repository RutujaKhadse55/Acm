import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const NAV_LINKS = [
  { label: 'Home',         to: '/' },
  { label: 'Events',       to: '/events' },
  { label: 'Achievements', to: '/#achievements' },
  { label: 'Team',         to: '/team' },
  { label: 'About',        to: '/#about' },
];

export default function Navbar() {
  const [scrolled,  setScrolled]  = useState(false);
  const [menuOpen,  setMenuOpen]  = useState(false);
  const [logoError, setLogoError] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleHashLink = (e, to) => {
    if (to.startsWith('/#') && location.pathname === '/') {
      e.preventDefault();
      document.getElementById(to.slice(2))?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      aria-label="Main navigation"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        transition: 'background 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        background: scrolled ? 'rgba(3,7,18,0.80)' : 'transparent',
        backdropFilter: scrolled ? 'blur(18px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(18px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(56,189,248,0.12)' : '1px solid transparent',
        boxShadow: scrolled ? '0 4px 32px rgba(0,0,0,0.5)' : 'none',
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0 24px',
          height: '72px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Link
          to="/"
          aria-label="ACM RSCOE Home"
          style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
        >
          <div style={{ position: 'relative', width: '36px', height: '36px', flexShrink: 0 }}>
            {logoError ? (
              <span style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '1rem', fontWeight: 900, color: '#38bdf8' }}>
                ACM
              </span>
            ) : (
              <img
                src="/Images/acmrscoelogo.png"
                alt="ACM Logo"
                style={{ width: '36px', height: '36px', objectFit: 'contain', filter: 'drop-shadow(0 0 8px #38bdf8)' }}
                onError={() => setLogoError(true)}
              />
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
            <span
              style={{
                fontFamily: 'Orbitron, sans-serif',
                color: '#fff',
                fontSize: '0.7rem',
                fontWeight: 700,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                opacity: 0.9,
              }}
            >
              RSCOE
            </span>
            <span
              style={{
                fontFamily: 'Inter, sans-serif',
                color: '#38bdf8',
                fontSize: '0.6rem',
                letterSpacing: '0.3em',
                textTransform: 'uppercase',
              }}
            >
              Student Chapter
            </span>
          </div>
        </Link>

        <ul
          role="list"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '32px',
            listStyle: 'none',
            margin: 0,
            padding: 0,
          }}
          className="nav-desktop-links"
        >
          {NAV_LINKS.map((link) => {
            const isActive =
              link.to === '/'
                ? location.pathname === '/'
                : location.pathname.startsWith(link.to.split('#')[0]) && link.to !== '/';

            return (
              <li key={link.label} style={{ position: 'relative' }}>
                <Link
                  to={link.to}
                  onClick={(e) => handleHashLink(e, link.to)}
                  aria-current={isActive ? 'page' : undefined}
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: '0.65rem',
                    fontWeight: 600,
                    letterSpacing: '0.2em',
                    textTransform: 'uppercase',
                    textDecoration: 'none',
                    color: isActive ? '#38bdf8' : 'rgba(255,255,255,0.75)',
                    transition: 'color 0.2s ease',
                    paddingBottom: '4px',
                    display: 'block',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#38bdf8';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = 'rgba(255,255,255,0.75)';
                  }}
                >
                  {link.label}
                  <span
                    style={{
                      display: 'block',
                      height: '2px',
                      borderRadius: '999px',
                      background: '#38bdf8',
                      boxShadow: '0 0 8px #38bdf8',
                      marginTop: '4px',
                      width: isActive ? '100%' : '0%',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="nav-desktop-cta" style={{ display: 'flex', alignItems: 'center' }}>
          <a
            href="https://www.acm.org/membership/join"
            target="_blank"
            rel="noreferrer"
            className="membership-btn-premium"
            style={{ fontSize: '0.65rem', padding: '10px 22px' }}
            aria-label="Become an ACM member"
          >
            MEMBERSHIP
          </a>
        </div>

        <button
          onClick={() => setMenuOpen((v) => !v)}
          aria-expanded={menuOpen}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          className="nav-hamburger"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '5px',
            padding: '8px',
            cursor: 'pointer',
            background: 'none',
            border: 'none',
          }}
        >
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              style={{
                display: 'block',
                height: '2px',
                borderRadius: '999px',
                background: '#fff',
                transition: 'all 0.3s ease',
                width: i === 1 && menuOpen ? '16px' : '24px',
                transform: menuOpen
                  ? i === 0
                    ? 'rotate(45deg) translate(5px,5px)'
                    : i === 2
                      ? 'rotate(-45deg) translate(5px,-5px)'
                      : 'scaleX(0)'
                  : 'none',
                opacity: i === 1 && menuOpen ? 0 : 1,
              }}
            />
          ))}
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{
              overflow: 'hidden',
              background: 'rgba(3,7,18,0.97)',
              backdropFilter: 'blur(18px)',
              borderTop: '1px solid rgba(56,189,248,0.12)',
            }}
          >
            <ul
              role="list"
              style={{
                display: 'flex',
                flexDirection: 'column',
                padding: '16px 24px',
                gap: '4px',
                listStyle: 'none',
                margin: 0,
              }}
            >
              {NAV_LINKS.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    onClick={(e) => handleHashLink(e, link.to)}
                    style={{
                      display: 'block',
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      textDecoration: 'none',
                      color: 'rgba(255,255,255,0.8)',
                      padding: '12px 0',
                      borderBottom: '1px solid rgba(56,189,248,0.06)',
                      transition: 'color 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = '#38bdf8';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li style={{ paddingTop: '12px' }}>
                <a
                  href="https://www.acm.org/membership/join"
                  target="_blank"
                  rel="noreferrer"
                  className="membership-btn-premium"
                  style={{ display: 'block', textAlign: 'center', fontSize: '0.65rem' }}
                >
                  MEMBERSHIP
                </a>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`
        @media (max-width: 767px) {
          .nav-desktop-links { display: none !important; }
          .nav-desktop-cta   { display: none !important; }
          .nav-hamburger     { display: flex !important; }
        }
        @media (min-width: 768px) {
          .nav-hamburger     { display: none !important; }
        }
      `}</style>
    </nav>
  );
}

