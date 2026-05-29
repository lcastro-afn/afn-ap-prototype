import { Link } from "react-router-dom";
import { useStore } from "../lib/store";
import { ROLE_LABEL } from "../data/personas";
import { Shield } from "lucide-react";
import { DemoBadge } from "../components/Ui";

export function LoginPage() {
  const { setPersonaId, personas } = useStore();

  return (
    <div className="grid min-h-screen place-items-center bg-gradient-to-br from-afn-50 via-white to-slate-50 p-4">
      <div className="card w-full max-w-md p-6">
        <div className="flex items-center gap-2">
          <div className="grid h-10 w-10 place-items-center rounded-md bg-afn-600 font-bold text-white">
            A
          </div>
          <div>
            <div className="text-base font-semibold">AFN AP Platform</div>
            <div className="text-[11px] uppercase tracking-wider text-slate-500">
              Concur Replacement · Phase 1 MVP
            </div>
          </div>
          <DemoBadge className="ml-auto" />
        </div>
        <p className="mt-4 text-sm text-slate-600">
          Production will sign you in via{" "}
          <span className="font-medium text-slate-800">AFN Entra ID</span>.
          For this prototype, pick a demo persona to enter the app.
        </p>

        <div className="mt-4 space-y-1.5">
          {personas.map((p) => (
            <Link
              key={p.id}
              to="/"
              onClick={() => setPersonaId(p.id)}
              className="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-2 hover:border-afn-300 hover:bg-afn-50"
            >
              <span className="grid h-9 w-9 place-items-center rounded-md bg-afn-100 text-sm font-semibold text-afn-700">
                {p.initials}
              </span>
              <span className="flex flex-col leading-tight">
                <span className="text-sm font-medium text-slate-900">{p.name}</span>
                <span className="text-xs text-slate-500">
                  {p.title} · {ROLE_LABEL[p.role]}
                </span>
              </span>
              <span className="ml-auto text-[10px] uppercase tracking-wider text-afn-700">
                Sign in →
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-md bg-slate-50 px-3 py-2 text-xs text-slate-600">
          <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-500" />
          <p>
            Role-based access (AP Clerk, AP Lead, Approver, Administrator)
            controls every screen. Permission checks happen at the API and UI
            layer in production.
          </p>
        </div>
      </div>
    </div>
  );
}
