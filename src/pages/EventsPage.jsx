import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Event Data ────────────────────────────────────────────────────────────────
const EVENTS = [
  {
    id: 1,
    title: 'Logica 2.0',
    date: '2023',
    location: 'JSPM RSCOE, Pune',
    description:
      'Logica 2.0 is ACM RSCOE\'s flagship logic and problem-solving competition, challenging participants with intricate puzzles, algorithmic thinking rounds, and real-world coding scenarios. A high-energy event that tests both creativity and technical depth.',
    image: '/Images/Logica2.0/Logica1.jpg',
    gallery: [
      '/Images/Logica2.0/Logica1.jpg',
      '/Images/Logica2.0/Logica2.jpg',
      '/Images/Logica2.0/Logica3.jpg',
      '/Images/Logica2.0/Logica4.jpg',
      '/Images/Logica2.0/Logica5.jpg',
      '/Images/Logica2.0/Logica6.jpg',
      '/Images/Logica2.0/Logica7.jpg',
    ],
    link: '#',
    tag: 'Competition',
  },
  {
    id: 2,
    title: 'Pradyot',
    date: '2023',
    location: 'JSPM RSCOE, Pune',
    description:
      'Pradyot is ACM RSCOE\'s annual technical symposium — a celebration of innovation, engineering, and student talent. Packed with workshops, project exhibitions, expert talks, and exciting inter-college competitions across multiple domains.',
    image: '/Images/Pradyot/Pradyot1.jpg',
    gallery: [
      '/Images/Pradyot/Pradyot1.jpg',
      '/Images/Pradyot/Pradyot2.jpg',
      '/Images/Pradyot/Pradyot3.jpg',
      '/Images/Pradyot/Pradyot4.jpg',
      '/Images/Pradyot/Pradyot5.jpg',
    ],
    link: '#',
    tag: 'Symposium',
  },
  {
    id: 3,
    title: 'Pradyot 2.0',
    date: '2024',
    location: 'JSPM RSCOE, Pune',
    description:
      'The second edition of Pradyot returned bigger and bolder, featuring expanded competition tracks, a dedicated project showcase arena, and guest lectures from industry professionals. A landmark event on the RSCOE academic calendar.',
    image: '/Images/Pradyot_2.0/pradyot_2.0.png',
    gallery: [
      '/Images/Pradyot_2.0/1.jpg',
      '/Images/Pradyot_2.0/2.jpg',
      '/Images/Pradyot_2.0/3.jpg',
      '/Images/Pradyot_2.0/4.jpg',
      '/Images/Pradyot_2.0/5.jpg',
      '/Images/Pradyot_2.0/6.jpg',
      '/Images/Pradyot_2.0/7.jpg',
    ],
    link: '#',
    tag: 'Symposium',
  },
  {
    id: 4,
    title: 'UIPath Workshop',
    date: '2023',
    location: 'FY Seminar Hall, RSCOE',
    description:
      'A hands-on RPA (Robotic Process Automation) workshop powered by UIPath, teaching students to automate repetitive workflows, build bots, and explore enterprise automation tools. Participants left with real project experience and industry certificates.',
    image: '/Images/UIPath/ui1.jpg',
    gallery: [
      '/Images/UIPath/ui1.jpg',
      '/Images/UIPath/ui2.jpg',
      '/Images/UIPath/ui3.jpg',
      '/Images/UIPath/ui4.jpg',
      '/Images/UIPath/ui5.jpg',
      '/Images/UIPath/ui6.jpg',
    ],
    link: '#',
    tag: 'Workshop',
  },
  {
    id: 5,
    title: 'TechExplore',
    date: '2025',
    location: 'JSPM RSCOE, Pune',
    description:
      'TechExplore is an exploration-driven event encouraging students to discover emerging technologies through live demos, rapid-fire challenges, and peer-to-peer learning sessions. From AR/VR to blockchain, participants dived deep into cutting-edge tech.',
    image: '/Images/TechExplore/final1.jpg',
    gallery: [
      '/Images/TechExplore/final1.jpg',
      '/Images/TechExplore/final2.jpg',
      '/Images/TechExplore/final3.jpg',
      '/Images/TechExplore/final4.jpg',
      '/Images/TechExplore/final5.jpg',
      '/Images/TechExplore/final6.jpg',
      '/Images/TechExplore/tech1.jpg',
    ],
    link: '#',
    tag: 'Tech Event',
  },
  {
    id: 6,
    title: 'Trinity',
    date: '2023',
    location: 'JSPM RSCOE, Pune',
    description:
      'Trinity is a unique three-pronged event fusing design, development, and deployment into one competition. Teams were challenged to conceive, build, and pitch a working product within a limited timeframe — simulating real startup dynamics.',
    image: '/Images/Trinity/Trinity1.jpg',
    gallery: [
      '/Images/Trinity/Trinity1.jpg',
      '/Images/Trinity/Trinity2.jpg',
      '/Images/Trinity/Trinity3.jpg',
      '/Images/Trinity/Trinity4.jpg',
      '/Images/Trinity/Trinity5.jpg',
    ],
    link: '#',
    tag: 'Hackathon',
  },
  {
    id: 7,
    title: 'FY Induction',
    date: '2024',
    location: 'JSPM RSCOE Auditorium',
    description:
      'The First Year Induction is ACM RSCOE\'s welcoming ceremony for incoming students, offering them a glimpse into the chapter\'s vision, events, and opportunities. An energetic kickoff to the academic journey with interactive sessions and live demos.',
    image: '/Images/FYinduction/induc.jpeg',
    gallery: [
      '/Images/FYinduction/induc.jpeg',
      '/Images/FYinduction/1.jpg',
      '/Images/FYinduction/2.jpg',
      '/Images/FYinduction/3.jpg',
    ],
    link: '#',
    tag: 'Seminar',
  },
  {
    id: 8,
    title: 'Figma Workshop',
    date: '2024',
    location: 'MBA seminar, RSCOE',
    description:
      'A beginner-to-intermediate Figma design workshop covering UI/UX fundamentals, wireframing, prototyping, and component-based design systems. Students walked away with portfolio-ready mockups and a strong foundation in modern design tools.',
    image: '/Images/figmaworkshop/figma.png',
    gallery: [
      '/Images/figmaworkshop/figma.png',
      '/Images/figmaworkshop/1.jpg',
      '/Images/figmaworkshop/2.jpg',
      '/Images/figmaworkshop/3.jpg',
    ],
    link: '#',
    tag: 'Workshop',
  },
  {
    id: 9,
    title: 'Freshman Session',
    date: '2024',
    location: 'JSPM RSCOE, Pune',
    description:
      'An orientation and networking session designed for first-year members, connecting them with seniors, committee leads, and domain experts. The event featured mentorship panels, fun icebreakers, and a behind-the-scenes look at ACM chapter operations.',
    image: '/Images/freshmansession/freshmansession.jpg',
    gallery: [
      '/Images/freshmansession/freshmansession.jpg',
      '/Images/freshmansession/1.jpg',
      '/Images/freshmansession/2.jpeg',
      '/Images/freshmansession/3.jpeg',
      '/Images/freshmansession/4.jpeg',
      '/Images/freshmansession/5.jpg',
      '/Images/freshmansession/6.jpg',
      '/Images/freshmansession/7.jpg',
      '/Images/freshmansession/8.jpg',
    ],
    link: '#',
    tag: 'Seminar',
  },
  {
    id: 10,
    title: "Children's Day",
    date: 'November 2024',
    location: 'JSPM RSCOE, Pune',
    description:
      "ACM RSCOE celebrated Children's Day with a special event combining fun, learning, and social outreach. Activities included coding demos for underprivileged kids, creative workshops, and a campus cultural program organized by the chapter.",
    image: '/Images/CD/Childrensday.jpg',
    gallery: [
      '/Images/CD/Childrensday.jpg',
      '/Images/CD/CD1.JPG',
      '/Images/CD/CD2.JPG',
      '/Images/CD/CD3.JPG',
      '/Images/CD/CD4.jpg',
      '/Images/CD/CD5.JPG',
      '/Images/CD/CD6.JPG',
      '/Images/CD/CD7.JPG',
      '/Images/CD/CD8.jpg',
    ],
    link: '#',
    tag: 'Social',
  },
  {
    id: 11,
    title: 'Ganapati Celebration',
    date: '2023',
    location: 'JSPM RSCOE, Pune',
    description:
      'ACM RSCOE marked the Ganapati festival with a vibrant cultural celebration on campus, bringing the team together for decoration, rituals, and a community spirit event that strengthened bonds across the chapter.',
    image: '/Images/Ganapati/Ganapati.jpg',
    gallery: [
      '/Images/Ganapati/Ganapati.jpg',
      '/Images/Ganapati/Ganapati1.jpg',
    ],
    link: '#',
    tag: 'Cultural',
  },
  {
    id: 12,
    title: 'Meet and Greet',
    date: '2025',
    location: 'JSPM RSCOE, Pune',
    description: 'ACM RSCOE organized a special Meet and Greet session for its members. The event served as a platform for students to connect with chapter leads, share ideas, and get acquainted with the upcoming activities and initiatives planned for the year.',
    image: '/Images/aluminimeet/a1.jpeg',
    gallery: [
      '/Images/aluminimeet/a1.jpeg',
      '/Images/aluminimeet/a2.jpeg',
      '/Images/ealuminimeet/a3.jpeg',
    ],
    link: '#',
    tag: 'Seminar',
  },
  {
    id: 13,
    title: 'Logica 5.O',
    date: '2026',
    location: 'JSPM RSCOE, Pune',
    description: 'Logica 5.0 is ACM RSCOE\'s flagship logic and problem-solving competition, challenging participants with intricate puzzles, algorithmic thinking rounds, and real-world coding scenarios. A high-energy event that tests both creativity and technical depth.',

    image: '/Images/logica3/l1.jpeg',
    gallery: [
      '/Images/logica3/l1.jpeg',
      '/Images/logica3/l2.jpeg',
      '/Images/events/grp.jpeg',
    ],
    link: '#',
    tag: 'Event',
  },
  {
    id: 14,
    title: 'Vibe Check Arena',
    date: '2025',
    location: 'JSPM RSCOE, Pune',
    description: 'Vibe Check Arena is ACM RSCOE\'s flagship logic and problem-solving competition, challenging participants with intricate puzzles, algorithmic thinking rounds, and real-world coding scenarios. A high-energy event that tests both creativity and technical depth.',

    image: '/Images/vibecheckarena/v1.jpeg',
    gallery: [
      '/Images/vibecheckarena/v1.jpeg',
      '/Images/vibecheckarena/v1.jpeg',
      '/Images/vibecheckarena/v1.jpeg',
    ],
    link: '#',
    tag: 'Event',
  },
  {
    id: 15,
    title: 'Expert Session',
    date: '2025',
    location: 'JSPM RSCOE, Pune',
    description: 'An insightful session featuring industry leaders and subject matter experts sharing their knowledge, experiences, and perspectives on emerging trends in technology. A valuable opportunity for students to gain industry insights and expand their professional network.',

    image: '/Images/expertsession/e1.jpeg',
    gallery: [
      '/Images/expertsession/e1.jpeg',
      '/Images/expertsession/e2.jpeg',
      '/Images/expertsession/e3.jpeg',
    ],
    link: '#',
    tag: 'session',
  },
];

const INTERVAL_MS = 5000;

// ─── Tag Badge ─────────────────────────────────────────────────────────────────
function TagBadge({ tag }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '4px 12px',
        borderRadius: '999px',
        fontSize: '0.65rem',
        fontWeight: 700,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        background: 'rgba(56,189,248,0.12)',
        border: '1px solid rgba(56,189,248,0.35)',
        color: '#38bdf8',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {tag}
    </span>
  );
}

// ─── Image Components with React State fallback ────────────────────────────────
function MainEventImage({ src, alt }) {
  const [hasError, setHasError] = useState(false);
  useEffect(() => { setHasError(false); }, [src]);

  if (hasError) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0b1525,#0d2133)', fontSize: '5rem', opacity: 0.3 }}>
        🎓
      </div>
    );
  }
  return (
    <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setHasError(true)} />
  );
}

function ThumbnailImage({ src, alt, isActive }) {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isActive ? 'rgba(56,189,248,0.2)' : 'rgba(255,255,255,0.05)', fontSize: '0.9rem', color: '#38bdf8' }}>
        🎓
      </div>
    );
  }
  return (
    <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={() => setHasError(true)} />
  );
}

function CardImage({ src, alt }) {
  const [hasError, setHasError] = useState(false);
  if (hasError) {
    return (
      <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(56,189,248,0.05)', fontSize: '3rem', opacity: 0.3 }}>
        🎓
      </div>
    );
  }
  return (
    <img src={src} alt={alt} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} onError={() => setHasError(true)} />
  );
}

// ─── Main Events Page ──────────────────────────────────────────────────────────
export default function EventsPage() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const progressRef = useRef(null);
  const progressStart = useRef(null);

  const goTo = useCallback((index) => {
    setActive(index);
    setProgress(0);
    progressStart.current = performance.now();
  }, []);

  const next = useCallback(() => goTo((active + 1) % EVENTS.length), [active, goTo]);
  const prev = useCallback(() => goTo((active - 1 + EVENTS.length) % EVENTS.length), [active, goTo]);

  useEffect(() => {
    if (isPaused) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(next, INTERVAL_MS);
    return () => clearInterval(intervalRef.current);
  }, [isPaused, next]);

  useEffect(() => {
    if (isPaused) { cancelAnimationFrame(progressRef.current); return; }
    progressStart.current = performance.now();
    const tick = (now) => {
      const pct = Math.min(((now - progressStart.current) / INTERVAL_MS) * 100, 100);
      setProgress(pct);
      if (pct < 100) progressRef.current = requestAnimationFrame(tick);
    };
    progressRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(progressRef.current);
  }, [active, isPaused]);

  useEffect(() => {
    const onKey = (e) => { if (e.key === 'ArrowRight') next(); if (e.key === 'ArrowLeft') prev(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [next, prev]);

  const event = EVENTS[active];

  return (
    <main
      style={{
        minHeight: '100vh',
        paddingTop: '80px',
        background: 'linear-gradient(180deg, #030712 0%, #060d1f 100%)',
      }}
      aria-label="Events page"
    >
      {/* ── Page Header ──────────────────────────────────────── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '48px 24px 40px', textAlign: 'center' }}>
        <p style={{ color: '#38bdf8', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
          What We've Hosted
        </p>
        <h1 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2.2rem, 5vw, 4rem)', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
          OUR <span style={{ color: '#38bdf8', textShadow: '0 0 24px rgba(56,189,248,0.5)' }}>EVENTS</span>
        </h1>
        <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
          <div style={{ height: '1px', width: '64px', background: 'linear-gradient(to right, transparent, #38bdf8)', opacity: 0.5 }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#38bdf8', boxShadow: '0 0 8px #38bdf8' }} />
          <div style={{ height: '1px', width: '64px', background: 'linear-gradient(to left, transparent, #38bdf8)', opacity: 0.5 }} />
        </div>
      </div>

      {/* ── Showcase ─────────────────────────────────────────── */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 80px' }}>

        {/* Main showcase card */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            borderRadius: '16px',
            overflow: 'hidden',
            border: '1px solid rgba(56,189,248,0.14)',
            background: 'rgba(255,255,255,0.02)',
          }}
        >
          {/* LEFT: Image Area */}
          <div
            style={{ position: 'relative', minHeight: '460px', overflow: 'hidden' }}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <AnimatePresence mode="sync">
              <motion.div
                key={event.id}
                initial={{ opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1.02 }}
                exit={{ opacity: 0, scale: 1 }}
                transition={{ duration: 0.5, ease: 'easeInOut' }}
                style={{ position: 'absolute', inset: 0 }}
              >
                <MainEventImage src={event.image} alt={event.title} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(3,7,18,0.3) 0%, transparent 60%), linear-gradient(to top, rgba(3,7,18,0.8) 0%, transparent 50%)' }} />
              </motion.div>
            </AnimatePresence>

            {/* Tag */}
            <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10 }}>
              <TagBadge tag={event.tag} />
            </div>

            {/* Prev arrow */}
            <button
              onClick={prev}
              aria-label="Previous event"
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(3,7,18,0.6)', border: '1px solid rgba(56,189,248,0.25)', backdropFilter: 'blur(8px)', cursor: 'pointer', transition: 'box-shadow 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(56,189,248,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <svg width="16" height="16" fill="none" stroke="#38bdf8" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
            </button>

            {/* Next arrow */}
            <button
              onClick={next}
              aria-label="Next event"
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', zIndex: 10, width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(3,7,18,0.6)', border: '1px solid rgba(56,189,248,0.25)', backdropFilter: 'blur(8px)', cursor: 'pointer', transition: 'box-shadow 0.2s ease' }}
              onMouseEnter={e => { e.currentTarget.style.boxShadow = '0 0 16px rgba(56,189,248,0.4)'; }}
              onMouseLeave={e => { e.currentTarget.style.boxShadow = 'none'; }}
            >
              <svg width="16" height="16" fill="none" stroke="#38bdf8" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
            </button>

            {/* Bottom: progress + thumbnails */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 10, padding: '40px 24px 20px', background: 'linear-gradient(to top, rgba(3,7,18,0.9), transparent)' }}>
              {/* Progress bar */}
              <div style={{ width: '100%', height: '2px', borderRadius: '999px', background: 'rgba(255,255,255,0.1)', marginBottom: '16px', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: '999px', background: 'linear-gradient(90deg, #38bdf8, #0ea5e9)', boxShadow: '0 0 8px rgba(56,189,248,0.6)', width: `${progress}%` }} />
              </div>

              {/* Thumbnails */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {EVENTS.map((ev, i) => (
                  <button
                    key={ev.id}
                    onClick={() => goTo(i)}
                    aria-label={`Go to event: ${ev.title}`}
                    style={{
                      flexShrink: 0,
                      width: i === active ? '64px' : '36px',
                      height: '36px',
                      borderRadius: '6px',
                      overflow: 'hidden',
                      border: i === active ? '2px solid #38bdf8' : '2px solid rgba(255,255,255,0.15)',
                      boxShadow: i === active ? '0 0 12px rgba(56,189,248,0.5)' : 'none',
                      padding: 0,
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                    }}
                  >
                    <ThumbnailImage src={ev.image} alt={ev.title} isActive={i === active} />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* RIGHT: Info Panel */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              padding: '40px',
              borderLeft: '1px solid rgba(56,189,248,0.1)',
              position: 'relative',
              minHeight: '460px',
            }}
          >
            {/* Bg glow */}
            <div style={{ position: 'absolute', top: 0, right: 0, width: '256px', height: '256px', background: 'radial-gradient(circle, #38bdf8, transparent)', opacity: 0.08, filter: 'blur(80px)', pointerEvents: 'none' }} aria-hidden="true" />

            <AnimatePresence mode="wait">
              <motion.div
                key={event.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 1 }}
              >
                <TagBadge tag={event.tag} />

                <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.4rem, 2.5vw, 2rem)', fontWeight: 900, color: '#fff', lineHeight: 1.25 }}>
                  {event.title}
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#38bdf8', fontSize: '0.875rem' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
                    <span style={{ fontWeight: 500, letterSpacing: '0.02em' }}>{event.date}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255,255,255,0.55)', fontSize: '0.875rem' }}>
                    <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></svg>
                    <span>{event.location}</span>
                  </div>
                </div>

                <div style={{ height: '1px', background: 'linear-gradient(to right, rgba(56,189,248,0.3), transparent)' }} />

                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.875rem', lineHeight: 1.75 }}>
                  {event.description}
                </p>

                <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>
                  Event {active + 1} of {EVENTS.length}
                </p>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={event.id + '-btn'}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.35, delay: 0.2 }}
                style={{ marginTop: '32px' }}
              >
                <a
                  href={event.link}
                  className="membership-btn-premium"
                  style={{ display: 'block', textAlign: 'center', fontSize: '0.7rem' }}
                  aria-label={`View details for ${event.title}`}
                >
                  View Details →
                </a>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* ── All Events Grid ─────────────────────────────────── */}
        <div style={{ marginTop: '80px' }}>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.5rem, 3vw, 2.2rem)', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff', marginBottom: '32px' }}>
            ALL <span style={{ color: '#38bdf8' }}>EVENTS</span>
          </h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '20px' }}>
            {EVENTS.map((ev, i) => (
              <article
                key={ev.id}
                className="glass-card hover-glow"
                onClick={() => goTo(i)}
                tabIndex={0}
                role="button"
                aria-label={`Switch to event: ${ev.title}`}
                onKeyDown={e => { if (e.key === 'Enter') goTo(i); }}
                style={{
                  cursor: 'pointer',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease',
                  outline: active === i ? '2px solid #38bdf8' : 'none',
                }}
              >
                <div style={{ position: 'relative', height: '144px', overflow: 'hidden' }}>
                  <CardImage src={ev.image} alt={ev.title} />
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(3,7,18,0.7), transparent)' }} />
                  <div style={{ position: 'absolute', top: '12px', left: '12px' }}>
                    <TagBadge tag={ev.tag} />
                  </div>
                </div>
                <div style={{ padding: '16px' }}>
                  <p style={{ color: '#38bdf8', fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '6px', fontFamily: 'Inter, sans-serif' }}>
                    {ev.date}
                  </p>
                  <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: '0.85rem', fontWeight: 700, color: '#fff', lineHeight: 1.35 }}>
                    {ev.title}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
