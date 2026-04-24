import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";
import { getSettings } from "@/lib/settings";

const footerLinks = {
  company: [
    { label: "About Us", href: "/about" },
    { label: "Products", href: "/products" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  categories: [
    { label: "Engine Parts", href: "/products?category=engine-parts" },
    { label: "Suspension", href: "/products?category=suspension" },
    { label: "Brakes", href: "/products?category=brakes" },
    { label: "Body Parts", href: "/products?category=body-parts" },
    { label: "Electrical", href: "/products?category=electrical" },
  ],
};

export async function Footer() {
  const settings = await getSettings();
  const phone = settings.contact_phone || "+91 84481 76091";
  const email = settings.contact_email || "info@rrautorevamp.com";
  const address = settings.contact_address || "Delhi, India";
  // Strip +, spaces, dashes so wa.me link always works
  const whatsapp = (settings.whatsapp_number || "919205876091").replace(/[\s+\-()]/g, "");
  const instagram = settings.social_instagram || "https://www.instagram.com/rr_auto_revamp/";
  const facebook = settings.social_facebook || "https://www.facebook.com/sharer.php?t=R%20R%20Auto%20Parts%20Dealer%20in%20Delhi%2C%20India%20%7C%20Partfinder%20India&u=https%3A%2F%2Fwww.partfinder.in%2Fshop%2Fr-r-auto-revamp-2963";
  const youtube = settings.social_youtube || "https://www.youtube.com/@r_renterprises.";

  return (
    <footer className="bg-carbon-950 border-t border-white/5">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gold-gradient rounded-sm flex items-center justify-center">
                <span className="text-carbon-950 font-display font-bold text-sm">RR</span>
              </div>
              <span className="font-display font-bold text-lg tracking-wider text-white">
                AUTO REVAMP
              </span>
            </Link>
            <p className="text-carbon-400 text-sm leading-relaxed mb-6">
              Premium automotive spare parts sourced globally. Trusted by enthusiasts and garages across India.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: instagram, label: "Instagram" },
                { Icon: Facebook, href: facebook, label: "Facebook" },
                { Icon: Youtube, href: youtube, label: "YouTube" },
              ].map(({ Icon, href, label }) => (
                <a key={label} href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 glass rounded-sm flex items-center justify-center text-carbon-400 hover:text-gold hover:border-gold/30 transition-all duration-200">
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 tracking-wide">Company</h4>
            <ul className="space-y-2">
              {footerLinks.company.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-carbon-400 text-sm hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 tracking-wide">Categories</h4>
            <ul className="space-y-2">
              {footerLinks.categories.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-carbon-400 text-sm hover:text-gold transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-white mb-4 tracking-wide">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-carbon-400">
                <MapPin size={16} className="text-gold mt-0.5 shrink-0" />
                <span>{address}</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-gold shrink-0" />
                <a href={`tel:${phone.replace(/\s/g, "")}`}
                  className="text-carbon-400 hover:text-gold transition-colors">
                  {phone}
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gold shrink-0" />
                <a href={`mailto:${email}`}
                  className="text-carbon-400 hover:text-gold transition-colors">
                  {email}
                </a>
              </li>
            </ul>

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 flex items-center gap-2 text-sm text-[#25D366] hover:text-[#25D366]/80 transition-colors"
            >
              <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current shrink-0">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Chat on WhatsApp
            </a>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-carbon-500 text-xs">
            © {new Date().getFullYear()} RR Auto Revamp. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-carbon-500 text-xs hover:text-gold transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="text-carbon-500 text-xs hover:text-gold transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
