"use client";

import { use, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Copy, ExternalLink, Check, Star, Zap, Globe, Layers, Search, Sparkles, ChevronLeft, ChevronRight, Send } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toolsData from "@/data/tools.json";

const TOOLS_MAP = Object.fromEntries(toolsData.map((t) => [t.id, t]));
const TELEGRAM_SUPPORT_URL = "https://t.me/+LP7nrF5aYa04ZGU9";
const TELEGRAM_SUPPORT_LABEL = "Join Telegram Untuk Ajukan Pertanyaan";

const CATEGORY_ICON: Record<string, typeof Star> = {
  "AI Tools": Zap,
  "Design": Layers,
  "Web Dev": Globe,
  "Productivity": Star,
  "SEO": Search,
  "Writing": Sparkles,
};

export default function ToolPageClient({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const tool = TOOLS_MAP[id];
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
      <div className="fixed inset-0 pointer-events-none">
        <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-gradient-to-b ${tool.color} blur-[100px] opacity-50`} />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-5 py-8 sm:py-12">
        <motion.div initial={{ x: -10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ duration: 0.4 }}>
          <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/40 hover:text-white transition-colors mb-8">
            <ArrowLeft className="size-4" />
            <span>All Tools</span>
          </Link>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }} className="bg-white/[0.03] border border-white/[0.08] rounded-2xl overflow-hidden">
          {/* Image Carousel */}
          <div className={`relative aspect-[16/9] bg-gradient-to-br ${tool.color} overflow-hidden`}>
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:24px_24px]" />
            <AnimatePresence mode="wait">
              <motion.div key={imgIdx} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.3 }} className="absolute inset-0">
                <Image src={tool.images[imgIdx]} alt={`${tool.title} screenshot ${imgIdx + 1}`} fill className="object-cover" unoptimized />
              </motion.div>
            </AnimatePresence>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <Icon className="size-16 text-white/5" />
            </div>
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
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-1 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20 font-mono">{tool.tag}</span>
                <span className="text-[10px] text-white/30 font-mono">{tool.category}</span>
                {tool.date && <span className="text-[10px] text-white/20 font-mono ml-auto">{tool.date}</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold text-white/95">{tool.title}</h1>
              <p className="text-sm text-white/50">{tool.desc}</p>
            </div>

            <div className="space-y-2">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-white/30">Tentang Tool Ini</h2>
              <p className="text-sm text-white/60 leading-relaxed whitespace-pre-line">{tool.body}</p>
            </div>

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

            <div className="pt-2 flex flex-col sm:flex-row gap-3 flex-wrap">
              <a href={TELEGRAM_SUPPORT_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-violet-500/15 border border-violet-400/20 text-violet-100 rounded-xl px-5 py-3 text-sm font-semibold hover:bg-violet-500/20 transition-colors">
                <Send className="size-4" />
                <span>{TELEGRAM_SUPPORT_LABEL}</span>
              </a>
              {tool.links.filter((link) => link.url !== TELEGRAM_SUPPORT_URL).map((link, i) => (
                <a key={i} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-2 bg-white text-black rounded-xl px-5 py-3 text-sm font-semibold hover:bg-white/90 transition-colors">
                  <ExternalLink className="size-4" />
                  <span>{link.label}</span>
                </a>
              ))}
              <button onClick={copyLink} className="inline-flex items-center justify-center gap-2 bg-white/[0.05] border border-white/[0.08] rounded-xl px-5 py-3 text-sm text-white/60 hover:text-white hover:bg-white/[0.08] transition-all">
                {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
                <span>{copied ? "Copied!" : "Share Link"}</span>
              </button>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, delay: 0.3 }} className="mt-8">
          <p className="text-xs text-white/30 uppercase tracking-wider font-mono mb-4">More Tools</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {toolsData.filter((t) => t.id !== id).slice(0, 3).map((t) => (
              <Link key={t.id} href={`/post/${t.id}`} className="group p-4 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all">
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
