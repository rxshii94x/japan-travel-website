import { useEffect, useRef, useState } from 'react';
import { MapPin, Plane, Bus, Hotel } from 'lucide-react';

const includedItems = [
  {
    icon: MapPin,
    title: 'GUIDES',
    body: '2 awesome guides who know everything about Japan!',
  },
  {
    icon: Plane,
    title: 'FLIGHTS',
    body: 'Routes: Moscow \u2014 Osaka, Tokyo \u2014 Moscow',
  },
  {
    icon: Bus,
    title: 'TRANSFERS',
    body: 'From the airport to the hotels',
  },
  {
    icon: Hotel,
    title: 'HOTELS',
    body: 'Comfortable accommodation, 2 people per room (breakfasts included)',
  },
];

function IncludedCard({
  item,
  index,
}: {
  item: (typeof includedItems)[0];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const Icon = item.icon;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    if (cardRef.current) observer.observe(cardRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={cardRef}
      className="group relative rounded-2xl p-10 transition-all duration-300 hover:-translate-y-1"
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        backdropFilter: 'blur(12px)',
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.6s cubic-bezier(0.16,1,0.3,1) ${index * 0.15}s`,
        transitionProperty: 'opacity, transform, border-color, box-shadow',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = '#D4F87A';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)';
      }}
    >
      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(212,248,122,0.08) 0%, transparent 70%)',
        }}
      />
      {/* Icon */}
      <div className="mb-6 transition-transform duration-300 group-hover:scale-110" style={{ transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)' }}>
        <Icon size={20} className="text-[#D4F87A]" strokeWidth={1.5} />
      </div>
      {/* Title */}
      <h3
        className="text-[#FAFAFA] text-sm font-medium uppercase tracking-[0.12em] mb-4"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {item.title}
      </h3>
      {/* Body */}
      <p
        className="text-[#FAFAFA] text-base leading-[1.6]"
        style={{ fontFamily: 'Inter, sans-serif' }}
      >
        {item.body}
      </p>
    </div>
  );
}

export default function Included() {
  return (
    <section id="included" className="w-full bg-[#0A0A0A]" style={{ padding: '120px 5vw' }}>
      {/* Section heading */}
      <div className="flex items-center gap-6 mb-16 max-w-[1200px] mx-auto">
        <h2
          className="text-[#FAFAFA] text-5xl md:text-6xl font-bold uppercase tracking-[0.08em]"
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          WHAT&apos;S INCLUDED
        </h2>
        <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.15)]" />
      </div>

      {/* 2x2 Grid */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {includedItems.map((item, i) => (
          <IncludedCard key={i} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
