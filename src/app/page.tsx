"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";

/* ─── Data ─── */
const GREETINGS = [
  { text: "Hello", lang: "English" },
  { text: "Hola", lang: "Spanish" },
  { text: "Bonjour", lang: "French" },
  { text: "Ciao", lang: "Italian" },
  { text: "வணக்கம்", lang: "Tamil" },
];

const NAV_LINKS = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Works", href: "#works" },
  { label: "Services", href: "#services" },
  { label: "Contact", href: "#contact" },
];

const WORKS = [
  {
    title: "N&Rans",
    category: "E-Commerce Design",
    year: "2022",
    image: "/work-1.jpg",
    description: "Premium fashion e-commerce platform with immersive product showcases and seamless checkout flow.",
  },
  {
    title: "LangChain",
    category: "Web Application",
    year: "2023",
    image: "/work-2.jpg",
    description: "AI-powered web application with dynamic interfaces and real-time data visualization dashboards.",
  },
  {
    title: "SalzCorp",
    category: "Corporate Website",
    year: "2023",
    image: "/work-3.jpg",
    description: "Corporate branding website with modern design language, animations, and responsive layouts.",
  },
  {
    title: "Airnet&Co",
    category: "Digital Agency",
    year: "2025",
    image: "/work-4.jpg",
    description: "Digital agency portfolio with creative transitions, 3D elements, and interactive storytelling.",
  },
];

const SERVICES = [
  {
    icon: "◆",
    title: "Website Design",
    description:
      "Custom, pixel-perfect websites crafted with modern design principles. From concept to launch, every detail is meticulously designed to elevate your brand's digital presence.",
  },
  {
    icon: "◇",
    title: "Web Development",
    description:
      "Clean, performant code that brings designs to life. Expert in Webflow, WordPress, and custom development with responsive layouts that work flawlessly across all devices.",
  },
  {
    icon: "○",
    title: "Brand Identity",
    description:
      "Cohesive visual identities that make brands memorable. Logo design, color systems, typography, and brand guidelines that communicate your unique story effectively.",
  },
  {
    icon: "△",
    title: "Content & Campaigning",
    description:
      "Strategic content marketing and digital campaigns that drive engagement. Data-driven approaches combined with creative storytelling to grow your audience organically.",
  },
];

const PLATFORMS = ["Webflow", "WordPress", "Wix", "Next.js"];
const SOCIALS = [
  { label: "WhatsApp", href: "http://wa.me/+779194083" },
  { label: "Facebook", href: "https://web.facebook.com/mhd.usman.mi/" },
  { label: "X (Twitter)", href: "https://x.com/" },
  { label: "Fiverr", href: "https://www.fiverr.com/webworks_456/" },
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
          setTimeout(() => onComplete(), 1000);
          return prev;
        }
        return prev + 1;
      });
    }, 500);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-[#0a0a0a] transition-opacity duration-500 ${
        fadeOut ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
    >
      <div className="text-center">
        <div className="h-20 flex items-center justify-center overflow-hidden">
          {GREETINGS.map((g, i) => (
            <span
              key={g.lang}
              className={`absolute text-5xl md:text-7xl font-display font-medium transition-all duration-400 ${
                i === currentIndex
                  ? "opacity-100 translate-y-0"
                  : i < currentIndex
                  ? "opacity-0 -translate-y-10"
                  : "opacity-0 translate-y-10"
              }`}
              style={{ color: i === currentIndex ? "#e8a838" : "#555" }}
            >
              {g.text}
            </span>
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-6 tracking-widest uppercase">
          {GREETINGS[currentIndex]?.lang}
        </p>
      </div>
    </div>
  );
}

/* ─── Side Navigation (Desktop) ─── */
function SideNav({ activeSection }: { activeSection: string }) {
  return (
    <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-[260px] flex-col justify-between p-8 border-r border-white/[0.06] z-50 bg-[#0a0a0a]/80 backdrop-blur-md">
      <div>
        <a href="#hero" className="flex items-center gap-2 mb-12 group">
          <div className="w-8 h-8 rounded-md bg-amber flex items-center justify-center text-charcoal font-bold text-sm">
            U
          </div>
          <span className="font-display font-medium text-lg tracking-tight">
            Usman<span className="text-amber">.</span>
          </span>
        </a>

        <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-4">
          Navigation
        </div>
        <div className="w-8 h-px bg-white/10 mb-6" />

        <nav className="flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`relative py-2.5 px-3 rounded-lg text-sm font-medium transition-all duration-300 group ${
                activeSection === link.href.slice(1)
                  ? "text-amber bg-amber/[0.08]"
                  : "text-white/60 hover:text-white hover:bg-white/[0.04]"
              }`}
            >
              {link.label}
              {activeSection === link.href.slice(1) && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-amber rounded-r-full" />
              )}
            </a>
          ))}
        </nav>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Start a Project
          </div>
          <a
            href="https://www.fiverr.com/webworks_456/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-white/70 hover:text-amber transition-colors"
          >
            Fiverr.com/webworks456
          </a>
        </div>
        <div>
          <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
            Socials
          </div>
          <div className="flex flex-col gap-1.5">
            {SOCIALS.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-white/50 hover:text-amber transition-colors"
              >
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

/* ─── Mobile Navigation ─── */
function MobileNav({ activeSection }: { activeSection: string }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-5 py-4 bg-[#0a0a0a]/80 backdrop-blur-md border-b border-white/[0.06]">
        <a href="#hero" className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-md bg-amber flex items-center justify-center text-charcoal font-bold text-xs">
            U
          </div>
          <span className="font-display font-medium tracking-tight">
            Usman<span className="text-amber">.</span>
          </span>
        </a>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="relative w-10 h-10 flex flex-col items-center justify-center gap-1.5"
          aria-label="Toggle menu"
        >
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "rotate-45 translate-y-2" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "opacity-0" : ""
            }`}
          />
          <span
            className={`w-6 h-0.5 bg-white transition-all duration-300 ${
              isOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          />
        </button>
      </div>

      {/* Mobile menu overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-xl transition-all duration-500 flex flex-col items-center justify-center ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <nav className="flex flex-col items-center gap-4 stagger-children">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={`text-2xl font-display font-medium transition-colors ${
                activeSection === link.href.slice(1) ? "text-amber" : "text-white/60 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="mt-12 flex gap-6">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/40 hover:text-amber transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

/* ─── Hero Section ─── */
function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex flex-col justify-between overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/hero-bg.jpg"
          alt="Hero background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/60 via-[#0a0a0a]/40 to-[#0a0a0a]" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex-1 flex flex-col justify-center pt-20 lg:pt-0 px-6 lg:px-12">
        <div className="max-w-4xl">
          <div className="flex items-center gap-3 mb-6 animate-fade-in-up">
            <div className="w-10 h-10 rounded-full bg-amber/20 flex items-center justify-center">
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-amber"
              >
                <path
                  d="M5 15L15 5M15 5H7M15 5V13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-sm md:text-base font-medium text-white/80">
              Freelance Designer & Developer
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl xl:text-8xl font-display font-medium leading-[0.95] tracking-tight animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
            Usman
            <br />
            <span className="text-gradient">Milas</span>
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/50 max-w-lg animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            Helping brands stand out in the digital era with modern, responsive, and user-focused design.
          </p>
        </div>
      </div>

      {/* Marquee */}
      <div className="relative z-10 border-t border-white/[0.06] py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(2)].map((_, setIdx) => (
            <span key={setIdx} className="flex-shrink-0">
              {Array(8)
                .fill("Usman Milas")
                .map((name, i) => (
                  <span
                    key={`${setIdx}-${i}`}
                    className="text-4xl md:text-6xl font-display font-medium text-white/[0.06] mx-4"
                  >
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

/* ─── About Section ─── */
function AboutSection() {
  return (
    <section id="about" className="py-24 md:py-32 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-px bg-amber" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                About
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium leading-tight">
              Helping brands to stand out in the{" "}
              <span className="text-gradient">digital era.</span>
            </h2>
          </div>

          {/* Right */}
          <div className="flex flex-col justify-center">
            <p className="text-lg text-white/60 leading-relaxed mb-8">
              The combination of my passion for design, code & interaction
              positions me in a unique place in the web design world. Together
              we will set the new status quo — no nonsense, always on the
              cutting edge.
            </p>
            <p className="text-lg text-white/60 leading-relaxed mb-10">
              Usman Milas is a freelance web designer from Sri Lanka with over 4
              years of hands-on experience, currently pursuing an HND in IT,
              specializing in modern, responsive, and user-focused website
              design.
            </p>
            <div className="flex flex-wrap gap-3">
              {PLATFORMS.map((p) => (
                <span
                  key={p}
                  className="px-4 py-2 rounded-full text-sm font-medium bg-white/[0.05] border border-white/[0.08] text-white/70 hover:border-amber/30 hover:text-amber transition-all cursor-default"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-20">
          {[
            { value: "4+", label: "Years Experience" },
            { value: "50+", label: "Projects Completed" },
            { value: "30+", label: "Happy Clients" },
            { value: "100%", label: "Client Satisfaction" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass rounded-2xl p-6 text-center hover-lift"
            >
              <div className="text-3xl md:text-4xl font-display font-medium text-amber">
                {stat.value}
              </div>
              <div className="text-sm text-white/40 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Works Section ─── */
function WorksSection() {
  const [hoveredWork, setHoveredWork] = useState<number | null>(null);

  return (
    <section id="works" className="py-24 md:py-32 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-amber" />
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Recent Works
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-16">
          Selected <span className="text-gradient">Projects</span>
        </h2>

        {/* Work items */}
        <div className="space-y-2">
          {WORKS.map((work, i) => (
            <div
              key={work.title}
              className="group relative"
              onMouseEnter={() => setHoveredWork(i)}
              onMouseLeave={() => setHoveredWork(null)}
            >
              <a
                href="#"
                className="block py-8 px-6 md:px-8 rounded-2xl border border-white/[0.04] hover:border-amber/20 transition-all duration-500 hover:bg-white/[0.02]"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-6">
                    <span className="text-5xl md:text-6xl font-display font-medium text-white/[0.06] group-hover:text-amber/20 transition-colors duration-500">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <h3 className="text-2xl md:text-3xl font-display font-medium group-hover:text-amber transition-colors duration-300">
                        {work.title}
                      </h3>
                      <p className="text-sm text-white/40 mt-1">
                        {work.category}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-sm text-white/30">{work.year}</span>
                    <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-amber group-hover:bg-amber/10 transition-all duration-300">
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        className="text-white/40 group-hover:text-amber transition-colors"
                      >
                        <path
                          d="M4 12L12 4M12 4H6M12 4V10"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover image preview */}
                <div
                  className={`absolute right-8 top-1/2 -translate-y-1/2 w-64 h-40 rounded-xl overflow-hidden pointer-events-none transition-all duration-500 ${
                    hoveredWork === i
                      ? "opacity-100 scale-100 translate-x-0"
                      : "opacity-0 scale-95 translate-x-4"
                  }`}
                >
                  <Image
                    src={work.image}
                    alt={work.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </a>
            </div>
          ))}
        </div>

        {/* Work gallery grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16">
          {WORKS.map((work) => (
            <div
              key={`gallery-${work.title}`}
              className="group relative aspect-video rounded-2xl overflow-hidden hover-lift cursor-pointer"
            >
              <Image
                src={work.image}
                alt={work.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h3 className="text-xl font-display font-medium">
                  {work.title}
                </h3>
                <p className="text-sm text-white/50 mt-1">
                  {work.category} — {work.year}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Services Section ─── */
function ServicesSection() {
  return (
    <section id="services" className="py-24 md:py-32 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-px bg-amber" />
          <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Services
          </span>
        </div>
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-medium mb-16">
          What I <span className="text-gradient">Do</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map((service) => (
            <div
              key={service.title}
              className="glass rounded-2xl p-8 hover-lift group cursor-default"
            >
              <div className="text-3xl text-amber/40 group-hover:text-amber transition-colors duration-300 mb-6">
                {service.icon}
              </div>
              <h3 className="text-xl font-display font-medium mb-3 group-hover:text-amber transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-white/40 leading-relaxed text-sm">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact Section ─── */
function ContactSection() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 md:py-32 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-px bg-amber" />
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                Get In Touch
              </span>
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-medium leading-tight mb-8">
              Let&apos;s work
              <br />
              <span className="text-gradient">together</span>
            </h2>
            <p className="text-lg text-white/50 mb-10 max-w-md">
              Have a project in mind? Let&apos;s create something extraordinary
              together. Reach out and let&apos;s start the conversation.
            </p>

            <div className="space-y-6">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Email
                </div>
                <a
                  href="mailto:Webworks456@gmail.com"
                  className="text-white/70 hover:text-amber transition-colors"
                >
                  Webworks456@gmail.com
                </a>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
                  Hire Me
                </div>
                <a
                  href="https://www.fiverr.com/webworks_456/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white/70 hover:text-amber transition-colors"
                >
                  Fiverr.com/webworks456
                </a>
              </div>
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-3">
                  Connect
                </div>
                <div className="flex gap-4">
                  {SOCIALS.map((s) => (
                    <a
                      key={s.label}
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full text-sm border border-white/10 text-white/50 hover:border-amber/30 hover:text-amber transition-all"
                    >
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right - Form */}
          <div className="glass rounded-3xl p-8 md:p-10">
            {submitted ? (
              <div className="flex flex-col items-center justify-center h-full py-12">
                <div className="w-16 h-16 rounded-full bg-amber/20 flex items-center justify-center mb-4">
                  <svg
                    width="28"
                    height="28"
                    viewBox="0 0 28 28"
                    fill="none"
                    className="text-amber"
                  >
                    <path
                      d="M6 14L12 20L22 8"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-medium mb-2">
                  Message Sent!
                </h3>
                <p className="text-white/40 text-sm">
                  I&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2"
                  >
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
                    placeholder="John Doe"
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all"
                    placeholder="john@example.com"
                  />
                </div>
                <div>
                  <label
                    htmlFor="message"
                    className="block text-xs uppercase tracking-[0.15em] text-muted-foreground mb-2"
                  >
                    Your Message
                  </label>
                  <textarea
                    id="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl px-4 py-3 text-white placeholder:text-white/20 focus:outline-none focus:border-amber/40 focus:ring-1 focus:ring-amber/20 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-amber text-charcoal font-display font-medium text-sm tracking-wide hover:bg-amber-light transition-all duration-300 glow-amber"
                >
                  Send Message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─── Footer ─── */
function Footer() {
  return (
    <footer className="border-t border-white/[0.06] py-8 px-6 lg:px-12">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-amber flex items-center justify-center text-charcoal font-bold text-[10px]">
            U
          </div>
          <span className="text-sm text-white/40">
            © {new Date().getFullYear()} Usman Milas. All rights reserved.
          </span>
        </div>
        <div className="flex items-center gap-6">
          {SOCIALS.slice(0, 3).map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-white/30 hover:text-amber transition-colors"
            >
              {s.label}
            </a>
          ))}
        </div>
        <div className="text-xs text-white/20">
          Proudly from Sri Lanka 🇱🇰
        </div>
      </div>
    </footer>
  );
}

/* ─── Main Page ─── */
export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState("hero");

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { threshold: 0.3, rootMargin: "-10% 0px -10% 0px" }
    );

    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [loading]);

  return (
    <>
      {loading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div
        className={`min-h-screen transition-opacity duration-500 ${
          loading ? "opacity-0" : "opacity-100"
        }`}
      >
        <SideNav activeSection={activeSection} />
        <MobileNav activeSection={activeSection} />

        {/* Top badge */}
        <div className="fixed top-0 left-0 right-0 z-30 lg:left-[260px]">
          <div className="bg-amber/10 border-b border-amber/20 px-4 py-2 text-center">
            <span className="text-xs font-medium text-amber">
              ✦ Proud to Be One of Sri Lanka&apos;s Top Web Designers ✦
            </span>
          </div>
        </div>

        {/* Main content */}
        <main className="lg:ml-[260px]">
          <HeroSection />
          <AboutSection />
          <WorksSection />
          <ServicesSection />
          <ContactSection />
          <Footer />
        </main>
      </div>
    </>
  );
}
