import { cn, pct, tier, tierClass } from "../lib/utils";
import { Info } from "lucide-react";
import type { ReactNode } from "react";

export function DemoBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn("demo-badge", className)}
      title="This data is mocked for the prototype demo. No real backend is connected."
    >
      <Info className="h-2.5 w-2.5" />
      Demo Data
    </span>
  );
}

export function ConfidencePill({
  confidence,
  showPct = true,
  className,
}: {
  confidence: number;
  showPct?: boolean;
  className?: string;
}) {
  return (
    <span className={cn(tierClass(confidence), className)} title={`Confidence: ${pct(confidence)}`}>
      <span
        className={cn(
          "h-1.5 w-1.5 rounded-full",
          tier(confidence) === "high" && "bg-emerald-500",
          tier(confidence) === "medium" && "bg-amber-500",
          tier(confidence) === "low" && "bg-rose-500"
        )}
      />
      {showPct ? pct(confidence) : tier(confidence).toUpperCase()}
    </span>
  );
}

export function Section({
  title,
  description,
  right,
  children,
}: {
  title: string;
  description?: string;
  right?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <header className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="text-sm text-slate-500">{description}</p>
          )}
        </div>
        {right}
      </header>
      {children}
    </section>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
    </div>
  );
}

export function Card({
  children,
  className,
  padded = true,
}: {
  children: ReactNode;
  className?: string;
  padded?: boolean;
}) {
  return (
    <div className={cn("card", padded && "p-4 sm:p-5", className)}>
      {children}
    </div>
  );
}

export function KeyValue({
  label,
  value,
  badge,
}: {
  label: string;
  value: ReactNode;
  badge?: ReactNode;
}) {
  return (
    <div>
      <dt className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
        {badge}
      </dt>
      <dd className="mt-0.5 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export function EmptyState({
  title,
  description,
  icon,
}: {
  title: string;
  description?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="card flex flex-col items-center justify-center px-6 py-12 text-center">
      {icon && <div className="mb-3 text-slate-400">{icon}</div>}
      <p className="text-sm font-medium text-slate-700">{title}</p>
      {description && (
        <p className="mt-1 max-w-sm text-xs text-slate-500">{description}</p>
      )}
    </div>
  );
}
