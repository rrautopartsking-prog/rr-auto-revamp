interface Props {
  brands: { brand: string; count: number }[];
}

export function TopBrands({ brands }: Props) {
  const max = brands[0]?.count || 1;

  return (
    <div className="glass rounded-lg p-5">
      <h3 className="font-display font-semibold text-white mb-5">Top Searched Brands</h3>
      <div className="space-y-3">
        {brands.map((b, i) => (
          <div key={b.brand} className="flex items-center gap-3">
            <span className="text-carbon-500 text-xs w-4">{i + 1}</span>
            <div className="flex-1">
              <div className="flex justify-between mb-1">
                <span className="text-sm text-carbon-300">{b.brand}</span>
                <span className="text-sm font-semibold text-white">{b.count}</span>
              </div>
              <div className="h-1.5 bg-carbon-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gold-gradient rounded-full"
                  style={{ width: `${(b.count / max) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
        {brands.length === 0 && (
          <p className="text-carbon-500 text-sm text-center py-4">No data yet</p>
        )}
      </div>
    </div>
  );
}
