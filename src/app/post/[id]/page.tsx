"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Copy, ExternalLink, Check, Star, Zap, Globe, Layers, Search, Sparkles, ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const TOOLS: Record<string, { title: string; category: string; tag: string; desc: string; body: string; features: string[]; url: string; color: string; images: string[] }> = {
  "1": {
    title: "ChatGPT Free Tier",
    category: "AI Tools",
    tag: "Popular",
    desc: "AI chatbot gratis dari OpenAI",
    body: "ChatGPT menawarkan tier gratis yang sangat powerful untuk berbagai kebutuhan. Kamu bisa menggunakannya untuk brainstorming, menulis kode, menjawab pertanyaan kompleks, dan bahkan membuat konten kreatif. Free tier mencakup akses ke GPT-4o mini dan beberapa fitur GPT-4o.",
    features: ["Unlimited chat dengan GPT-4o mini", "Akses terbatas GPT-4o", "Code interpreter", "Web browsing", "File upload"],
    url: "https://chat.openai.com",
    color: "from-emerald-500/20 to-teal-500/10",
    images: ["/img/chatgpt-1.jpg", "/img/chatgpt-2.jpg", "/img/chatgpt-3.jpg"],
  },
  "2": {
    title: "Canva Free",
    category: "Design",
    tag: "Essential",
    desc: "Platform desain grafis gratis",
    body: "Canva Free memberikan akses ke ribuan template profesional untuk sosial media, presentasi, poster, dan lainnya. Dengan drag-and-drop editor yang intuitif, siapa saja bisa membuat desain menarik tanpa skill desain.",
    features: ["250,000+ template gratis", "100+ design types", "5GB cloud storage", "Kolaborasi real-time", "Export PNG, JPG, PDF"],
    url: "https://canva.com",
    color: "from-violet-500/20 to-purple-500/10",
    images: ["/img/canva-1.jpg", "/img/canva-2.jpg"],
  },
  "3": {
    title: "Vercel Hosting",
    category: "Web Dev",
    tag: "Dev",
    desc: "Deploy website gratis",
    body: "Vercel menawarkan hosting gratis untuk project Next.js, React, Vue, dan static sites. Setiap deploy otomatis mendapat SSL, CDN global, dan preview deployment. Perfect untuk personal projects dan portfolio.",
    features: ["Unlimited deployments", "SSL otomatis", "CDN global", "Preview deployments", "Serverless functions (100GB-hrs/mo)"],
    url: "https://vercel.com",
    color: "from-blue-500/20 to-cyan-500/10",
    images: ["/img/vercel-1.jpg", "/img/vercel-2.jpg", "/img/vercel-3.jpg"],
  },
  "4": {
    title: "Notion Free Plan",
    category: "Productivity",
    tag: "Top Pick",
    desc: "All-in-one workspace gratis",
    body: "Notion Free Plan memberikan akses penuh ke semua fitur core: notes, databases, kanban boards, dan wiki. Cocok untuk personal productivity, project tracking, dan knowledge management.",
    features: ["Unlimited pages & blocks", "Invite up to 10 guests", "7-day page history", "API access", "Import from other tools"],
    url: "https://notion.so",
    color: "from-amber-500/20 to-orange-500/10",
    images: ["/img/notion-1.jpg", "/img/notion-2.jpg"],
  },
  "5": {
    title: "Ubersuggest Free",
    category: "SEO",
    tag: "SEO",
    desc: "Tool riset keyword gratis",
    body: "Ubersuggest dari Neil Patel memberikan akses gratis ke data keyword research termasuk volume pencarian, keyword difficulty, dan content ideas. Tool ini cukup untuk pemula yang ingin memulai optimasi SEO.",
    features: ["3 searches/day gratis", "Keyword suggestions", "Content ideas", "Site audit (limited)", "Competitor analysis"],
    url: "https://neilpatel.com/ubersuggest",
    color: "from-rose-500/20 to-pink-500/10",
    images: ["/img/ubersuggest-1.jpg", "/img/ubersuggest-2.jpg"],
  },
  "6": {
    title: "Claude AI",
    category: "AI Tools",
    tag: "New",
    desc: "AI assistant dari Anthropic",
    body: "Claude adalah AI assistant yang excellent untuk coding, analisis dokumen panjang, dan penulisan. Free tier memberikan akses ke Claude Sonnet dengan context window yang besar — ideal untuk menganalisis file besar atau conversation panjang.",
    features: ["Akses Claude Sonnet", "200K context window", "File & image upload", "Code generation", "Artifacts (preview)"],
    url: "https://claude.ai",
    color: "from-indigo-500/20 to-blue-500/10",
    images: ["/img/claude-1.jpg", "/img/claude-2.jpg", "/img/claude-3.jpg"],
  },
};

const CATEGORY_ICON: Record<string, typeof Star> = {
  "AI Tools": Zap,
  "Design": Layers,
  "Web Dev": Globe,
  "Productivity": Star,
  "SEO": Search,
  "Writing": Sparkles,
};

export default function ToolPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tool = TOOLS[id];
  const [copied, setCopied] = useState(false);
  const [imgIdx, setImgIdx] = useState(0);

  if (!tool) return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center">
        <p className="text-white/50 mb-4">Tool tidak ditemukan.</p>
        <Link href="/" className="text-sm text-violet-400 hover:text-violet-300">← Kembali</Link>
      </div>
    </div>
  );

  const copyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const Icon = CATEGORY_ICON[tool.category] || Zap;

  return (
    <div className="min-h-screen bg-black">
      {/* Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-b ${tool.color} blur-[100px] opacity-50`} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-8 sm:py-12">
        {/* Back */}
        <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8">
            <ArrowLeft className="size-4" />
            <span>All Tools</span>
          </Link>
        </motion.div>

        {/* Main card */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
          {/* Image Carousel */}
          <div className={`relative aspect-[16/9] bg-gradient-to-br ${tool.color} overflow-hidden`}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <AnimatePresence mode="wait">
              <motion.div key={imgIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                <Image src={tool.images[imgIdx]} alt={`${tool.title} screenshot ${imgIdx + 1}`} fill className="object-cover" unoptimized />
              </motion.div>
            </AnimatePresence>
            {/* Fallback overlay when image fails */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Icon className="size-16 text-white/5" />
            </div>
            {/* Navigation */}
            {tool.images.length > 1 && (
              <>
                <button onClick={() => setImgIdx(i => (i - 1 + tool.images.length) % tool.images.length)} className="absolute left-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 backdrop-blur-sm grid place-items-center text-white/70 hover:text-white hover:bg-black/70 transition-all">
                  <ChevronLeft className="size-4" />
                </button>
                <button onClick={() => setImgIdx(i => (i + 1) % tool.images.length)} className="absolute right-3 top-1/2 -translate-y-1/2 size-9 rounded-full bg-black/50 backdrop-blur-sm grid place-items-center text-white/70 hover:text-white hover:bg-black/70 transition-all">
                  <ChevronRight className="size-4" />
                </button>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {tool.images.map((_, i) => (
                    <button key={i} onClick={() => setImgIdx(i)} className={`size-2 rounded-full transition-all ${i === imgIdx ? "bg-white scale-125" : "bg-white/40 hover:bg-white/60"}`} />
                  ))}
                </div>
                <span className="absolute top-3 right-3 text-[10px] font-mono bg-black/50 backdrop-blur-sm text-white/60 px-2 py-1 rounded-full">{imgIdx + 1}/{tool.images.length}</span>
              </>
            )}
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Title + meta */}
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">{tool.tag}</span>
                <span className="text-[10px] text-white/30 font-mono">{tool.category}</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white/95">{tool.title}</h1>
              <p className="text-sm text-white/50">{tool.desc}</p>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30">Tentang Tool Ini</h2>
              <p className="text-sm text-white/60 leading-relaxed">{tool.body}</p>
            </div>

            {/* Features */}
            <div className="space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30">Fitur Gratis</h2>
              <ul className="space-y-2">
                {tool.features.map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-white/60">
                    <Check className="size-3.5 text-emerald-400 mt-0.5 shrink-0" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA */}
            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <a href={tool.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-black rounded-xl px-5 py-3 text-sm font-semibold hover:bg-white/90 transition-colors">
                <ExternalLink className="size-4" />
                <span>Buka {tool.title}</span>
              </a>
              <button onClick={copyLink} className="inline-flex items-center justify-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-all">
                {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                <span>{copied ? "Copied!" : "Share Link"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        {/* Related */}
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-8">
          <p className="text-xs text-white/30 uppercase tracking-wider font-mono mb-4">More Tools</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {Object.entries(TOOLS).filter(([k]) => k !== id).slice(0, 3).map(([k, t]) => (
              <Link key={k} href={`/post/${k}`} className="group p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all">
                <p className="text-xs text-white/80 font-medium group-hover:text-white transition-colors">{t.title}</p>
                <p className="text-[10px] text-white/30 mt-1 font-mono">{t.category}</p>
              </Link>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
