"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

interface Props {
  productName: string;
  whatsappNumber?: string;
}

export function StickyQuoteBar({ productName, whatsappNumber = "918448176091" }: Props) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const waMsg = encodeURIComponent(`Hi, I'm interested in: ${productName}. Can you help me source it?`);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed top-16 left-0 right-0 z-40 bg-carbon-900/95 backdrop-blur-md border-b border-gold/20 shadow-lg"
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate">{productName}</p>
              <p className="text-carbon-400 text-xs">Interested in this part?</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <a href={`https://wa.me/${whatsappNumber}?text=${waMsg}`}
                target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] text-xs font-semibold py-2 px-3 rounded-lg hover:bg-[#25D366]/20 transition-colors">
                <MessageCircle size={13} /> WhatsApp
              </a>
              <a href="#inquiry"
                className="flex items-center gap-1.5 bg-gold text-carbon-950 text-xs font-bold py-2 px-4 rounded-lg hover:bg-gold-light transition-colors">
                Get Quote <ArrowRight size={13} />
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
