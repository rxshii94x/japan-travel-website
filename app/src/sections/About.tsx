import { useEffect, useRef, useState } from 'react';

const timelineData = [
  {
    label: 'Days 1\u20133 \u2014 Osaka',
    photos: ['/images/about-osaka-castle.jpg', '/images/about-osaka-skyline.jpg'],
  },
  {
    label: 'Days 4\u20136 \u2014 Kyoto',
    photos: ['/images/about-kyoto-pagoda.jpg', '/images/about-kyoto-shrine.jpg'],
  },
  {
    label: 'Days 7\u201310 \u2014 Tokyo',
    photos: ['/images/about-tokyo-shibuya.jpg', '/images/about-tokyo-street.jpg'],
  },
];

function TimelineNode({
  data,
  index,
}: {
  data: (typeof timelineData)[0];
  index: number;
}) {
  const nodeRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    if (nodeRef.current) observer.observe(nodeRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={nodeRef}
      className="relative flex items-start gap-6"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(40px)',
        transition: `all 0.8s cubic-bezier(0.16,1,0.3,1) ${index * 0.2}s`,
      }}
    >
      {/* Node dot */}
      <div className="relative flex flex-col items-center">
        <div className="w-3 h-3 rounded-full bg-[#D4F87A] z-10 flex-shrink-0" />
        {index < timelineData.length - 1 && (
          <div className="w-[1px] h-[120px] bg-[rgba(255,255,255,0.2)]" />
        )}
      </div>
      {/* Content */}
      <div className="pb-10">
        <span
          className="text-[#FAFAFA] text-sm font-medium uppercase tracking-[0.08em] block mb-4"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          {data.label}
        </span>
        {/* Photo cluster */}
        <div className="flex gap-3 group">
          {data.photos.map((photo, pi) => (
            <div
              key={pi}
              className="relative overflow-hidden rounded shadow-lg transition-all duration-300"
              style={{
                width: '140px',
                height: '100px',
                border: '4px solid white',
                transform: `rotate(${pi === 0 ? -3 : 3}deg)`,
                transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
              }}
            >
              <div
                className="w-full h-full transition-transform duration-300 group-hover:scale-105"
                style={{
                  transform: `rotate(${pi === 0 ? -3 : 3}deg) scale(1.1)`,
                }}
              >
                <img
                  src={photo}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function About() {
  return (
    <section id="about" className="w-full bg-[#0A0A0A]" style={{ padding: '120px 5vw' }}>
      {/* Section heading with hairline rules */}
      <div className="flex items-center justify-center gap-6 mb-20">
        <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.15)]" />
        <h2
          className="text-[#FAFAFA] text-5xl md:text-6xl font-bold uppercase tracking-[0.08em] text-center flex-shrink-0"
          style={{ fontFamily: 'Oswald, sans-serif' }}
        >
          ABOUT THE TOUR
        </h2>
        <div className="flex-1 h-[1px] bg-[rgba(255,255,255,0.15)]" />
      </div>

      {/* Two-column layout */}
      <div className="max-w-[1200px] mx-auto grid grid-cols-1 lg:grid-cols-[45%_55%] gap-20">
        {/* Left column: text */}
        <div className="space-y-8">
          <p
            className="text-[#FAFAFA] text-lg leading-[1.7]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            We&apos;ve planned a simple and convenient 10-day itinerary for your trip to Japan.
            You&apos;ll visit three cities:{' '}
            <span className="text-[#D4F87A]">Osaka, Kyoto, and Tokyo</span>.
          </p>
          <p
            className="text-[#FAFAFA] text-lg leading-[1.7]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            No need to worry about routes, schedules, or finding places — everything is already
            organized. We&apos;ll show you where to go, what to see, and where to eat, so you can
            simply <span className="text-[#D4F87A]">enjoy the journey</span>.
          </p>
        </div>

        {/* Right column: timeline */}
        <div className="flex justify-center lg:justify-start">
          <div className="relative">
            {/* Vertical hairline */}
            <div className="absolute left-[5px] top-[6px] bottom-[6px] w-[1px] bg-[rgba(255,255,255,0.2)]" />
            {timelineData.map((item, i) => (
              <TimelineNode key={i} data={item} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
