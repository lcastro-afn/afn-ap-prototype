import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { Card, ConfidencePill, DemoBadge, PageHeader, EmptyState } from "../components/Ui";
import { STATUS_LABEL, fmtMoney, relativeTime, statusClass } from "../lib/utils";
import { CheckSquare, ChevronRight, FileText } from "lucide-react";
import { ROLE_LABEL } from "../data/personas";
import type { Invoice } from "../data/types";

export function ApprovalsPage() {
  const { invoices, persona } = useStore();
  const queue = invoices.filter((inv) => {
    const cur = inv.routing.find((r) => r.status === "current");
    if (!cur) return false;
    if (cur.approverName === persona.name) return true;
    if (persona.role === "AP_LEAD" && cur.approverRole.toLowerCase().includes("ap lead")) return true;
    if (persona.role === "APPROVER" && cur.approverRole.toLowerCase().includes(persona.name.split(" ").pop()?.toLowerCase() ?? "")) return true;
    if (persona.role === "ADMINISTRATOR") return true;
    return false;
  });

  const others = invoices.filter(
    (inv) => !queue.includes(inv) && inv.status !== "POSTED" && inv.status !== "REJECTED"
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Approval Inbox"
        subtitle={`Routed to you (${persona.name} · ${ROLE_LABEL[persona.role]})`}
        actions={<DemoBadge />}
      />

      <Card className="bg-afn-50/40">
        <h3 className="text-sm font-semibold">For your decision</h3>
        <p className="mt-0.5 text-xs text-slate-600">
          Open an invoice to see the PDF, line items, and routing chain.
          Approve, reject, or return-for-info — all logged in the audit trail.
        </p>
        <div className="mt-3 space-y-2">
          {queue.length === 0 ? (
            <EmptyState
              title="Inbox zero. Nice."
              description="No invoices currently routed to you. Try switching to AP Lead or an Approver persona."
              icon={<CheckSquare className="h-8 w-8" />}
            />
          ) : (
            queue.map((inv) => <ApprovalRow key={inv.id} inv={inv} mine />)
          )}
        </div>
      </Card>

      {others.length > 0 && (
        <Card>
          <h3 className="text-sm font-semibold">Other in-flight invoices</h3>
          <p className="text-xs text-slate-500">Visibility for context — not routed to you.</p>
          <div className="mt-3 space-y-2">
            {others.map((inv) => (
              <ApprovalRow key={inv.id} inv={inv} />
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

function ApprovalRow({ inv, mine }: { inv: Invoice; mine?: boolean }) {
  const cur = inv.routing.find((r) => r.status === "current");
  return (
    <Link
      to={`/invoice/${inv.id}`}
      className={
        "flex items-center gap-3 rounded-md border bg-white px-3 py-2.5 hover:border-afn-300 " +
        (mine ? "border-afn-200" : "border-slate-200")
      }
    >
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-600">
        <FileText className="h-4 w-4" />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-baseline gap-2">
          <span className="truncate text-sm font-semibold text-slate-900">
            {inv.vendor.value}
          </span>
          <span className="text-xs text-slate-500">{inv.id}</span>
          <span className={statusClass(inv.status)}>{STATUS_LABEL[inv.status]}</span>
        </div>
        <div className="mt-0.5 text-xs text-slate-500">
          {fmtMoney(inv.total.value)} · received {relativeTime(inv.receivedAt)}{" "}
          {cur && (
            <>
              · current step: <span className="font-medium text-slate-700">{cur.approverName}</span>
            </>
          )}
        </div>
      </div>
      <ConfidencePill confidence={inv.overallConfidence} />
      <ChevronRight className="h-4 w-4 text-slate-300" />
    </Link>
  );
}
