import type { Vendor, GLAccount, Branch, RoutingRule } from "./types";

export const VENDORS: Vendor[] = [
  { id: "V-1042", name: "Iron Mountain Information Mgmt", defaultGL: "6420", defaultBranch: "PHX-01", paymentTerms: "Net 30", status: "active" },
  { id: "V-2087", name: "First American Title Insurance", defaultGL: "5310", defaultBranch: "HQ-00", paymentTerms: "Net 15", status: "active" },
  { id: "V-3331", name: "Stewart Lender Services", defaultGL: "5320", defaultBranch: "HQ-00", paymentTerms: "Net 30", status: "active" },
  { id: "V-4150", name: "CoreLogic Credit Solutions", defaultGL: "5410", defaultBranch: "HQ-00", paymentTerms: "Net 30", status: "active" },
  { id: "V-5512", name: "Ancora Capital Backups", defaultGL: "5820", defaultBranch: "HQ-00", paymentTerms: "Net 45", status: "active" },
  { id: "V-6601", name: "OfficeMax Business Supply", defaultGL: "6510", defaultBranch: "PHX-01", paymentTerms: "Net 30", status: "active" },
  { id: "V-7720", name: "Aspect Technologies Group", defaultGL: "6310", defaultBranch: "HQ-00", paymentTerms: "Net 30", status: "active" },
  { id: "V-8830", name: "BluePeak Marketing Co.", defaultGL: "7110", defaultBranch: "PHX-01", paymentTerms: "Net 30", status: "active" },
];

export const GL_ACCOUNTS: GLAccount[] = [
  { code: "5310", name: "Title Insurance — Loan Cost", category: "Loan Production" },
  { code: "5320", name: "Lender Services — Loan Cost", category: "Loan Production" },
  { code: "5410", name: "Credit Reports", category: "Loan Production" },
  { code: "5820", name: "Per-Loan Vendor Pass-through", category: "Loan Production" },
  { code: "6310", name: "Software & SaaS", category: "Technology" },
  { code: "6420", name: "Records Storage & Retention", category: "Operations" },
  { code: "6510", name: "Office Supplies", category: "Operations" },
  { code: "7110", name: "Marketing — Branch", category: "Marketing" },
];

export const BRANCHES: Branch[] = [
  { code: "HQ-00", name: "Corporate HQ", state: "AZ" },
  { code: "PHX-01", name: "Phoenix — Camelback", state: "AZ" },
  { code: "PHX-02", name: "Phoenix — Scottsdale", state: "AZ" },
  { code: "DAL-01", name: "Dallas — Uptown", state: "TX" },
  { code: "ORL-01", name: "Orlando — Downtown", state: "FL" },
  { code: "SEA-01", name: "Seattle — Bellevue", state: "WA" },
];

export const ROUTING_RULES: RoutingRule[] = [
  {
    id: "R-001",
    description: "Auto-route to AP Lead",
    condition: "Any invoice ≥ $1 AND confidence ≥ 95%",
    threshold: 1,
    approverRole: "AP Lead",
    enabled: true,
  },
  {
    id: "R-002",
    description: "Branch Manager approval for branch-level spend",
    condition: "Total ≥ $500 AND category = Operations|Marketing AND branch ≠ HQ-00",
    threshold: 500,
    approverRole: "Branch Manager",
    enabled: true,
  },
  {
    id: "R-003",
    description: "VP Finance approval for mid-tier spend",
    condition: "Total ≥ $5,000",
    threshold: 5000,
    approverRole: "VP Finance",
    enabled: true,
  },
  {
    id: "R-004",
    description: "CFO sign-off for major spend",
    condition: "Total ≥ $50,000",
    threshold: 50000,
    approverRole: "CFO",
    enabled: true,
  },
  {
    id: "R-005",
    description: "Low-confidence → AP Clerk review",
    condition: "Any field confidence < 80%",
    approverRole: "AP Clerk",
    enabled: true,
  },
  {
    id: "R-006",
    description: "Per-loan invoices route through Loan Ops review",
    condition: "Line item has Loan Number reference",
    approverRole: "Loan Ops Manager",
    enabled: false,
  },
];

export const VENDOR_GL_MAP: Record<string, string> = Object.fromEntries(
  VENDORS.map((v) => [v.id, v.defaultGL])
);
