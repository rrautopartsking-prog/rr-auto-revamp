export function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="glass rounded-lg overflow-hidden">
          <div className="aspect-[4/3] shimmer-bg" />
          <div className="p-4 space-y-3">
            <div className="h-4 shimmer-bg rounded w-3/4" />
            <div className="h-3 shimmer-bg rounded w-1/2" />
            <div className="flex gap-2">
              <div className="h-6 shimmer-bg rounded w-16" />
              <div className="h-6 shimmer-bg rounded w-16" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
