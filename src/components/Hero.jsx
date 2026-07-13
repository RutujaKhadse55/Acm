import { useState } from 'react';
import { motion } from 'framer-motion';

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: (delay = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1], delay },
  }),
};
function AcmHeroLogo() {
  const [hasError, setHasError] = useState(false);

  return (
    <div
      className="w-28 h-28 md:w-36 md:h-36 mx-auto flex items-center justify-center"
      style={{
        filter: 'drop-shadow(0 0 32px #38bdf8) drop-shadow(0 0 64px rgba(56,189,248,0.35))',
      }}
    >
      {hasError ? (
        <span style={{ fontFamily: 'Orbitron,sans-serif', fontSize: '1.8rem', fontWeight: 900, color: '#38bdf8', letterSpacing: '0.05em' }}>ACM</span>
      ) : (
        <img
          src="/Images/acmrscoelogo.png"
          alt="ACM Logo"
          className="w-24 h-24 md:w-32 md:h-32 object-contain"
          onError={() => setHasError(true)}
        />
      )}
    </div>
  );
}

export default function Hero() {
  const [bgError, setBgError] = useState(false);

  return (
    <section
      id="home"
      className="relative w-full flex items-center justify-center overflow-hidden"
      style={{ minHeight: '100vh', background: '#030712' }}
      aria-label="Hero section"
    >
      {/* Background Image */}
      {!bgError && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-opacity duration-700"
          style={{ backgroundImage: "url('/Images/rscoe.jpg')" }}
          aria-hidden="true"
          onError={() => setBgError(true)}
        />
      )}

      {/* Dark gradient overlay */}


      {/* Blue glow at bottom */}
      <div
        className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] rounded-full opacity-20 blur-[80px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, #38bdf8 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      {/* Content — centered */}
      <div className="relative z-10 flex flex-col items-center text-center px-6 pt-28 pb-20 w-full max-w-5xl mx-auto">
        {/* ACM Logo */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0}
          className="mb-8"
        >
          <AcmHeroLogo />
        </motion.div>

        {/* Heading */}
        <motion.h1
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.2}
          className="font-black uppercase leading-tight"
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 'clamp(1rem, 4vw, 4rem)',
            letterSpacing: '0.08em',
          }}
        >
          <span className="text-white">JSPM RSCOE </span>
          <span
            className="text-[#38bdf8]"
            style={{ textShadow: '0 0 30px rgba(56,189,248,0.7)' }}
          >
            ACM
          </span>
          <span className="text-white">STUDENT CHAPTER</span>
        </motion.h1>




        {/* CTA Buttons */}
        <motion.div
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          custom={0.62}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href="#achievements"
            onClick={e => {
              e.preventDefault();
              document.getElementById('achievements')?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="membership-btn-premium"
            style={{ fontSize: '0.75rem' }}
          >
            Explore
          </a>
          <a
            href="/apply"
            className="membership-btn-premium"
            style={{ fontSize: '0.75rem' }}
          >
            Join ACM
          </a>
        </motion.div>

      </div>

      {/* Scroll indicator */}


    </section>
  );
}

