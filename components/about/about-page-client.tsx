"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Shield, Zap, Users, Globe, Heart, Award,
  X, ChevronLeft, ChevronRight, Linkedin,
  ArrowRight, Star, CheckCircle, MapPin,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { defaultAboutData } from "@/app/api/about/route";

type AboutData = typeof defaultAboutData;

const iconMap: Record<string, React.ElementType> = {
  shield: Shield,
  zap: Zap,
  users: Users,
  globe: Globe,
  heart: Heart,
  award: Award,
};

// ─── Animated Counter ─────────────────────────────────────────────────────────
function AnimatedCounter({ value, duration = 2 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [display, setDisplay] = useState("0");

  useEffect(() => {
    if (!inView) return;
    const numeric = parseInt(value.replace(/\D/g, ""), 10);
    const suffix = value.replace(/[\d]/g, "");
    if (isNaN(numeric)) { setDisplay(value); return; }

    let start = 0;
    const step = numeric / (duration * 60);
    const timer = setInterval(() => {
      start += step;
      if (start >= numeric) {
        setDisplay(`${numeric}${suffix}`);
        clearInterval(timer);
      } else {
        setDisplay(`${Math.floor(start)}${suffix}`);
      }
    }, 1000 / 60);
    return () => clearInterval(timer);
  }, [inView, value, duration]);

  return <span ref={ref}>{display}</span>;
}

// ─── Lightbox ─────────────────────────────────────────────────────────────────
function Lightbox({
  images,
  index,
  onClose,
  onPrev,
  onNext,
}: {
  images: { url: string; caption: string }[];
  index: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, onPrev, onNext]);

  const img = images[index];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
      onClick={onClose}
    >
      <button
        className="absolute top-4 right-4 text-white/70 hover:text-white transition-colors z-10"
        onClick={onClose}
      >
        <X size={28} />
      </button>

      <button
        className="absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 bg-white/10 rounded-full p-2"
        onClick={(e) => { e.stopPropagation(); onPrev(); }}
      >
        <ChevronLeft size={24} />
      </button>

      <button
        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 bg-white/10 rounded-full p-2"
        onClick={(e) => { e.stopPropagation(); onNext(); }}
      >
        <ChevronRight size={24} />
      </button>

      <motion.div
        key={index}
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative aspect-video rounded-lg overflow-hidden bg-carbon-900">
          {img.url ? (
            <Image src={img.url} alt={img.caption} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <div className="text-center">
                <div className="w-16 h-16 bg-gold/20 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star size={28} className="text-gold" />
                </div>
                <p className="text-carbon-400 text-sm">{img.caption}</p>
              </div>
            </div>
          )}
        </div>
        <p className="text-center text-carbon-300 mt-3 text-sm">{img.caption}</p>
        <p className="text-center text-carbon-600 text-xs mt-1">{index + 1} / {images.length}</p>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export function AboutPageClient({ data }: { data: AboutData }) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const openLightbox = (i: number) => setLightboxIndex(i);
  const closeLightbox = () => setLightboxIndex(null);
  const prevImage = () => setLightboxIndex((i) => (i === null ? 0 : (i - 1 + data.gallery.length) % data.gallery.length));
  const nextImage = () => setLightboxIndex((i) => (i === null ? 0 : (i + 1) % data.gallery.length));

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  const stagger = {
    visible: { transition: { staggerChildren: 0.1 } },
  };

  return (
    <div className="min-h-screen bg-carbon-950 overflow-x-hidden">

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Parallax BG */}
        <motion.div style={{ y: heroY }} className="absolute inset-0">
          {data.hero.backgroundImage ? (
            <Image src={data.hero.backgroundImage} alt="Hero" fill className="object-cover opacity-20" />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-carbon-950 via-carbon-900 to-carbon-950" />
          )}
          {/* Animated grid */}
          <div
            className="absolute inset-0 opacity-5"
            style={{
              backgroundImage: `linear-gradient(rgba(201,168,76,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(201,168,76,0.3) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
          {/* Radial glow */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.08)_0%,transparent_70%)]" />
        </motion.div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-gold/40 rounded-full"
            style={{
              left: `${10 + (i * 7.5) % 80}%`,
              top: `${15 + (i * 11) % 70}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: 3 + (i % 3),
              repeat: Infinity,
              delay: i * 0.3,
            }}
          />
        ))}

        <motion.div
          style={{ opacity: heroOpacity }}
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 text-gold text-xs font-semibold tracking-[0.3em] uppercase mb-6 bg-gold/10 border border-gold/20 rounded-full px-4 py-2">
              <Star size={12} className="fill-gold" />
              {data.hero.badge}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-none mb-6"
          >
            {data.hero.headline.split("\n").map((line, i) => (
              <span key={i} className={cn("block", i === 1 && "text-gold")}>
                {line}
              </span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-carbon-300 text-lg md:text-xl max-w-3xl mx-auto leading-relaxed mb-10"
          >
            {data.hero.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/contact" className="btn-gold flex items-center gap-2 justify-center text-base px-8 py-3">
              Get a Quote <ArrowRight size={16} />
            </Link>
            <Link
              href="/products"
              className="flex items-center gap-2 justify-center text-base px-8 py-3 border border-white/20 text-white rounded hover:border-gold/50 hover:text-gold transition-all"
            >
              Browse Parts
            </Link>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="w-6 h-10 border-2 border-white/20 rounded-full flex justify-center pt-2">
            <div className="w-1 h-2 bg-gold rounded-full" />
          </div>
        </motion.div>
      </section>

      {/* ── STATS ────────────────────────────────────────────────────────── */}
      <section className="py-16 bg-carbon-900/50 border-y border-white/5">
        <div className="container mx-auto px-4">
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {data.stats.map((stat, i) => (
              <motion.div key={i} variants={fadeUp} className="text-center">
                <div className="font-display text-4xl md:text-5xl font-bold text-gold mb-2">
                  <AnimatedCounter value={stat.value} />
                </div>
                <div className="text-carbon-400 text-sm tracking-wide uppercase">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── STORY ────────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
            >
              <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Our Story</span>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-3 mb-6 leading-tight">
                {data.story.title}
              </h2>
              <div className="space-y-4">
                {data.story.paragraphs.map((p, i) => (
                  <p key={i} className="text-carbon-300 leading-relaxed">{p}</p>
                ))}
              </div>
              <div className="mt-8 flex items-center gap-3">
                <CheckCircle size={18} className="text-gold shrink-0" />
                <span className="text-carbon-300 text-sm">Trusted by 8,000+ customers across India</span>
              </div>
              <div className="mt-3 flex items-center gap-3">
                <MapPin size={18} className="text-gold shrink-0" />
                <span className="text-carbon-300 text-sm">Headquartered in Delhi, serving nationwide</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative"
            >
              <div className="relative aspect-square rounded-2xl overflow-hidden bg-carbon-900 border border-white/10">
                {data.story.image ? (
                  <Image src={data.story.image} alt="Our Story" fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-8">
                      <div className="w-24 h-24 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                        <div className="w-12 h-12 bg-gold-gradient rounded-sm flex items-center justify-center">
                          <span className="text-carbon-950 font-display font-bold text-xl">RR</span>
                        </div>
                      </div>
                      <p className="text-carbon-500 text-sm">Add your story image in admin</p>
                    </div>
                  </div>
                )}
                {/* Decorative corner */}
                <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-gold/40 rounded-tr-lg" />
                <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-gold/40 rounded-bl-lg" />
              </div>
              {/* Floating badge */}
              <div className="absolute -bottom-6 -left-6 bg-gold text-carbon-950 rounded-xl p-4 shadow-2xl">
                <div className="font-display font-bold text-2xl">10+</div>
                <div className="text-xs font-semibold">Years of Trust</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── VALUES ───────────────────────────────────────────────────────── */}
      <section className="py-24 bg-carbon-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">What We Stand For</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-3">Our Core Values</h2>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto"
          >
            {data.values.map((value, i) => {
              const Icon = iconMap[value.icon] || Shield;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  whileHover={{ y: -4, transition: { duration: 0.2 } }}
                  className="glass rounded-xl p-6 border border-white/5 hover:border-gold/30 transition-all group"
                >
                  <div className="w-12 h-12 bg-gold/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-gold/20 transition-colors">
                    <Icon size={22} className="text-gold" />
                  </div>
                  <h3 className="font-display font-semibold text-white text-lg mb-2">{value.title}</h3>
                  <p className="text-carbon-400 text-sm leading-relaxed">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── TIMELINE ─────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Our Journey</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-3">A Decade of Growth</h2>
          </motion.div>

          <div className="max-w-4xl mx-auto relative">
            {/* Center line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-gold/50 via-gold/20 to-transparent hidden md:block" />

            <div className="space-y-8">
              {data.timeline.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -40 : 40 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.05 }}
                  className={cn(
                    "flex items-center gap-8",
                    i % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  )}
                >
                  <div className={cn("flex-1", i % 2 === 0 ? "md:text-right" : "md:text-left")}>
                    <div className="glass rounded-xl p-5 border border-white/5 hover:border-gold/20 transition-all">
                      <div className="text-gold font-display font-bold text-2xl mb-1">{item.year}</div>
                      <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                      <p className="text-carbon-400 text-sm">{item.description}</p>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className="hidden md:flex w-4 h-4 bg-gold rounded-full border-4 border-carbon-950 shrink-0 relative z-10" />

                  <div className="flex-1 hidden md:block" />
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM ─────────────────────────────────────────────────────────── */}
      <section className="py-24 bg-carbon-900/30">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">The People</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-3">Meet the Team</h2>
            <p className="text-carbon-400 mt-4 max-w-xl mx-auto">
              The passionate humans behind every part sourced, every inquiry answered, every customer satisfied.
            </p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
          >
            {data.team.map((member, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="glass rounded-xl overflow-hidden border border-white/5 hover:border-gold/30 transition-all group"
              >
                {/* Avatar */}
                <div className="relative aspect-square bg-carbon-900">
                  {member.image ? (
                    <Image src={member.image} alt={member.name} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <div className="w-20 h-20 bg-gold/10 rounded-full flex items-center justify-center group-hover:bg-gold/20 transition-colors">
                        <span className="font-display font-bold text-2xl text-gold">
                          {member.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                    </div>
                  )}
                  {/* Gold overlay on hover */}
                  <div className="absolute inset-0 bg-gold/0 group-hover:bg-gold/5 transition-all" />
                </div>

                <div className="p-5">
                  <h3 className="font-display font-semibold text-white">{member.name}</h3>
                  <p className="text-gold text-xs font-medium mt-0.5 mb-3">{member.role}</p>
                  <p className="text-carbon-400 text-xs leading-relaxed">{member.bio}</p>
                  {member.linkedin && (
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-carbon-500 hover:text-gold transition-colors text-xs"
                    >
                      <Linkedin size={12} /> LinkedIn
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── GALLERY ──────────────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Behind the Scenes</span>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mt-3">Gallery</h2>
            <p className="text-carbon-400 mt-4">Click any image to explore</p>
          </motion.div>

          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-5xl mx-auto"
          >
            {data.gallery.map((item, i) => (
              <motion.button
                key={i}
                variants={fadeUp}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openLightbox(i)}
                className={cn(
                  "relative overflow-hidden rounded-xl bg-carbon-900 border border-white/5 hover:border-gold/40 transition-all group",
                  i === 0 ? "md:col-span-2 aspect-video" : "aspect-square",
                  i === 3 ? "md:col-span-2 aspect-video" : ""
                )}
              >
                {item.url ? (
                  <Image src={item.url} alt={item.caption} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <div className="text-center p-4">
                      <div className="w-10 h-10 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-2 group-hover:bg-gold/20 transition-colors">
                        <Star size={18} className="text-gold" />
                      </div>
                      <p className="text-carbon-500 text-xs">{item.caption}</p>
                    </div>
                  </div>
                )}
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-end">
                  <div className="p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-white text-sm font-medium">{item.caption}</p>
                  </div>
                </div>
              </motion.button>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────── */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gold/5 via-gold/10 to-gold/5" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(201,168,76,0.12)_0%,transparent_70%)]" />

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative z-10 text-center px-4 max-w-3xl mx-auto"
        >
          <h2 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
            {data.cta.title}
          </h2>
          <p className="text-carbon-300 text-lg mb-8">{data.cta.subtitle}</p>
          <Link
            href={data.cta.buttonHref}
            className="btn-gold inline-flex items-center gap-2 text-base px-10 py-4"
          >
            {data.cta.buttonText} <ArrowRight size={18} />
          </Link>
        </motion.div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox
            images={data.gallery}
            index={lightboxIndex}
            onClose={closeLightbox}
            onPrev={prevImage}
            onNext={nextImage}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
