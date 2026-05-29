import type { Persona } from "./types";

export const PERSONAS: Persona[] = [
  {
    id: "p_clerk",
    name: "Dana Ruiz",
    role: "AP_CLERK",
    title: "AP Clerk",
    email: "druiz@afncorp.com",
    initials: "DR",
    dba: "AFN Lending — Pilot DBA",
  },
  {
    id: "p_lead",
    name: "Marcus Chen",
    role: "AP_LEAD",
    title: "AP Lead",
    email: "mchen@afncorp.com",
    initials: "MC",
    dba: "AFN Lending — Pilot DBA",
  },
  {
    id: "p_approver_branch",
    name: "Priya Patel",
    role: "APPROVER",
    title: "Branch Manager — Phoenix",
    email: "ppatel@afncorp.com",
    initials: "PP",
    dba: "AFN Lending — Pilot DBA",
    approvalLimit: 5000,
  },
  {
    id: "p_approver_cfo",
    name: "John Eric Williams",
    role: "APPROVER",
    title: "VP Finance",
    email: "jewilliams@afncorp.com",
    initials: "JE",
    dba: "AFN Lending — Pilot DBA",
    approvalLimit: 50000,
  },
  {
    id: "p_admin",
    name: "Matt Gruber",
    role: "ADMINISTRATOR",
    title: "CIO / Administrator",
    email: "mgruber@afncorp.com",
    initials: "MG",
    dba: "AFN Lending — Pilot DBA",
  },
];

export const ROLE_LABEL: Record<Persona["role"], string> = {
  AP_CLERK: "AP Clerk",
  AP_LEAD: "AP Lead",
  APPROVER: "Approver",
  ADMINISTRATOR: "Administrator",
};
