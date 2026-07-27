import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/inquiry-form";
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

  const email    = settings.contact_email    || "info@rrautorevamp.com";
  const address  = settings.contact_address  || "9, The Auto Stores, 1390, Nicholson Rd, Kashmere Gate, Delhi - 110006";
  const whatsapp = (settings.whatsapp_number || "919205876091").replace(/\D/g, "");
  const mapUrl   = settings.contact_map_url  || "https://maps.app.goo.gl/YLXKF1DAMCxqvPAi9";

  const mapsEmbedSrc =
    settings.contact_map_embed ||
    `https://maps.google.com/maps?q=${encodeURIComponent(
      "9, The Auto Stores, 1390, Nicholson Rd, Kashmere Gate, Delhi, 110006"
    )}&output=embed&z=17`;

  return (
    <div className="min-h-screen bg-carbon-950 pt-20">
      <div className="container mx-auto px-4 py-16">

        {/* Page heading */}
        <div className="text-center mb-10">
          <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Get In Touch</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">Contact Us</h1>
          <p className="text-carbon-400 mt-4 max-w-xl mx-auto text-sm">
            Can&apos;t find what you need? Our team sources parts globally. Submit an inquiry and we&apos;ll respond within 24 hours.
          </p>
        </div>

        <div className="max-w-5xl mx-auto space-y-8">

          {/* ── MAP BLOCK — exactly like reference ── */}
          <div className="rounded-2xl overflow-hidden border border-white/10 bg-carbon-900">

            {/* Map — full width, tall */}
            <div className="w-full h-[320px] md:h-[420px]">
              <iframe
                src={mapsEmbedSrc}
                width="100%"
                height="100%"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="RR Auto Revamp Location"
              />
            </div>

            {/* Info strip — 2 col on mobile, 4 col on desktop, clean text like reference */}
            <div className="grid grid-cols-2 md:grid-cols-4 border-t border-white/10">

              {/* Shop */}
              <div className="px-6 py-5 border-r border-white/10">
                <p className="text-carbon-500 text-xs mb-2 uppercase tracking-widest">Shop</p>
                <a
                  href={mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white text-sm leading-relaxed hover:text-gold transition-colors"
                >
                  {address}
                </a>
              </div>

              {/* Phone */}
              <div className="px-6 py-5 border-r border-white/10">
                <p className="text-carbon-500 text-xs mb-2 uppercase tracking-widest">Phone</p>
                <div className="flex flex-col gap-1">
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
              <div className="px-6 py-5 border-r border-white/10">
                <p className="text-carbon-500 text-xs mb-2 uppercase tracking-widest">Email</p>
                <a
                  href={`mailto:${email}`}
                  className="text-white text-sm hover:text-gold transition-colors break-all"
                >
                  {email}
                </a>
              </div>

              {/* Hours */}
              <div className="px-6 py-5">
                <p className="text-carbon-500 text-xs mb-2 uppercase tracking-widest">Hours</p>
                <p className="text-white text-sm leading-relaxed">
                  Mon – Sat<br />9AM – 7PM IST
                </p>
              </div>
            </div>

            {/* View larger map link — bottom left, just like Google Maps default */}
            <div className="px-6 py-3 border-t border-white/10 flex items-center justify-between">
              <a
                href={mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-gold text-xs hover:underline"
              >
                View larger map ↗
              </a>
              {/* WhatsApp quick link */}
              <a
                href={`https://wa.me/${whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-[#25D366] text-xs hover:underline"
              >
                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-current shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* ── INQUIRY FORM + SIDE CARDS ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Side: phone picker + WhatsApp card */}
            <div className="space-y-4">
              <PhoneSelector phones={phones} />

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

            {/* Inquiry form */}
            <div className="lg:col-span-2">
              <InquiryForm type="GENERAL_INQUIRY" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
