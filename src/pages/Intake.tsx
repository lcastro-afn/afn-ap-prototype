import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useStore } from "../lib/store";
import { PageHeader, Card, DemoBadge, ConfidencePill } from "../components/Ui";
import {
  UploadCloud,
  Mail,
  FileText,
  ChevronRight,
  CheckCircle2,
  Loader2,
} from "lucide-react";
import { STATUS_LABEL, fmtMoney, relativeTime, statusClass } from "../lib/utils";

export function IntakePage() {
  const { invoices } = useStore();
  const navigate = useNavigate();
  const fileRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const [processing, setProcessing] = useState<null | { name: string; step: number }>(null);

  const inboxItems = invoices
    .slice()
    .sort((a, b) => (a.receivedAt < b.receivedAt ? 1 : -1));

  function simulateCapture(name: string) {
    setProcessing({ name, step: 0 });
    let i = 0;
    const tick = () => {
      i++;
      if (i < 4) {
        setProcessing({ name, step: i });
        setTimeout(tick, 700);
      } else {
        setProcessing(null);
        navigate("/invoice/INV-2026-0414");
      }
    };
    setTimeout(tick, 700);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Invoice Intake"
        subtitle="Drag-drop upload + monitored AP inbox feed. Captured by Azure Document Intelligence in ≤ 15 s P95."
        actions={<DemoBadge />}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_1.4fr]">
        <Card>
          <h3 className="text-sm font-semibold text-slate-900">Upload PDF</h3>
          <p className="mt-0.5 text-xs text-slate-500">
            Drop a single invoice PDF here or pick a file. In production this
            uploads to AFN-controlled Azure Storage.
          </p>
          <div
            className={
              "mt-3 flex h-44 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed text-center transition " +
              (dragging
                ? "border-afn-500 bg-afn-50"
                : "border-slate-300 bg-slate-50 hover:border-afn-300")
            }
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const name = e.dataTransfer.files[0]?.name ?? "invoice.pdf";
              simulateCapture(name);
            }}
          >
            <UploadCloud className="h-7 w-7 text-slate-400" />
            <p className="mt-2 text-sm font-medium text-slate-700">
              Drop a PDF here, or click to browse
            </p>
            <p className="mt-0.5 text-[11px] text-slate-500">
              PDF up to 25 MB · Other file types blocked
            </p>
            <input
              ref={fileRef}
              type="file"
              accept=".pdf"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) simulateCapture(f.name);
                e.target.value = "";
              }}
            />
          </div>

          {processing && (
            <div className="mt-3 rounded-md border border-afn-200 bg-afn-50 p-3 text-xs text-afn-800">
              <div className="flex items-center gap-2 font-semibold">
                <Loader2 className="h-3.5 w-3.5 animate-spin" /> Processing{" "}
                {processing.name}
              </div>
              <ul className="mt-2 space-y-1">
                {[
                  "Uploaded to intake storage",
                  "Running Azure Document Intelligence",
                  "Applying rules engine",
                  "Routing",
                ].map((s, i) => (
                  <li
                    key={s}
                    className={
                      "flex items-center gap-1.5 " +
                      (i <= processing.step ? "text-afn-800" : "text-slate-400")
                    }
                  >
                    {i < processing.step ? (
                      <CheckCircle2 className="h-3.5 w-3.5" />
                    ) : i === processing.step ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <span className="h-3.5 w-3.5 rounded-full border border-slate-300" />
                    )}
                    {s}
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[10px] italic text-afn-700">
                (Demo: skips ahead to a mixed-confidence sample invoice.)
              </p>
            </div>
          )}

          <div className="mt-4 rounded-md bg-slate-50 p-3 text-[11px] leading-snug text-slate-600">
            <div className="mb-1 flex items-center gap-1 font-semibold text-slate-700">
              <Mail className="h-3.5 w-3.5" /> Monitored AP inbox
            </div>
            <code className="text-[11px] text-slate-700">ap-intake@afncorp.com</code>
            <p className="mt-1">
              Vendors send invoices to this address. They land in the inbox at right
              within seconds.
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-slate-900">
              Monitored AP Inbox
              <span className="ml-2 text-xs font-normal text-slate-500">
                ({inboxItems.length} invoices)
              </span>
            </h3>
            <span className="text-[10px] uppercase tracking-wider text-slate-500">
              Live · polled every 30 s
            </span>
          </div>

          <div className="mt-3 -mx-2 divide-y divide-slate-100">
            {inboxItems.map((inv) => (
              <Link
                key={inv.id}
                to={`/invoice/${inv.id}`}
                className="group flex items-center gap-3 rounded-md px-2 py-2.5 hover:bg-slate-50"
              >
                <div className="grid h-9 w-9 shrink-0 place-items-center rounded-md bg-slate-100 text-slate-500">
                  <FileText className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 truncate">
                    <span className="truncate text-sm font-medium text-slate-900">
                      {inv.vendor.value}
                    </span>
                    <span className="shrink-0 text-[11px] text-slate-500">
                      {inv.id}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 truncate text-xs text-slate-500">
                    <span>{inv.source === "INBOX" ? "📥 inbox" : "⬆ upload"}</span>
                    <span>·</span>
                    <span>{relativeTime(inv.receivedAt)}</span>
                    <span>·</span>
                    <span className="font-medium text-slate-700">
                      {fmtMoney(inv.total.value)}
                    </span>
                  </div>
                </div>
                <ConfidencePill confidence={inv.overallConfidence} />
                <span className={statusClass(inv.status)}>
                  {STATUS_LABEL[inv.status]}
                </span>
                <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-afn-600" />
              </Link>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
