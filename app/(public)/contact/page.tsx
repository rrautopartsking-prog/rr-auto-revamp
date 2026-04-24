import type { Metadata } from "next";
import { InquiryForm } from "@/components/forms/inquiry-form";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with RR Auto Revamp for premium automotive parts inquiries.",
};

export default async function ContactPage() {
  const settings = await getSettings();

  const phone = settings.contact_phone || "+91 84481 76091";
  const email = settings.contact_email || "info@rrautorevamp.com";
  const address = settings.contact_address || "Delhi, India";
  const whatsapp = (settings.whatsapp_number || "919205876091").replace(/[\s+\-()]/g, "");

  const contactInfo = [
    { icon: Phone, label: "Phone", value: phone, href: `tel:${phone.replace(/\s/g, "")}` },
    { icon: Mail, label: "Email", value: email, href: `mailto:${email}` },
    { icon: MapPin, label: "Location", value: address, href: "#" },
    { icon: Clock, label: "Hours", value: "Mon–Sat: 9AM – 7PM IST", href: "#" },
  ];

  return (
    <div className="min-h-screen bg-carbon-950 pt-20">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <span className="text-gold text-xs font-semibold tracking-[0.3em] uppercase">Get In Touch</span>
          <h1 className="font-display text-4xl md:text-5xl font-bold text-white mt-2">Contact Us</h1>
          <p className="text-carbon-400 mt-4 max-w-xl mx-auto">
            Can&apos;t find what you need? Our team sources parts globally. Submit an inquiry and we&apos;ll respond within 24 hours.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {/* Contact info */}
          <div className="space-y-4">
            {contactInfo.map((item) => (
              <a key={item.label} href={item.href}
                className="flex items-start gap-4 glass rounded-lg p-4 hover:border-gold/30 transition-all group">
                <div className="w-10 h-10 bg-gold/10 rounded-sm flex items-center justify-center shrink-0 group-hover:bg-gold/20 transition-colors">
                  <item.icon size={18} className="text-gold" />
                </div>
                <div>
                  <div className="text-carbon-500 text-xs">{item.label}</div>
                  <div className="text-white text-sm font-medium mt-0.5">{item.value}</div>
                </div>
              </a>
            ))}

            {/* WhatsApp CTA */}
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-[#25D366]/10 border border-[#25D366]/30 rounded-lg hover:bg-[#25D366]/20 transition-all"
            >
              <div className="w-10 h-10 bg-[#25D366] rounded-full flex items-center justify-center shrink-0">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </div>
              <div>
                <div className="text-[#25D366] font-semibold text-sm">Chat on WhatsApp</div>
                <div className="text-carbon-400 text-xs">Fastest response</div>
              </div>
            </a>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <InquiryForm type="GENERAL_INQUIRY" />
          </div>
        </div>
      </div>
    </div>
  );
}
