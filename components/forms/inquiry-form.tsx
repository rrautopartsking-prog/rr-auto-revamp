"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Upload, Send, CheckCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { leadSchema, type LeadInput } from "@/lib/validations";
import { CAR_BRANDS, getModelsForBrand, generateYears, FUEL_TYPES, COUNTRY_SPECS } from "@/lib/car-data";

interface Props {
  productId?: string;
  productName?: string;
  prefillBrand?: string;
  prefillModel?: string;
  type?: "PRODUCT_INQUIRY" | "GENERAL_INQUIRY" | "BULK_INQUIRY";
}

const DRAFT_KEY = "rr_lead_draft";

export function InquiryForm({ productId, productName, prefillBrand, prefillModel, type = "PRODUCT_INQUIRY" }: Props) {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedBrand, setSelectedBrand] = useState(prefillBrand || "");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      type,
      brand: prefillBrand,
      model: prefillModel,
      partName: productName,
      productId,
    },
  });

  const watchedBrand = watch("brand");
  const models = watchedBrand ? getModelsForBrand(watchedBrand) : [];
  const years = generateYears();

  // Auto-save draft
  useEffect(() => {
    const subscription = watch((data) => {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  // Load draft
  useEffect(() => {
    if (!prefillBrand) {
      const draft = localStorage.getItem(DRAFT_KEY);
      if (draft) {
        try {
          const parsed = JSON.parse(draft);
          Object.entries(parsed).forEach(([key, value]) => {
            if (value) setValue(key as keyof LeadInput, value as string);
          });
        } catch {}
      }
    }
  }, []);

  const onSubmit = async (data: LeadInput) => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) throw new Error(result.error || "Submission failed");

      setIsSubmitted(true);
      localStorage.removeItem(DRAFT_KEY);
      toast.success("Inquiry submitted! Check your email for confirmation.", { duration: 5000 });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass rounded-lg p-10 text-center"
      >
        <div className="w-16 h-16 bg-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle size={32} className="text-gold" />
        </div>
        <h3 className="font-display text-2xl font-bold text-white mb-2">Inquiry Received! 🎉</h3>
        <p className="text-carbon-300 text-base mb-2">
          Hi, thank you for reaching out to RR Auto Revamp.
        </p>
        <p className="text-carbon-400 text-sm mb-6 leading-relaxed">
          We've received your inquiry and our team will get back to you within <span className="text-gold font-semibold">2–4 hours</span>.<br />
          A confirmation has been sent to your email.
        </p>
        <div className="bg-carbon-900 border border-carbon-700 rounded-lg p-4 mb-6 text-left">
          <p className="text-carbon-400 text-xs mb-1">Need a faster response?</p>
          <a
            href="https://wa.me/rrautorevamp"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-gold transition-colors"
          >
            <span className="text-green-400">💬</span> Chat with us on WhatsApp
          </a>
        </div>
        <button onClick={() => { setIsSubmitted(false); reset(); }} className="btn-ghost-gold text-sm">
          Submit Another Inquiry
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="glass rounded-lg p-6 space-y-5">
      {/* Type selector */}
      <div className="flex gap-2">
        {(["PRODUCT_INQUIRY", "GENERAL_INQUIRY", "BULK_INQUIRY"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setValue("type", t)}
            className={`text-xs px-3 py-1.5 rounded-sm border transition-all ${
              watch("type") === t
                ? "border-gold text-gold bg-gold/10"
                : "border-carbon-600 text-carbon-400 hover:border-gold/50"
            }`}
          >
            {t.replace("_", " ")}
          </button>
        ))}
      </div>

      {/* Contact info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs text-carbon-400 mb-1 block">Full Name *</label>
          <input {...register("name")} placeholder="Your name" className="input-premium" />
          {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
        </div>
        <div>
          <label className="text-xs text-carbon-400 mb-1 block">Phone *</label>
          <input {...register("phone")} placeholder="+971 XX XXX XXXX" className="input-premium" />
          {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone.message}</p>}
        </div>
        <div>
          <label className="text-xs text-carbon-400 mb-1 block">Email *</label>
          <input {...register("email")} type="email" placeholder="your@email.com" className="input-premium" />
          {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
        </div>
        <div>
          <label className="text-xs text-carbon-400 mb-1 block">Company</label>
          <input {...register("company")} placeholder="Company name (optional)" className="input-premium" />
        </div>
      </div>

      {/* Car details */}
      <div className="border-t border-carbon-800 pt-5">
        <h4 className="text-sm font-semibold text-white mb-4">Vehicle Details</h4>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Brand</label>
            <select
              {...register("brand")}
              onChange={(e) => { setValue("brand", e.target.value); setSelectedBrand(e.target.value); setValue("model", ""); }}
              className="input-premium"
            >
              <option value="">Select brand</option>
              {CAR_BRANDS.map((b) => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Model</label>
            <select {...register("model")} className="input-premium" disabled={!watchedBrand}>
              <option value="">Select model</option>
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Year</label>
            <select {...register("year", { valueAsNumber: true })} className="input-premium">
              <option value="">Year</option>
              {years.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Fuel Type</label>
            <select {...register("fuelType")} className="input-premium">
              <option value="">Fuel type</option>
              {FUEL_TYPES.map((f) => <option key={f} value={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Country Spec</label>
            <select {...register("countrySpec")} className="input-premium">
              <option value="">Spec</option>
              {COUNTRY_SPECS.map((cs) => <option key={cs} value={cs}>{cs}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Chassis No.</label>
            <input {...register("chassisNumber")} placeholder="VIN / Chassis" className="input-premium" />
          </div>
        </div>
      </div>

      {/* Part details */}
      <div className="border-t border-carbon-800 pt-5">
        <h4 className="text-sm font-semibold text-white mb-4">Part Details</h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Part Name</label>
            <input {...register("partName")} placeholder="e.g. Engine Mount" className="input-premium" />
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Part Number</label>
            <input {...register("partNumber")} placeholder="OEM part number" className="input-premium" />
          </div>
          <div>
            <label className="text-xs text-carbon-400 mb-1 block">Quantity</label>
            <input {...register("quantity", { valueAsNumber: true })} type="number" min="1" placeholder="1" className="input-premium" />
          </div>
        </div>
        <div className="mt-4">
          <label className="text-xs text-carbon-400 mb-1 block">Additional Notes</label>
          <textarea
            {...register("message")}
            rows={3}
            placeholder="Any additional details about the part or your vehicle..."
            className="input-premium resize-none"
          />
        </div>
      </div>

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        className="btn-gold w-full flex items-center justify-center gap-2 text-base"
      >
        {isLoading ? (
          <><Loader2 size={18} className="animate-spin" /> Submitting...</>
        ) : (
          <><Send size={18} /> Submit Inquiry</>
        )}
      </motion.button>

      <p className="text-carbon-500 text-xs text-center">
        Your inquiry is saved as draft automatically. We respond within 24 hours.
      </p>
    </form>
  );
}
