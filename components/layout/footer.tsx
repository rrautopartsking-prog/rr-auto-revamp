import Link from "next/link";
import { Phone, Mail, MapPin, Instagram, Facebook, Youtube } from "lucide-react";

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

export function Footer() {
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
              Premium automotive spare parts sourced globally. Trusted by enthusiasts and garages across the GCC.
            </p>
            <div className="flex gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 glass rounded-sm flex items-center justify-center text-carbon-400 hover:text-gold hover:border-gold/30 transition-all duration-200"
                >
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
                <span>Delhi, India</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Phone size={16} className="text-gold shrink-0" />
                <a href="tel:+971XXXXXXXXX" className="text-carbon-400 hover:text-gold transition-colors">
                  +91 84481 76091
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Mail size={16} className="text-gold shrink-0" />
                <a href="mailto:rrautopartsking@gmail.com" className="text-carbon-400 hover:text-gold transition-colors">
                  rrautopartsking@gmail.com
                </a>
              </li>
            </ul>
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
