import { useEffect, useRef, useState } from 'react';

export default function Contact() {
  const formRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', comment: '' });

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
    if (formRef.current) observer.observe(formRef.current);
    return () => observer.disconnect();
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <section id="contact" className="relative w-full min-h-[80vh] overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: 'url(/images/contact-bg.jpg)' }}
      />
      {/* Dark overlay */}
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(10,10,10,0.4)' }} />

      {/* Content */}
      <div className="relative z-10 flex items-center min-h-[80vh] px-[5vw] py-20">
        <div
          ref={formRef}
          className="w-full max-w-[480px] rounded-[20px] p-10 md:p-[60px]"
          style={{
            background: 'rgba(20,20,20,0.5)',
            backdropFilter: 'blur(24px)',
            WebkitBackdropFilter: 'blur(24px)',
            border: '1px solid rgba(255,255,255,0.1)',
            opacity: visible ? 1 : 0,
            transform: visible ? 'translateX(0)' : 'translateX(-60px)',
            transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Heading */}
          <h3
            className="text-[#FAFAFA] text-2xl md:text-[28px] font-light italic leading-[1.4] mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif' }}
          >
            Want to join us, but still have questions?
          </h3>
          <span
            className="text-[#888888] text-xs font-medium uppercase tracking-[0.12em] block mb-10"
            style={{ fontFamily: 'Inter, sans-serif' }}
          >
            LEAVE A REQUEST
          </span>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Name */}
            <div className="relative">
              <input
                type="text"
                placeholder="Your name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-transparent text-[#FAFAFA] text-base py-4 px-0 border-0 border-b border-[rgba(255,255,255,0.2)] outline-none placeholder:text-[#888888] focus:border-[#D4F87A] transition-colors duration-300"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            {/* Phone */}
            <div className="relative">
              <input
                type="tel"
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full bg-transparent text-[#FAFAFA] text-base py-4 px-0 border-0 border-b border-[rgba(255,255,255,0.2)] outline-none placeholder:text-[#888888] focus:border-[#D4F87A] transition-colors duration-300"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>
            {/* Comment */}
            <div className="relative">
              <textarea
                placeholder="Comment"
                rows={4}
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="w-full bg-transparent text-[#FAFAFA] text-base py-4 px-0 border-0 border-b border-[rgba(255,255,255,0.2)] outline-none placeholder:text-[#888888] focus:border-[#D4F87A] transition-colors duration-300 resize-none"
                style={{ fontFamily: 'Inter, sans-serif' }}
              />
            </div>

            {/* Submit button */}
            <button
              type="submit"
              className="w-full py-4 px-6 rounded-full bg-[#FAFAFA] text-[#0A0A0A] text-sm font-medium uppercase tracking-[0.12em] border-none cursor-pointer transition-all duration-300 hover:bg-[#D4F87A]"
              style={{ fontFamily: 'Inter, sans-serif' }}
            >
              SEND
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
