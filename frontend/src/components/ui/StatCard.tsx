import { LucideIcon, ArrowUp, ArrowDown } from "lucide-react";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  change?: number;
}

export default function StatCard({ label, value, icon: Icon, iconBg, iconColor, change }: StatCardProps) {
  const positive = (change ?? 0) >= 0;
  return (
    <div className="rounded-2xl border border-ink-100 bg-white p-5 shadow-card">
      <div className="flex items-center gap-4">
        <div className={`grid h-12 w-12 shrink-0 place-items-center rounded-full ${iconBg}`}>
          <Icon size={20} className={iconColor} />
        </div>
        <div>
          <p className="text-sm text-ink-500">{label}</p>
          <p className="text-2xl font-bold text-ink-900">{value}</p>
        </div>
      </div>
      {change !== undefined && (
        <p className={`mt-3 flex items-center gap-1 text-xs font-medium ${positive ? "text-brand-600" : "text-rose-500"}`}>
          {positive ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
          {Math.abs(change)}% <span className="text-ink-400">vs last month</span>
        </p>
      )}
    </div>
  );
}
