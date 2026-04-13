"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface Props {
  images: string[];
  name: string;
}

export function ProductGallery({ images, name }: Props) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const hasImages = images.length > 0;

  if (!hasImages) {
    return (
      <div className="aspect-square bg-carbon-800 rounded-lg flex items-center justify-center">
        <span className="text-6xl opacity-20">🔩</span>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Main image */}
      <div className="relative aspect-square bg-carbon-800 rounded-lg overflow-hidden group">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0"
          >
            <Image
              src={images[activeIndex]}
              alt={`${name} - Image ${activeIndex + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((i) => (i - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-gold/30"
            >
              <ChevronLeft size={16} className="text-white" />
            </button>
            <button
              onClick={() => setActiveIndex((i) => (i + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 glass rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:border-gold/30"
            >
              <ChevronRight size={16} className="text-white" />
            </button>
          </>
        )}

        <button
          onClick={() => setIsZoomed(true)}
          className="absolute top-3 right-3 w-9 h-9 glass rounded-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <ZoomIn size={16} className="text-white" />
        </button>
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActiveIndex(i)}
              className={`relative w-16 h-16 rounded-sm overflow-hidden shrink-0 border-2 transition-all duration-200 ${
                i === activeIndex ? "border-gold" : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image src={img} alt={`Thumbnail ${i + 1}`} fill className="object-cover" sizes="64px" />
            </button>
          ))}
        </div>
      )}

      {/* Zoom modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsZoomed(false)}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-zoom-out"
          >
            <div className="relative max-w-4xl max-h-[90vh] w-full h-full">
              <Image
                src={images[activeIndex]}
                alt={name}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
