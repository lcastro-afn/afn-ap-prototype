import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { Card, DemoBadge, PageHeader } from "../components/Ui";
import { fmtDate } from "../lib/utils";
import { ChevronDown, ChevronRight, Search } from "lucide-react";

export function AuditPage() {
  const { invoices } = useStore();
  const [open, setOpen] = useState<string | null>(invoices[0]?.id ?? null);
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    if (!q.trim()) return invoices;
    const term = q.toLowerCase();
    return invoices.filter((i) =>
      [i.id, i.vendor.value, i.invoiceNumber.value].some((s) => s.toLowerCase().includes(term))
    );
  }, [q, invoices]);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Audit Trail"
        subtitle="Every state transition, every actor, every timestamp. Append-only and tamper-evident in production."
        actions={<DemoBadge />}
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search by invoice ID, vendor, or invoice #"
          className="w-full rounded-md border border-slate-300 bg-white py-2 pl-9 pr-3 text-sm focus:border-afn-500 focus:outline-none focus:ring-1 focus:ring-afn-500"
        />
      </div>

      <div className="space-y-2">
        {filtered.map((inv) => {
          const isOpen = inv.id === open;
          return (
            <Card key={inv.id} padded={false} className="overflow-hidden">
              <button
                onClick={() => setOpen(isOpen ? null : inv.id)}
                className="flex w-full items-center gap-2 px-4 py-3 text-left hover:bg-slate-50"
              >
                {isOpen ? (
                  <ChevronDown className="h-4 w-4 text-slate-500" />
                ) : (
                  <ChevronRight className="h-4 w-4 text-slate-500" />
                )}
                <span className="text-sm font-semibold text-slate-900">{inv.vendor.value}</span>
                <span className="text-xs text-slate-500">
                  {inv.id} · {inv.invoiceNumber.value}
                </span>
                <Link
                  to={`/invoice/${inv.id}`}
                  className="ml-auto text-xs text-afn-700 hover:underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  Open invoice →
                </Link>
              </button>
              {isOpen && (
                <div className="border-t border-slate-100 bg-slate-50/40 px-4 py-4">
                  <ol className="space-y-3 border-l border-slate-200 pl-4">
                    {inv.audit.map((e) => (
                      <li key={e.id} className="relative">
                        <span className="absolute -left-[1.06rem] top-1.5 h-2 w-2 rounded-full bg-afn-500 ring-2 ring-white" />
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span className="text-sm font-medium text-slate-900">{e.action}</span>
                          <span className="text-[11px] text-slate-500">· {fmtDate(e.timestamp)}</span>
                        </div>
                        <div className="text-xs text-slate-600">
                          {e.actor} <span className="text-slate-400">({e.actorRole})</span>
                        </div>
                        {e.detail && <div className="text-xs italic text-slate-500">{e.detail}</div>}
                      </li>
                    ))}
                  </ol>
                  {inv.loanVisionTxnId && (
                    <div className="mt-3 rounded-md bg-emerald-50 px-3 py-2 text-xs text-emerald-800">
                      Posted to Loan Vision · <code>{inv.loanVisionTxnId}</code>
                    </div>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
