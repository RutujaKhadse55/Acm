import { useEffect, useRef, useState } from 'react';

/**
 * useInView
 * Tracks whether a ref'd element is within the viewport using IntersectionObserver.
 *
 * @param {Object} options
 * @param {number} [options.threshold=0.15] - fraction of element visible before triggering
 * @param {string} [options.rootMargin='0px'] - margin around root
 * @param {boolean} [options.once=true] - if true, stops observing after first intersection
 * @returns {[React.RefObject, boolean]} [ref, inView]
 */
export function useInView({ threshold = 0.15, rootMargin = '0px', once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    // Respect users who've asked for reduced motion: just show content immediately.
    if (typeof window !== 'undefined' && window.matchMedia) {
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (prefersReduced) {
        setInView(true);
        return undefined;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setInView(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setInView(false);
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}