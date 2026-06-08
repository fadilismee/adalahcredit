"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles, Zap, Globe, Layers, Search, Star } from "lucide-react";
import toolsData from "@/data/tools.json";

const EASE = [0.16, 1, 0.3, 1] as const;

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7, delay, ease: EASE }} className={className}>
      {children}
    </motion.div>
  );
}

function ParallaxText({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.2"] });
  const chars = text.split("");
  return (
    <p ref={ref} className={className}>
      {chars.map((char, i) => <ParallaxChar key={i} char={char} progress={scrollYProgress} index={i} total={chars.length} />)}
    </p>
  );
}

function ParallaxChar({ char, progress, index, total }: { char: string; progress: ReturnType<typeof useScroll>["scrollYProgress"]; index: number; total: number }) {
  const p = index / total;
  const opacity = useTransform(progress, [p - 0.1, p + 0.05], [0.15, 1]);
  return <motion.span style={{ opacity }}>{char}</motion.span>;
}

// ─── Data ─────────────────────────────────────────────────────────
const CATEGORIES = [
  { icon: Zap, label: "AI Tools", count: 12 },
  { icon: Globe, label: "Web Dev", count: 8 },
  { icon: Layers, label: "Design", count: 6 },
  { icon: Search, label: "SEO", count: 5 },
  { icon: Star, label: "Productivity", count: 9 },
  { icon: Sparkles, label: "Writing", count: 7 },
];

const TOOLS = toolsData;

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ background: "#050505" }}>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex flex-col">
        {/* Gradient orbs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-violet-600/15 to-transparent blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-emerald-600/10 to-transparent blur-3xl" />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] pointer-events-none" />

        {/* Nav */}
        <nav className="relative z-20 flex justify-center pt-5 px-4">
          <div className="bg-white/[0.04] backdrop-blur-xl border border-white/[0.08] rounded-full px-6 py-2.5 flex items-center gap-6">
            <span className="text-sm font-bold bg-gradient-to-r from-white to-white/70 bg-clip-text text-transparent">FreeTools</span>
            <div className="h-4 w-px bg-white/10" />
            <a href="#tools" className="text-xs text-white/50 hover:text-white transition-colors">Tools</a>
            <a href="#about" className="text-xs text-white/50 hover:text-white transition-colors">About</a>
          </div>
        </nav>

        {/* Hero content */}
        <div className="relative flex-1 flex flex-col items-center justify-center px-5 text-center">
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5, ease: EASE }} className="inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full px-4 py-1.5 mb-8">
            <Sparkles className="size-3.5 text-amber-400" />
            <span className="text-xs text-white/60">100% Free • No Signup Required</span>
          </motion.div>

          <motion.h1 initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease: EASE }} className="text-[clamp(2.5rem,8vw,6rem)] font-bold leading-[0.9] tracking-[-0.03em] max-w-4xl">
            <span className="bg-gradient-to-b from-white via-white to-white/50 bg-clip-text text-transparent">Discover Free</span>
            <br />
            <span className="bg-gradient-to-r from-violet-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">Tools & Resources</span>
          </motion.h1>

          <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2, duration: 0.8, ease: EASE }} className="mt-6 text-base sm:text-lg text-white/50 max-w-lg leading-relaxed">
            Koleksi tools gratis terbaik untuk developer, designer, dan creator. Diupdate setiap minggu.
          </motion.p>

          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.4, duration: 0.8, ease: EASE }} className="mt-8 flex gap-3">
            <a href="#tools" className="group inline-flex items-center gap-2 bg-white text-black rounded-full pl-5 pr-2 py-2.5 hover:bg-white/90 transition-colors">
              <span className="text-sm font-semibold">Explore Tools</span>
              <span className="bg-black text-white rounded-full size-7 grid place-items-center group-hover:translate-x-0.5 transition-transform"><ArrowRight className="size-3.5" /></span>
            </a>
          </motion.div>

          {/* Stats */}
          <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.6, duration: 0.8, ease: EASE }} className="mt-16 flex gap-8 sm:gap-12">
            {[{ n: "50+", l: "Free Tools" }, { n: "6", l: "Categories" }, { n: "Weekly", l: "Updates" }].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-xl sm:text-2xl font-bold text-white">{s.n}</p>
                <p className="text-xs text-white/40 mt-1">{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="relative pb-8 flex justify-center">
          <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="size-8 rounded-full border border-white/10 grid place-items-center">
            <div className="size-1.5 rounded-full bg-white/40" />
          </motion.div>
        </div>
      </section>

      {/* ═══ CATEGORIES ═══ */}
      <section className="py-16 px-5 sm:px-8" id="about">
        <div className="max-w-5xl mx-auto">
          <Reveal className="text-center mb-10">
            <span className="text-[11px] tracking-[0.2em] uppercase text-white/30 font-mono">Browse by Category</span>
          </Reveal>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {CATEGORIES.map((cat, i) => (
              <Reveal key={cat.label} delay={i * 0.05}>
                <div className="group flex flex-col items-center gap-2.5 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/[0.12] transition-all cursor-pointer">
                  <cat.icon className="size-5 text-white/40 group-hover:text-white/70 transition-colors" />
                  <span className="text-xs font-medium text-white/60 group-hover:text-white/80 transition-colors">{cat.label}</span>
                  <span className="text-[10px] text-white/25 font-mono">{cat.count} tools</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ABOUT ═══ */}
      <section className="py-16 sm:py-24 px-5 sm:px-8">
        <Reveal>
          <div className="max-w-4xl mx-auto bg-white/[0.02] border border-white/[0.06] rounded-2xl p-6 sm:p-10 md:p-14 text-center">
            <span className="text-[11px] tracking-[0.25em] uppercase font-mono text-violet-400/70">Why FreeTools?</span>
            <h2 className="mt-6 text-2xl sm:text-3xl md:text-4xl max-w-2xl mx-auto leading-[1.1] text-white/90">
              <span>Kami kurasikan </span>
              <span className="font-serif italic text-white/50">tools gratis terbaik </span>
              <span>supaya kamu nggak perlu buang waktu nyari satu-satu.</span>
            </h2>
            <div className="mt-10 max-w-2xl mx-auto">
              <ParallaxText
                text="Setiap tool yang kami share sudah ditest dan diverifikasi. Kami fokus pada tools yang benar-benar gratis — bukan trial, bukan freemium yang nggak berguna. Dari AI tools, design apps, hosting, sampai productivity tools."
                className="text-sm sm:text-base leading-relaxed text-white/60"
              />
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ TOOLS GRID ═══ */}
      <section className="py-16 px-5 sm:px-8" id="tools">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-12">
            <span className="text-[11px] tracking-[0.2em] uppercase font-mono text-white/30">Featured</span>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-white/90">Tools Gratis Pilihan</h2>
            <p className="mt-2 text-sm text-white/40">Diupdate setiap minggu dengan tools terbaru</p>
          </Reveal>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TOOLS.map((tool, idx) => (
              <Reveal key={tool.id} delay={idx * 0.06}>
                <Link href={`/post/${tool.id}`} className="group block rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden hover:border-white/[0.15] hover:bg-white/[0.04] transition-all">
                  <div className={`aspect-[2/1] bg-gradient-to-br ${tool.color} relative overflow-hidden`}>
                    {tool.images?.[0] ? (
                      <Image src={tool.images[0]} alt={tool.title} fill className="object-cover" unoptimized />
                    ) : (
                      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:20px_20px]" />
                    )}
                  </div>
                  <div className="p-5 space-y-2.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/[0.06] text-white/40 font-mono">{tool.tag}</span>
                      <span className="text-[10px] text-white/25 font-mono">{tool.category}</span>
                      {tool.date && <span className="text-[10px] text-white/20 font-mono ml-auto">{tool.date}</span>}
                    </div>
                    <h3 className="text-base font-semibold text-white/90 group-hover:text-white transition-colors">{tool.title}</h3>
                    <p className="text-xs text-white/40 leading-relaxed line-clamp-2">{tool.desc}</p>
                    <div className="pt-2 flex items-center gap-1 text-xs text-white/30 group-hover:text-violet-400/70 transition-colors">
                      <span>Lihat detail</span>
                      <ArrowRight className="size-3" />
                    </div>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 px-5 sm:px-8">
        <Reveal>
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-bold text-white/90">Punya rekomendasi tool gratis?</h2>
            <p className="mt-3 text-sm text-white/40">Submit tool favoritmu dan bantu komunitas discover resource baru.</p>
            <div className="mt-6 inline-flex items-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-full px-5 py-2.5 text-sm text-white/50">
              <span>Coming Soon — Community Submissions</span>
            </div>
          </div>
        </Reveal>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="border-t border-white/[0.06] py-8 px-5">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/30">&copy; 2026 FreeTools. Sharing is caring.</p>
          <div className="flex gap-4 text-xs text-white/30">
            <span>Built with Next.js</span>
            <span>•</span>
            <span>Updated Weekly</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
