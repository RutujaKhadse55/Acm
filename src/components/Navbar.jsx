import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

const NAV_LINKS = [
  { label: "Home", to: "/" },
  { label: "Events", to: "/events" },
  { label: "Achievements", to: "/achievements" },
  { label: "Team", to: "/team" },
  { label: "About", to: "/#about" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [location]);

  const handleHashLink = (e, to) => {
    if (to.startsWith("/#") && location.pathname === "/") {
      e.preventDefault();

      document
        .getElementById(to.slice(2))
        ?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const isActiveLink = (link) => {
    if (link.to === "/")
      return location.pathname === "/" && !location.hash;

    if (link.to.startsWith("/#")) {
      return (
        location.pathname === "/" &&
        location.hash === link.to.replace("/", "")
      );
    }

    return location.pathname === link.to;
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: scrolled
          ? "rgba(3,7,18,0.82)"
          : "transparent",
        backdropFilter: scrolled ? "blur(18px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(18px)" : "none",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,.08)"
          : "1px solid transparent",
        transition: ".35s",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          height: "72px",
          padding: "0 30px",
          display: "grid",
          gridTemplateColumns: "1fr auto 1fr",
          alignItems: "center",
        }}
      >
        {/* Logo */}

        <Link
          to="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            textDecoration: "none",
          }}
        >
          {logoError ? (
            <span
              style={{
                color: "#38bdf8",
                fontFamily: "Orbitron",
                fontWeight: 900,
              }}
            >
              ACM
            </span>
          ) : (
            <img
              src="/Images/acmrscoelogo.png"
              alt="logo"
              onError={() => setLogoError(true)}
              style={{
                width: 38,
                filter: "drop-shadow(0 0 8px #38bdf8)",
              }}
            />
          )}

          <div>
            <div
              style={{
                color: "#fff",
                fontFamily: "Orbitron",
                fontSize: ".72rem",
                letterSpacing: ".25em",
              }}
            >
              RSCOE
            </div>

            <div
              style={{
                color: "#38bdf8",
                fontSize: ".58rem",
                letterSpacing: ".35em",
                textTransform: "uppercase",
              }}
            >
              Student Chapter
            </div>
          </div>
        </Link>

        {/* Desktop */}

        <ul className="nav-desktop-links">
          {NAV_LINKS.map((link) => {
            const active = isActiveLink(link);

            return (
              <li key={link.label}>
                <Link
                  to={link.to}
                  onClick={(e) => handleHashLink(e, link.to)}
                  className={`nav-link ${active ? "active" : ""}`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right side: Join CTA + Hamburger */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '12px' }}>
          {/* Join CTA — hidden on mobile */}
          <Link
            to="/apply"
            className="nav-join-btn"
          >
            <span style={{ fontSize: '0.8rem' }}>🚀</span>
            Join ACM RSCOE
          </Link>

          {/* Hamburger */}
          <button
            className="nav-hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {[1, 2, 3].map((i) => (
              <span key={i} />
            ))}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              overflow: "hidden",
              background: "#050b18",
            }}
          >
            <ul className="mobile-menu">
              {NAV_LINKS.map((link) => {
                const active = isActiveLink(link);

                return (
                  <li key={link.label}>
                    <Link
                      to={link.to}
                      onClick={(e) => handleHashLink(e, link.to)}
                      className={`mobile-link ${active ? "active" : ""
                        }`}
                    >
                      {link.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <style>{`

.nav-desktop-links{
display:flex;
gap:36px;
list-style:none;
margin:0;
padding:0;
align-items:center;
}

.nav-link{

position:relative;
text-decoration:none;
font-family:Orbitron,sans-serif;
font-size:.68rem;
font-weight:700;
letter-spacing:.22em;
text-transform:uppercase;

color:rgba(255,255,255,.65);

transition:.35s;

padding:8px 0;

}

/* Hover */

.nav-link:hover{

color:#fff;

transform:translateY(-2px);

text-shadow:0 0 12px rgba(56,189,248,.45);

}

/* Underline */

.nav-link::after{

content:"";

position:absolute;

left:50%;

bottom:-3px;

width:0;

height:2px;

background:linear-gradient(90deg,#38bdf8,#60a5fa);

transform:translateX(-50%);

transition:.35s;

border-radius:999px;

box-shadow:0 0 15px #38bdf8;

}

.nav-link:hover::after{

width:100%;

}

/* Active */

.nav-link.active{

color:#fff;

}

.nav-link.active::after{

width:100%;

}

.mobile-menu{

display:flex;

flex-direction:column;

padding:15px 24px;

list-style:none;

margin:0;

}

.mobile-link{

display:block;

padding:15px 0;

text-decoration:none;

font-family:Orbitron;

letter-spacing:.18em;

font-size:.75rem;

color:rgba(255,255,255,.75);

transition:.3s;

border-bottom:1px solid rgba(255,255,255,.06);

}

.mobile-link:hover{

color:#38bdf8;

padding-left:8px;

}

.mobile-link.active{

color:#38bdf8;

}

.nav-hamburger{

display:none;

background:none;

border:none;

cursor:pointer;

flex-direction:column;

gap:5px;

}

.nav-hamburger span{

width:24px;

height:2px;

background:white;

border-radius:99px;

}

@media(max-width:767px){

.nav-desktop-links{

display:none;

}

.nav-hamburger{

display:flex;

}

.nav-join-btn{

display:none;

}

}

@media(min-width:768px){

.nav-hamburger{

display:none;

}

}

.nav-join-btn{
display:inline-flex;
align-items:center;
gap:6px;
padding:7px 16px;
border-radius:999px;
background:linear-gradient(135deg,rgba(56,189,248,0.12),rgba(167,139,250,0.1));
border:1px solid rgba(56,189,248,0.35);
color:#fff;
font-family:Orbitron,sans-serif;
font-size:0.58rem;
font-weight:700;
letter-spacing:0.15em;
text-transform:uppercase;
text-decoration:none;
transition:all 0.3s ease;
white-space:nowrap;
backdrop-filter:blur(8px);
-webkit-backdrop-filter:blur(8px);
}

.nav-join-btn:hover{
background:linear-gradient(135deg,rgba(56,189,248,0.22),rgba(167,139,250,0.18));
border-color:rgba(56,189,248,0.65);
color:#7dd3fc;
transform:translateY(-1px);
box-shadow:0 0 18px rgba(56,189,248,0.25),0 4px 12px rgba(56,189,248,0.15);
}

      `}</style>
    </nav>
  );
}