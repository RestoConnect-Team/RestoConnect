interface StatCardProps {
  value: string | number;
  label: string;
  sub: string;
  accent?: "pink" | "amber";
}

export function StatCard({ value, label, sub, accent }: StatCardProps) {
  const valueColor =
    accent === "pink"
      ? "text-[rgb(230,0,126)]"
      : accent === "amber"
        ? "text-amber-500"
        : "text-gray-900";
  return (
    <div className="bg-white rounded-xl border border-gray-200 px-5 py-4 flex-1 min-w-0">
      <p className={`text-2xl font-bold ${valueColor}`}>{value}</p>
      <p className="text-[13px] font-semibold text-gray-700 mt-0.5">{label}</p>
      <p className="text-[11px] text-gray-400">{sub}</p>
    </div>
  );
}
