import { useEffect, useRef, useState } from 'react';

/**
 * useScrollProgress
 * Returns a 0→1 progress value driven by how far the user has scrolled
 * through a wrapping element's own height (a "scroll-through spacer" pattern).
 *
 * Usage: attach the returned ref to a wrapper div whose total height is taller
 * than the sticky content inside it (see the `.hero-morph__spacer` pattern).
 * As the wrapper scrolls past the viewport, progress climbs from 0 to 1.
 *
 * @param {Object} options
 * @param {number} [options.range=1] - fraction of the wrapper's scrollable
 *   distance over which progress should resolve from 0 to 1. Lower values
 *   make the morph complete earlier in the scroll.
 * @returns {[React.RefObject, number]} [ref, progress]
 */
export function useScrollProgress({ range = 1 } = {}) {
    const ref = useRef(null);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const el = ref.current;
        if (!el) return undefined;

        let ticking = false;

        const compute = () => {
            ticking = false;
            const rect = el.getBoundingClientRect();
            const viewportH = window.innerHeight || document.documentElement.clientHeight;

            // Total distance the element travels through the viewport.
            const totalScrollable = rect.height - viewportH;
            if (totalScrollable <= 0) {
                setProgress(0);
                return;
            }

            // How far we've scrolled into the element (0 at top entering view, totalScrollable at bottom).
            const scrolled = -rect.top;
            const clamped = Math.min(Math.max(scrolled, 0), totalScrollable);

            const effectiveRange = totalScrollable * Math.max(range, 0.0001);
            const p = Math.min(clamped / effectiveRange, 1);

            setProgress(p);
        };

        const onScroll = () => {
            if (!ticking) {
                ticking = true;
                window.requestAnimationFrame(compute);
            }
        };

        compute();
        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onScroll);
        return () => {
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onScroll);
        };
    }, [range]);

    return [ref, progress];
}