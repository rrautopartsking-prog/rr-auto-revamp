"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, MessageCircle } from "lucide-react";

export function CTASection() {
  return (
    <section className="py-24 bg-carbon-950 relative overflow-hidden">
      {/* Background accent */}
      <div className="absolute inset-0 bg-gold-gradient opacity-5" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-full bg-gradient-to-b from-transparent via-gold/20 to-transparent" />

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center max-w-3xl mx-auto"
        >
          <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Ready to Source?</span>
          <h2 className="section-title text-white mt-4 mb-6">
            Can&apos;t Find What You&apos;re Looking For?
          </h2>
          <p className="text-carbon-400 text-lg mb-10 leading-relaxed">
            Our sourcing team can find virtually any part for any vehicle. Submit an inquiry and we&apos;ll get back to you within 24 hours.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact" className="btn-gold flex items-center justify-center gap-2 text-base">
              Submit Inquiry <ArrowRight size={18} />
            </Link>
            <a
              href={`https://wa.me/918448176091`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] rounded-sm font-semibold hover:bg-[#25D366]/20 transition-all duration-300"
            >
              <MessageCircle size={18} />
              WhatsApp Us
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
