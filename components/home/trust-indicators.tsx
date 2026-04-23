"use client";

import { motion } from "framer-motion";
import { Shield, Truck, Award, Headphones, CheckCircle, Globe } from "lucide-react";

const indicators = [
  { icon: Shield, title: "Genuine Parts", desc: "100% authentic OEM and certified aftermarket parts" },
  { icon: Award, title: "Quality Assured", desc: "Every part inspected before dispatch" },
  { icon: Globe, title: "Global Sourcing", desc: "Parts sourced from 50+ countries worldwide" },
  { icon: Truck, title: "Fast Delivery", desc: "Express shipping across the GCC" },
  { icon: Headphones, title: "Expert Support", desc: "Technical team available 7 days a week" },
  { icon: CheckCircle, title: "Fitment Guarantee", desc: "Verified compatibility for your vehicle" },
];

export function TrustIndicators() {
  return (
    <section className="py-20 bg-carbon-950 border-y border-white/5">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Why Choose Us</span>
          <h2 className="section-title text-white mt-2">The RR Difference</h2>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {indicators.map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 p-5 glass rounded-lg hover:border-gold/20 transition-all duration-300 group"
            >
              <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                <item.icon size={20} className="text-gold" />
              </div>
              <div>
                <h3 className="font-display font-semibold text-white text-sm mb-1">{item.title}</h3>
                <p className="text-carbon-400 text-xs leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
