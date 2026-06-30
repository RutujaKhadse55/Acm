import { useCallback, useRef } from 'react';

/**
 * useTilt
 * Gives an element a subtle 3D tilt that follows the cursor on hover,
 * plus a CSS custom property pair (--mx, --my) you can use to drive a
 * pointer-following glow/spotlight in your stylesheet.
 *
 * @param {number} [maxTilt=8] - maximum rotation in degrees
 * @returns {{ ref: React.RefObject, onMouseMove: Function, onMouseLeave: Function }}
 */
export function useTilt(maxTilt = 8) {
    const ref = useRef(null);

    const onMouseMove = useCallback(
        (e) => {
            const el = ref.current;
            if (!el) return;
            const rect = el.getBoundingClientRect();
            const px = (e.clientX - rect.left) / rect.width; // 0..1
            const py = (e.clientY - rect.top) / rect.height; // 0..1

            const rotateY = (px - 0.5) * 2 * maxTilt;
            const rotateX = (0.5 - py) * 2 * maxTilt;

            el.style.transform = `perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-4px)`;
            el.style.setProperty('--mx', `${px * 100}%`);
            el.style.setProperty('--my', `${py * 100}%`);
        },
        [maxTilt]
    );

    const onMouseLeave = useCallback(() => {
        const el = ref.current;
        if (!el) return;
        el.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0)';
        el.style.setProperty('--mx', '50%');
        el.style.setProperty('--my', '50%');
    }, []);

    return { ref, onMouseMove, onMouseLeave };
}