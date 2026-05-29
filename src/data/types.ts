// Domain types for the AFN AP Platform prototype.
// NOTE: This is a clickable prototype. No data is persisted to a real backend.

export type Role = "AP_CLERK" | "AP_LEAD" | "APPROVER" | "ADMINISTRATOR";

export type Persona = {
  id: string;
  name: string;
  role: Role;
  title: string;
  email: string;
  initials: string;
  dba: string;
  approvalLimit?: number; // dollar limit if approver
};

export type ConfidenceTier = "high" | "medium" | "low";

export type ExtractedField<T = string> = {
  value: T;
  confidence: number; // 0..1
  // Optional bounding box on the rendered fake PDF preview (percentages 0..100)
  bbox?: { x: number; y: number; w: number; h: number };
  // Whether a human has accepted / edited this field
  reviewed?: boolean;
};

export type LineItem = {
  id: string;
  description: ExtractedField<string>;
  amount: ExtractedField<number>;
  glAccount: ExtractedField<string>;
  costCenter: ExtractedField<string>;
  branch: ExtractedField<string>;
  loanNumber?: ExtractedField<string>;
  borrowerName?: ExtractedField<string>;
};

export type InvoiceStatus =
  | "INTAKE"
  | "AI_CAPTURE"
  | "CLERK_REVIEW"
  | "ROUTED"
  | "PENDING_APPROVAL"
  | "APPROVED"
  | "REJECTED"
  | "RETURNED"
  | "POSTED"
  | "EXCEPTION";

export type AuditEvent = {
  id: string;
  timestamp: string; // ISO
  actor: string;
  actorRole: Role | "SYSTEM" | "AI";
  action: string;
  detail?: string;
};

export type ApprovalStep = {
  id: string;
  approverName: string;
  approverRole: string;
  threshold?: string;
  status: "pending" | "approved" | "rejected" | "skipped" | "current";
  decidedAt?: string;
  comment?: string;
};

export type Invoice = {
  id: string;
  source: "INBOX" | "UPLOAD";
  receivedAt: string;
  vendor: ExtractedField<string>;
  vendorId?: string;
  invoiceNumber: ExtractedField<string>;
  invoiceDate: ExtractedField<string>;
  dueDate: ExtractedField<string>;
  total: ExtractedField<number>;
  currency: string;
  poNumber?: ExtractedField<string>;
  lineItems: LineItem[];
  overallConfidence: number;
  status: InvoiceStatus;
  routing: ApprovalStep[];
  audit: AuditEvent[];
  loanVisionTxnId?: string;
  edgeCase?:
    | "HIGH_CONFIDENCE"
    | "MIXED_CONFIDENCE"
    | "ALL_LOW"
    | "MULTI_LINE"
    | "BORROWER_LINE"
    | "MISSING_PO";
};

export type Vendor = {
  id: string;
  name: string;
  defaultGL: string;
  defaultBranch: string;
  paymentTerms: string;
  status: "active" | "inactive";
};

export type GLAccount = {
  code: string;
  name: string;
  category: string;
};

export type Branch = {
  code: string;
  name: string;
  state: string;
};

export type RoutingRule = {
  id: string;
  description: string;
  condition: string;
  threshold?: number;
  approverRole: string;
  enabled: boolean;
};
