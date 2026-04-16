import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { WhatsAppButton } from "@/components/ui/whatsapp-button";
import { InquiryNudge } from "@/components/ui/inquiry-nudge";
import { ExitIntent } from "@/components/ui/exit-intent";
import { BackToTop } from "@/components/ui/back-to-top";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
      <InquiryNudge />
      <ExitIntent />
      <BackToTop />
    </div>
  );
}
