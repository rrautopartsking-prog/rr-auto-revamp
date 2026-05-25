import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Phone, Mail, MapPin, Clock, ExternalLink } from "lucide-react";
import { getSettings } from "@/lib/settings";
import { PhoneSelector } from "@/components/ui/phone-selector";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with RR Auto Revamp for premium automotive parts inquiries.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  const rawPhone = settings.contact_phone || "+91 84481 76091";
  const phones = rawPhone.split(",").map((p) => p.trim()).filter(Boolean);

  const email = settings.contact_email || "info@rrautorevamp.com";
  const address = settings.contact_address || "Delhi, India";
  const whatsapp = (settings.whatsapp_number || "919205876091").replace(/\D/g, "");
  const mapUrl = settings.contact_map_url || "https://maps.app.goo.gl/HfiZ1CQgV7w7BctV6";

  // Google Maps embed — works with both short links and full URLs
  const mapsEmbedSrc = `https://maps.google.com/maps?q=${encodeURIComponent(mapUrl)}&output=embed&z=16`;

  return (
    <div className="min-h-screen bg-carbon-950 pt-20">
      <div className="container mx-auto px-4 py-16">

        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Get In Touch</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">Contact Us</h1>
          <p className="text-carbon-400 mt-4 max-w-xl mx-auto">
            Can&apos;t find what you need? Our team sources parts globally. Submit an inquiry and we&apos;ll respond within 24 hours.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-6">

          {/* ── MAP CARD ── */}
          <div className="glass rounded-2xl overflow-hidden border border-white/10">
            {/* Map iframe */}
            <div className="relative w-full h-[340px] md:h-[420px]">
              <iframe
                src={mapsEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RR Auto Revamp Location"
                className="w-full h-full"
              />
            </div>

            {/* Contact details strip below map */}
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-white/10 border-t border-white/10">

              {/* Office / Address */}
              <div className="px-5 py-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <MapPin size={13} className="text-gold shrink-0" />
                  <span className="text-carbon-500 text-xs font-medium uppercase tracking-wide">Office</span>
                </div>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-sm leading-snug hover:text-gold transition-colors"
                >
                  {address}
                </a>
              </div>

              {/* Phone */}
              <div className="px-5 py-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Phone size={13} className="text-gold shrink-0" />
                  <span className="text-carbon-500 text-xs font-medium uppercase tracking-wide">Phone</span>
                </div>
                <div className="flex flex-col gap-0.5">
                  {phones.map((p, i) => (
                    <a
                      key={i}
                      href={`tel:${p.replace(/\s/g, "")}`}
                      className="text-white text-sm hover:text-gold transition-colors"
                    >
                      {p}
                    </a>
                  ))}
                </div>
              </div>

              {/* Email */}
              <div className="px-5 py-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Mail size={13} className="text-gold shrink-0" />
                  <span className="text-carbon-500 text-xs font-medium uppercase tracking-wide">Email</span>
                </div>
                <a
                  href={`mailto:${email}`}
                  className="text-white text-sm hover:text-gold transition-colors break-all"
                >
                  {email}
                </a>
              </div>

              {/* Hours */}
              <div className="px-5 py-4">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <Clock size={13} className="text-gold shrink-0" />
                  <span className="text-carbon-500 text-xs font-medium uppercase tracking-wide">Hours</span>
                </div>
                <p className="text-white text-sm leading-snug">Mon–Sat<br />9AM – 7PM IST</p>
              </div>
            </div>

            {/* Open in Maps link */}
            <div className="px-5 py-3 border-t border-white/10 flex justify-end">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-gold text-xs hover:underline"
              >
                <ExternalLink size={12} />
                Open in Google Maps
              </a>
            </div>
          </div>

          {/* ── BOTTOM ROW: contact cards + form ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Left: quick contact cards */}
            <div className="space-y-4">
              {/* Phone selector (dropdown for multiple numbers) */}
              <PhoneSelector phones={phones} />

              {/* Email */}
              <a
                href={`mailto:${email}`}
                className="flex items-start gap-4 glass rounded-lg p-4 hover:border-gold/30 transition-all group"
              >
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <Mail size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-carbon-500 text-xs">Email</div>
                  <div className="text-white text-sm font-medium mt-0.5 break-all">{email}</div>
                </div>
              </a>

              {/* Location */}
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 glass rounded-lg p-4 hover:border-gold/30 transition-all group"
              >
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <MapPin size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-carbon-500 text-xs">Location</div>
                  <div className="text-white text-sm font-medium mt-0.5">{address}</div>
                </div>
              </a>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-lg hover:bg-[#25D366]/20 transition-all"
              >
                <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <div className="text-[#25D366] font-semibold text-sm">Chat on WhatsApp</div>
                  <div className="text-carbon-400 text-xs">Fastest response</div>
                </div>
              </a>
            </div>

            {/* Right: inquiry form */}
            <div className="lg:col-span-2">
              <InquiryForm type="GENERAL_INQUIRY" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
