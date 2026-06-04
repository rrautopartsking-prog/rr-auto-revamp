// Central gtag helper — call these anywhere in client components

export const GA_ID = "G-S3L852Q8DS";

declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}

// ── Page view (called on route changes) ──
export function pageview(url: string) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("config", GA_ID, { page_path: url });
}

// ── Generic event ──
export function event(
  action: string,
  params: Record<string, string | number | boolean> = {}
) {
  if (typeof window === "undefined" || !window.gtag) return;
  window.gtag("event", action, params);
}

// ── Shorthand helpers ──

export const gaEvents = {
  // Forms
  inquirySubmit: (type: string, brand?: string, partName?: string) =>
    event("inquiry_submit", { inquiry_type: type, car_brand: brand || "unknown", part_name: partName || "general" }),

  inquiryStart: (type: string) =>
    event("inquiry_start", { inquiry_type: type }),

  // Products
  productView: (name: string, sku?: string, category?: string) =>
    event("view_item", { item_name: name, item_id: sku || "", item_category: category || "" }),

  productSearch: (query: string) =>
    event("search", { search_term: query }),

  // Contact / Engagement
  whatsappClick: (source: string) =>
    event("whatsapp_click", { source }),

  phoneClick: (phone: string, source: string) =>
    event("phone_click", { phone_number: phone, source }),

  emailClick: (source: string) =>
    event("email_click", { source }),

  mapClick: (source: string) =>
    event("map_click", { source }),

  // Navigation
  ctaClick: (label: string, location: string) =>
    event("cta_click", { cta_label: label, page_location: location }),

  // Blog
  blogView: (title: string, slug: string) =>
    event("blog_view", { blog_title: title, blog_slug: slug }),
};
