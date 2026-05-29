import {
  BarChart,
  Bar,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  LineChart,
  Line,
  Legend,
  Cell,
} from "recharts";
import { Card, DemoBadge, PageHeader } from "../components/Ui";
import { Activity, AlertOctagon, Clock, FileCheck2 } from "lucide-react";

const VOLUME_DAILY = [
  { day: "Mon", invoices: 38, posted: 32 },
  { day: "Tue", invoices: 44, posted: 39 },
  { day: "Wed", invoices: 51, posted: 46 },
  { day: "Thu", invoices: 41, posted: 36 },
  { day: "Fri", invoices: 47, posted: 41 },
  { day: "Sat", invoices: 6, posted: 5 },
  { day: "Sun", invoices: 3, posted: 2 },
];

const CONFIDENCE = [
  { bucket: "<70%", count: 4, color: "#f43f5e" },
  { bucket: "70–80%", count: 11, color: "#f43f5e" },
  { bucket: "80–90%", count: 27, color: "#f59e0b" },
  { bucket: "90–95%", count: 41, color: "#f59e0b" },
  { bucket: "95–98%", count: 78, color: "#10b981" },
  { bucket: "≥98%", count: 64, color: "#10b981" },
];

const LATENCY = [
  { week: "W1", median: 18.3, p95: 38.4 },
  { week: "W2", median: 17.1, p95: 34.7 },
  { week: "W3", median: 15.9, p95: 30.2 },
  { week: "W4", median: 14.4, p95: 27.5 },
  { week: "W5", median: 12.8, p95: 25.1 },
];

const HEALTH = [
  { label: "AI Capture", status: "Healthy", lat: "P95 8.2s", color: "text-emerald-700 bg-emerald-50 ring-emerald-200" },
  { label: "Rules Engine", status: "Healthy", lat: "P95 220ms", color: "text-emerald-700 bg-emerald-50 ring-emerald-200" },
  { label: "Loan Vision Connector", status: "Degraded", lat: "P95 4.1s", color: "text-amber-700 bg-amber-50 ring-amber-200" },
  { label: "Entra ID Auth", status: "Healthy", lat: "P95 480ms", color: "text-emerald-700 bg-emerald-50 ring-emerald-200" },
  { label: "Document Storage", status: "Healthy", lat: "P95 90ms", color: "text-emerald-700 bg-emerald-50 ring-emerald-200" },
];

export function DashboardPage() {
  return (
    <div className="space-y-5">
      <PageHeader
        title="Operational Telemetry"
        subtitle="Phase 1 exit criteria are measured here. All numbers below are illustrative."
        actions={<DemoBadge />}
      />

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <KPI label="Invoices this week" value="230" delta="+12%" icon={Activity} accent="afn" />
        <KPI label="Field accuracy (avg)" value="96.4%" delta="+0.8 pp" icon={FileCheck2} accent="emerald" />
        <KPI label="Exception rate" value="6.1%" delta="−1.4 pp" icon={AlertOctagon} accent="amber" />
        <KPI label="End-to-end P95 latency" value="12.8 s" delta="On target" icon={Clock} accent="sky" />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <h3 className="text-sm font-semibold">Invoice volume — last 7 days</h3>
          <p className="text-[10px] text-slate-500">Received vs posted to Loan Vision</p>
          <div className="mt-3 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={VOLUME_DAILY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip cursor={{ fill: "#f1f5f9" }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="invoices" fill="#2f6b39" radius={[4, 4, 0, 0]} />
                <Bar dataKey="posted" fill="#8cbf94" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold">AI confidence distribution</h3>
          <p className="text-[10px] text-slate-500">Field-level extractions, rolling 30 days</p>
          <div className="mt-3 h-60">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CONFIDENCE}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="bucket" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip cursor={{ fill: "#f1f5f9" }} />
                <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                  {CONFIDENCE.map((c, i) => (
                    <Cell key={i} fill={c.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <p className="mt-2 text-[10px] text-slate-500">
            Green = ≥ 95% (auto-process). Yellow = 80–94% (human review). Red = &lt; 80% (exception).
          </p>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold">Approval latency trend</h3>
          <p className="text-[10px] text-slate-500">Hours from capture to posting</p>
          <div className="mt-3 h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={LATENCY}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="week" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Line dataKey="median" stroke="#2f6b39" strokeWidth={2} dot={{ r: 3 }} />
                <Line dataKey="p95" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="lg:col-span-2">
          <h3 className="text-sm font-semibold">System health</h3>
          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {HEALTH.map((h) => (
              <div key={h.label} className={"rounded-md px-3 py-2 ring-1 " + h.color}>
                <div className="text-[10px] font-semibold uppercase tracking-wider">{h.label}</div>
                <div className="mt-0.5 text-sm font-semibold">{h.status}</div>
                <div className="text-[10px] text-slate-500">{h.lat}</div>
              </div>
            ))}
          </div>
          <p className="mt-3 text-[10px] text-slate-500">
            Loan Vision Connector currently degraded — retry queue is draining.
            This is the measurement layer for the Phase 1 exit-criteria gate
            "AP team has used dashboards to find and resolve a real exception".
          </p>
        </Card>
      </div>
    </div>
  );
}

function KPI({
  label,
  value,
  delta,
  icon: Icon,
  accent,
}: {
  label: string;
  value: string;
  delta: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: "afn" | "emerald" | "amber" | "sky";
}) {
  const map: Record<string, string> = {
    afn: "text-afn-700 bg-afn-50",
    emerald: "text-emerald-700 bg-emerald-50",
    amber: "text-amber-700 bg-amber-50",
    sky: "text-sky-700 bg-sky-50",
  };
  return (
    <Card padded={false} className="flex items-center gap-3 p-3">
      <span className={"grid h-10 w-10 place-items-center rounded-md " + map[accent]}>
        <Icon className="h-5 w-5" />
      </span>
      <div>
        <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</div>
        <div className="text-lg font-semibold text-slate-900">{value}</div>
        <div className="text-[10px] text-slate-500">{delta}</div>
      </div>
    </Card>
  );
}
