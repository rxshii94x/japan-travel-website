import { useEffect, useRef, useState } from 'react';

export function useScrollProgress() {
  const progressRef = useRef(0);
  const smoothProgress = useRef(0);
  const [currentProgress, setCurrentProgress] = useState(0);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = docHeight > 0 ? scrollTop / docHeight : 0;
      progressRef.current = Math.min(Math.max(progress, 0), 1);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    const loop = () => {
      const target = progressRef.current;
      smoothProgress.current += (target - smoothProgress.current) * 0.08;
      setCurrentProgress(smoothProgress.current);
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return currentProgress;
}
