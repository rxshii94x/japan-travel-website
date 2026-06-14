import { Globe, Instagram, Facebook, Send } from 'lucide-react';

export default function Footer() {
  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <footer className="w-full bg-[#0A0A0A] border-t border-[rgba(255,255,255,0.08)]" style={{ padding: '60px 5vw' }}>
      <div className="max-w-[1200px] mx-auto">
        {/* Nav links */}
        <div className="flex items-center justify-center gap-8 mb-12">
          {[
            { label: 'Home', id: 'top' },
            { label: 'About', id: 'about' },
            { label: 'Included', id: 'included' },
            { label: 'Contacts', id: 'contact' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (item.id === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
                else scrollTo(item.id);
              }}
              className="text-[#888888] text-xs font-medium uppercase tracking-[0.12em] bg-transparent border-none cursor-pointer transition-colors duration-300 hover:text-[#FAFAFA]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Bottom row */}
        <div className="flex items-center justify-between">
          {/* Wordmark */}
          <div className="flex items-center gap-2">
            <Globe size={18} strokeWidth={1} className="text-[#FAFAFA]" />
            <span
              className="text-[#FAFAFA] text-xs font-medium uppercase tracking-[0.12em]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              JAPAN TOURS
            </span>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            <Instagram
              size={20}
              strokeWidth={1}
              className="text-[#FAFAFA] opacity-40 cursor-pointer hover:opacity-100 transition-opacity"
            />
            <Facebook
              size={20}
              strokeWidth={1}
              className="text-[#FAFAFA] opacity-40 cursor-pointer hover:opacity-100 transition-opacity"
            />
            <Send
              size={20}
              strokeWidth={1}
              className="text-[#FAFAFA] opacity-40 cursor-pointer hover:opacity-100 transition-opacity"
            />
          </div>
        </div>

        {/* Copyright */}
        <p
          className="text-[#888888] text-[11px] text-center mt-10"
          style={{ fontFamily: 'Inter, sans-serif' }}
        >
          &copy; 2025 JAPAN TOURS. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
