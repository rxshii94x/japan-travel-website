import { useEffect, useRef, useState } from 'react';
import { Globe, Instagram, Facebook, Send } from 'lucide-react';

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      ref={navRef}
      className="fixed top-0 left-0 w-full z-50 transition-all duration-500"
      style={{
        backgroundColor: scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
      }}
    >
      <div className="flex items-center justify-between h-[72px] px-[5vw]">
        {/* Left: Wordmark */}
        <div className="flex items-center gap-2 opacity-0 animate-[fadeInDown_0.6s_0.3s_forwards]">
          <Globe size={18} strokeWidth={1} className="text-[#FAFAFA]" />
          <span
            className="text-[#FAFAFA] text-xs font-medium uppercase tracking-[0.12em]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            JAPAN TOURS
          </span>
        </div>

        {/* Right: Nav + Book */}
        <div className="flex items-center gap-8 opacity-0 animate-[fadeInDown_0.6s_0.5s_forwards]">
          <div className="hidden md:flex items-center gap-8">
            {[
              { label: 'About', id: 'about' },
              { label: 'Included', id: 'included' },
              { label: 'Contacts', id: 'contact' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => scrollTo(item.id)}
                className="group relative text-[#FAFAFA] text-xs font-medium uppercase tracking-[0.12em] bg-transparent border-none cursor-pointer"
                style={{ fontFamily: 'Inter, sans-serif' }}
              >
                {item.label}
                <span className="absolute bottom-[-4px] left-0 w-0 h-[1px] bg-[#FAFAFA] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:w-full" />
              </button>
            ))}
          </div>

          <button
            onClick={() => scrollTo('contact')}
            className="text-[#FAFAFA] text-xs font-medium uppercase tracking-[0.12em] border border-[rgba(255,255,255,0.3)] rounded-full px-6 py-2 bg-transparent cursor-pointer transition-all duration-300 hover:bg-[#D4F87A] hover:text-[#0A0A0A] hover:border-[#D4F87A]"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            Book
          </button>
        </div>

        {/* Far right: Social icons (vertical on desktop) */}
        <div className="hidden lg:flex flex-col items-center gap-3 absolute right-[5vw] top-1/2 -translate-y-1/2 opacity-50">
          <Instagram size={18} strokeWidth={1} className="text-[#FAFAFA] cursor-pointer hover:opacity-100 transition-opacity" />
          <Facebook size={18} strokeWidth={1} className="text-[#FAFAFA] cursor-pointer hover:opacity-100 transition-opacity" />
          <Send size={18} strokeWidth={1} className="text-[#FAFAFA] cursor-pointer hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </nav>
  );
}
