import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

/**
 * useLenisScroll — Initializes Lenis smooth scrolling at the app root level.
 * 
 * Config:
 * - duration: 1.2 (smooth but responsive)
 * - easing: exponential decay (near-native feel)
 * - smoothWheel: true (desktop mouse/trackpad)
 * - smoothTouch: false (mobile keeps native scroll for performance)
 * 
 * Properly cleans up the Lenis instance on unmount.
 * Compatible with native scroll event listeners (used by Hero, VideoStrip, etc.)
 */
export function useLenisScroll() {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
    });

    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return lenisRef;
}
