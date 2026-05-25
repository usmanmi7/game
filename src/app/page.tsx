"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";

/* ═══════════════════════════════════════════
   DATA
   ═══════════════════════════════════════════ */

const PROJECTS = [
  {
    title: "N&Rans",
    tag: "E-Commerce",
    year: "2022",
    image: "/project-1.jpg",
    desc: "Premium fashion e-commerce with immersive product storytelling and seamless purchasing flow.",
    tools: ["Webflow", "Custom JS"],
  },
  {
    title: "LangChain",
    tag: "Web App",
    year: "2023",
    image: "/project-2.jpg",
    desc: "AI-powered platform with dynamic data visualization and real-time collaboration interfaces.",
    tools: ["Next.js", "Tailwind"],
  },
  {
    title: "SalzCorp",
    tag: "Corporate",
    year: "2023",
    image: "/project-3.jpg",
    desc: "Corporate brand identity with cutting-edge animations and responsive design system.",
    tools: ["WordPress", "GSAP"],
  },
  {
    title: "Airnet&Co",
    tag: "Agency",
    year: "2025",
    image: "/project-4.jpg",
    desc: "Digital agency portfolio featuring creative transitions, 3D elements, and interactive storytelling.",
    tools: ["Webflow", "Three.js"],
  },
];

const SERVICES = [
  {
    number: "01",
    title: "Website Design",
    desc: "Pixel-perfect, custom websites that captivate visitors and convert them into loyal customers. Every layout, animation, and interaction is crafted with intention.",
    tags: ["UI/UX", "Responsive", "Figma"],
  },
  {
    number: "02",
    title: "Web Development",
    desc: "Clean, performant code that brings designs to life. From Webflow to custom solutions — fast, accessible, and built to scale with your business.",
    tags: ["Webflow", "WordPress", "Next.js"],
  },
  {
    number: "03",
    title: "Brand Identity",
    desc: "Cohesive visual systems that make brands unforgettable. Logos, color palettes, typography, and guidelines that tell your story at every touchpoint.",
    tags: ["Logo", "Guidelines", "Strategy"],
  },
  {
    number: "04",
    title: "Digital Campaigns",
    desc: "Data-driven marketing strategies combined with creative storytelling. SEO, content, and social campaigns that grow your audience organically.",
    tags: ["SEO", "Content", "Social"],
  },
];

const TECH_STACK = [
  "Webflow", "WordPress", "Wix", "Next.js", "React",
  "Tailwind CSS", "Figma", "GSAP", "Three.js", "Shopify",
];

const SOCIAL_LINKS = [
  { label: "WhatsApp", href: "http://wa.me/+779194083" },
  { label: "Facebook", href: "https://web.facebook.com/mhd.usman.mi/" },
  { label: "X", href: "https://x.com/" },
  { label: "Fiverr", href: "https://www.fiverr.com/webworks_456/" },
];

/* ═══════════════════════════════════════════
   LOADING SCREEN
   ═══════════════════════════════════════════ */

function Loader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(interval);
          setTimeout(onComplete, 400);
          return 100;
        }
        return p + 4;
      });
    }, 40);
    return () => clearInterval(interval);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#050505] flex flex-col items-center justify-center">
      <div className="text-center mb-12">
        <div className="text-6xl md:text-8xl font-display font-800 gradient-text mb-4">
          UM
        </div>
        <p className="text-xs tracking-[0.3em] text-white/30 uppercase">
          Loading experience
        </p>
      </div>
      <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-200 ease-out"
          style={{
            width: `${progress}%`,
            background: "linear-gradient(90deg, #ff6b35, #c084fc)",
          }}
        />
      </div>
      <p className="text-xs text-white/20 mt-4 font-mono">{progress}%</p>
    </div>
  );
}

/* ═══════════════════════════════════════════
   NAVIGATION
   ═══════════════════════════════════════════ */

function Nav({ menuOpen, setMenuOpen }: { menuOpen: boolean; setMenuOpen: (v: boolean) => void }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? "bg-[#050505]/80 backdrop-blur-xl border-b border-white/[0.04]" : ""
        }`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-10 py-4 md:py-5">
          {/* Logo */}
          <a href="#hero" className="relative z-50 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#ff6b35] to-[#c084fc] flex items-center justify-center">
              <span className="text-sm font-display font-800 text-white">U</span>
            </div>
            <span className="font-display font-700 text-lg tracking-tight hidden sm:block">
              Usman<span className="text-white/30">.</span>
            </span>
          </a>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8">
            {["About", "Work", "Services", "Contact"].map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                className="text-sm text-white/40 hover:text-white transition-colors duration-300 tracking-wide"
              >
                {link}
              </a>
            ))}
          </div>

          {/* CTA + Hamburger */}
          <div className="flex items-center gap-4">
            <a
              href="#contact"
              className="hidden md:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium bg-white text-[#050505] hover:bg-white/90 transition-all"
            >
              Let&apos;s Talk
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M2 10L10 2M10 2H4M10 2V8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="relative z-50 w-9 h-9 flex flex-col items-center justify-center gap-[5px] rounded-xl bg-white/5 border border-white/[0.06]"
              aria-label="Toggle menu"
            >
              <span className={`w-4 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-[3.5px]" : ""}`} />
              <span className={`w-4 h-[1.5px] bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-[3.5px]" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-0 z-40 bg-[#050505] transition-all duration-600 flex flex-col items-center justify-center ${
          menuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        style={{ transition: "opacity 0.5s ease" }}
      >
        <nav className="flex flex-col items-center gap-6">
          {["About", "Work", "Services", "Contact"].map((link, i) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              onClick={() => setMenuOpen(false)}
              className="text-4xl font-display font-700 gradient-text-subtle hover:gradient-text transition-all"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              {link}
            </a>
          ))}
        </nav>
        <div className="mt-16 flex gap-5">
          {SOCIAL_LINKS.map((s) => (
            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
              className="text-xs text-white/30 hover:text-[#ff6b35] transition-colors uppercase tracking-widest">
              {s.label}
            </a>
          ))}
        </div>
      </div>
    </>
  );
}

/* ═══════════════════════════════════════════
   HERO
   ═══════════════════════════════════════════ */

function Hero() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <Image src="/hero-2026.jpg" alt="" fill className="object-cover opacity-20" priority />
        <div className="absolute inset-0 bg-gradient-to-b from-[#050505]/50 via-[#050505]/70 to-[#050505]" />
      </div>

      {/* Decorative gradient orbs */}
      <div className="absolute top-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-[#ff6b35]/[0.04] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[400px] h-[400px] rounded-full bg-[#c084fc]/[0.03] blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 pt-32 pb-20 w-full">
        {/* Available badge */}
        <div className="flex items-center gap-3 mb-8 animate-fade-in-up">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#ff6b35] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#ff6b35]" />
          </span>
          <span className="text-sm text-white/50 tracking-wide">Available for freelance work</span>
        </div>

        {/* Main heading */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-display font-800 leading-[0.95] tracking-tight mb-8 animate-fade-in-up" style={{ animationDelay: "0.15s" }}>
          Crafting
          <br />
          <span className="gradient-text">digital</span> experiences
          <br />
          that <span className="italic font-500 text-white/60">matter</span>
        </h1>

        {/* Subline */}
        <p className="text-lg md:text-xl text-white/40 max-w-xl mb-12 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          Freelance designer & developer from Sri Lanka — building modern, responsive, and unforgettable websites.
        </p>

        {/* CTA buttons */}
        <div className="flex flex-wrap gap-4 animate-fade-in-up" style={{ animationDelay: "0.45s" }}>
          <a
            href="#work"
            className="group inline-flex items-center gap-3 px-7 py-4 rounded-full bg-gradient-to-r from-[#ff6b35] to-[#ff8f5e] text-white text-sm font-medium hover:shadow-[0_0_40px_rgba(255,107,53,0.3)] transition-all duration-500"
          >
            View My Work
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="group-hover:translate-x-1 transition-transform">
              <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 px-7 py-4 rounded-full text-sm font-medium border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-all"
          >
            Get In Touch
          </a>
        </div>
      </div>

      {/* Bottom marquee */}
      <div className="absolute bottom-0 left-0 right-0 border-t border-white/[0.04] py-4 overflow-hidden">
        <div className="animate-marquee whitespace-nowrap flex">
          {[...Array(2)].map((_, si) => (
            <span key={si} className="flex-shrink-0 flex items-center">
              {Array(8).fill(0).map((_, i) => (
                <span key={`${si}-${i}`} className="flex items-center mx-4 md:mx-6">
                  <span className="text-lg md:text-2xl font-display font-600 text-white/[0.04]">Usman Milas</span>
                  <span className="text-[#ff6b35]/20 ml-4 md:ml-6 text-xs">◆</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   ABOUT (Bento Grid)
   ═══════════════════════════════════════════ */

function About() {
  return (
    <section id="about" className="py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs font-mono text-[#ff6b35] tracking-widest uppercase">01</span>
          <div className="w-12 h-px bg-white/10" />
          <span className="text-xs tracking-[0.2em] text-white/30 uppercase">About</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-700 mb-16 max-w-2xl">
          A brief intro,{" "}
          <span className="gradient-text">who I am</span>
        </h2>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Portrait card — spans 1 col, 2 rows on lg */}
          <div className="bento-card lg:row-span-2 relative group">
            <div className="aspect-[3/4] lg:aspect-auto lg:h-full relative overflow-hidden">
              <Image
                src="/portrait-2026.jpg"
                alt="Usman Milas portrait"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent" />
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-6">
              <h3 className="text-xl font-display font-700">Usman Milas</h3>
              <p className="text-sm text-white/40 mt-1">Freelance Designer & Developer</p>
            </div>
          </div>

          {/* Bio card — spans 2 cols */}
          <div className="bento-card lg:col-span-2 p-8 md:p-10 flex flex-col justify-center">
            <p className="text-lg md:text-xl text-white/60 leading-relaxed mb-6">
              I&apos;m a freelance web designer and developer from Sri Lanka with
              over 4 years of hands-on experience. Currently pursuing an HND in IT,
              I specialize in crafting modern, responsive, and user-focused digital
              experiences that help brands stand out.
            </p>
            <p className="text-lg md:text-xl text-white/60 leading-relaxed">
              The combination of my passion for <span className="text-white font-medium">design</span>,{" "}
              <span className="text-white font-medium">code</span> &{" "}
              <span className="text-white font-medium">interaction</span> positions me
              in a unique place in the web design world. Together we will set the new
              status quo — no nonsense, always on the cutting edge.
            </p>
          </div>

          {/* Stats cards */}
          <div className="bento-card p-8 flex flex-col justify-between">
            <span className="text-5xl md:text-6xl font-display font-800 gradient-text">4+</span>
            <div>
              <p className="text-sm text-white/40 mt-2">Years of</p>
              <p className="text-sm text-white/70">Experience</p>
            </div>
          </div>

          <div className="bento-card p-8 flex flex-col justify-between">
            <span className="text-5xl md:text-6xl font-display font-800 gradient-text">50+</span>
            <div>
              <p className="text-sm text-white/40 mt-2">Projects</p>
              <p className="text-sm text-white/70">Delivered</p>
            </div>
          </div>

          <div className="bento-card p-8 flex flex-col justify-between">
            <span className="text-5xl md:text-6xl font-display font-800 gradient-text">30+</span>
            <div>
              <p className="text-sm text-white/40 mt-2">Happy</p>
              <p className="text-sm text-white/70">Clients</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   WORK
   ═══════════════════════════════════════════ */

function Work() {
  const [activeProject, setActiveProject] = useState(0);

  return (
    <section id="work" className="py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs font-mono text-[#ff6b35] tracking-widest uppercase">02</span>
          <div className="w-12 h-px bg-white/10" />
          <span className="text-xs tracking-[0.2em] text-white/30 uppercase">Selected Work</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-700 mb-16 max-w-2xl">
          Projects I&apos;m{" "}
          <span className="gradient-text">proud of</span>
        </h2>

        {/* Project showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Project list */}
          <div className="space-y-2">
            {PROJECTS.map((project, i) => (
              <button
                key={project.title}
                onClick={() => setActiveProject(i)}
                className={`w-full text-left p-6 md:p-8 rounded-2xl transition-all duration-400 group ${
                  activeProject === i
                    ? "bg-white/[0.04] border border-white/[0.08]"
                    : "bg-transparent border border-transparent hover:bg-white/[0.02]"
                }`}
              >
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-xs font-mono text-[#ff6b35]/60">{project.number || `0${i + 1}`}</span>
                    <h3 className={`text-2xl md:text-3xl font-display font-700 mt-1 transition-colors ${
                      activeProject === i ? "gradient-text" : "text-white/40 group-hover:text-white/70"
                    }`}>
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="text-xs text-white/20 px-2.5 py-1 rounded-full border border-white/[0.06]">{project.tag}</span>
                    <span className="text-xs text-white/20">{project.year}</span>
                  </div>
                </div>
                <p className={`text-sm leading-relaxed transition-colors ${
                  activeProject === i ? "text-white/50" : "text-white/20"
                }`}>
                  {project.desc}
                </p>
                {activeProject === i && (
                  <div className="flex gap-2 mt-4">
                    {project.tools.map((tool) => (
                      <span key={tool} className="text-xs text-white/30 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.06]">
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Project preview image */}
          <div className="relative aspect-[4/3] lg:aspect-auto rounded-2xl overflow-hidden bento-card border-0">
            <Image
              src={PROJECTS[activeProject].image}
              alt={PROJECTS[activeProject].title}
              fill
              className="object-cover transition-all duration-700"
              key={activeProject}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
              <h3 className="text-2xl md:text-3xl font-display font-700 gradient-text">
                {PROJECTS[activeProject].title}
              </h3>
              <p className="text-sm text-white/40 mt-1">
                {PROJECTS[activeProject].tag} — {PROJECTS[activeProject].year}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   SERVICES
   ═══════════════════════════════════════════ */

function Services() {
  return (
    <section id="services" className="py-24 md:py-36 px-6 md:px-10">
      <div className="max-w-7xl mx-auto">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs font-mono text-[#ff6b35] tracking-widest uppercase">03</span>
          <div className="w-12 h-px bg-white/10" />
          <span className="text-xs tracking-[0.2em] text-white/30 uppercase">What I Do</span>
        </div>
        <h2 className="text-3xl md:text-5xl font-display font-700 mb-16 max-w-2xl">
          Services &{" "}
          <span className="gradient-text">expertise</span>
        </h2>

        {/* Service cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {SERVICES.map((service) => (
            <div key={service.number} className="bento-card p-8 md:p-10 group">
              <div className="flex items-center justify-between mb-8">
                <span className="text-4xl md:text-5xl font-display font-800 text-white/[0.04] group-hover:text-[#ff6b35]/10 transition-colors duration-500">
                  {service.number}
                </span>
                <div className="w-10 h-10 rounded-full border border-white/[0.06] flex items-center justify-center group-hover:border-[#ff6b35]/30 group-hover:bg-[#ff6b35]/5 transition-all duration-300">
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="text-white/20 group-hover:text-[#ff6b35] transition-colors">
                    <path d="M3 11L11 3M11 3H5M11 3V9" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <h3 className="text-xl md:text-2xl font-display font-700 mb-4 group-hover:text-[#ff6b35] transition-colors duration-300">
                {service.title}
              </h3>
              <p className="text-sm text-white/30 leading-relaxed mb-6">
                {service.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {service.tags.map((tag) => (
                  <span key={tag} className="text-xs text-white/20 px-3 py-1.5 rounded-full bg-white/[0.02] border border-white/[0.04]">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Tech stack marquee */}
        <div className="mt-16 overflow-hidden py-4 border-y border-white/[0.04]">
          <div className="animate-marquee whitespace-nowrap flex">
            {[...Array(2)].map((_, si) => (
              <span key={si} className="flex-shrink-0 flex items-center">
                {TECH_STACK.map((tech, i) => (
                  <span key={`${si}-${i}`} className="mx-8 text-lg md:text-xl font-display font-600 text-white/[0.06] hover:text-white/20 transition-colors cursor-default">
                    {tech}
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════
   CONTACT
   ═══════════════════════════════════════════ */

function Contact() {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 4000);
    setFormData({ name: "", email: "", message: "" });
  };

  return (
    <section id="contact" className="py-24 md:py-36 px-6 md:px-10 relative">
      {/* Background glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-[#ff6b35]/[0.03] blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section header */}
        <div className="flex items-center gap-4 mb-4">
          <span className="text-xs font-mono text-[#ff6b35] tracking-widest uppercase">04</span>
          <div className="w-12 h-px bg-white/10" />
          <span className="text-xs tracking-[0.2em] text-white/30 uppercase">Contact</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left */}
          <div>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-display font-800 leading-[0.95] mb-8">
              Let&apos;s build
              <br />
              <span className="gradient-text">something</span>
              <br />
              great together
            </h2>
            <p className="text-lg text-white/30 mb-12 max-w-md">
              Have a project in mind or just want to chat? I&apos;d love to hear from you. Let&apos;s turn your vision into reality.
            </p>

            {/* Quick links */}
            <div className="space-y-6">
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-white/20">Email</span>
                <a href="mailto:Webworks456@gmail.com" className="block text-lg text-white/60 hover:text-[#ff6b35] transition-colors mt-1">
                  Webworks456@gmail.com
                </a>
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-white/20">Hire Me</span>
                <a href="https://www.fiverr.com/webworks_456/" target="_blank" rel="noopener noreferrer"
                  className="block text-lg text-white/60 hover:text-[#ff6b35] transition-colors mt-1">
                  Fiverr.com/webworks456
                </a>
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-white/20 mb-3 block">Connect</span>
                <div className="flex gap-3">
                  {SOCIAL_LINKS.map((s) => (
                    <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                      className="px-4 py-2 rounded-full text-xs border border-white/[0.06] text-white/30 hover:border-[#ff6b35]/30 hover:text-[#ff6b35] transition-all">
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right — Form */}
          <div className="bento-card p-8 md:p-10">
            {sent ? (
              <div className="flex flex-col items-center justify-center h-full py-16">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#ff6b35] to-[#c084fc] flex items-center justify-center mb-6 animate-scale-in">
                  <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                    <path d="M6 14L12 20L22 8" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
                <h3 className="text-xl font-display font-700 mb-2">Message Sent!</h3>
                <p className="text-sm text-white/30">I&apos;ll get back to you within 24 hours.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-xs uppercase tracking-[0.15em] text-white/20 mb-3">Name</label>
                  <input
                    id="name" type="text" required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#ff6b35]/30 focus:ring-1 focus:ring-[#ff6b35]/10 transition-all"
                    placeholder="Your name"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs uppercase tracking-[0.15em] text-white/20 mb-3">Email</label>
                  <input
                    id="email" type="email" required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#ff6b35]/30 focus:ring-1 focus:ring-[#ff6b35]/10 transition-all"
                    placeholder="you@email.com"
                  />
                </div>
                <div>
                  <label htmlFor="message" className="block text-xs uppercase tracking-[0.15em] text-white/20 mb-3">Message</label>
                  <textarea
                    id="message" required rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-white/[0.03] border border-white/[0.06] rounded-xl px-5 py-4 text-white placeholder:text-white/10 focus:outline-none focus:border-[#ff6b35]/30 focus:ring-1 focus:ring-[#ff6b35]/10 transition-all resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-4 rounded-xl bg-gradient-to-r from-[#ff6b35] to-[#ff8f5e] text-white font-display font-600 text-sm tracking-wide hover:shadow-[0_0_40px_rgba(255,107,53,0.25)] transition-all duration-500"
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

/* ═══════════════════════════════════════════
   FOOTER
   ═══════════════════════════════════════════ */

function Footer() {
  return (
    <footer className="border-t border-white/[0.04] px-6 md:px-10 py-10">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left */}
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-[#ff6b35] to-[#c084fc] flex items-center justify-center">
              <span className="text-[10px] font-display font-800 text-white">U</span>
            </div>
            <span className="text-sm text-white/20">
              © {new Date().getFullYear()} Usman Milas
            </span>
          </div>

          {/* Center - Proud */}
          <p className="text-xs text-white/15 text-center">
            Proudly designing from Sri Lanka 🇱🇰
          </p>

          {/* Right - Socials */}
          <div className="flex items-center gap-5">
            {SOCIAL_LINKS.map((s) => (
              <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer"
                className="text-xs text-white/20 hover:text-[#ff6b35] transition-colors">
                {s.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ═══════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════ */

export default function HomePage() {
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLoadingComplete = useCallback(() => {
    setLoading(false);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  return (
    <>
      {loading && <Loader onComplete={handleLoadingComplete} />}
      <div className={`noise min-h-screen transition-opacity duration-700 ${loading ? "opacity-0" : "opacity-100"}`}>
        <Nav menuOpen={menuOpen} setMenuOpen={setMenuOpen} />
        <main>
          <Hero />
          <About />
          <Work />
          <Services />
          <Contact />
          <Footer />
        </main>
      </div>
    </>
  );
}
