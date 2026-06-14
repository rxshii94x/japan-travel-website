import Navigation from './sections/Navigation';
import Hero from './sections/Hero';
import VideoStrip from './sections/VideoStrip';
import About from './sections/About';
import Included from './sections/Included';
import Contact from './sections/Contact';
import Footer from './sections/Footer';
import CustomCursor from './components/CustomCursor';
import { useLenisScroll } from './hooks/useLenisScroll';

export default function App() {
  // Initialize Lenis smooth scroll at the root layout level
  useLenisScroll();

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      <CustomCursor />
      <Navigation />
      <Hero />
      <VideoStrip />
      <About />
      <Included />
      <Contact />
      <Footer />
    </div>
  );
}
