"use client";

import { useState, useRef, useEffect } from "react";
import { Phone, ChevronDown } from "lucide-react";
import { gaEvents } from "@/lib/gtag";

interface PhoneSelectorProps {
  phones: string[]; // array of phone numbers
}

export function PhoneSelector({ phones }: PhoneSelectorProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // If only one number, just dial directly
  if (phones.length === 1) {
    return (
      <a
        href={`tel:${phones[0].replace(/\s/g, "")}`}
        className="flex items-start gap-4 glass rounded-lg p-4 hover:border-gold/30 transition-all group"
      >
        <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
          <Phone size={18} className="text-gold" />
        </div>
        <div>
          <div className="text-carbon-500 text-xs">Phone</div>
          <div className="text-white text-sm font-medium mt-0.5">{phones[0]}</div>
        </div>
      </a>
    );
  }

  return (
    <div ref={ref} className="relative">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="w-full flex items-start gap-4 glass rounded-lg p-4 hover:border-gold/30 transition-all group text-left"
      >
        <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
          <Phone size={18} className="text-gold" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-carbon-500 text-xs">Phone</div>
          <div className="text-white text-sm font-medium mt-0.5">{phones[0]}</div>
          <div className="text-carbon-500 text-xs mt-0.5">+{phones.length - 1} more number{phones.length - 1 > 1 ? "s" : ""}</div>
        </div>
        <ChevronDown
          size={16}
          className={`text-carbon-400 mt-1 shrink-0 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute left-0 right-0 top-full mt-1 z-50 glass rounded-lg border border-white/10 overflow-hidden shadow-premium">
          <div className="px-3 py-2 border-b border-white/5">
            <span className="text-carbon-500 text-xs">Select a number to call</span>
          </div>
          {phones.map((phone, i) => (
            <a
              key={i}
              href={`tel:${phone.replace(/\s/g, "")}`}
              onClick={() => { gaEvents.phoneClick(phone, "contact_page"); setOpen(false); }}
              className="flex items-center gap-3 px-4 py-3 hover:bg-gold/10 transition-colors group"
            >
              <div className="w-7 h-7 bg-gold/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                <Phone size={14} className="text-gold" />
              </div>
              <span className="text-white text-sm font-medium">{phone}</span>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
