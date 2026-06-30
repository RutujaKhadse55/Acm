import { useEffect, useMemo, useRef, useState } from 'react';

import { useInView } from '../hooks/useInView';

function FadeInSection({ children, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.12, once: true });
  return (
    <section ref={ref} className={`${inView ? 'section-visible' : 'section-hidden'} ${className}`.trim()}>
      {children}
    </section>
  );
}

function SectionTitle({ eyebrow, title, accentWord }) {
  return (
    <div className="team-section-title" aria-label={eyebrow}>
      <p className="team-section-title__eyebrow">{eyebrow}</p>
      <h2 className="team-section-title__h2">
        {title} <span className="team-section-title__accent">{accentWord}</span>
      </h2>
    </div>
  );
}

function PlaceholderImg({ src, alt, className = '', fallbackBg = true, rounded = false }) {
  const [broken, setBroken] = useState(false);
  if (!src || broken) {
    return (
      <div
        className={className}
        style={{
          width: '100%',
          height: '100%',
          borderRadius: rounded ? 999 : 16,
          background: fallbackBg ? 'rgba(56,189,248,0.08)' : 'transparent',
          border: '1px solid rgba(56,189,248,0.20)',
        }}
        aria-hidden="true"
      />
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      draggable={false}
      onError={() => setBroken(true)}
      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
    />
  );
}

function LinkedInIcon({ href }) {
  const isValid = Boolean(href && href !== '#');
  return (
    <a
      href={isValid ? href : undefined}
      target={isValid ? '_blank' : undefined}
      rel={isValid ? 'noreferrer' : undefined}
      aria-label="LinkedIn"
      className={`li-icon ${isValid ? '' : 'li-icon--disabled'}`}
      onClick={(e) => {
        if (!isValid) e.preventDefault();
      }}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path
          d="M6.94 8.5H4V20H6.94V8.5Z"
          fill="currentColor"
          opacity="0.95"
        />
        <path
          d="M5.47 4C4.63 4 4 4.7 4 5.52C4 6.34 4.63 7.04 5.47 7.04C6.31 7.04 6.94 6.34 6.94 5.52C6.94 4.7 6.31 4 5.47 4Z"
          fill="currentColor"
          opacity="0.95"
        />
        <path
          d="M20 20H17.06V14.35C17.06 13.03 16.78 12.19 15.48 12.19C14.36 12.19 13.98 12.95 13.98 14.2V20H11.04V8.5H13.87V9.99H13.91C14.29 9.27 15.24 8.32 16.64 8.32C19.04 8.32 20 9.86 20 12.52V20Z"
          fill="currentColor"
          opacity="0.95"
        />
      </svg>
    </a>
  );
}

function MemberCard({ name, role, photo, linkedinHref }) {
  return (
    <article className="member-card" aria-label={`${name} ${role}`}
      role="group"
    >
      <div className="member-card__avatar" aria-hidden="true">
        <PlaceholderImg src={photo} alt={name} rounded className="member-card__img" />
      </div>
      <div className="member-card__name">{name}</div>
      <div className="member-card__role">{role}</div>

      <div className="member-card__social">
        <LinkedInIcon href={linkedinHref} />
      </div>
    </article>
  );
}

function CoreCard({ label, position, photo, linkedinHref }) {
  return (
    <article className="core-card glass-card" aria-label={position} role="group">
      <div className="core-card__imgWrap" aria-hidden="true">
        <PlaceholderImg src={photo} alt={label} rounded className="core-card__img" />
      </div>

      <div className="core-card__name">{label}</div>
      <div className="core-card__role">{position}</div>

      <div className="core-card__social">
        <LinkedInIcon href={linkedinHref} />
      </div>
    </article>
  );
}


function HeadCard({ genderLabel, name, photo, linkedinHref }) {
  return (
    <article className="head-card" aria-label={`${genderLabel} ${name}`} role="group">
      <div className="head-card__photo" aria-hidden="true">
        <PlaceholderImg src={photo} alt={name} rounded className="head-card__img" />
      </div>

      <div className="head-card__meta">
        <div className="head-card__label">{genderLabel}</div>
        <div className="head-card__name">{name}</div>
        <div className="head-card__title">Team Lead</div>
        <div className="head-card__social">
          <LinkedInIcon href={linkedinHref} />
        </div>
      </div>
    </article>
  );
}

function MembersGrid({ members }) {
  return (
    <div className="members-grid" role="list" aria-label="Team members">
      {members.map((m, idx) => (
        <div key={`${m.name}-${idx}`} role="listitem" className="members-grid__item">
          <MemberCard {...m} />
        </div>
      ))}
    </div>
  );
}

function MembersCarousel({ members }) {
  const [page, setPage] = useState(0);
  const [cardsPerPage, setCardsPerPage] = useState(4);
  const viewportRef = useRef(null);

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w <= 640) setCardsPerPage(1);
      else if (w <= 860) setCardsPerPage(2);
      else if (w <= 1024) setCardsPerPage(3);
      else setCardsPerPage(4);
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  const totalPages = Math.max(1, Math.ceil(members.length / cardsPerPage));

  useEffect(() => {
    setPage((p) => Math.max(0, Math.min(totalPages - 1, p)));
  }, [totalPages]);

  const go = (p) => {
    setPage(Math.max(0, Math.min(totalPages - 1, p)));
  };

  const pageMembers = (p) => {
    const start = p * cardsPerPage;
    return members.slice(start, start + cardsPerPage);
  };

  const trackStyle = useMemo(() => ({ transform: `translateX(-${page * 100}%)` }), [page]);

  // Swipe/touch
  useEffect(() => {
    const el = viewportRef.current;
    if (!el) return;

    let startX = 0;
    let dx = 0;

    const onTouchStart = (e) => {
      startX = e.touches[0].clientX;
      dx = 0;
    };
    const onTouchMove = (e) => {
      dx = e.touches[0].clientX - startX;
    };
    const onTouchEnd = () => {
      if (dx < -50) go(page + 1);
      if (dx > 50) go(page - 1);
    };

    el.addEventListener('touchstart', onTouchStart, { passive: true });
    el.addEventListener('touchmove', onTouchMove, { passive: true });
    el.addEventListener('touchend', onTouchEnd);

    return () => {
      el.removeEventListener('touchstart', onTouchStart);
      el.removeEventListener('touchmove', onTouchMove);
      el.removeEventListener('touchend', onTouchEnd);
    };
  }, [page]);

  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="carousel" aria-label="Members carousel">
      <div className="carousel__viewport" ref={viewportRef}>
        <div className="carousel__track" style={trackStyle}>
          {Array.from({ length: totalPages }).map((_, p) => (
            <div className="carousel__page" key={p}>
              {pageMembers(p).map((m, idx) => (
                <MemberCard key={`${m.name}-${idx}`} {...m} />
              ))}
            </div>
          ))}
        </div>
      </div>

      <button className="carousel__arrow" disabled={!canPrev} onClick={() => go(page - 1)} aria-label="Previous">
        ‹
      </button>
      <button className="carousel__arrow carousel__arrow--next" disabled={!canNext} onClick={() => go(page + 1)} aria-label="Next">
        ›
      </button>

      <div className="carousel__dots" role="tablist" aria-label="Pagination dots">
        {Array.from({ length: totalPages }).map((_, p) => (
          <button
            key={p}
            className={`carousel__dot ${p === page ? 'is-active' : ''}`}
            onClick={() => go(p)}
            aria-label={`Go to page ${p + 1}`}
            aria-selected={p === page}
          />
        ))}
      </div>
    </div>
  );
}

function DepartmentSection({ title, headMale, headFemale, members }) {
  const useCarousel = members.length > 5;

  return (
    <section className="dept-wrap">
      <div className="dept-header">
        <div className="dept-eyebrow">DEPARTMENT</div>
        <h3 className="dept-title">{title}</h3>
      </div>

      <div className="dept-glass glass-card" style={{ background: 'rgba(255,255,255,0.03)', borderColor: 'rgba(56,189,248,0.18)' }}>
        <div className="dept-inner">
          <FadeInSection>
            <div className="heads-grid">
              <HeadCard genderLabel="Male Head" {...headMale} />
              <HeadCard genderLabel="Female Head" {...headFemale} />
            </div>
          </FadeInSection>

          <div className="dept-members">
            <FadeInSection>
              {useCarousel ? <MembersCarousel members={members} /> : <MembersGrid members={members} />}
            </FadeInSection>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function TeamPage() {
  // Use string paths only (no imports)
  const heroImg = 'image/teamacm.jpg';
  const facultyImg = '/Images/faculty/faculty.jpg';

  const coreMembers = [
    { label: 'Chair', position: 'image/teamacm.jpg', photo: 'image/teamacm.jpg' },
    { label: 'Vice Chair', position: '/image/coreteam/vice-chair.jpg', photo: '/image/coreteam/vice-chair.jpg' },
    { label: 'President', position: '/image/coreteam/president.jpg', photo: '/image/coreteam/president.jpg' },
    { label: 'Secretary', position: '/image/coreteam/secretary.jpg', photo: '/image/coreteam/secretary.jpg' },
    { label: 'Treasurer', position: '/image/coreteam/treasurer.jpg', photo: '/image/coreteam/treasurer.jpg' },
    { label: 'Joint Secretary', position: '/image/coreteam/joint-secretary.jpg', photo: '/image/coreteam/joint-secretary.jpg' },
    { label: 'Other Executive Members', position: '/image/coreteam/treasurer.jpg', photo: '/image/coreteam/treasurer.jpg' },
  ];

  const departments = [
    {
      title: 'Web Development Team',
      headMale: { name: 'Name', photo: '/image/webteam/male-head.jpg', linkedinHref: '#' },
      headFemale: { name: 'Name', photo: '/image/webteam/female-head.jpg', linkedinHref: '#' },
      members: Array.from({ length: 8 }).map((_, i) => ({
        name: `Member ${i + 1}`,
        role: 'Member',
        photo: `/image/webteam/member${i + 1}.jpg`,
        linkedinHref: '#',
      })),
    },
    {
      title: 'Design Team',
      headMale: { name: 'Name', photo: '/image/designteam/male-head.jpg', linkedinHref: '#' },
      headFemale: { name: 'Name', photo: '/image/designteam/female-head.jpg', linkedinHref: '#' },
      members: Array.from({ length: 8 }).map((_, i) => ({
        name: `Member ${i + 1}`,
        role: 'Member',
        photo: `/image/designteam/member${i + 1}.jpg`,
        linkedinHref: '#',
      })),
    },
    {
      title: 'Video Editing Team',
      headMale: { name: 'Name', photo: '/image/videoeditingteam/male-head.jpg', linkedinHref: '#' },
      headFemale: { name: 'Name', photo: '/image/videoeditingteam/female-head.jpg', linkedinHref: '#' },
      members: Array.from({ length: 8 }).map((_, i) => ({
        name: `Member ${i + 1}`,
        role: 'Member',
        photo: `/image/videoeditingteam/member${i + 1}.jpg`,
        linkedinHref: '#',
      })),
    },
    {
      title: 'Content Team',
      headMale: { name: 'Name', photo: '/image/contentteam/male-head.jpg', linkedinHref: '#' },
      headFemale: { name: 'Name', photo: '/image/contentteam/female-head.jpg', linkedinHref: '#' },
      members: Array.from({ length: 8 }).map((_, i) => ({
        name: `Member ${i + 1}`,
        role: 'Member',
        photo: `/image/contentteam/member${i + 1}.jpg`,
        linkedinHref: '#',
      })),
    },
    {
      title: 'Event Management Team',
      headMale: { name: 'Name', photo: '/image/eventmanagementteam/male-head.jpg', linkedinHref: '#' },
      headFemale: { name: 'Name', photo: '/image/eventmanagementteam/female-head.jpg', linkedinHref: '#' },
      members: Array.from({ length: 8 }).map((_, i) => ({
        name: `Member ${i + 1}`,
        role: 'Member',
        photo: `/image/eventmanagementteam/member${i + 1}.jpg`,
        linkedinHref: '#',
      })),
    },
    {
      title: 'Social Media Team',
      headMale: { name: 'Name', photo: '/image/socialmediateam/male-head.jpg', linkedinHref: '#' },
      headFemale: { name: 'Name', photo: '/image/socialmediateam/female-head.jpg', linkedinHref: '#' },
      members: Array.from({ length: 8 }).map((_, i) => ({
        name: `Member ${i + 1}`,
        role: 'Member',
        photo: `/image/socialmediateam/member${i + 1}.jpg`,
        linkedinHref: '#',
      })),
    },
    {
      title: 'Inventory Team',
      headMale: { name: 'Name', photo: '/image/inventoryteam/male-head.jpg', linkedinHref: '#' },
      headFemale: { name: 'Name', photo: '/image/inventoryteam/female-head.jpg', linkedinHref: '#' },
      members: Array.from({ length: 8 }).map((_, i) => ({
        name: `Member ${i + 1}`,
        role: 'Member',
        photo: `/image/inventoryteam/member${i + 1}.jpg`,
        linkedinHref: '#',
      })),
    },
    {
      title: 'Sponsorship Team',
      headMale: { name: 'Name', photo: '/image/sponsorshipteam/male-head.jpg', linkedinHref: '#' },
      headFemale: { name: 'Name', photo: '/image/sponsorshipteam/female-head.jpg', linkedinHref: '#' },
      members: Array.from({ length: 8 }).map((_, i) => ({
        name: `Member ${i + 1}`,
        role: 'Member',
        photo: `/image/sponsorshipteam/member${i + 1}.jpg`,
        linkedinHref: '#',
      })),
    },
  ];

  return (
    <main
      style={{
        minHeight: '100vh',
        paddingTop: '80px',
        background: 'linear-gradient(180deg, #030712 0%, #060d1f 100%)',
      }}
      aria-label="Team page"
    >
      <style>{`
        .team-section-title{margin:0 auto;text-align:center;}
        .team-section-title__eyebrow{color:#38bdf8;font-size:0.7rem;letter-spacing:0.35em;text-transform:uppercase;font-weight:600;margin-bottom:12px;font-family:'Inter',sans-serif;}
        .team-section-title__h2{font-family:'Orbitron',sans-serif;font-size:clamp(2rem,4vw,3.5rem);font-weight:900;letter-spacing:0.1em;text-transform:uppercase;color:#fff;margin:0;}
        .team-section-title__accent{color:#38bdf8;text-shadow:0 0 20px rgba(56,189,248,0.5);} 

        .team-hero{position:relative;border-radius:26px;overflow:hidden;}
        .team-hero__img{width:100%;height:420px;object-fit:cover;display:block;border-radius:26px;}
        .team-hero__overlay{position:absolute;inset:0;background:linear-gradient(110deg, rgba(56,189,248,0.25) 0%, rgba(56,189,248,0.08) 40%, rgba(3,7,18,0.75) 100%);} 
        .team-hero__glow{position:absolute;inset:-40px;background:radial-gradient(circle at 30% 20%, rgba(56,189,248,0.40), transparent 56%),radial-gradient(circle at 80% 60%, rgba(14,165,233,0.24), transparent 52%);filter:blur(18px);opacity:0.95;pointer-events:none;}
        .team-hero__panel{position:absolute;left:50%;bottom:22px;transform:translateX(-50%);width:min(980px, calc(100% - 24px));}
        .team-hero__panel-inner{padding:22px;border-radius:18px;background:rgba(255,255,255,0.05);border:1px solid rgba(56,189,248,0.22);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);box-shadow:0 0 28px rgba(56,189,248,0.12);} 
        .team-hero__title{font-family:'Orbitron',sans-serif;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#fff;font-size:clamp(1.6rem,4vw,2.6rem);margin:0;}
        .team-hero__subtitle{margin-top:10px;color:rgba(255,255,255,0.7);font-size:clamp(0.95rem,2.1vw,1.1rem);line-height:1.6;}
        .hero-anim{animation:heroIn 700ms cubic-bezier(.2,.9,.2,1) both;}
        @keyframes heroIn{from{opacity:0;transform:translateY(14px) scale(0.985);}to{opacity:1;transform:translateY(0) scale(1);}}

        .container-1300{max-width:1320px;margin:0 auto;padding:0 20px;}

        .premium-center-card{max-width:1080px;margin:0 auto;}

        .faculty-card{padding:22px;border-radius:22px;display:flex;gap:18px;align-items:center;justify-content:center;flex-wrap:wrap;}

        .faculty-img{width:140px;height:140px;border-radius:999px;overflow:hidden;border:1px solid rgba(56,189,248,0.26);background:rgba(56,189,248,0.06);box-shadow:0 0 28px rgba(56,189,248,0.14);} 

        /* CORE */
        .core-grid{margin-top:24px;display:grid;gap:16px;justify-content:center;grid-template-columns:repeat(3, minmax(0, 1fr));}

        /* default (desktop): 3 + 3 + 1 centered */
        .core-card{max-width:320px;margin:0 auto;padding:18px 14px;border-radius:20px;border:1px solid rgba(56,189,248,0.16);background:rgba(255,255,255,0.02);box-shadow:0 0 24px rgba(56,189,248,0.08);display:flex;flex-direction:column;gap:12px;min-height:188px;align-items:center;transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;}
        .core-card:hover{transform:translateY(-3px);border-color:rgba(56,189,248,0.45);box-shadow:0 0 34px rgba(56,189,248,0.22);} 

        .core-card__imgWrap{width:96px;height:96px;border-radius:999px;border:1px solid rgba(56,189,248,0.26);background:rgba(56,189,248,0.06);overflow:hidden;box-shadow:0 0 24px rgba(56,189,248,0.12);} 
        .core-card__img{width:100%;height:100%;object-fit:cover;display:block;}

        .core-card__name{font-family:'Orbitron',sans-serif;font-weight:900;letter-spacing:0.06em;color:#fff;font-size:1rem;text-align:center;}
        .core-card__role{color:rgba(56,189,248,0.95);font-family:'Inter',sans-serif;font-weight:600;font-size:0.9rem;text-align:center;}
        .core-card__social{margin-top:auto;padding-top:4px;display:flex;justify-content:center;min-height:28px;}

        /* Tablet: 2 cards per row */
        @media (max-width:1100px){.core-grid{grid-template-columns:repeat(2, minmax(0, 1fr));}}

        /* Mobile: 1 per row */
        @media (max-width:640px){.core-grid{grid-template-columns:repeat(1, minmax(0, 1fr));}}


        /* DEPT */
        .dept-wrap{padding:54px 0;}
        .dept-header{text-align:center;margin-bottom:18px;}
        .dept-eyebrow{color:#38bdf8;font-size:0.65rem;letter-spacing:0.35em;text-transform:uppercase;font-weight:600;margin-bottom:10px;font-family:'Inter',sans-serif;}
        .dept-title{font-family:'Orbitron',sans-serif;font-weight:900;letter-spacing:0.12em;text-transform:uppercase;color:#fff;font-size:clamp(1.5rem,3.6vw,2.2rem);margin:0;}
        .dept-glass{border-radius:22px;box-shadow:0 0 28px rgba(56,189,248,0.10);backdrop-filter:blur(14px);-webkit-backdrop-filter:blur(14px);}
        .dept-inner{padding:22px;max-width:1250px;margin:0 auto;}
        .dept-members{margin-top:22px;}

        /* HEADS */
        .heads-grid{display:grid;grid-template-columns:repeat(2, minmax(0, 1fr));gap:16px;justify-content:center;}
        .head-card{border-radius:20px;border:1px solid rgba(56,189,248,0.20);background:rgba(0,0,0,0.12);overflow:hidden;display:flex;flex-direction:column;align-items:center;padding:18px 14px;box-shadow:0 0 26px rgba(56,189,248,0.10);transition:transform .25s ease, box-shadow .25s ease, border-color .25s ease;}
        .head-card:hover{transform:translateY(-3px);box-shadow:0 0 34px rgba(56,189,248,0.22);border-color:rgba(56,189,248,0.48);} 
        .head-card__photo{width:118px;height:118px;border-radius:999px;border:1px solid rgba(56,189,248,0.26);background:rgba(56,189,248,0.06);overflow:hidden;box-shadow:0 0 24px rgba(56,189,248,0.12);} 
        .head-card__meta{text-align:center;margin-top:14px;}
        .head-card__label{color:rgba(56,189,248,0.95);font-family:'Inter',sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:0.03em;}
        .head-card__name{margin-top:8px;font-family:'Orbitron',sans-serif;font-weight:900;color:#fff;font-size:1.15rem;letter-spacing:0.06em;}
        .head-card__title{margin-top:8px;color:rgba(255,255,255,0.7);font-family:'Inter',sans-serif;font-weight:600;font-size:0.9rem;}
        .head-card__social{margin-top:12px;display:flex;justify-content:center;}
        @media (max-width:640px){.heads-grid{grid-template-columns:1fr;}.head-card__photo{width:108px;height:108px;}}

        /* MEMBERS GRID */
        .members-grid{display:grid;gap:16px;justify-content:center;grid-template-columns:repeat(4, minmax(0, 1fr));}
        @media (max-width:1100px){.members-grid{grid-template-columns:repeat(3, minmax(0, 1fr));}}
        @media (max-width:860px){.members-grid{grid-template-columns:repeat(2, minmax(0, 1fr));}}
        @media (max-width:640px){.members-grid{grid-template-columns:repeat(1, minmax(0, 1fr));}}

        .member-card{border-radius:16px;border:1px solid rgba(56,189,248,0.14);background:rgba(255,255,255,0.02);backdrop-filter:blur(12px);-webkit-backdrop-filter:blur(12px);padding:14px 12px;box-shadow:0 0 22px rgba(56,189,248,0.08);transition:transform .25s ease, border-color .25s ease, box-shadow .25s ease;display:flex;flex-direction:column;align-items:center;}
        .member-card:hover{transform:translateY(-3px);border-color:rgba(56,189,248,0.45);box-shadow:0 0 34px rgba(56,189,248,0.22);} 
        .member-card__avatar{width:78px;height:78px;border-radius:999px;border:1px solid rgba(56,189,248,0.22);background:rgba(56,189,248,0.06);overflow:hidden;box-shadow:0 0 18px rgba(56,189,248,0.12);} 
        .member-card__name{text-align:center;margin-top:12px;font-family:'Orbitron',sans-serif;font-weight:900;color:#fff;font-size:0.98rem;letter-spacing:0.04em;}
        .member-card__role{text-align:center;margin-top:8px;color:rgba(56,189,248,0.95);font-family:'Inter',sans-serif;font-weight:700;font-size:0.85rem;}
        .member-card__social{margin-top:12px;display:flex;justify-content:center;min-height:28px;}

        /* Carousel */
        .carousel{position:relative;max-width:1200px;margin:0 auto;}
        .carousel__viewport{overflow:hidden;border-radius:18px;}
        .carousel__track{display:flex;transition:transform 500ms cubic-bezier(.2,.9,.2,1);}
        .carousel__page{min-width:100%;padding:10px 6px;display:grid;gap:16px;justify-content:center;grid-template-columns:repeat(4, minmax(0, 1fr));}
        @media (max-width:1100px){.carousel__page{grid-template-columns:repeat(3, minmax(0, 1fr));}}
        @media (max-width:860px){.carousel__page{grid-template-columns:repeat(2, minmax(0, 1fr));}}
        @media (max-width:640px){.carousel__page{grid-template-columns:repeat(1, minmax(0, 1fr));}}

        .carousel__arrow{position:absolute;top:50%;transform:translateY(-50%);left:6px;width:44px;height:44px;border-radius:999px;border:1px solid rgba(56,189,248,0.22);background:rgba(0,0,0,0.25);color:#38bdf8;font-size:24px;display:flex;align-items:center;justify-content:center;cursor:pointer;box-shadow:0 0 24px rgba(56,189,248,0.14);transition:transform .2s ease, box-shadow .2s ease, opacity .2s ease;}
        .carousel__arrow:hover{transform:translateY(-50%) scale(1.04);box-shadow:0 0 34px rgba(56,189,248,0.22);} 
        .carousel__arrow:disabled{opacity:0.35;cursor:not-allowed;box-shadow:none;}
        .carousel__arrow--next{left:auto;right:6px;}

        .carousel__dots{display:flex;gap:10px;justify-content:center;margin-top:14px;}
        .carousel__dot{width:10px;height:10px;border-radius:999px;border:1px solid rgba(56,189,248,0.35);background:rgba(56,189,248,0.12);cursor:pointer;transition:transform .2s ease, background .2s ease, box-shadow .2s ease;}
        .carousel__dot.is-active{background:rgba(56,189,248,0.85);box-shadow:0 0 18px rgba(56,189,248,0.35);transform:scale(1.2);} 

        /* LinkedIn */
        .li-icon{width:28px;height:28px;border-radius:999px;border:1px solid rgba(56,189,248,0.25);background:rgba(56,189,248,0.06);box-shadow:0 0 18px rgba(56,189,248,0.12);color:#38bdf8;text-decoration:none;display:inline-flex;align-items:center;justify-content:center;transition:transform .2s ease, box-shadow .2s ease, border-color .2s ease, background .2s ease;}
        .li-icon:hover{transform:translateY(-1px) scale(1.05);box-shadow:0 0 30px rgba(56,189,248,0.26);border-color:rgba(56,189,248,0.55);background:rgba(56,189,248,0.10);} 
        .li-icon--disabled{opacity:0.65;}
      `}</style>

      <div className="container-1300" style={{ padding: '42px 0 18px' }}>
        <FadeInSection>
          <div className="team-hero hero-anim" role="banner" aria-label="Team hero">
            <div className="team-hero__glow" />
            <img className="team-hero__img" src={heroImg} alt="Our Team" />
            <div className="team-hero__overlay" />
            <div className="team-hero__panel">
              <div className="team-hero__panel-inner">
                <div className="team-hero__title">OUR TEAM</div>
                <div className="team-hero__subtitle">Meet the passionate students behind the RSCOE ACM Student Chapter.</div>
              </div>
            </div>
          </div>
        </FadeInSection>
      </div>

      <div style={{ padding: '26px 0 18px' }}>
        <div className="container-1300">
          <FadeInSection>
            <div className="premium-center-card glass-card hover-glow" style={{ borderRadius: 22, padding: 22 }}>
              <div className="faculty-card" style={{ display: 'flex', alignItems: 'center' }}>
                <div className="faculty-img">
                  <PlaceholderImg src={facultyImg} alt="Faculty Coordinator" rounded />
                </div>
                <div style={{ textAlign: 'left', minWidth: 280 }}>
                  <div style={{ fontFamily: 'Orbitron, sans-serif', fontWeight: 900, color: '#fff', letterSpacing: '0.06em', fontSize: '1.35rem' }}>
                    Faculty Coordinator
                  </div>
                  <div style={{ marginTop: 10, color: 'rgba(56,189,248,0.95)', fontFamily: 'Inter, sans-serif', fontWeight: 800, fontSize: '1rem' }}>
                    Designation
                  </div>
                  <div style={{ marginTop: 8, color: 'rgba(255,255,255,0.72)', fontFamily: 'Inter, sans-serif', fontWeight: 600, fontSize: '0.95rem' }}>
                    Department
                  </div>
                  <div style={{ marginTop: 12 }}>
                    <LinkedInIcon href="#" />
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </div>
      </div>

      <div style={{ padding: '26px 0 10px' }}>
        <div className="container-1300">
          <SectionTitle eyebrow="CORE TEAM" title="CORE" accentWord="TEAM" />
          <div className="core-grid">
            {coreMembers.map((c, idx) => (
              <FadeInSection key={c.label}>
                <CoreCard label={c.label} position={c.label} />
              </FadeInSection>
            ))}
          </div>
        </div>
      </div>

      {departments.map((d) => (
        <DepartmentSection
          key={d.title}
          title={d.title}
          headMale={d.headMale}
          headFemale={d.headFemale}
          members={d.members.map((m) => ({
            ...m,
            linkedinHref: '#',
          }))}
        />
      ))}

      <div style={{ height: 64 }} />
    </main>
  );
}

