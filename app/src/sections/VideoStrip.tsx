import { useEffect, useRef, useState } from 'react';

const cards = [
  { video: '/videos/video-kyoto-pagoda.mp4', caption: '3 cities in Japan', rotation: -2 },
  { video: '/videos/video-rice-fields.mp4', caption: '10 days', rotation: 3 },
  { video: '/videos/video-red-shrine.mp4', caption: 'gigabytes of photos', rotation: -3 },
  { video: '/videos/video-ramen-shop.mp4', caption: 'eat ramen', rotation: 2 },
  { video: '/videos/video-shinjuku.mp4', caption: 'enjoy the vibe', rotation: -1 },
];

export default function VideoStrip() {
  const stripRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (stripRef.current) observer.observe(stripRef.current);
    return () => observer.disconnect();
  }, []);

  // Scroll-linked horizontal parallax at 0.4x scroll speed
  useEffect(() => {
    const handleScroll = () => {
      if (!stripRef.current) return;
      const drift = window.scrollY * 0.4;
      stripRef.current.style.transform = `translateX(${-drift}px)`;
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="w-full bg-[#0A0A0A] py-10 overflow-hidden">
      <div
        ref={stripRef}
        className="flex gap-6 px-[5vw]"
        style={{ willChange: 'transform' }}
      >
        {cards.map((card, i) => (
          <PolaroidCard
            key={i}
            card={card}
            index={i}
            isInView={isInView}
          />
        ))}
      </div>
    </section>
  );
}

function PolaroidCard({
  card,
  index,
  isInView,
}: {
  card: (typeof cards)[0];
  index: number;
  isInView: boolean;
}) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="flex-shrink-0 relative cursor-pointer"
      data-interactive="true"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: '160px',
        height: '200px',
        transform: `rotate(${card.rotation}deg) translateY(${isHovered ? -8 : 0}px) scale(${isHovered ? 1.02 : 1})`,
        opacity: isInView ? 1 : 0,
        translate: isInView ? '0 0' : '0 40px',
        transition: `all 0.4s cubic-bezier(0.16,1,0.3,1) ${index * 0.1}s`,
      }}
    >
      {/* Sakura pink warm glow on hover */}
      <div
        className="absolute inset-0 rounded-lg transition-opacity duration-300 pointer-events-none"
        style={{
          opacity: isHovered ? 1 : 0,
          boxShadow: '0 20px 40px rgba(255, 184, 197, 0.2)',
          transform: 'scale(1.05)',
        }}
      />
      {/* Card */}
      <div
        className="w-full h-full bg-[#0A0A0A] border-4 border-white rounded-lg overflow-hidden transition-shadow duration-400"
        style={{
          boxShadow: isHovered
            ? '0 20px 40px rgba(255, 184, 197, 0.2)'
            : '0 4px 12px rgba(0, 0, 0, 0.3)',
          transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        }}
      >
        <video
          src={card.video}
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        />
      </div>
      {/* Caption */}
      <span
        className="absolute bottom-[-24px] left-0 text-[11px] text-[#888888]"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {card.caption}
      </span>
    </div>
  );
}
