"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRight } from "lucide-react";
import Link from "next/link";

const STORAGE_KEY = "rr_exit_shown";

export function ExitIntent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(STORAGE_KEY)) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 10 && !sessionStorage.getItem(STORAGE_KEY)) {
        setVisible(true);
        sessionStorage.setItem(STORAGE_KEY, "1");
      }
    };

    // Mobile: show after 30s of inactivity
    let mobileTimer: ReturnType<typeof setTimeout>;
    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      mobileTimer = setTimeout(() => {
        if (!sessionStorage.getItem(STORAGE_KEY)) {
          setVisible(true);
          sessionStorage.setItem(STORAGE_KEY, "1");
        }
      }, 30000);
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
      clearTimeout(mobileTimer);
    };
  }, []);

  if (!visible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/80 backdrop-blur-sm"
        onClick={() => setVisible(false)}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="bg-carbon-900 border border-carbon-700 rounded-2xl max-w-md w-full overflow-hidden shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="h-1 bg-gold-gradient" />
          <div className="p-8 text-center">
            <button onClick={() => setVisible(false)}
              className="absolute top-4 right-4 text-carbon-500 hover:text-white transition-colors">
              <X size={18} />
            </button>

            <div className="text-5xl mb-4">🔧</div>
            <h2 className="font-display text-2xl font-bold text-white mb-2">
              Wait — before you go!
            </h2>
            <p className="text-carbon-400 text-sm leading-relaxed mb-6">
              Can&apos;t find the part you need? Our team sources hard-to-find parts globally.
              Leave us your details and we&apos;ll get back to you within 2 hours.
            </p>

            <div className="space-y-3">
              <Link href="/contact" onClick={() => setVisible(false)}
                className="btn-gold w-full flex items-center justify-center gap-2">
                Get a Free Quote <ArrowRight size={16} />
              </Link>
              <a href="https://wa.me/919205876091" target="_blank" rel="noopener noreferrer"
                onClick={() => setVisible(false)}
                className="block w-full py-3 px-4 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] rounded-lg text-sm font-semibold hover:bg-[#25D366]/20 transition-colors">
                💬 Chat on WhatsApp Instead
              </a>
              <button onClick={() => setVisible(false)} className="text-carbon-500 text-xs hover:text-carbon-300 transition-colors">
                No thanks, I&apos;ll look elsewhere
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
