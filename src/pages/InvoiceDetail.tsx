import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useStore } from "../lib/store";
import { PageHeader, Card, DemoBadge, ConfidencePill, KeyValue } from "../components/Ui";
import { FakePdf } from "../components/FakePdf";
import { STATUS_LABEL, fmtDate, fmtDateOnly, fmtMoney, statusClass, tier } from "../lib/utils";
import type { Invoice, LineItem, ExtractedField } from "../data/types";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  Edit2,
  Save,
  AlertTriangle,
  Sparkles,
  ChevronsRight,
  CornerDownLeft,
  Send,
} from "lucide-react";

export function InvoiceDetailPage() {
  const { id } = useParams();
  const { getInvoice, updateInvoice, persona } = useStore();
  const navigate = useNavigate();
  const inv = id ? getInvoice(id) : undefined;
  const [highlight, setHighlight] = useState<{ x: number; y: number; w: number; h: number } | undefined>();
  const [comment, setComment] = useState("");
  const [postedFlash, setPostedFlash] = useState(false);

  if (!inv) {
    return (
      <Card className="text-center">
        <p>Invoice not found.</p>
        <Link to="/intake" className="btn-primary mt-3 inline-flex">
          Back to intake
        </Link>
      </Card>
    );
  }

  const isClerk = persona.role === "AP_CLERK";
  const isApprover = persona.role === "APPROVER" || persona.role === "AP_LEAD" || persona.role === "ADMINISTRATOR";
  const canReview = isClerk && (inv.status === "CLERK_REVIEW" || inv.status === "EXCEPTION");
  const canApprove =
    isApprover && (inv.status === "PENDING_APPROVAL" || inv.status === "ROUTED" || inv.status === "CLERK_REVIEW");

  function decide(action: "approve" | "reject" | "return") {
    const now = new Date().toISOString();
    const decisionLabel =
      action === "approve" ? "Approved" : action === "reject" ? "Rejected" : "Returned for info";

    updateInvoice(inv!.id, (i) => {
      const nextRouting = i.routing.map((step) =>
        step.status === "current"
          ? {
              ...step,
              status:
                action === "approve"
                  ? ("approved" as const)
                  : action === "reject"
                    ? ("rejected" as const)
                    : ("pending" as const),
              decidedAt: now,
              comment: comment || undefined,
            }
          : step
      );

      let promoted = false;
      const promotedRouting = nextRouting.map((step) => {
        if (!promoted && action === "approve" && step.status === "pending") {
          promoted = true;
          return { ...step, status: "current" as const };
        }
        return step;
      });

      const nextStatus: Invoice["status"] =
        action === "reject"
          ? "REJECTED"
          : action === "return"
            ? "RETURNED"
            : promoted
              ? "PENDING_APPROVAL"
              : "APPROVED";

      const lvTxnId =
        nextStatus === "APPROVED"
          ? `LV-TXN-${new Date().toISOString().slice(0, 10).replace(/-/g, "")}-PRT-${String(
              Math.floor(Math.random() * 90000) + 10000
            )}`
          : i.loanVisionTxnId;

      const auditAdds: typeof i.audit = [
        {
          id: `a${Date.now()}`,
          timestamp: now,
          actor: persona.name,
          actorRole: persona.role,
          action: decisionLabel,
          detail: comment || (action === "approve" ? "Approved with no comment." : undefined),
        },
      ];
      if (nextStatus === "APPROVED") {
        auditAdds.push({
          id: `a${Date.now() + 1}`,
          timestamp: new Date(Date.now() + 1000).toISOString(),
          actor: "Loan Vision Connector",
          actorRole: "SYSTEM",
          action: "Posted to Loan Vision",
          detail: `Transaction ${lvTxnId}`,
        });
      }
      if (promoted && action === "approve") {
        const next = promotedRouting.find((s) => s.status === "current");
        if (next) {
          auditAdds.push({
            id: `a${Date.now() + 2}`,
            timestamp: new Date(Date.now() + 500).toISOString(),
            actor: "Routing Engine",
            actorRole: "SYSTEM",
            action: `Routed to ${next.approverName}`,
            detail: next.approverRole,
          });
        }
      }

      return {
        ...i,
        status: nextStatus === "APPROVED" ? "POSTED" : nextStatus,
        routing: promotedRouting,
        loanVisionTxnId: lvTxnId,
        audit: [...i.audit, ...auditAdds],
      };
    });

    setComment("");
    if (action === "approve") {
      setPostedFlash(true);
      setTimeout(() => setPostedFlash(false), 2500);
    }
  }

  return (
    <div className="space-y-5">
      <button onClick={() => navigate(-1)} className="btn-ghost -ml-2 text-xs">
        <ArrowLeft className="h-3.5 w-3.5" /> Back
      </button>

      <PageHeader
        title={`${inv.vendor.value} · ${inv.invoiceNumber.value}`}
        subtitle={`${inv.id} · received ${fmtDate(inv.receivedAt)} · ${fmtMoney(inv.total.value, inv.currency)}`}
        actions={
          <div className="flex items-center gap-2">
            <span className={statusClass(inv.status)}>{STATUS_LABEL[inv.status]}</span>
            <ConfidencePill confidence={inv.overallConfidence} />
            <DemoBadge />
          </div>
        }
      />

      {postedFlash && (
        <div className="card flex items-center gap-3 border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
          <CheckCircle2 className="h-5 w-5" />
          <div className="flex-1">
            <p className="font-semibold">Posted to Loan Vision</p>
            <p className="text-xs">
              Transaction ID:{" "}
              <code className="rounded bg-emerald-100 px-1.5 py-0.5">{inv.loanVisionTxnId}</code>
            </p>
          </div>
          <Link to="/audit" className="btn-secondary">
            View audit trail
          </Link>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <FakePdf invoice={inv} highlightedBbox={highlight} />

        <div className="space-y-4">
          <Card>
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-afn-600" />
                <h3 className="text-sm font-semibold">AI Capture — Header Fields</h3>
              </div>
              <span className="text-[10px] text-slate-500">
                Azure Document Intelligence · prebuilt-invoice v3.1
              </span>
            </div>

            <dl className="grid grid-cols-1 gap-y-3 sm:grid-cols-2">
              <ExtractedRow
                label="Vendor"
                field={inv.vendor}
                onHighlight={setHighlight}
                editable={canReview}
                onChange={(v) =>
                  updateInvoice(inv.id, (i) => ({
                    ...i,
                    vendor: { ...i.vendor, value: v, confidence: 1, reviewed: true },
                  }))
                }
              />
              <ExtractedRow
                label="Invoice #"
                field={inv.invoiceNumber}
                onHighlight={setHighlight}
                editable={canReview}
                onChange={(v) =>
                  updateInvoice(inv.id, (i) => ({
                    ...i,
                    invoiceNumber: { ...i.invoiceNumber, value: v, confidence: 1, reviewed: true },
                  }))
                }
              />
              <ExtractedRow
                label="Invoice Date"
                field={inv.invoiceDate}
                onHighlight={setHighlight}
                editable={canReview}
                renderValue={(v) => fmtDateOnly(v)}
                onChange={(v) =>
                  updateInvoice(inv.id, (i) => ({
                    ...i,
                    invoiceDate: { ...i.invoiceDate, value: v, confidence: 1, reviewed: true },
                  }))
                }
              />
              <ExtractedRow
                label="Due Date"
                field={inv.dueDate}
                onHighlight={setHighlight}
                editable={canReview}
                renderValue={(v) => fmtDateOnly(v)}
                onChange={(v) =>
                  updateInvoice(inv.id, (i) => ({
                    ...i,
                    dueDate: { ...i.dueDate, value: v, confidence: 1, reviewed: true },
                  }))
                }
              />
              <ExtractedRow
                label="Total"
                field={inv.total}
                onHighlight={setHighlight}
                editable={canReview}
                renderValue={(v) => fmtMoney(Number(v), inv.currency)}
                onChange={(v) =>
                  updateInvoice(inv.id, (i) => ({
                    ...i,
                    total: { ...i.total, value: Number(v), confidence: 1, reviewed: true },
                  }))
                }
              />
              {inv.poNumber ? (
                <ExtractedRow
                  label="PO #"
                  field={inv.poNumber}
                  onHighlight={setHighlight}
                  editable={canReview}
                  onChange={(v) =>
                    updateInvoice(inv.id, (i) => ({
                      ...i,
                      poNumber: {
                        ...(i.poNumber ?? { value: "", confidence: 1 }),
                        value: v,
                        confidence: 1,
                        reviewed: true,
                      },
                    }))
                  }
                />
              ) : (
                <KeyValue
                  label="PO #"
                  badge={<span className="pill-red text-[10px]">Missing</span>}
                  value={<span className="italic text-slate-400">Not detected — exception path</span>}
                />
              )}
            </dl>
          </Card>

          <Card>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                Line items{" "}
                <span className="text-xs font-normal text-slate-500">({inv.lineItems.length})</span>
              </h3>
              <span className="text-[10px] text-slate-500">Coded against Loan Vision GL chart</span>
            </div>

            <div className="overflow-hidden rounded-md ring-1 ring-slate-200">
              <table className="min-w-full divide-y divide-slate-200 text-xs">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-2 py-1.5 text-left font-semibold">Description</th>
                    <th className="px-2 py-1.5 text-left font-semibold">GL</th>
                    <th className="px-2 py-1.5 text-left font-semibold">Branch</th>
                    <th className="px-2 py-1.5 text-left font-semibold">Loan #</th>
                    <th className="px-2 py-1.5 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {inv.lineItems.map((li) => (
                    <LineItemRow key={li.id} li={li} />
                  ))}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-50">
                    <td colSpan={4} className="px-2 py-1.5 text-right text-xs font-semibold text-slate-600">
                      Total
                    </td>
                    <td className="px-2 py-1.5 text-right text-sm font-bold text-slate-900">
                      {fmtMoney(inv.total.value)}
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {inv.overallConfidence < 0.95 && (
              <div className="mt-3 flex items-start gap-2 rounded-md bg-amber-50 px-3 py-2 text-xs text-amber-800">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <div>
                  <span className="font-semibold">Low-confidence fields detected.</span>{" "}
                  Hover any yellow/red badge to see its source on the PDF preview.{" "}
                  As an AP Clerk, click Edit to correct each value.
                </div>
              </div>
            )}
          </Card>

          <Card>
            <h3 className="mb-3 text-sm font-semibold">Approval routing</h3>
            <RoutingChain inv={inv} />
            <Link to="/rules" className="mt-3 inline-flex text-xs text-afn-700 hover:underline">
              Edit routing rules →
            </Link>
          </Card>

          {(canReview || canApprove) && (
            <Card className="border-afn-200 bg-afn-50/30">
              <h3 className="text-sm font-semibold">
                {canReview ? "AP Clerk actions" : "Your decision"}
              </h3>
              <p className="mt-0.5 text-xs text-slate-600">
                {canReview
                  ? "Confirm or correct flagged fields, then send the invoice into routing."
                  : "Approve to post to Loan Vision. Reject ends the workflow. Return-for-info sends it back to the clerk with your comment."}
              </p>

              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder={
                  canReview
                    ? "Optional note for routing (e.g. 'Confirmed PO with branch')"
                    : "Comment (required for return-for-info)"
                }
                rows={2}
                className="mt-3 w-full rounded-md border border-slate-300 bg-white px-2 py-1.5 text-sm focus:border-afn-500 focus:outline-none focus:ring-1 focus:ring-afn-500"
              />

              <div className="mt-3 flex flex-wrap gap-2">
                {canReview ? (
                  <>
                    <button onClick={() => decide("approve")} className="btn-primary">
                      <ChevronsRight className="h-4 w-4" /> Send to approver
                    </button>
                    <button onClick={() => decide("reject")} className="btn-danger">
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                  </>
                ) : (
                  <>
                    <button onClick={() => decide("approve")} className="btn-primary">
                      <CheckCircle2 className="h-4 w-4" /> Approve
                    </button>
                    <button onClick={() => decide("reject")} className="btn-danger">
                      <XCircle className="h-4 w-4" /> Reject
                    </button>
                    <button onClick={() => decide("return")} className="btn-secondary">
                      <CornerDownLeft className="h-4 w-4" /> Return for info
                    </button>
                  </>
                )}
                <button
                  className="btn-ghost ml-auto"
                  onClick={() => alert("Demo only: would offer attach-supporting-docs and other actions here.")}
                >
                  <Send className="h-4 w-4" /> More actions
                </button>
              </div>
            </Card>
          )}

          <Card>
            <h3 className="text-sm font-semibold">Audit trail</h3>
            <p className="text-[10px] text-slate-500">
              Every state transition · append-only · GLBA-compliant retention.
            </p>
            <ol className="mt-3 space-y-3 border-l border-slate-200 pl-4">
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
                  {e.detail && <div className="mt-0.5 text-xs italic text-slate-500">{e.detail}</div>}
                </li>
              ))}
            </ol>
          </Card>
        </div>
      </div>
    </div>
  );
}

function ExtractedRow({
  label,
  field,
  onHighlight,
  editable,
  onChange,
  renderValue,
}: {
  label: string;
  field: ExtractedField<any>;
  onHighlight: (b?: { x: number; y: number; w: number; h: number }) => void;
  editable?: boolean;
  onChange?: (v: string) => void;
  renderValue?: (v: any) => string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(String(field.value));
  const t = tier(field.confidence);
  const needsReview = t !== "high" && !field.reviewed;

  return (
    <div
      className={
        "rounded-md px-2 py-1.5 hover:bg-slate-50 " +
        (needsReview ? "ring-1 ring-amber-200 bg-amber-50/40" : "")
      }
      onMouseEnter={() => field.bbox && onHighlight(field.bbox)}
      onMouseLeave={() => onHighlight(undefined)}
    >
      <div className="flex items-center gap-2">
        <dt className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{label}</dt>
        <ConfidencePill confidence={field.confidence} />
        {field.reviewed && (
          <span className="pill-green text-[10px]" title="Edited & accepted by AP Clerk">
            <CheckCircle2 className="h-2.5 w-2.5" /> Reviewed
          </span>
        )}
        {editable && !editing && (
          <button
            onClick={() => {
              setEditing(true);
              setDraft(String(field.value));
            }}
            className="ml-auto text-[11px] text-afn-700 hover:underline"
          >
            <Edit2 className="inline h-3 w-3" /> Edit
          </button>
        )}
      </div>
      <dd className="mt-0.5">
        {!editing ? (
          <span className="text-sm font-medium text-slate-900">
            {renderValue ? renderValue(field.value) : String(field.value)}
          </span>
        ) : (
          <div className="mt-1 flex items-center gap-1">
            <input
              autoFocus
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              className="flex-1 rounded-md border border-afn-300 bg-white px-2 py-1 text-sm focus:border-afn-500 focus:outline-none focus:ring-1 focus:ring-afn-500"
            />
            <button
              className="btn-primary py-1"
              onClick={() => {
                onChange?.(draft);
                setEditing(false);
              }}
            >
              <Save className="h-3.5 w-3.5" />
            </button>
            <button className="btn-ghost py-1" onClick={() => setEditing(false)}>
              Cancel
            </button>
          </div>
        )}
      </dd>
    </div>
  );
}

function LineItemRow({ li }: { li: LineItem }) {
  return (
    <tr className="text-slate-700">
      <td className="px-2 py-1.5">
        <div className="flex flex-col">
          <span className="text-sm">{li.description.value}</span>
          {li.borrowerName && (
            <span className="text-[10px] text-slate-500">
              Borrower: {li.borrowerName.value}{" "}
              <ConfidencePill confidence={li.borrowerName.confidence} showPct={false} />
            </span>
          )}
        </div>
      </td>
      <td className="px-2 py-1.5">
        <div className="flex items-center gap-1">
          <code className="text-xs">{li.glAccount.value}</code>
          <ConfidencePill confidence={li.glAccount.confidence} showPct={false} />
        </div>
      </td>
      <td className="px-2 py-1.5">
        <div className="flex items-center gap-1">
          <code className="text-xs">{li.branch.value}</code>
          <ConfidencePill confidence={li.branch.confidence} showPct={false} />
        </div>
      </td>
      <td className="px-2 py-1.5">
        {li.loanNumber ? (
          <div className="flex items-center gap-1">
            <code className="text-xs">{li.loanNumber.value}</code>
            <ConfidencePill confidence={li.loanNumber.confidence} showPct={false} />
          </div>
        ) : (
          <span className="text-[11px] italic text-slate-400">—</span>
        )}
      </td>
      <td className="px-2 py-1.5 text-right text-sm font-medium">{fmtMoney(li.amount.value)}</td>
    </tr>
  );
}

function RoutingChain({ inv }: { inv: Invoice }) {
  return (
    <ol className="flex flex-col gap-2 sm:flex-row sm:items-stretch">
      {inv.routing.map((step, i) => {
        const isLast = i === inv.routing.length - 1;
        const color =
          step.status === "approved"
            ? "border-emerald-300 bg-emerald-50 text-emerald-800"
            : step.status === "rejected"
              ? "border-rose-300 bg-rose-50 text-rose-800"
              : step.status === "current"
                ? "border-afn-400 bg-afn-50 text-afn-800 ring-2 ring-afn-200"
                : step.status === "skipped"
                  ? "border-slate-200 bg-white text-slate-500"
                  : "border-slate-200 bg-slate-50 text-slate-600";
        return (
          <li key={step.id} className="flex flex-1 items-stretch gap-1">
            <div className={"flex-1 rounded-md border px-2.5 py-2 " + color}>
              <div className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider">
                Step {i + 1}
                {step.status === "approved" && <CheckCircle2 className="h-3 w-3" />}
                {step.status === "rejected" && <XCircle className="h-3 w-3" />}
                {step.status === "current" && (
                  <span className="ml-1 rounded-full bg-afn-600 px-1.5 py-0.5 text-[8px] text-white">
                    CURRENT
                  </span>
                )}
                {step.status === "skipped" && <span className="text-[10px] italic">skipped</span>}
              </div>
              <div className="mt-0.5 text-sm font-semibold">{step.approverName}</div>
              <div className="text-[11px]">{step.approverRole}</div>
              {step.threshold && (
                <div className="mt-0.5 text-[10px] italic text-slate-500">{step.threshold}</div>
              )}
              {step.decidedAt && (
                <div className="mt-0.5 text-[10px] text-slate-500">{fmtDate(step.decidedAt)}</div>
              )}
              {step.comment && <div className="mt-0.5 text-[10px] italic">“{step.comment}”</div>}
            </div>
            {!isLast && <span className="hidden self-center text-slate-300 sm:block">→</span>}
          </li>
        );
      })}
    </ol>
  );
}
