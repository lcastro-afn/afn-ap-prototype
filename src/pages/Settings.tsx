import { useState } from "react";
import { Card, DemoBadge, PageHeader } from "../components/Ui";
import { BRANCHES, GL_ACCOUNTS, VENDORS } from "../data/masters";
import { CheckCircle2, Database, RefreshCw } from "lucide-react";

type Tab = "vendors" | "gl" | "branches" | "approvers";

export function SettingsPage() {
  const [tab, setTab] = useState<Tab>("vendors");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Settings"
        subtitle="Master data synced from Loan Vision plus AP-leadership configuration."
        actions={<DemoBadge />}
      />

      <Card>
        <div className="flex items-center justify-between">
          <h3 className="flex items-center gap-2 text-sm font-semibold">
            <Database className="h-4 w-4 text-afn-600" /> Loan Vision masters
          </h3>
          <button
            className="btn-secondary"
            onClick={() => alert("Demo: would trigger nightly delta sync.")}
          >
            <RefreshCw className="h-3.5 w-3.5" /> Resync now
          </button>
        </div>
        <p className="text-xs text-slate-500">
          Last sync: <span className="text-slate-700">May 29, 2026 · 2:00 AM PT</span> · 1 of 1
          sources <CheckCircle2 className="inline h-3.5 w-3.5 text-emerald-600" />
        </p>

        <div className="mt-3 flex flex-wrap gap-1 border-b border-slate-200">
          {(["vendors", "gl", "branches", "approvers"] as const).map((t) => (
            <button
              key={t}
              className={
                "rounded-t-md px-3 py-1.5 text-xs font-medium " +
                (tab === t
                  ? "border-b-2 border-afn-600 text-afn-700"
                  : "text-slate-500 hover:text-slate-700")
              }
              onClick={() => setTab(t)}
            >
              {t === "gl"
                ? "GL chart"
                : t === "approvers"
                  ? "Approvers"
                  : t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>

        <div className="mt-4">
          {tab === "vendors" && <VendorTable />}
          {tab === "gl" && <GLTable />}
          {tab === "branches" && <BranchTable />}
          {tab === "approvers" && <ApproverHierarchy />}
        </div>
      </Card>

      <Card className="bg-slate-50 text-xs text-slate-600">
        Vendor, GL, and branch lists are mastered in Loan Vision and synced nightly.
        AP leadership can override default GL coding per vendor and configure the
        approver hierarchy without engineering.
      </Card>
    </div>
  );
}

function VendorTable() {
  return (
    <div className="overflow-hidden rounded-md ring-1 ring-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-xs">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-3 py-1.5 text-left font-semibold">ID</th>
            <th className="px-3 py-1.5 text-left font-semibold">Name</th>
            <th className="px-3 py-1.5 text-left font-semibold">Default GL</th>
            <th className="px-3 py-1.5 text-left font-semibold">Default Branch</th>
            <th className="px-3 py-1.5 text-left font-semibold">Terms</th>
            <th className="px-3 py-1.5 text-left font-semibold">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {VENDORS.map((v) => (
            <tr key={v.id} className="hover:bg-slate-50">
              <td className="px-3 py-1.5 font-mono">{v.id}</td>
              <td className="px-3 py-1.5 font-medium text-slate-800">{v.name}</td>
              <td className="px-3 py-1.5">
                <code>{v.defaultGL}</code>
              </td>
              <td className="px-3 py-1.5">
                <code>{v.defaultBranch}</code>
              </td>
              <td className="px-3 py-1.5">{v.paymentTerms}</td>
              <td className="px-3 py-1.5">
                <span className="pill-green text-[10px]">{v.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function GLTable() {
  return (
    <div className="overflow-hidden rounded-md ring-1 ring-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-xs">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-3 py-1.5 text-left font-semibold">Code</th>
            <th className="px-3 py-1.5 text-left font-semibold">Name</th>
            <th className="px-3 py-1.5 text-left font-semibold">Category</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {GL_ACCOUNTS.map((g) => (
            <tr key={g.code} className="hover:bg-slate-50">
              <td className="px-3 py-1.5 font-mono">{g.code}</td>
              <td className="px-3 py-1.5 font-medium text-slate-800">{g.name}</td>
              <td className="px-3 py-1.5 text-slate-600">{g.category}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function BranchTable() {
  return (
    <div className="overflow-hidden rounded-md ring-1 ring-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-xs">
        <thead className="bg-slate-50 text-slate-600">
          <tr>
            <th className="px-3 py-1.5 text-left font-semibold">Code</th>
            <th className="px-3 py-1.5 text-left font-semibold">Name</th>
            <th className="px-3 py-1.5 text-left font-semibold">State</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {BRANCHES.map((b) => (
            <tr key={b.code} className="hover:bg-slate-50">
              <td className="px-3 py-1.5 font-mono">{b.code}</td>
              <td className="px-3 py-1.5 font-medium text-slate-800">{b.name}</td>
              <td className="px-3 py-1.5">{b.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ApproverHierarchy() {
  const items = [
    {
      tier: "Tier 1 — Branch",
      limit: "$500 – $4,999",
      approvers: ["Priya Patel (PHX-01)", "Other branch managers"],
    },
    {
      tier: "Tier 2 — Department Head",
      limit: "$5,000 – $49,999",
      approvers: ["John Eric Williams (VP Finance)"],
    },
    {
      tier: "Tier 3 — CFO",
      limit: "$50,000 +",
      approvers: ["CFO (assigned in Entra group)"],
    },
  ];
  return (
    <div className="space-y-2">
      {items.map((it) => (
        <div key={it.tier} className="rounded-md border border-slate-200 bg-white px-3 py-2.5">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-sm font-semibold text-slate-800">{it.tier}</span>
            <code className="text-[11px] text-slate-600">{it.limit}</code>
          </div>
          <ul className="mt-1 list-inside list-disc text-xs text-slate-600">
            {it.approvers.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </div>
      ))}
      <p className="text-[10px] italic text-slate-500">
        Approver groups are mastered in Entra ID. Adding someone to the
        "AP-Approvers-VP-Finance" group routes invoices to them automatically.
      </p>
    </div>
  );
}
