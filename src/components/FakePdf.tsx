import { useState } from "react";
import type { Invoice } from "../data/types";
import { DemoBadge } from "./Ui";
import { fmtDateOnly, fmtMoney } from "../lib/utils";
import { FileText, Download } from "lucide-react";

export function FakePdf({
  invoice,
  highlightedBbox,
  className,
}: {
  invoice: Invoice;
  highlightedBbox?: { x: number; y: number; w: number; h: number };
  className?: string;
}) {
  const [zoom] = useState(1);

  return (
    <div className={"card overflow-hidden " + (className ?? "")} >
      <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
        <FileText className="h-4 w-4 text-slate-500" />
        <span className="font-medium">{invoice.id}.pdf</span>
        <DemoBadge className="ml-auto" />
        <button className="btn-ghost px-1.5 py-1" title="Download original">
          <Download className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="relative bg-slate-100 p-3">
        <div
          className="relative mx-auto aspect-[8.5/11] w-full max-w-[640px] origin-top bg-white shadow-md ring-1 ring-slate-300"
          style={{ transform: `scale(${zoom})` }}
        >
          <div className="absolute left-[6%] right-[6%] top-[3%] flex items-start justify-between border-b border-slate-200 pb-2">
            <div>
              <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">Vendor</div>
              <div className="text-sm font-semibold text-slate-900">{invoice.vendor.value}</div>
              <div className="mt-0.5 text-[10px] text-slate-500">501 Vendor Way · Suite 200 · Phoenix, AZ 85016</div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold text-slate-700">INVOICE</div>
              <div className="text-[10px] text-slate-500">{invoice.id}</div>
            </div>
          </div>

          <div className="absolute right-[6%] top-[12%] w-[28%] text-[10px]">
            <div className="grid grid-cols-2 gap-x-2 gap-y-0.5">
              <span className="text-slate-500">Invoice #</span>
              <span className="text-right font-medium text-slate-800">{invoice.invoiceNumber.value}</span>
              <span className="text-slate-500">Date</span>
              <span className="text-right font-medium text-slate-800">{fmtDateOnly(invoice.invoiceDate.value)}</span>
              <span className="text-slate-500">Due</span>
              <span className="text-right font-medium text-slate-800">{fmtDateOnly(invoice.dueDate.value)}</span>
              {invoice.poNumber && (
                <>
                  <span className="text-slate-500">PO #</span>
                  <span className="text-right font-medium text-slate-800">{invoice.poNumber.value}</span>
                </>
              )}
            </div>
          </div>

          <div className="absolute left-[6%] top-[26%] w-[60%] text-[10px]">
            <div className="font-semibold uppercase tracking-wider text-slate-400">Bill To</div>
            <div className="mt-0.5 text-slate-800">American Financial Network, Inc.</div>
            <div className="text-slate-600">Attn: Accounts Payable</div>
            <div className="text-slate-600">10 Pointe Drive, Suite 330</div>
            <div className="text-slate-600">Brea, CA 92821</div>
          </div>

          <div className="absolute left-[6%] right-[6%] top-[40%] text-[10px]">
            <div className="grid grid-cols-[1fr_4rem_4rem] border-b border-slate-300 pb-1 font-semibold uppercase tracking-wider text-slate-500">
              <span>Description</span>
              <span className="text-right">Qty</span>
              <span className="text-right">Amount</span>
            </div>
            {invoice.lineItems.slice(0, 6).map((li) => (
              <div
                key={li.id}
                className="grid grid-cols-[1fr_4rem_4rem] border-b border-slate-100 py-1 text-slate-700"
              >
                <span className="pr-2">{li.description.value}</span>
                <span className="text-right">1</span>
                <span className="text-right">{fmtMoney(li.amount.value)}</span>
              </div>
            ))}
            {invoice.lineItems.length > 6 && (
              <div className="py-1 text-center text-[9px] italic text-slate-400">
                + {invoice.lineItems.length - 6} more line items
              </div>
            )}
          </div>

          <div className="absolute bottom-[6%] right-[6%] w-[40%] text-[10px]">
            <div className="grid grid-cols-2 gap-y-0.5 border-t border-slate-300 pt-1">
              <span className="text-slate-500">Subtotal</span>
              <span className="text-right text-slate-800">{fmtMoney(invoice.total.value)}</span>
              <span className="text-slate-500">Tax</span>
              <span className="text-right text-slate-800">{fmtMoney(0)}</span>
              <span className="font-semibold text-slate-700">Total</span>
              <span className="text-right text-base font-bold text-slate-900">{fmtMoney(invoice.total.value)}</span>
            </div>
          </div>

          <div className="absolute bottom-[2%] left-[6%] right-[6%] border-t border-slate-200 pt-1 text-center text-[9px] text-slate-400">
            Remit to: {invoice.vendor.value} · Net terms per agreement · Questions: ap@vendor.example
          </div>

          {highlightedBbox && (
            <div
              className="pointer-events-none absolute rounded-sm bg-amber-300/40 ring-2 ring-amber-500 transition-all"
              style={{
                left: `${highlightedBbox.x}%`,
                top: `${highlightedBbox.y}%`,
                width: `${highlightedBbox.w}%`,
                height: `${highlightedBbox.h}%`,
              }}
            />
          )}
        </div>
      </div>
      <div className="border-t border-slate-200 px-3 py-1.5 text-[10px] text-slate-500">
        Page 1 of 1 · Rendered from extracted text (no real PDF) · Hover an extracted field on the right to highlight its location.
      </div>
    </div>
  );
}
