import { useState } from "react";
import { Card, DemoBadge, PageHeader } from "../components/Ui";
import { ROUTING_RULES } from "../data/masters";
import { GripVertical, Pencil, Plus, ToggleLeft, ToggleRight } from "lucide-react";

export function RulesPage() {
  const [rules, setRules] = useState(ROUTING_RULES);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Rules & Routing"
        subtitle="Editable by AP leadership. No engineering ticket required."
        actions={<DemoBadge />}
      />

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold">Approval routing rules</h3>
          <button
            className="btn-primary"
            onClick={() =>
              setRules((rs) => [
                ...rs,
                {
                  id: `R-${String(rs.length + 1).padStart(3, "0")}`,
                  description: "New rule",
                  condition: "Custom condition",
                  approverRole: "Approver",
                  enabled: true,
                },
              ])
            }
          >
            <Plus className="h-4 w-4" /> Add rule
          </button>
        </div>
        <p className="mt-0.5 text-xs text-slate-500">
          Evaluated top-down. Drag the handle to reorder. The first matching rule
          determines routing for each invoice — additional rules can chain when
          approval thresholds escalate.
        </p>

        <div className="mt-4 space-y-2">
          {rules.map((r, idx) => (
            <div
              key={r.id}
              className={
                "flex items-start gap-2 rounded-md border bg-white px-3 py-2.5 " +
                (r.enabled ? "border-slate-200" : "border-slate-200 opacity-60")
              }
            >
              <GripVertical className="mt-1 h-4 w-4 cursor-grab text-slate-300" />
              <div className="grid h-6 w-6 shrink-0 place-items-center rounded-md bg-slate-100 text-[10px] font-semibold text-slate-600">
                {idx + 1}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-baseline gap-2">
                  <code className="text-[11px] text-slate-500">{r.id}</code>
                  <span className="text-sm font-semibold text-slate-900">{r.description}</span>
                </div>
                <div className="mt-1 grid grid-cols-1 gap-1.5 text-xs sm:grid-cols-[1fr_auto]">
                  <div>
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      When
                    </div>
                    <code className="block whitespace-pre-wrap rounded bg-slate-50 px-2 py-1 text-[11px] text-slate-700">
                      {r.condition}
                    </code>
                  </div>
                  <div className="text-right">
                    <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      Then route to
                    </div>
                    <div className="font-medium text-slate-800">{r.approverRole}</div>
                  </div>
                </div>
              </div>
              <button
                className="btn-ghost"
                onClick={() =>
                  setRules((rs) => rs.map((x) => (x.id === r.id ? { ...x, enabled: !x.enabled } : x)))
                }
                title="Toggle rule"
              >
                {r.enabled ? (
                  <ToggleRight className="h-5 w-5 text-emerald-600" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-slate-400" />
                )}
              </button>
              <button
                className="btn-ghost"
                onClick={() => alert("Demo: rule editor opens here in production.")}
              >
                <Pencil className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <h3 className="text-sm font-semibold">Routing visualization (sample)</h3>
        <p className="text-xs text-slate-500">
          How a $4,150 marketing invoice from a branch flows through your current rules.
        </p>
        <div className="mt-3 flex flex-wrap items-center gap-3 rounded-md border border-slate-200 bg-slate-50 p-3 text-xs">
          <Node label="Intake" sub="ap-intake@" />
          <Arrow />
          <Node label="AI Capture" sub="Doc Intelligence" />
          <Arrow />
          <Node label="Rules" sub="R-001, R-002" tone="afn" />
          <Arrow />
          <Node label="AP Clerk" sub="Dana Ruiz" tone="amber" />
          <Arrow />
          <Node label="Branch Mgr" sub="Priya Patel" tone="afn" />
          <Arrow />
          <Node label="Loan Vision" sub="Post" tone="emerald" />
        </div>
      </Card>

      <Card className="bg-slate-50 text-xs text-slate-600">
        Rule changes are versioned; every save creates an audit entry showing who
        changed what and when. Production also runs new rules in shadow mode
        (logging would-be routing) before going live.
      </Card>
    </div>
  );
}

function Node({ label, sub, tone }: { label: string; sub: string; tone?: "afn" | "amber" | "emerald" }) {
  const map = {
    afn: "bg-afn-50 ring-afn-200 text-afn-800",
    amber: "bg-amber-50 ring-amber-200 text-amber-800",
    emerald: "bg-emerald-50 ring-emerald-200 text-emerald-800",
    default: "bg-white ring-slate-200 text-slate-800",
  };
  const cls = map[tone ?? "default"];
  return (
    <div className={"rounded-md px-2.5 py-1.5 ring-1 " + cls}>
      <div className="text-[11px] font-semibold leading-tight">{label}</div>
      <div className="text-[10px] leading-tight text-slate-500">{sub}</div>
    </div>
  );
}
function Arrow() {
  return <span className="text-slate-400">→</span>;
}
