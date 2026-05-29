import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { Card, ConfidencePill, DemoBadge, PageHeader, EmptyState } from "../components/Ui";
import { STATUS_LABEL, fmtMoney, relativeTime, statusClass } from "../lib/utils";
import { AlertTriangle, ClipboardList, ChevronRight } from "lucide-react";

export function ClerkQueuePage() {
  const { invoices, persona } = useStore();
  const queue = invoices.filter((i) => i.status === "CLERK_REVIEW" || i.status === "EXCEPTION");

  return (
    <div className="space-y-5">
      <PageHeader
        title="AP Clerk Review Queue"
        subtitle={
          persona.role === "AP_CLERK"
            ? "Invoices with low-confidence fields or exceptions — you fix, then send to approver."
            : `Viewing as ${persona.title}. Switch to AP Clerk in the top-right to take action.`
        }
        actions={<DemoBadge />}
      />

      {queue.length === 0 ? (
        <EmptyState
          title="Queue is clear."
          description="Nothing flagged for clerk review."
          icon={<ClipboardList className="h-8 w-8" />}
        />
      ) : (
        <div className="space-y-2">
          {queue.map((inv) => {
            const flagged = countFlagged(inv);
            return (
              <Link
                key={inv.id}
                to={`/invoice/${inv.id}`}
                className="card flex flex-col gap-3 p-4 hover:border-afn-300 hover:shadow-md sm:flex-row sm:items-center"
              >
                <div className="flex flex-1 items-start gap-3">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-700">
                    <AlertTriangle className="h-5 w-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-sm font-semibold text-slate-900">
                        {inv.vendor.value}
                      </span>
                      <span className="text-xs text-slate-500">{inv.id}</span>
                      <span className={statusClass(inv.status)}>
                        {STATUS_LABEL[inv.status]}
                      </span>
                    </div>
                    <div className="mt-0.5 text-xs text-slate-500">
                      {fmtMoney(inv.total.value)} · received {relativeTime(inv.receivedAt)} ·{" "}
                      <span className="font-medium text-amber-700">
                        {flagged} field{flagged !== 1 ? "s" : ""} need attention
                      </span>
                    </div>
                  </div>
                </div>
                <ConfidencePill confidence={inv.overallConfidence} />
                <ChevronRight className="h-4 w-4 text-slate-300" />
              </Link>
            );
          })}
        </div>
      )}

      <Card className="bg-slate-50 text-xs text-slate-600">
        <p>
          <span className="font-semibold">How the queue is populated:</span> any
          invoice with a field below 80% confidence, a missing PO, or a vendor
          not in the Loan Vision master is sent here automatically by the rules
          engine.
        </p>
      </Card>
    </div>
  );
}

function countFlagged(inv: ReturnType<typeof useStore>["invoices"][number]): number {
  let n = 0;
  const headers = [inv.vendor, inv.invoiceNumber, inv.invoiceDate, inv.dueDate, inv.total, inv.poNumber];
  for (const fld of headers) if (fld && fld.confidence < 0.8 && !fld.reviewed) n++;
  for (const li of inv.lineItems) {
    for (const fld of [li.description, li.amount, li.glAccount, li.costCenter, li.branch, li.loanNumber, li.borrowerName]) {
      if (fld && fld.confidence < 0.8 && !fld.reviewed) n++;
    }
  }
  return n;
}
