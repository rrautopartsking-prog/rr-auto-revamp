"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";

interface Props {
  whatsappNumber?: string;
}

export function WhatsAppButton({ whatsappNumber = "919205876091" }: Props) {
  const message = encodeURIComponent("Hello! I'm interested in automotive parts from RR Auto Revamp.");
  // Strip ALL non-digits — wa.me needs plain digits only (e.g. 919205876091)
  const cleanNumber = whatsappNumber.replace(/\D/g, "");

  return (
    <motion.a
      href={`https://wa.me/${cleanNumber}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-[#25D366] rounded-full flex items-center justify-center shadow-lg hover:shadow-[0_0_20px_rgba(37,211,102,0.4)] transition-shadow"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: "spring", stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle size={26} className="text-white fill-white" />
      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
    </motion.a>
  );
}
