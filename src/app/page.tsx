"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

/* ─── Data ─── */
const GREETINGS = ["Hello", "Hola", "Bonjour", "Ciao", "வணக்கம்"];

const WORKS = [
  {
    title: "N&Rans",
    year: "2022",
    category: "Interaction & Development",
    image: "/work-1.jpg",
  },
  {
    title: "LangChain",
    year: "2022",
    category: "Interaction & Development",
    image: "/work-2.jpg",
  },
  {
    title: "SalzCorp",
    year: "2023",
    category: "Interaction & Development",
    image: "/work-3.jpg",
  },
  {
    title: "Airnet&co",
    year: "2025",
    category: "Interaction & Development",
    image: "/work-4.jpg",
  },
];

const PORTFOLIO_IMAGES = [
  "/work-1.jpg",
  "/work-2.jpg",
  "/work-3.jpg",
  "/work-4.jpg",
  "/work-1.jpg",
  "/work-2.jpg",
  "/work-3.jpg",
  "/work-4.jpg",
];

const SOCIALS = [
  { label: "WhatsApp", href: "http://wa.me/+779194083" },
  { label: "Facebook", href: "https://web.facebook.com/mhd.usman.mi/" },
  { label: "Twitter", href: "https://x.com/" },
];

/* ─── Loading Screen ─── */
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [fadeOut, setFadeOut] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => {
        if (prev >= GREETINGS.length - 1) {
          clearInterval(interval);
          setTimeout(() => setFadeOut(true), 400);
          setTimeout(() => onComplete(), 900);
          return prev;
        }
        return prev + 1;
      });
    }, 450);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#f5f5f5] transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="text-center">
        <div className="h-20 flex items-center justify-center overflow-hidden relative">
          {GREETINGS.map((g, i) => (
            <span
              key={g}
              className={`absolute text-5xl md:text-7xl font-display font-medium transition-all duration-400 ${
                i === currentIndex
                  ? "opacity-100 translate-y-0"
                  : i < currentIndex
                  ? "opacity-0 -translate-y-12"
                  : "opacity-0 translate-y-12"
              }`}
            >
              {g}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Navigation ─── */
function Navigation({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  return (
    <>
      {/* Top Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 py-5">
        {/* Logo */}
        <a href="#hero" className="text-sm font-medium tracking-wide text-[#666] hover:text-black transition-colors">
          Usman Milas
        </a>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#hero" className="text-sm font-medium text-[#666] hover:text-black transition-colors">Home</a>
          <a href="#about" className="text-sm font-medium text-[#666] hover:text-black transition-colors">About</a>
          <a href="#contact" className="text-sm font-medium text-[#666] hover:text-black transition-colors">Contact</a>
        </div>

        {/* Hamburger Menu Button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="relative w-10 h-10 flex flex-col items-center justify-center gap-[5px] rounded-full bg-[#0a0a0a]"
          aria-label="Toggle menu"
        >
          <span className={`w-4 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
          <span className={`w-4 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
        </button>
      </nav>

      {/* Full-screen Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#f5f5f5] transition-all duration-500 flex flex-col items-center justify-center ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-6">
          {[
            { label: "Home", href: "#hero" },
            { label: "About", href: "#about" },
            { label: "Works", href: "#works" },
            { label: "Contact", href: "#contact" },
          ].map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="text-3xl font-display font-medium text-[#0a0a0a] hover:text-[#666] transition-colors"
              style={{ animationDelay: `${i * 0.1}s` }}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-12 flex flex-col items-center gap-3">
          <span className="text-xs uppercase tracking-[0.2em] text-[#999]">Socials</span>
          <div className="flex gap-6">
            {SOCIALS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" className="text-sm text-[#666] hover:text-black transition-colors">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section id="hero" className="relative min-h-screen bg-[#e8e8e8] flex flex-col">
      {/* Two-part hero layout */}
      <div className="flex-1 flex flex-col justify-center px-6 md:px-10 pt-24 pb-0">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between w-full max-w-7xl mx-auto">
          {/* Left: "Usman" */}
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-display font-medium leading-[0.9] tracking-tight animate-fade-in">
            Usman
          </h1>

          {/* Right: Freelance label + arrow */}
          <div className="flex flex-col items-end gap-4 mb-2 md:mb-4 animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <div className="flex items-center gap-3">
              <span className="text-sm md:text-base font-medium text-[#555]">
                Freelance <br /> Designer & Developer
              </span>
              <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-[#0a0a0a]">
                <path d="M10 30L30 10M30 10H18M30 10V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom: "Milas" + Marquee */}
      <div className="px-6 md:px-10 pb-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-display font-medium leading-[0.9] tracking-tight text-right animate-fade-in" style={{ animationDelay: "0.3s" }}>
            Milas
          </h1>
        </div>
      </div>

      {/* Scrolling marquee strip */}
      <div className="border-t border-[#ccc] py-3 overflow-hidden bg-[#e0e0e0]">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(2)].map((_, setIdx) => (
            <span key={setIdx} className="flex-shrink-0">
              {Array(10).fill("Usman Milas").map((name, i) => (
                <span key={`${setIdx}-${i}`} className="text-2xl md:text-4xl font-display font-medium text-[#0a0a0a]/[0.07] mx-3">
                  {name} —
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Intro Section ─── */
function IntroSection() {
  return (
    <section className="bg-white py-20 md:py-28 px-6 md:px-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20">
        <div>
          <h4 className="text-xl md:text-2xl font-display font-medium leading-relaxed">
            Helping brands to stand out in the{" "}
            <span className="text-[#999]">digital era.</span> Together we will
            set the new status quo. No nonsense, always on the cutting edge.
          </h4>
        </div>
        <div className="flex items-end">
          <p className="text-base md:text-lg text-[#666] leading-relaxed">
            The combination of my passion for design, code & interaction
            positions me in a unique place in the web design world.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ─── Works Section ─── */
function WorksSection() {
  const [hoveredWork, setHoveredWork] = useState<number | null>(null);

  return (
    <section id="works" className="bg-white py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-xs uppercase tracking-[0.2em] text-[#999] mb-12">
          Recent Works
        </div>

        {/* Work list */}
        <div className="space-y-0">
          {WORKS.map((work, i) => (
            <div
              key={work.title}
              className="group relative"
              onMouseEnter={() => setHoveredWork(i)}
              onMouseLeave={() => setHoveredWork(null)}
            >
              <a
                href="#"
                className="flex items-center justify-between py-6 md:py-8 border-t border-[#eee] hover:bg-[#fafafa] transition-colors duration-300 px-2 md:px-4 -mx-2 md:-mx-4"
              >
                <div className="flex items-center gap-4 md:gap-6">
                  <h2 className="text-3xl md:text-5xl lg:text-6xl font-display font-medium group-hover:translate-x-2 transition-transform duration-300">
                    {work.title}
                  </h2>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm text-[#999]">{work.category}</span>
                  <span className="text-sm text-[#999]">{work.year}</span>
                </div>
              </a>

              {/* Hover image preview */}
              <div
                className={`absolute right-0 md:right-10 top-1/2 -translate-y-1/2 w-48 md:w-72 h-32 md:h-48 rounded-xl overflow-hidden pointer-events-none transition-all duration-500 z-10 ${
                  hoveredWork === i
                    ? "opacity-100 scale-100"
                    : "opacity-0 scale-90"
                }`}
              >
                <Image
                  src={work.image}
                  alt={work.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          ))}
          {/* Bottom border for last item */}
          <div className="border-t border-[#eee]" />
        </div>

        {/* CTA button */}
        <div className="mt-10">
          <a
            href="#"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a0a0a] text-white text-sm font-medium rounded-full hover:bg-[#333] transition-colors"
          >
            More Works Coming Soon!
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}

/* ─── About Section ─── */
function AboutSection() {
  return (
    <section id="about" className="bg-white py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="text-xs uppercase tracking-[0.2em] text-[#999] mb-8">
          Who Am I
        </div>
        <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-4xl">
          <span className="font-medium">Usman Milas</span> — Is a freelance
          web <span className="text-[#999]">designer</span> from Sri Lanka with
          over 4 years of hands-on experience, currently pursuing an HND in IT,
          specializing in modern, responsive, and user-focused website design.
        </p>
      </div>
    </section>
  );
}

/* ─── Portfolio Grid Section ─── */
function PortfolioGrid() {
  return (
    <section className="bg-white py-16 md:py-24 px-6 md:px-10">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {PORTFOLIO_IMAGES.map((img, i) => (
            <div
              key={i}
              className="group relative aspect-[4/3] rounded-lg overflow-hidden cursor-pointer"
            >
              <Image
                src={img}
                alt={`Portfolio work ${i + 1}`}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Footer / CTA Section ─── */
function FooterSection() {
  return (
    <section id="contact" className="bg-[#0a0a0a] text-white">
      {/* CTA area */}
      <div className="px-6 md:px-10 py-20 md:py-32">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-8">
            <div>
              <div className="flex items-center gap-4 flex-wrap">
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium leading-none">
                  Let&apos;s work
                </h2>
                <span className="text-sm md:text-base font-medium text-white/40 border border-white/20 px-3 py-1 rounded-full">
                  WordPress
                </span>
              </div>
              <div className="flex items-center gap-4 flex-wrap mt-2">
                <h2 className="text-5xl md:text-7xl lg:text-8xl font-display font-medium leading-none">
                  together
                </h2>
                <span className="text-sm md:text-base font-medium text-white/40 border border-white/20 px-3 py-1 rounded-full">
                  Webflow
                </span>
                <span className="text-sm md:text-base font-medium text-white/40 border border-white/20 px-3 py-1 rounded-full">
                  Wix
                </span>
                <svg width="40" height="40" viewBox="0 0 40 40" fill="none" className="text-white/60 ml-2">
                  <path d="M10 30L30 10M30 10H18M30 10V22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>

          {/* Get in touch button */}
          <div className="mt-12">
            <a
              href="mailto:Webworks456@gmail.com"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#3366ff] text-white text-sm font-medium rounded-full hover:bg-[#2952e6] transition-colors"
            >
              Get In Touch
            </a>
          </div>

          {/* Email */}
          <div className="mt-8">
            <a href="mailto:Webworks456@gmail.com" className="text-sm text-white/50 hover:text-white transition-colors">
              Webworks456@gmail.com
            </a>
          </div>
        </div>
      </div>

      {/* Footer bottom */}
      <div className="border-t border-white/10 px-6 md:px-10 py-8">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
              Start Project
            </div>
            <a
              href="https://www.fiverr.com/webworks_456/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/60 hover:text-white transition-colors"
            >
              Fiverr webworks456
            </a>
          </div>
          <div>
            <div className="text-xs uppercase tracking-[0.2em] text-white/30 mb-2">
              Socials
            </div>
            <div className="flex gap-6">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white/60 hover:text-white transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </div>
          </div>
          <div className="text-xs text-white/20">
            © {new Date().getFullYear()} Usman Milas
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Main Page ─── */
export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  // Lock scroll when menu is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div
        className={`min-h-screen transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <Navigation menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main>
          <HeroSection />
          <IntroSection />
          <WorksSection />
          <AboutSection />
          <PortfolioGrid />
          <FooterSection />
        </main>
      </div>
    </>
  );
}
