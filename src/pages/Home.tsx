import { Link } from "react-router-dom";
import {
  Inbox,
  ClipboardList,
  CheckSquare,
  BarChart3,
  GitBranch,
  Settings as SettingsIcon,
  ScrollText,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { PageHeader, Card, DemoBadge } from "../components/Ui";
import { useStore } from "../lib/store";
import { ROLE_LABEL } from "../data/personas";

const TILES = [
  { to: "/intake", icon: Inbox, title: "Invoice Intake", desc: "Drag-drop upload + monitored AP inbox" },
  { to: "/queue", icon: ClipboardList, title: "AP Clerk Queue", desc: "Field-level review of low-confidence captures" },
  { to: "/approvals", icon: CheckSquare, title: "Approvals", desc: "Approve, reject, return for info" },
  { to: "/dashboard", icon: BarChart3, title: "Telemetry Dashboard", desc: "Volume · confidence · latency · health" },
  { to: "/rules", icon: GitBranch, title: "Rules & Routing", desc: "Dollar thresholds, category & branch rules" },
  { to: "/settings", icon: SettingsIcon, title: "Settings", desc: "Vendors · GL chart · branches" },
  { to: "/audit", icon: ScrollText, title: "Audit Trail", desc: "Per-invoice timeline + actor history" },
];

export function HomePage() {
  const { persona, invoices } = useStore();
  const stats = {
    inFlight: invoices.filter((i) =>
      ["INTAKE", "AI_CAPTURE", "CLERK_REVIEW", "ROUTED", "PENDING_APPROVAL"].includes(i.status)
    ).length,
    needsReview: invoices.filter((i) => i.status === "CLERK_REVIEW" || i.status === "EXCEPTION").length,
    awaitingMe: invoices.filter((i) => i.status === "PENDING_APPROVAL").length,
    postedToday: invoices.filter((i) => i.status === "POSTED").length,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${persona.name.split(" ")[0]}.`}
        subtitle={`${ROLE_LABEL[persona.role]} · ${persona.dba}`}
        actions={<DemoBadge />}
      />

      <Card className="bg-gradient-to-br from-afn-50 to-white">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-afn-700">
              <Sparkles className="h-3.5 w-3.5" /> Phase 1 MVP
            </div>
            <h2 className="mt-1 text-lg font-semibold text-slate-900">
              End-to-end AP automation for the pilot DBA
            </h2>
            <p className="mt-1 max-w-2xl text-sm text-slate-600">
              Invoices arrive in the monitored AP inbox or by upload, get
              captured by Azure Document Intelligence, coded automatically
              against the Loan Vision vendor master, routed by dollar and
              category rules, and posted to Loan Vision once approved. Every
              state transition is in the audit trail.
            </p>
          </div>
          <Link to="/intake" className="btn-primary shrink-0">
            Start at Intake <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Card>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="In-flight invoices" value={stats.inFlight} accent="afn" />
        <StatCard label="Need clerk review" value={stats.needsReview} accent="amber" />
        <StatCard label="Pending approval" value={stats.awaitingMe} accent="sky" />
        <StatCard label="Posted (today)" value={stats.postedToday} accent="emerald" />
      </div>

      <div>
        <h3 className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
          Modules
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((t) => (
            <Link
              key={t.to}
              to={t.to}
              className="card group flex items-start gap-3 p-4 transition hover:border-afn-300 hover:shadow-md"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-afn-50 text-afn-700 group-hover:bg-afn-100">
                <t.icon className="h-5 w-5" />
              </span>
              <span className="flex flex-col">
                <span className="text-sm font-semibold text-slate-900">
                  {t.title}
                </span>
                <span className="mt-0.5 text-xs text-slate-500">
                  {t.desc}
                </span>
              </span>
              <ArrowRight className="ml-auto h-4 w-4 self-center text-slate-300 group-hover:text-afn-600" />
            </Link>
          ))}
        </div>
      </div>

      <Card className="border-amber-200 bg-amber-50">
        <div className="flex items-start gap-3 text-sm text-amber-900">
          <DemoBadge className="mt-0.5" />
          <div>
            <p className="font-semibold">This is a prototype — read this once.</p>
            <ul className="mt-1.5 list-inside list-disc space-y-1 text-amber-800">
              <li>All invoice data, AI confidence scores, and Loan Vision transaction IDs are mocked in-browser.</li>
              <li>No real PDF upload, no Document Intelligence call, no Loan Vision write.</li>
              <li>Switch personas via the top-right menu to see each role's view.</li>
              <li>Refresh resets everything.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "afn" | "amber" | "sky" | "emerald";
}) {
  const map: Record<string, string> = {
    afn: "text-afn-700",
    amber: "text-amber-700",
    sky: "text-sky-700",
    emerald: "text-emerald-700",
  };
  return (
    <Card padded={false} className="p-3">
      <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </div>
      <div className={"mt-1 text-2xl font-semibold " + map[accent]}>{value}</div>
    </Card>
  );
}
