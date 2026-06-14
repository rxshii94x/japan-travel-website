import { useRef, useEffect, useState, useCallback, Suspense } from 'react';
import HeroCanvasR3F from './HeroCanvas';

export default function Hero() {
  const heroRef = useRef<HTMLDivElement>(null);
  const [heroProgress, setHeroProgress] = useState(0);
  const rafRef = useRef<number>(0);
  const progressRef = useRef(0);

  const updateProgress = useCallback(() => {
    if (!heroRef.current) return;
    const rect = heroRef.current.getBoundingClientRect();
    const heroHeight = rect.height;
    // Offset: ["start start", "end start"]
    // progress 0 = hero top at viewport top, progress 1 = hero bottom at viewport top
    const raw = -rect.top / heroHeight;
    progressRef.current = Math.min(Math.max(raw, 0), 1);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      updateProgress();
      setHeroProgress(progressRef.current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    updateProgress();
    setHeroProgress(progressRef.current);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, [updateProgress]);

  // Pixel translations — multipliers define how fast each layer moves relative to scroll
  // Mountain (0.3x) = slowest, anchors the scene
  // JAPAN (0.5x) = mid-depth
  // Kimono = fixed, no transform
  const vh = typeof window !== 'undefined' ? window.innerHeight : 1000;
  const mountainY = heroProgress * vh * 0.3;
  const japanY = heroProgress * vh * 0.5;

  return (
    <section
      ref={heroRef}
      className="relative w-full overflow-hidden"
      style={{ height: '100vh' }}
    >
      {/* Z-0: Background plane — Mountain landscape with WebGL dissolve shader */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          zIndex: 0,
          transform: `translateY(${mountainY}px)`,
          willChange: 'transform',
        }}
      >
        <Suspense
          fallback={
            <div
              className="w-full h-full bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/hero-mountains.jpg)' }}
            />
          }
        >
          <HeroCanvasR3F scrollProgress={heroProgress} />
        </Suspense>
      </div>

      {/* Z-1: Mid-ground plane — "JAPAN" ghost typography */}
      <div
        className="absolute bottom-[15vh] left-0 w-full pointer-events-none select-none"
        style={{
          zIndex: 1,
          transform: `translateY(${japanY}px)`,
          willChange: 'transform',
        }}
      >
        <h1
          className="text-center leading-[0.8] font-display font-bold uppercase tracking-[0.08em]"
          style={{
            fontSize: '25vw',
            color: 'rgba(250,250,250,0.08)',
          }}
        >
          JAPAN
        </h1>
      </div>

      {/* Z-2: Foreground plane — Kimono figure (visual anchor, no transform) */}
      <div
        className="absolute right-[5vw] bottom-0 pointer-events-none"
        style={{
          zIndex: 2,
          height: '85vh',
        }}
      >
        <img
          src="/images/hero-kimono-figure.png"
          alt="Woman in kimono gazing at the valley"
          className="h-full w-auto object-contain"
          style={{ maxHeight: '85vh' }}
        />
      </div>
    </section>
  );
}
