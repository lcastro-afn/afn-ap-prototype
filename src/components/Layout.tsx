import { NavLink, Outlet, useLocation } from "react-router-dom";
import {
  Inbox,
  Sparkles,
  ClipboardList,
  CheckSquare,
  GitBranch,
  CheckCircle2,
  BarChart3,
  Settings,
  ScrollText,
  Users,
  ChevronDown,
  Bell,
  HelpCircle,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useStore } from "../lib/store";
import { ROLE_LABEL } from "../data/personas";
import { cn } from "../lib/utils";
import { DemoBadge } from "./Ui";

type NavItem = {
  to: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
};

const NAV: NavItem[] = [
  { to: "/intake", label: "Invoice Intake", icon: Inbox, description: "Drag-drop + monitored inbox" },
  { to: "/queue", label: "AP Clerk Queue", icon: ClipboardList, description: "Review low-confidence" },
  { to: "/approvals", label: "Approvals", icon: CheckSquare, description: "Approve / reject / return" },
  { to: "/dashboard", label: "Telemetry", icon: BarChart3, description: "Volume · confidence · health" },
  { to: "/rules", label: "Rules & Routing", icon: GitBranch, description: "GL map · thresholds · approvers" },
  { to: "/settings", label: "Settings", icon: Settings, description: "Vendors · GL · branches" },
  { to: "/audit", label: "Audit Trail", icon: ScrollText, description: "Per-invoice timeline" },
];

export function Layout() {
  const { persona, setPersonaId, personas } = useStore();
  const [personaOpen, setPersonaOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
        <div className="flex h-14 items-center gap-3 px-3 sm:px-5">
          <button
            className="rounded-md p-1.5 text-slate-600 hover:bg-slate-100 md:hidden"
            onClick={() => setSidebarOpen(true)}
            aria-label="Open navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <NavLink to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-md bg-afn-600 font-bold text-white">
              A
            </div>
            <div className="flex flex-col leading-tight">
              <span className="text-sm font-semibold text-slate-900">
                AFN AP Platform
              </span>
              <span className="hidden text-[10px] uppercase tracking-wider text-slate-500 sm:block">
                Concur Replacement · Phase 1 MVP
              </span>
            </div>
          </NavLink>
          <DemoBadge className="hidden sm:inline-flex" />

          <div className="ml-auto flex items-center gap-2">
            <button
              className="hidden items-center gap-1 rounded-md px-2 py-1.5 text-slate-500 hover:bg-slate-100 sm:flex"
              title="Help"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
            <button
              className="relative hidden items-center gap-1 rounded-md px-2 py-1.5 text-slate-500 hover:bg-slate-100 sm:flex"
              title="Notifications"
            >
              <Bell className="h-4 w-4" />
              <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-rose-500" />
            </button>

            <div className="relative">
              <button
                onClick={() => setPersonaOpen((o) => !o)}
                className="flex items-center gap-2 rounded-md border border-slate-200 bg-white py-1 pl-1 pr-2 hover:bg-slate-50"
              >
                <span className="grid h-7 w-7 place-items-center rounded-md bg-afn-100 text-xs font-semibold text-afn-700">
                  {persona.initials}
                </span>
                <span className="hidden flex-col items-start leading-tight sm:flex">
                  <span className="text-xs font-semibold text-slate-900">
                    {persona.name}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500">
                    {ROLE_LABEL[persona.role]}
                  </span>
                </span>
                <ChevronDown className="h-3.5 w-3.5 text-slate-500" />
              </button>
              {personaOpen && (
                <>
                  <div
                    className="fixed inset-0 z-20"
                    onClick={() => setPersonaOpen(false)}
                  />
                  <div className="absolute right-0 z-30 mt-2 w-72 rounded-lg border border-slate-200 bg-white p-2 shadow-lg">
                    <div className="flex items-center gap-2 px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                      <Users className="h-3 w-3" /> Switch demo persona
                      <DemoBadge className="ml-auto" />
                    </div>
                    {personas.map((p) => (
                      <button
                        key={p.id}
                        onClick={() => {
                          setPersonaId(p.id);
                          setPersonaOpen(false);
                        }}
                        className={cn(
                          "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-slate-50",
                          p.id === persona.id && "bg-afn-50"
                        )}
                      >
                        <span className="grid h-7 w-7 place-items-center rounded-md bg-afn-100 text-xs font-semibold text-afn-700">
                          {p.initials}
                        </span>
                        <span className="flex flex-col leading-tight">
                          <span className="text-xs font-medium text-slate-900">
                            {p.name}
                          </span>
                          <span className="text-[10px] text-slate-500">
                            {p.title}
                          </span>
                        </span>
                        {p.id === persona.id && (
                          <CheckCircle2 className="ml-auto h-4 w-4 text-afn-600" />
                        )}
                      </button>
                    ))}
                    <div className="mt-2 border-t border-slate-100 px-2 pt-2 text-[10px] text-slate-500">
                      Personas reset on refresh. Use this to demo each role's view.
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 top-0 z-40 w-72 transform border-r border-slate-200 bg-white pt-14 transition-transform md:relative md:top-0 md:z-0 md:translate-x-0 md:pt-0",
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          <div className="flex h-14 items-center justify-between border-b border-slate-200 px-4 md:hidden">
            <span className="text-sm font-semibold">Menu</span>
            <button
              onClick={() => setSidebarOpen(false)}
              className="rounded-md p-1.5 hover:bg-slate-100"
              aria-label="Close navigation"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <nav className="flex flex-col gap-0.5 px-3 py-4">
            <NavLink
              to="/"
              end
              onClick={() => setSidebarOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 rounded-md px-2.5 py-2 text-sm font-medium hover:bg-slate-100",
                  isActive ? "bg-afn-50 text-afn-700" : "text-slate-700"
                )
              }
            >
              <Sparkles className="h-4 w-4" /> Home
            </NavLink>
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={() => setSidebarOpen(false)}
                className={({ isActive }) =>
                  cn(
                    "flex items-start gap-2 rounded-md px-2.5 py-2 text-sm font-medium hover:bg-slate-100",
                    isActive ? "bg-afn-50 text-afn-700" : "text-slate-700"
                  )
                }
              >
                <item.icon className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="flex flex-col leading-tight">
                  <span>{item.label}</span>
                  {item.description && (
                    <span className="text-[10px] font-normal text-slate-500">
                      {item.description}
                    </span>
                  )}
                </span>
              </NavLink>
            ))}
            <div className="mt-4 px-2.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
              Pilot DBA
            </div>
            <div className="px-2.5 py-1.5 text-xs text-slate-600">
              {persona.dba}
            </div>
            <div className="mt-4 rounded-md bg-slate-50 px-3 py-2.5 text-[11px] leading-snug text-slate-600">
              This prototype mocks all data and AI calls. Use the persona
              switcher in the top-right to see each role.
            </div>
          </nav>
        </aside>

        {sidebarOpen && (
          <div
            className="fixed inset-0 z-30 bg-slate-900/30 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-8" key={location.pathname}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
