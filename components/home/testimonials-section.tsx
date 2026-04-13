"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    name: "Ahmed Al-Rashidi",
    role: "Garage Owner, Dubai",
    content: "RR Auto Revamp has been our go-to supplier for over 3 years. The quality is unmatched and delivery is always on time.",
    rating: 5,
  },
  {
    name: "Mohammed Al-Farsi",
    role: "Porsche Enthusiast, Abu Dhabi",
    content: "Found a rare part for my 911 Turbo that no one else could source. Incredible network and professional service.",
    rating: 5,
  },
  {
    name: "Khalid Al-Mansouri",
    role: "Fleet Manager, Riyadh",
    content: "Managing a fleet of 50+ vehicles, RR Auto Revamp handles all our bulk orders efficiently. Highly recommended.",
    rating: 5,
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-20 bg-carbon-900">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Testimonials</span>
          <h2 className="section-title text-white mt-2">What Our Clients Say</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass rounded-lg p-6 relative"
            >
              <Quote size={32} className="text-gold/20 absolute top-4 right-4" />
              <div className="flex gap-1 mb-4">
                {Array.from({ length: t.rating }).map((_, j) => (
                  <Star key={j} size={14} className="text-gold fill-gold" />
                ))}
              </div>
              <p className="text-carbon-300 text-sm leading-relaxed mb-6">&ldquo;{t.content}&rdquo;</p>
              <div>
                <div className="font-display font-semibold text-white text-sm">{t.name}</div>
                <div className="text-carbon-500 text-xs mt-0.5">{t.role}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
