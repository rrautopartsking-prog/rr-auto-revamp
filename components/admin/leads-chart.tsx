"use client";

interface Props {
  leadsByStatus: { status: string; count: number }[];
}

const statusColors: Record<string, string> = {
  NEW: "#3b82f6",
  CONTACTED: "#f59e0b",
  QUALIFIED: "#10b981",
  CLOSED: "#6b7280",
  SPAM: "#ef4444",
};

export function LeadsChart({ leadsByStatus }: Props) {
  const total = leadsByStatus.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="glass rounded-lg p-5">
      <h3 className="font-display font-semibold text-white mb-5">Leads by Status</h3>

      <div className="space-y-3">
        {leadsByStatus.map((item) => {
          const pct = total > 0 ? (item.count / total) * 100 : 0;
          const color = statusColors[item.status] || "#9e9e9e";
          return (
            <div key={item.status}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-carbon-300">{item.status}</span>
                <span className="text-sm font-semibold text-white">{item.count}</span>
              </div>
              <div className="h-2 bg-carbon-800 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, backgroundColor: color }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {total === 0 && (
        <p className="text-carbon-500 text-sm text-center py-4">No leads yet</p>
      )}
    </div>
  );
}
