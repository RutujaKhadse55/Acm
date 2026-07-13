import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { Link } from 'react-router-dom';

/* ─────────────────────────────────────────────
   STAT COUNTER
───────────────────────────────────────────── */
function StatCounter({ end, suffix, label }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.max(1, Math.ceil(end / 80));
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(start);
    }, 20);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <div ref={ref} style={{ textAlign: 'center' }}>
      <div style={{
        fontFamily: 'Orbitron, sans-serif',
        fontSize: 'clamp(1.8rem, 4vw, 3.2rem)',
        fontWeight: 900,
        background: 'linear-gradient(135deg, #38bdf8, #60a5fa, #a78bfa)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        lineHeight: 1,
      }}>
        {count}{suffix}
      </div>
      <div style={{
        color: 'rgba(255,255,255,0.5)',
        fontFamily: 'Inter, sans-serif',
        fontSize: '0.7rem',
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        marginTop: '8px',
      }}>
        {label}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   FLOATING PARTICLES CANVAS
───────────────────────────────────────────── */
function ParticleCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animId;
    const particles = [];
    const COUNT = 70;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < COUNT; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2.2 + 0.4,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.55 + 0.15,
        hue: Math.random() * 50 + 200,
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 68%, ${p.alpha})`;
        ctx.fill();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * 3.5, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, 68%, 0.04)`;
        ctx.fill();
      });
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56,189,248,${0.1 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position: 'absolute', inset: 0, width: '100%', height: '100%',
      pointerEvents: 'none', zIndex: 1,
    }} />
  );
}

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const ACHIEVEMENTS = [
  {
    id: 1, emoji: '🥇',
    title: '1st Prize — Innovators Hackathon 2026',
    badge: 'Winner', badgeColor: '#fbbf24',
    date: '2026', college: 'NMIET Talegaon', duration: '48 Hours',
    project: 'Rapid Innovation Challenge',
    members: ['Shikha'],
    description: 'Shikha secured First Prize at the prestigious 48-Hour Innovators Hackathon 2026 conducted at NMIET Talegaon in collaboration with T-Hub. The hackathon challenged participants to solve real-world problems through rapid innovation, teamwork, and technical excellence over an intensive 48-hour development cycle. Winning this competition reflects outstanding creativity, problem-solving skills, and dedication.',
    tags: ['Hackathon', 'Winner', 'Innovation', 'T-Hub'],
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.05))',
    borderColor: 'rgba(251,191,36,0.3)', glowColor: 'rgba(251,191,36,0.15)',
    images: ['/Images/achievements/shik1.jpeg', '/Images/achievements/shikh2.jpeg']
  },
  {
    id: 2, emoji: '🌱',
    title: 'AGRIPULSE — Pune Agri Hackathon 2026',
    badge: 'Finalist', badgeColor: '#34d399',
    date: '15–17 May 2026', college: 'Pune', duration: '3 Days',
    project: 'AGRIPULSE',
    members: ['Pawan', 'Aditya'],
    description: 'AGRIPULSE successfully completed its journey as a Finalist at Pune Agri Hackathon 2026. The team presented their solution before government officials, investors, farmers, industry professionals, and students. AGRIPULSE focuses on smart agriculture by providing technology-driven insights and modern farming solutions that empower farmers through data and innovation.',
    tags: ['Agriculture', 'AI', 'Finalist', 'Innovation'],
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(16,185,129,0.05))',
    borderColor: 'rgba(52,211,153,0.3)', glowColor: 'rgba(52,211,153,0.15)',
    images: ['/Images/achievements/pawan1.jpeg', '/Images/achievements/pawan2.jpeg']
  },
  {
    id: 3, emoji: '🥈',
    title: 'Versanix Hackathon — 2nd Prize',
    badge: '2nd Prize', badgeColor: '#94a3b8',
    date: '2026', college: 'VIIT', duration: 'Hackathon',
    project: 'INDIAPRENEUR',
    members: ['Harshal Borse', 'Harshal Mahajan', 'Kunal P Patil'],
    description: 'Team INDIAPRENEUR secured Second Prize at the Versanix Hackathon hosted by VIIT. In addition to this accomplishment, the team earned a direct internship opportunity from the organizing company. Harshal Borse, Harshal Mahajan, and Kunal P Patil are multiple Hackathon Finalists demonstrating consistency and technical excellence.',
    tags: ['Hackathon', '2nd Prize', 'VIIT', 'Internship'],
    highlight: '🎯 Direct Internship Opportunity from Versanix',
    gradient: 'linear-gradient(135deg, rgba(148,163,184,0.12), rgba(100,116,139,0.05))',
    borderColor: 'rgba(148,163,184,0.3)', glowColor: 'rgba(148,163,184,0.15)',
    images: ['/Images/achievements/harshal2.jpeg', '/Images/achievements/harshal1.jpeg']
  },
  {
    id: 4, emoji: '🏆',
    title: 'GEN-AI Hackathon 2026 — 1st Prize',
    badge: 'Winner', badgeColor: '#fbbf24',
    date: '2026', college: 'National Level', duration: 'Hackathon',
    project: 'INDIAPRENEUR',
    members: ['Harshal Borse', 'Bhim Rathod', 'Harshal Mahajan', 'Kunal P Patil'],
    description: 'Team INDIAPRENEUR secured First Prize at the prestigious GEN-AI Hackathon 2026. Their innovative AI solution impressed judges through technical excellence, teamwork, and practical impact. Harshal Borse, Harshal Mahajan, and Kunal P Patil are recognized as multiple-time Hackathon Finalists, showcasing exceptional consistency across national-level hackathons.',
    tags: ['Artificial Intelligence', 'Hackathon', 'Winner', 'Innovation'],
    highlight: '🌟 Multiple-time National Hackathon Champions',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.14), rgba(168,85,247,0.07))',
    borderColor: 'rgba(251,191,36,0.35)', glowColor: 'rgba(251,191,36,0.2)',
    images: ['/Images/achievements/bhim1.jpeg', '/Images/achievements/bhim2.jpeg',]
  },
  {
    id: 5, emoji: '🏆',
    title: 'GEN-AI Hackathon 2026 — 2nd Prize',
    badge: '2nd Prize', badgeColor: '#fbbf24',
    date: '2026', college: 'National Level', duration: 'Hackathon',
    project: 'RescueNet',
    members: ['Snehal Kalkote'],
    description: 'We developed RescueNet, a disaster response web application during the Google Gen AI Hackathon, where our team won 2nd Place. We used Google AI Studio for prompt-assisted development, along with Gemini API, Google Vision API, and Google Maps to build an AI-powered emergency assistance platform with SOS alerts, live location sharing, and disaster image analysis.',
    tags: ['Artificial Intelligence', 'Hackathon', '2nd Prize', 'Innovation'],
    highlight: '🌟 Multiple-time National Hackathon Champions',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.14), rgba(168,85,247,0.07))',
    borderColor: 'rgba(251,191,36,0.35)', glowColor: 'rgba(251,191,36,0.2)',
    images: ['/Images/achievements/snehal1.jpeg', '/Images/achievements/snehal2.jpeg',]
  },

];

/* ─────────────────────────────────────────────
   ALUMNI DATA
   ───────────────────────────────────────────── */
const ALUMNI_DATA = [
  {
    name: 'Shreeyash Pawar',
    image: '/Images/shreeyash.jpeg',
    achievement: 'Smart India Hackathon Finalist 2024',
    badge: 'National Level Innovation Finalist',
    badgeColor: '#a78bfa',
    gradient: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(139,92,246,0.05))',
    borderColor: 'rgba(167,139,250,0.3)',
    glowColor: 'rgba(167,139,250,0.15)',
  },
  {
    name: 'Dheemahi Gupta',
    image: '/Images/dheemahi.jpeg',
    company: 'Accenture',
    achievement: 'Successfully placed at Accenture',
    badge: 'Placed',
    badgeColor: '#34d399',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(16,185,129,0.05))',
    borderColor: 'rgba(52,211,153,0.3)',
    glowColor: 'rgba(52,211,153,0.15)',
  },
  {
    name: 'Pratiksha Patil',
    image: '/Images/pratiksha.jpeg',
    achievement: 'Contributor of FareIntelligence',
    badge: 'Placed',
    badgeColor: '#fbbf24',
    gradient: 'linear-gradient(135deg, rgba(251,191,36,0.12), rgba(245,158,11,0.05))',
    borderColor: 'rgba(251,191,36,0.3)',
    glowColor: 'rgba(251,191,36,0.15)',
  },
  {
    name: 'Sumit Dnyaneshwar Karanjkar',
    image: '/Images/sumit.jpeg',
    company: 'Accenture',
    achievement: 'Software Engineer at Accenture',
    badge: 'Placed',
    badgeColor: '#34d399',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(16,185,129,0.05))',
    borderColor: 'rgba(52,211,153,0.3)',
    glowColor: 'rgba(52,211,153,0.15)',
  },
  {
    name: 'Shubham Asbe',
    image: '/Images/shubham.jpeg',
    company: 'TCS',
    achievement: 'Placed at Tata Consultancy Services',
    badge: 'Placed',
    badgeColor: '#34d399',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(16,185,129,0.05))',
    borderColor: 'rgba(52,211,153,0.3)',
    glowColor: 'rgba(52,211,153,0.15)',
  },
  {
    name: 'Yash Patil',
    image: '/Images/yash.jpeg',
    previousRole: 'Ex-Treasurer',
    company: 'EY GDS',
    achievement: 'Successfully placed at EY GDS',
    badge: 'Placed',
    badgeColor: '#34d399',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(16,185,129,0.05))',
    borderColor: 'rgba(52,211,153,0.3)',
    glowColor: 'rgba(52,211,153,0.15)',
  },
  {
    name: 'Vasudev Surwase',
    image: '/Images/vasudev.jpeg',

    company: 'Rebind Technology',
    position: 'Senior Software Engineer',
    achievement: 'Senior Software Engineer at Rebind Technology',
    badge: 'Senior SE',
    badgeColor: '#38bdf8',
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(14,165,233,0.05))',
    borderColor: 'rgba(56,189,248,0.3)',
    glowColor: 'rgba(56,189,248,0.15)',
  },
  {
    name: 'Prajakta Satav',
    image: '/Images/prajakta.jpeg',

    company: 'Ambiguity Labs',
    position: 'Software Development Engineer (SDE)',
    achievement: 'Software Development Engineer (SDE) at Ambiguity Labs',
    badge: 'SDE',
    badgeColor: '#38bdf8',
    gradient: 'linear-gradient(135deg, rgba(56,189,248,0.12), rgba(14,165,233,0.05))',
    borderColor: 'rgba(56,189,248,0.3)',
    glowColor: 'rgba(56,189,248,0.15)',
  },
  {
    name: 'Anis Shaikh',
    image: '/Images/anis.jpeg',
    previousRole: 'Ex-president',
    company: 'Sulzer',
    achievement: 'Successfully placed at Sulzer',
    badge: 'Placed',
    badgeColor: '#34d399',
    gradient: 'linear-gradient(135deg, rgba(52,211,153,0.12), rgba(16,185,129,0.05))',
    borderColor: 'rgba(52,211,153,0.3)',
    glowColor: 'rgba(52,211,153,0.15)',
  }
];

/* ─────────────────────────────────────────────
   ALUMNI CARD
   ───────────────────────────────────────────── */
function AlumniCard({ alumnus, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: index * 0.08 }}
      style={{ display: 'flex', width: '100%' }}
    >
      <div
        style={{
          background: alumnus.gradient,
          border: `1px solid ${alumnus.borderColor}`,
          borderRadius: '20px',
          padding: '24px',
          position: 'relative',
          overflow: 'hidden',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          transition: 'transform 0.3s ease, box-shadow 0.3s ease, border-color 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          width: '100%',
        }}
        className="ach-alumni-card"
      >
        <span style={{
          position: 'absolute', top: 0, left: '-20%', width: '35%', height: '2px',
          background: `linear-gradient(to right, transparent, ${alumnus.badgeColor}, transparent)`,
          boxShadow: `0 0 12px ${alumnus.badgeColor}`,
          animation: `traceMove ${4 + index * 0.5}s linear infinite`,
        }} />

        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', gap: '6px', flexWrap: 'wrap' }}>
            <span style={{
              padding: '4px 12px', borderRadius: '999px',
              background: `${alumnus.badgeColor}22`, border: `1px solid ${alumnus.badgeColor}55`,
              color: alumnus.badgeColor, fontFamily: 'Inter, sans-serif',
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>
              {alumnus.badge}
            </span>
            {alumnus.previousRole && (
              <span style={{
                padding: '4px 10px', borderRadius: '6px',
                background: 'rgba(56, 189, 248, 0.09)', border: '1px solid rgba(56, 189, 248, 0.25)',
                color: '#38bdf8', fontFamily: 'Inter, sans-serif',
                fontSize: '0.62rem', fontWeight: 600, letterSpacing: '0.05em',
              }}>
                ✨ {alumnus.previousRole}
              </span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '18px' }}>
            <div style={{
              width: '64px',
              height: '64px',
              borderRadius: '50%',
              overflow: 'hidden',
              border: `2px solid ${alumnus.borderColor || 'rgba(255,255,255,0.1)'}`,
              boxShadow: `0 0 10px ${alumnus.glowColor || 'rgba(255,255,255,0.05)'}`,
              flexShrink: 0,
              transition: 'transform 0.3s ease, border-color 0.3s ease',
            }} className="alumni-img-container">
              <img
                src={alumnus.image}
                alt={alumnus.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  display: 'block',
                  transition: 'transform 0.4s ease',
                }}
                className="alumni-avatar"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentNode.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.parentNode.innerHTML = `<div style="display:flex;align-items:center;justify-content:center;height:100%;color:${alumnus.badgeColor};font-weight:bold;font-size:1.2rem;font-family:'Orbitron',sans-serif;">${alumnus.name.charAt(0)}</div>`;
                }}
              />
            </div>

            <div>
              <h3 style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: '1.05rem',
                fontWeight: 700,
                color: '#fff',
                margin: 0,
                lineHeight: 1.2
              }}>
                {alumnus.name}
              </h3>
              {alumnus.company && (
                <div style={{
                  color: alumnus.badgeColor,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  fontFamily: 'Inter, sans-serif',
                  marginTop: '4px'
                }}>
                  🏢 {alumnus.company}
                </div>
              )}
            </div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.02)',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '4px'
          }}>
            <span style={{
              color: 'rgba(255,255,255,0.36)',
              fontSize: '0.58rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              fontFamily: 'Inter, sans-serif',
              display: 'block',
              marginBottom: '4px'
            }}>
              Highlight
            </span>
            <p style={{
              color: 'rgba(255,255,255,0.8)',
              fontSize: '0.82rem',
              lineHeight: 1.5,
              fontFamily: 'Inter, sans-serif',
              margin: 0,
              fontWeight: 500
            }}>
              {alumnus.achievement}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}



/* ─────────────────────────────────────────────
   TIMELINE CARD
───────────────────────────────────────────── */
function AchievementCard({ achievement, index }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: index * 0.1 }}
      style={{ display: 'flex', width: '100%' }}
    >
      <div style={{
        background: achievement.gradient,
        border: `1px solid ${achievement.borderColor}`,
        borderRadius: '20px',
        padding: '26px',
        position: 'relative',
        overflow: 'hidden',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        width: '100%',
      }}
        className="ach-timeline-card"
      >
        <span style={{
          position: 'absolute', top: 0, left: '-20%', width: '35%', height: '2px',
          background: `linear-gradient(to right, transparent, ${achievement.badgeColor}, transparent)`,
          boxShadow: `0 0 12px ${achievement.badgeColor}`,
          animation: `traceMove ${3.5 + index * 0.8}s linear infinite`,
        }} />

        <div>
          {/* Top row: badge + date */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '14px', flexWrap: 'wrap', gap: '6px' }}>
            <span style={{
              padding: '4px 12px', borderRadius: '999px',
              background: `${achievement.badgeColor}22`, border: `1px solid ${achievement.badgeColor}55`,
              color: achievement.badgeColor, fontFamily: 'Inter, sans-serif',
              fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase',
            }}>{achievement.badge}</span>
            <span style={{ color: 'rgba(255,255,255,0.38)', fontSize: '0.68rem', fontFamily: 'Inter, sans-serif' }}>📅 {achievement.date}</span>
          </div>

          {/* Emoji */}
          <div style={{ fontSize: '2.6rem', marginBottom: '10px', filter: `drop-shadow(0 0 10px ${achievement.badgeColor})` }}>{achievement.emoji}</div>

          {/* Achievement Images inside Card */}
          {achievement.images && achievement.images.length > 0 && (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
              gap: '10px',
              marginBottom: '16px',
              borderRadius: '12px',
              overflow: 'hidden',
            }}>
              {achievement.images.map((imgUrl, imgIdx) => (
                <div
                  key={imgIdx}
                  style={{
                    position: 'relative',
                    height: '110px',
                    overflow: 'hidden',
                    borderRadius: '8px',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <img
                    src={imgUrl}
                    alt={`Achievement event photo ${imgIdx + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      transition: 'transform 0.4s ease',
                    }}
                    className="timeline-card-img"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(0.85rem, 1.6vw, 1.05rem)', fontWeight: 700, color: '#fff', marginBottom: '12px', lineHeight: 1.4 }}>
            {achievement.title}
          </h3>

          {/* College / Duration */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
            {[`🏫 ${achievement.college}`, `⏱ ${achievement.duration}`].map(m => (
              <span key={m} style={{
                padding: '3px 9px', borderRadius: '6px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.55)', fontSize: '0.63rem', fontFamily: 'Inter, sans-serif',
              }}>{m}</span>
            ))}
          </div>

          {/* Project */}
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: 'rgba(255,255,255,0.36)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif' }}>Project</span>
            <div style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 600, fontFamily: 'Inter, sans-serif', marginTop: '2px' }}>{achievement.project}</div>
          </div>

          {/* Members */}
          <div style={{ marginBottom: '12px' }}>
            <span style={{ color: 'rgba(255,255,255,0.36)', fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', display: 'block', marginBottom: '6px' }}>Team Members</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px' }}>
              {achievement.members.map(m => (
                <span key={m} style={{ padding: '3px 10px', borderRadius: '999px', background: 'rgba(56,189,248,0.09)', border: '1px solid rgba(56,189,248,0.22)', color: '#7dd3fc', fontSize: '0.67rem', fontFamily: 'Inter, sans-serif' }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Description */}
          <p style={{ color: 'rgba(255,255,255,0.56)', fontSize: '0.8rem', lineHeight: 1.78, fontFamily: 'Inter, sans-serif', marginBottom: '14px' }}>
            {achievement.description}
          </p>

          {/* Highlight */}
          {achievement.highlight && (
            <div style={{
              padding: '9px 13px', borderRadius: '10px',
              background: `${achievement.badgeColor}14`, border: `1px solid ${achievement.badgeColor}38`,
              color: achievement.badgeColor, fontSize: '0.73rem', fontFamily: 'Inter, sans-serif', fontWeight: 600, marginBottom: '14px',
            }}>{achievement.highlight}</div>
          )}

          {/* Tags */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginBottom: '16px' }}>
            {achievement.tags.map(t => (
              <span key={t} style={{ padding: '3px 9px', borderRadius: '6px', background: 'rgba(167,139,250,0.09)', border: '1px solid rgba(167,139,250,0.18)', color: '#c4b5fd', fontSize: '0.6rem', fontFamily: 'Inter, sans-serif', letterSpacing: '0.1em' }}>#{t}</span>
            ))}
          </div>
        </div>

        {/* CTA */}

      </div>
    </motion.div>
  );
}


/* ─────────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────────── */
export default function AchievementsPage() {
  return (
    <main style={{ background: '#030712', minHeight: '100vh', overflowX: 'hidden' }}>

      {/* ══ HERO ══ */}
      <section style={{
        position: 'relative', minHeight: '100vh',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden', background: '#030712',
      }}>
        <ParticleCanvas />

        {/* Gradient mesh */}
        <div style={{
          position: 'absolute', inset: 0, zIndex: 0,
          background: `
            radial-gradient(ellipse 80% 60% at 20% 30%, rgba(56,189,248,0.11) 0%, transparent 60%),
            radial-gradient(ellipse 60% 50% at 80% 70%, rgba(167,139,250,0.09) 0%, transparent 55%),
            radial-gradient(ellipse 40% 40% at 50% 50%, rgba(96,165,250,0.05) 0%, transparent 50%)
          `,
          animation: 'meshPulse 9s ease-in-out infinite alternate',
        }} />

        {/* Glowing circles */}
        <div style={{ position: 'absolute', top: '15%', left: '8%', zIndex: 0, width: '280px', height: '280px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(56,189,248,0.07) 0%, transparent 70%)', animation: 'circleFloat 7s ease-in-out infinite', filter: 'blur(18px)' }} />
        <div style={{ position: 'absolute', bottom: '22%', right: '8%', zIndex: 0, width: '240px', height: '240px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(167,139,250,0.09) 0%, transparent 70%)', animation: 'circleFloat 9s ease-in-out infinite reverse', filter: 'blur(18px)' }} />
        <div style={{ position: 'absolute', top: '48%', right: '4%', zIndex: 0, width: '160px', height: '160px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(251,191,36,0.05) 0%, transparent 70%)', animation: 'circleFloat 11s ease-in-out infinite 2s', filter: 'blur(14px)' }} />

        {/* Moving lines */}
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 0, opacity: 0.14, pointerEvents: 'none' }} aria-hidden="true">
          <line x1="0" y1="28%" x2="100%" y2="28%" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="6 14" style={{ animation: 'lineDrift 18s linear infinite' }} />
          <line x1="0" y1="58%" x2="100%" y2="58%" stroke="#a78bfa" strokeWidth="0.5" strokeDasharray="4 20" style={{ animation: 'lineDrift 22s linear infinite reverse' }} />
          <line x1="0" y1="78%" x2="100%" y2="78%" stroke="#38bdf8" strokeWidth="0.5" strokeDasharray="8 18" style={{ animation: 'lineDrift 14s linear infinite 3s' }} />
        </svg>

        {/* Content */}
        <div style={{ position: 'relative', zIndex: 2, textAlign: 'center', padding: '110px 24px 60px', maxWidth: '920px', width: '100%' }}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} style={{ marginBottom: '24px' }}>
            <span style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              padding: '6px 20px', borderRadius: '999px',
              background: 'rgba(56,189,248,0.09)', border: '1px solid rgba(56,189,248,0.22)',
              color: '#38bdf8', fontFamily: 'Inter, sans-serif', fontSize: '0.68rem',
              letterSpacing: '0.25em', textTransform: 'uppercase', fontWeight: 600,
            }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#38bdf8', animation: 'dotPulse 2s ease infinite' }} />
              ACM RSCOE • Team Achievements
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.9rem, 5.5vw, 4rem)', fontWeight: 900, lineHeight: 1.2, letterSpacing: '0.04em', marginBottom: '22px', color: '#fff' }}
          >
            Celebrating{' '}
            <span style={{ background: 'linear-gradient(135deg, #38bdf8, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Innovation.</span>
            <br />
            Recognizing{' '}
            <span style={{ background: 'linear-gradient(135deg, #a78bfa, #f472b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Excellence.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            style={{ color: 'rgba(255,255,255,0.58)', fontFamily: 'Inter, sans-serif', fontSize: 'clamp(0.88rem, 1.8vw, 1.05rem)', lineHeight: 1.82, maxWidth: '660px', margin: '0 auto 44px' }}
          >
            Our members are constantly pushing boundaries through hackathons, research, innovation,
            entrepreneurship, and technical competitions across India.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '64px' }}
          >
            <a
              href="#achievements-timeline"
              onClick={e => { e.preventDefault(); document.getElementById('achievements-timeline')?.scrollIntoView({ behavior: 'smooth' }); }}
              className="ach-hero-btn-primary"
            >
              View Achievements
            </a>
            <Link to="/" className="ach-hero-btn-secondary">Join ACM</Link>
          </motion.div>

          {/* Stats grid */}

        </div>


      </section>

      {/* ══ TIMELINE ══ */}
      <section id="achievements-timeline" style={{ padding: '120px 0', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(56,189,248,0.035) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ width: '28px', height: '1px', background: '#38bdf8' }} />
              <span style={{ color: '#38bdf8', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Our Journey</span>
              <span style={{ width: '28px', height: '1px', background: '#38bdf8' }} />
            </div>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '0.08em', marginBottom: '14px' }}>
              ACHIEVEMENTS <span style={{ color: '#38bdf8', textShadow: '0 0 28px rgba(56,189,248,0.5)' }}></span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.48)', fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', maxWidth: '480px', margin: '0 auto' }}>
              Each victory marks a milestone in our relentless pursuit of excellence.
            </p>
          </motion.div>

          {/* Grid wrapper */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            position: 'relative'
          }}>
            {ACHIEVEMENTS.map((a, i) => <AchievementCard key={a.id} achievement={a} index={i} />)}
          </div>
        </div>
      </section>

      {/* ══ ALUMNI SECTION ══ */}
      <section id="alumni-section" style={{ padding: '120px 0', position: 'relative', borderTop: '1px solid rgba(255,255,255,0.04)' }}>
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '700px', height: '500px', borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(167,139,250,0.02) 0%, transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.7 }} style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
              <span style={{ width: '28px', height: '1px', background: '#a78bfa' }} />
              <span style={{ color: '#a78bfa', fontSize: '0.68rem', letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'Inter, sans-serif', fontWeight: 700 }}>Our Legacy</span>
              <span style={{ width: '28px', height: '1px', background: '#a78bfa' }} />
            </div>
            <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(1.7rem, 4vw, 2.8rem)', fontWeight: 900, color: '#fff', letterSpacing: '0.08em', marginBottom: '14px' }}>
              WHERE OUR ALUMNI <span style={{ color: '#a78bfa', textShadow: '0 0 28px rgba(167,139,250,0.5)' }}>ARE TODAY</span>
            </h2>
            <p style={{ color: 'rgba(255,255,255,0.48)', fontFamily: 'Inter, sans-serif', fontSize: '0.88rem', maxWidth: '520px', margin: '0 auto' }}>
              From ACM RSCOE to leading global companies and prestigious competitions
            </p>
          </motion.div>

          {/* Grid wrapper */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '30px',
            position: 'relative'
          }}>
            {ALUMNI_DATA.map((a, i) => <AlumniCard key={i} alumnus={a} index={i} />)}
          </div>
        </div>
      </section>



      {/* ══ STYLES ══ */}
      <style>{`
        @keyframes meshPulse { 0% { opacity:0.8; } 100% { opacity:1; transform:scale(1.02); } }
        @keyframes circleFloat { 0%,100% { transform:translateY(0); } 50% { transform:translateY(-28px); } }
        @keyframes lineDrift { 0% { stroke-dashoffset:0; } 100% { stroke-dashoffset:-100; } }
        @keyframes dotPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.8); } }
        @keyframes scrollPulse { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes traceMove { 0% { left:-20%; } 100% { left:110%; } }

        .ach-hero-btn-primary {
          display:inline-flex; align-items:center; gap:8px;
          padding:13px 30px; border-radius:12px;
          background:linear-gradient(135deg,#38bdf8,#60a5fa);
          color:#030712; font-family:'Orbitron',sans-serif;
          font-size:0.7rem; font-weight:700; letter-spacing:0.18em;
          text-transform:uppercase; text-decoration:none;
          transition:all 0.35s ease;
          box-shadow:0 0 28px rgba(56,189,248,0.28), 0 4px 18px rgba(56,189,248,0.18);
          position:relative; overflow:hidden;
        }
        .ach-hero-btn-primary::before {
          content:''; position:absolute; inset:0;
          background:linear-gradient(135deg,rgba(255,255,255,0.18),transparent);
          opacity:0; transition:opacity 0.35s;
        }
        .ach-hero-btn-primary:hover { transform:translateY(-3px) scale(1.03); box-shadow:0 0 50px rgba(56,189,248,0.55),0 8px 28px rgba(56,189,248,0.28); }
        .ach-hero-btn-primary:hover::before { opacity:1; }

        .ach-hero-btn-secondary {
          display:inline-flex; align-items:center; gap:8px;
          padding:13px 30px; border-radius:12px;
          background:transparent; color:#38bdf8;
          font-family:'Orbitron',sans-serif; font-size:0.7rem; font-weight:700;
          letter-spacing:0.18em; text-transform:uppercase; text-decoration:none;
          border:1.5px solid rgba(56,189,248,0.45);
          transition:all 0.35s ease; position:relative; overflow:hidden;
        }
        .ach-hero-btn-secondary::before {
          content:''; position:absolute; inset:0;
          background:rgba(56,189,248,0.07); opacity:0; transition:opacity 0.35s;
        }
        .ach-hero-btn-secondary:hover {
          transform:translateY(-3px); border-color:#38bdf8; color:#7dd3fc;
          box-shadow:0 0 28px rgba(56,189,248,0.22), inset 0 0 18px rgba(56,189,248,0.04);
        }
        .ach-hero-btn-secondary:hover::before { opacity:1; }

        .ach-timeline-card:hover { transform:translateY(-4px) !important; box-shadow:0 16px 40px rgba(0,0,0,0.4); }
        .ach-timeline-card:hover .timeline-card-img { transform: scale(1.08) !important; }
        
        .ach-alumni-card:hover { transform:translateY(-4px) !important; box-shadow:0 16px 40px rgba(0,0,0,0.4); }
        .ach-alumni-card:hover .alumni-avatar { transform: scale(1.08) !important; }
        .ach-alumni-card:hover .alumni-img-container { border-color: rgba(255, 255, 255, 0.4) !important; }
        
        .ach-view-btn { transition:all 0.28s ease; }
        .ach-view-btn:hover { transform:translateY(-2px); filter:brightness(1.2); }

        @media (max-width:860px) {
          .ach-timeline-wrapper > div { justify-content:center !important; }
        }
        @media (max-width:640px) {
          .ach-hero-btn-primary, .ach-hero-btn-secondary { width:100%; justify-content:center; }
        }
      `}</style>
    </main>
  );
}
