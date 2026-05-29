# AFN AP Platform — Phase 1 MVP Prototype

A **clickable prototype** of AFN's in-house Accounts Payable platform — the
proposed replacement for SAP Concur. This artifact exists so AP leadership
(Matt Gruber, John Eric Williams) and the AP team can validate the
end-to-end workflow before AFN commits to a 10–14 week production build.

> **Live URL:** https://lcastro-afn.github.io/afn-ap-prototype/
>
> **This is a prototype.** Every data point, AI confidence score, Loan Vision
> transaction ID, and audit entry is mocked in-browser. There is no real
> backend, no Document Intelligence call, and no write to Loan Vision.

## What's in the box

End-to-end Phase 1 MVP workflow for a single pilot DBA:

| Screen | What it shows |
|---|---|
| **Home** | Persona-aware landing page, KPIs, module tiles. |
| **Login** | Persona picker (production = Entra ID SSO). |
| **Intake** | Drag-drop PDF upload + monitored AP inbox feed. |
| **Invoice detail** | Side-by-side PDF preview + extracted fields with per-field confidence (green ≥ 95%, yellow 80–94%, red < 80%), editable line items, routing chain, audit timeline. |
| **AP Clerk queue** | Inbox of low-confidence / exception invoices needing field-level review. |
| **Approver portal** | Routed invoices for the current persona — Approve / Reject / Return-for-info with comments. |
| **Telemetry dashboard** | Invoice volume, AI confidence histogram, approval latency trend, system health. |
| **Rules & Routing** | Editable dollar-threshold + category rules, routing visualization. |
| **Settings** | Loan Vision vendor master, GL chart, branch list, approver hierarchy. |
| **Audit trail** | Per-invoice timeline of every state transition, actor, and timestamp. |

## Demo personas

Switch via the top-right avatar menu. Each persona changes which queue is
populated and which actions are available.

- **Dana Ruiz** — AP Clerk (review queue + send-to-approver)
- **Marcus Chen** — AP Lead (first-tier approver)
- **Priya Patel** — Branch Manager (branch-level approver)
- **John Eric Williams** — VP Finance (mid-tier approver)
- **Matt Gruber** — Administrator (sees everything)

## Demo invoices

Six fixtures cover the edge cases from the Phase 1 spec:

1. `INV-2026-0413` — high confidence, awaiting branch approval
2. `INV-2026-0414` — mixed confidence, in AP Clerk queue
3. `INV-2026-0415` — all-low (handwritten scan), exception
4. `INV-2026-0416` — multi-line SaaS renewal, already posted
5. `INV-2026-0417` — borrower-name line items, awaiting AP Lead
6. `INV-2026-0418` — missing PO, in routing
7. `INV-2026-0411` — historical posted invoice

## Local development

```bash
npm install
npm run dev      # http://localhost:5173/
npm run build    # production build into dist/
npm run preview  # serve the production build locally
```

## Stack

- React 19 + TypeScript
- Vite 8
- Tailwind CSS 3 (forest-green AFN palette)
- shadcn-style inline component primitives (no MUI)
- lucide-react icons
- recharts for the telemetry charts
- react-router-dom (HashRouter — works on GitHub Pages without server rewrites)

## Deploy

`main` is deployed automatically to GitHub Pages by
`.github/workflows/deploy.yml`. Set the repository's Pages source to
**"GitHub Actions"** under Settings → Pages.
