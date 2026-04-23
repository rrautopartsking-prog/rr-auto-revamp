import { NextRequest, NextResponse } from "next/server";
import { getAuthUser } from "@/lib/auth";
import { isDbConnected } from "@/lib/db";

export const dynamic = "force-dynamic";

export const defaultAboutData = {
  hero: {
    badge: "Our Story",
    headline: "Built for Gearheads,\nBy Gearheads",
    subheadline:
      "RR Auto Revamp was born in the workshops of Delhi — where grease-stained hands and relentless passion for machines turned a small parts shop into India's most trusted automotive sourcing partner.",
    backgroundImage: "",
  },
  stats: [
    { value: "10+", label: "Years Experience" },
    { value: "50K+", label: "Parts Sourced" },
    { value: "8K+", label: "Happy Customers" },
    { value: "120+", label: "Brands Covered" },
  ],
  story: {
    title: "From a Single Garage to a National Network",
    paragraphs: [
      "It started in 2013 with a single garage in Karol Bagh, Delhi. Our founder Rajesh Rathore had one mission: make genuine automotive parts accessible to every mechanic and enthusiast in India — without the markup, without the wait.",
      "What began as a local operation quickly grew into a pan-India sourcing network. Today, RR Auto Revamp works with OEM suppliers, authorized distributors, and performance specialists across 15+ countries to bring you parts that are hard to find anywhere else.",
      "We don't just sell parts. We solve problems. Whether it's a rare chassis component for a vintage Maruti or a performance upgrade for a modern SUV, our team digs until we find it.",
    ],
    image: "",
  },
  values: [
    {
      icon: "shield",
      title: "Authenticity First",
      description:
        "Every part we source is verified for authenticity. No counterfeits, no compromises — your safety depends on it.",
    },
    {
      icon: "zap",
      title: "Speed of Delivery",
      description:
        "We know downtime costs money. Our logistics network ensures the fastest possible turnaround from order to doorstep.",
    },
    {
      icon: "users",
      title: "Expert Guidance",
      description:
        "Our team includes ex-mechanics, automotive engineers, and parts specialists who speak your language.",
    },
    {
      icon: "globe",
      title: "Global Reach",
      description:
        "Sourcing from Japan, Germany, UAE, and beyond — if the part exists, we'll find it for you.",
    },
    {
      icon: "heart",
      title: "Customer Obsession",
      description:
        "We measure success by your satisfaction. Every inquiry gets a human response within 24 hours.",
    },
    {
      icon: "award",
      title: "Quality Guaranteed",
      description:
        "All parts come with warranty support and our personal guarantee. If it's wrong, we make it right.",
    },
  ],
  team: [
    {
      name: "Rajesh Rathore",
      role: "Founder & CEO",
      bio: "20+ years in the automotive industry. Started as a mechanic, built an empire.",
      image: "",
      linkedin: "",
    },
    {
      name: "Priya Sharma",
      role: "Head of Sourcing",
      bio: "Former OEM procurement specialist with a network spanning 3 continents.",
      image: "",
      linkedin: "",
    },
    {
      name: "Arjun Mehta",
      role: "Technical Lead",
      bio: "Automotive engineer who ensures every part meets spec before it ships.",
      image: "",
      linkedin: "",
    },
    {
      name: "Sunita Verma",
      role: "Customer Success",
      bio: "The voice behind every satisfied customer. 5-star service is her baseline.",
      image: "",
      linkedin: "",
    },
  ],
  timeline: [
    {
      year: "2013",
      title: "The Garage Begins",
      description: "Founded in Karol Bagh with 3 employees and a passion for genuine parts.",
    },
    {
      year: "2015",
      title: "First OEM Partnership",
      description: "Secured direct supply agreements with 5 major OEM distributors.",
    },
    {
      year: "2017",
      title: "Online Store Launch",
      description: "Took the business digital, reaching customers across India.",
    },
    {
      year: "2019",
      title: "International Sourcing",
      description: "Expanded to source parts from Japan, Germany, and the UAE.",
    },
    {
      year: "2021",
      title: "50,000 Parts Milestone",
      description: "Crossed 50,000 successful parts deliveries with 98% satisfaction rate.",
    },
    {
      year: "2024",
      title: "Platform Relaunch",
      description: "Launched the new RR Auto Revamp platform with real-time inventory and instant quotes.",
    },
  ],
  gallery: [
    { url: "", caption: "Our main warehouse in Delhi" },
    { url: "", caption: "Quality inspection process" },
    { url: "", caption: "International parts sourcing" },
    { url: "", caption: "Team at work" },
    { url: "", caption: "Customer delivery day" },
    { url: "", caption: "Performance parts collection" },
  ],
  cta: {
    title: "Ready to Find Your Part?",
    subtitle: "Join 8,000+ customers who trust RR Auto Revamp for their automotive needs.",
    buttonText: "Get a Quote",
    buttonHref: "/contact",
  },
};

export async function GET() {
  if (!isDbConnected()) {
    return NextResponse.json({ success: true, data: defaultAboutData });
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    const row = await prisma.siteSettings.findUnique({ where: { key: "about_page_data" } });
    if (row) {
      return NextResponse.json({ success: true, data: JSON.parse(row.value) });
    }
    return NextResponse.json({ success: true, data: defaultAboutData });
  } catch {
    return NextResponse.json({ success: true, data: defaultAboutData });
  }
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser(req);
  if (!user) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

  const body = await req.json();

  if (!isDbConnected()) {
    return NextResponse.json({ success: true });
  }

  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.siteSettings.upsert({
      where: { key: "about_page_data" },
      update: { value: JSON.stringify(body) },
      create: { key: "about_page_data", value: JSON.stringify(body) },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Failed to save" }, { status: 500 });
  }
}
