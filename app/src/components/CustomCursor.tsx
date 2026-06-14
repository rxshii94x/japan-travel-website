import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * CustomCursor — Two-state cursor with smooth lerp following.
 * Default: 8px solid dot. Hover (interactive elements): 32px outlined circle.
 * Uses mix-blend-mode: difference for universal visibility.
 * Hidden on mobile (< 768px).
 */
export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const mousePos = useRef({ x: -100, y: -100 });
  const currentPos = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);
  const isMobileRef = useRef(true);

  // Check if we should show the custom cursor (desktop only)
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 768;
      isMobileRef.current = mobile;
      if (mobile) {
        setIsVisible(false);
        document.body.classList.remove('custom-cursor-active');
      } else {
        document.body.classList.add('custom-cursor-active');
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => {
      window.removeEventListener('resize', checkMobile);
      document.body.classList.remove('custom-cursor-active');
    };
  }, []);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!isMobileRef.current && !isVisible) {
        setIsVisible(true);
      }
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseEnter = () => {
      if (!isMobileRef.current) {
        setIsVisible(true);
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [isVisible]);

  // Detect hover on interactive elements
  const handleInteractiveHover = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const interactive = target.closest(
      'a, button, [role="button"], [data-interactive="true"], input, textarea, select, label'
    );
    setIsHovering(!!interactive);
  }, []);

  useEffect(() => {
    document.addEventListener('mouseover', handleInteractiveHover, { passive: true });
    return () => document.removeEventListener('mouseover', handleInteractiveHover);
  }, [handleInteractiveHover]);

  // RAF loop for smooth lerp following
  useEffect(() => {
    const LERP = 0.15;

    const animate = () => {
      const dx = mousePos.current.x - currentPos.current.x;
      const dy = mousePos.current.y - currentPos.current.y;

      currentPos.current.x += dx * LERP;
      currentPos.current.y += dy * LERP;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${currentPos.current.x}px, ${currentPos.current.y}px, 0)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  // Don't render on mobile
  if (typeof window !== 'undefined' && window.innerWidth < 768) {
    return null;
  }

  const size = isHovering ? 32 : 8;

  return (
    <div
      ref={dotRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: `${size}px`,
        height: `${size}px`,
        marginLeft: `${-size / 2}px`,
        marginTop: `${-size / 2}px`,
        borderRadius: '50%',
        backgroundColor: isHovering ? 'transparent' : '#FAFAFA',
        border: isHovering ? '1px solid #FAFAFA' : 'none',
        pointerEvents: 'none',
        zIndex: 9999,
        mixBlendMode: 'difference',
        opacity: isVisible ? 1 : 0,
        transition: 'width 0.3s cubic-bezier(0.16,1,0.3,1), height 0.3s cubic-bezier(0.16,1,0.3,1), margin 0.3s cubic-bezier(0.16,1,0.3,1), background-color 0.3s ease, border 0.3s ease, opacity 0.2s ease',
        willChange: 'transform',
      }}
    />
  );
}
