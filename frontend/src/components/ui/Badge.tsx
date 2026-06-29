const TONES: Record<string, string> = {
  green: "bg-emerald-50 text-emerald-600",
  red: "bg-rose-50 text-rose-600",
  amber: "bg-amber-50 text-amber-600",
  blue: "bg-sky-50 text-sky-600",
  violet: "bg-violet-50 text-violet-600",
  gray: "bg-ink-100 text-ink-500",
};

export default function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: keyof typeof TONES }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${TONES[tone]}`}>
      {children}
    </span>
  );
}
