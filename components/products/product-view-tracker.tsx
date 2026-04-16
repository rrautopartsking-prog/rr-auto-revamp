"use client";

import { useEffect } from "react";
import { trackProductView } from "./recently-viewed";

interface Props {
  id: string;
  slug: string;
  name: string;
  image?: string;
  brand?: string;
}

export function ProductViewTracker({ id, slug, name, image, brand }: Props) {
  useEffect(() => {
    trackProductView({ id, slug, name, image, brand });
  }, [id, slug, name, image, brand]);

  return null;
}
