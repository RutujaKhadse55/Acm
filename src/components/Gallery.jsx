import { useMemo, useState } from 'react';

const GALLERY_IMAGES = [
  '/Images/gallery/1.jpg',
  '/Images/gallery/2.jpeg',
  '/Images/gallery/2.jpg',
  '/Images/gallery/3.jpeg',
  '/Images/gallery/3.jpg',
  '/Images/gallery/4.jpeg',
  '/Images/gallery/5.jpg',
  '/Images/gallery/6.jpg',
  '/Images/gallery/7.jpg',
  '/Images/gallery/8.jpg',
  '/Images/gallery/CD1.JPG',
  '/Images/gallery/CD2.JPG',
  '/Images/gallery/CD3.JPG',
  '/Images/gallery/CD4.jpg',
  '/Images/gallery/CD5.JPG',
  '/Images/gallery/CD6.JPG',
  '/Images/gallery/CD7.JPG',
  '/Images/gallery/CD8.jpg',
  '/Images/gallery/Childrensday.jpg',
  '/Images/gallery/Logica1.jpg',
  '/Images/gallery/Logica2.jpg',
  '/Images/gallery/Logica3.jpg',
  '/Images/gallery/Logica4.jpg',
  '/Images/gallery/Logica5.jpg',
  '/Images/gallery/Logica6.jpg',
  '/Images/gallery/Logica7.jpg',
  '/Images/gallery/Pradyot1.jpg',
  '/Images/gallery/Pradyot2.jpg',
  '/Images/gallery/Pradyot3.jpg',
  '/Images/gallery/Pradyot4.jpg',
  '/Images/gallery/Pradyot5.jpg',
  '/Images/gallery/figma.png',
  '/Images/gallery/freshmansession.jpg',
];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function GalleryImage({ src, alt }) {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      style={{
        flexShrink: 0,
        width: '240px',
        height: '160px',
        borderRadius: '12px',
        overflow: 'hidden',
        border: '1px solid rgba(56,189,248,0.1)',
        background: 'rgba(56,189,248,0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.boxShadow = '0 0 22px rgba(56,189,248,0.35)';
        e.currentTarget.style.borderColor = 'rgba(56,189,248,0.5)';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1.08)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = 'none';
        e.currentTarget.style.borderColor = 'rgba(56,189,248,0.1)';
        const img = e.currentTarget.querySelector('img');
        if (img) img.style.transform = 'scale(1)';
      }}
    >
      {hasError ? (
        <div style={{ fontSize: '2rem', opacity: 0.15 }}>📷</div>
      ) : (
        <img
          src={src}
          alt={alt}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }}
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

function GalleryRow({ images, direction = 'left', duration = '40s' }) {
  const doubled = [...images, ...images];

  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        width: '100%',
        WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
        maskImage: 'linear-gradient(to right, transparent 0%, black 8%, black 92%, transparent 100%)',
      }}
    >
      <div
        className={direction === 'left' ? 'gallery-row-left' : 'gallery-row-right'}
        style={{ '--duration': duration, display: 'flex', gap: '14px', width: 'max-content' }}
      >
        {doubled.map((src, idx) => (
          <GalleryImage
            key={idx}
            src={src}
            alt={`Gallery image ${(idx % images.length) + 1}`}
          />
        ))}
      </div>
    </div>
  );
}

export default function Gallery() {
  const [row1, row2, row3] = useMemo(
    () => [shuffle(GALLERY_IMAGES), shuffle(GALLERY_IMAGES), shuffle(GALLERY_IMAGES)],
    []
  );

  return (
    <section
      id="gallery"
      aria-label="Gallery section"
      style={{ position: 'relative', padding: '96px 0', overflow: 'hidden' }}
    >
      {/* Heading */}
      <div style={{ maxWidth: '1280px', margin: '0 auto', padding: '0 24px 56px' }}>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#38bdf8', fontSize: '0.7rem', letterSpacing: '0.35em', textTransform: 'uppercase', fontWeight: 600, marginBottom: '12px', fontFamily: 'Inter, sans-serif' }}>
            Moments We've Made
          </p>
          <h2 style={{ fontFamily: 'Orbitron, sans-serif', fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontWeight: 900, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#fff' }}>
            OUR <span style={{ color: '#38bdf8', textShadow: '0 0 20px rgba(56,189,248,0.5)' }}>GALLERY</span>
          </h2>
        </div>
      </div>

      {/* Infinite scroll rows */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        <GalleryRow images={row1} direction="left"  duration="55s" />
        <GalleryRow images={row2} direction="right" duration="38s" />
        <GalleryRow images={row3} direction="left"  duration="70s" />
      </div>
    </section>
  );
}
