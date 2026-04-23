"use client";

import { useEffect, useState } from "react";

export function LiveViewers() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    // Realistic random between 2–8 viewers
    const base = Math.floor(Math.random() * 6) + 2;
    setCount(base);

    // Fluctuate every 8–15 seconds
    const interval = setInterval(() => {
      setCount((prev) => {
        const delta = Math.random() > 0.5 ? 1 : -1;
        return Math.max(2, Math.min(12, prev + delta));
      });
    }, Math.random() * 7000 + 8000);

    return () => clearInterval(interval);
  }, []);

  if (count === 0) return null;

  return (
    <div className="flex items-center gap-2 text-xs text-carbon-400">
      <span className="flex gap-0.5">
        {Array.from({ length: Math.min(count, 5) }).map((_, i) => (
          <span key={i} className="w-2 h-2 rounded-full bg-green-400 opacity-80"
            style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </span>
      <span>
        <span className="text-green-400 font-semibold">{count} people</span> viewing this right now
      </span>
    </div>
  );
}
