"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, MessageCircle, Zap } from "lucide-react";
import Link from "next/link";

const MESSAGES = [
  { emoji: "🔧", text: "Looking for a specific part?", sub: "Get a quote in 2 minutes" },
  { emoji: "🚗", text: "Can't find your car part?", sub: "Our team sources it for you" },
  { emoji: "⚡", text: "Need it urgently?", sub: "We respond within 2–4 hours" },
  { emoji: "💎", text: "OEM & aftermarket parts", sub: "Trusted by 500+ garages" },
];

const STORAGE_KEY = "rr_nudge_dismissed";
const SCROLL_THRESHOLD = 40; // % of page scrolled before showing

export function InquiryNudge() {
  const [visible, setVisible] = useState(false);
  const [msgIndex, setMsgIndex] = useState(0);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Don't show if dismissed in this session
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    // Show after 4 seconds on page load
    const timer = setTimeout(() => {
      if (!sessionStorage.getItem(STORAGE_KEY)) setVisible(true);
    }, 4000);

    // Also show on scroll past threshold
    const handleScroll = () => {
      if (sessionStorage.getItem(STORAGE_KEY)) return;
      const scrollPct = (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100;
      if (scrollPct > SCROLL_THRESHOLD) setVisible(true);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      clearTimeout(timer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Rotate messages every 4s while visible
  useEffect(() => {
    if (!visible) return;
    const interval = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [visible]);

  const dismiss = () => {
    setVisible(false);
    setDismissed(true);
    sessionStorage.setItem(STORAGE_KEY, "1");
  };

  const msg = MESSAGES[msgIndex];

  return (
    <AnimatePresence>
      {visible && !dismissed && (
        <motion.div
          initial={{ opacity: 0, y: 80, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 80, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-24 left-4 z-40 w-72 md:w-80"
        >
          <div className="bg-carbon-900 border border-carbon-700 rounded-xl shadow-2xl overflow-hidden">
            {/* Gold top bar */}
            <div className="h-1 bg-gold-gradient" />

            <div className="p-4">
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gold/10 rounded-lg flex items-center justify-center">
                    <Zap size={16} className="text-gold" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-semibold">RR Auto Revamp</p>
                    <p className="text-green-400 text-xs flex items-center gap-1">
                      <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse" />
                      Online now
                    </p>
                  </div>
                </div>
                <button onClick={dismiss} className="text-carbon-500 hover:text-white transition-colors p-1">
                  <X size={14} />
                </button>
              </div>

              {/* Rotating message */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={msgIndex}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3 }}
                  className="mb-4"
                >
                  <p className="text-white text-sm font-medium">
                    {msg.emoji} {msg.text}
                  </p>
                  <p className="text-carbon-400 text-xs mt-0.5">{msg.sub}</p>
                </motion.div>
              </AnimatePresence>

              {/* CTAs */}
              <div className="flex gap-2">
                <Link
                  href="/contact"
                  onClick={dismiss}
                  className="flex-1 bg-gold text-carbon-950 text-xs font-bold py-2 px-3 rounded-lg text-center hover:bg-gold-light transition-colors"
                >
                  Inquire Now
                </Link>
                <a
                  href="https://wa.me/918448176091"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={dismiss}
                  className="flex items-center gap-1.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold py-2 px-3 rounded-lg hover:bg-[#25D366]/20 transition-colors"
                >
                  <MessageCircle size={13} />
                  Chat
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
