import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function tier(confidence: number): "high" | "medium" | "low" {
  if (confidence >= 0.95) return "high";
  if (confidence >= 0.8) return "medium";
  return "low";
}

export function tierClass(confidence: number): string {
  const t = tier(confidence);
  if (t === "high") return "pill-green";
  if (t === "medium") return "pill-yellow";
  return "pill-red";
}

export function pct(confidence: number): string {
  return `${Math.round(confidence * 100)}%`;
}

export function fmtMoney(n: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(n);
}

export function fmtDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function fmtDateOnly(iso: string): string {
  try {
    const d = new Date(iso);
    if (isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export function relativeTime(iso: string): string {
  const now = new Date();
  const then = new Date(iso);
  const diffMs = now.getTime() - then.getTime();
  const min = Math.floor(diffMs / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day < 30) return `${day}d ago`;
  return fmtDateOnly(iso);
}

export const STATUS_LABEL: Record<string, string> = {
  INTAKE: "Intake",
  AI_CAPTURE: "AI Capture",
  CLERK_REVIEW: "Clerk Review",
  ROUTED: "Routed",
  PENDING_APPROVAL: "Pending Approval",
  APPROVED: "Approved",
  REJECTED: "Rejected",
  RETURNED: "Returned for info",
  POSTED: "Posted",
  EXCEPTION: "Exception",
};

export function statusClass(status: string): string {
  switch (status) {
    case "POSTED":
      return "pill-green";
    case "APPROVED":
      return "pill-green";
    case "PENDING_APPROVAL":
      return "pill-blue";
    case "ROUTED":
      return "pill-blue";
    case "CLERK_REVIEW":
      return "pill-yellow";
    case "AI_CAPTURE":
      return "pill-slate";
    case "INTAKE":
      return "pill-slate";
    case "EXCEPTION":
      return "pill-red";
    case "REJECTED":
      return "pill-red";
    case "RETURNED":
      return "pill-yellow";
    default:
      return "pill-slate";
  }
}
