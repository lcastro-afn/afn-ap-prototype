import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { PERSONAS } from "../data/personas";
import { INVOICES } from "../data/invoices";
import type { Invoice, Persona } from "../data/types";

type StoreCtx = {
  persona: Persona;
  setPersonaId: (id: string) => void;
  personas: Persona[];
  invoices: Invoice[];
  getInvoice: (id: string) => Invoice | undefined;
  updateInvoice: (id: string, updater: (inv: Invoice) => Invoice) => void;
  resetData: () => void;
};

const Ctx = createContext<StoreCtx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [personaId, setPersonaIdState] = useState<string>(PERSONAS[0].id);
  const [invoices, setInvoices] = useState<Invoice[]>(INVOICES);

  const setPersonaId = useCallback((id: string) => {
    setPersonaIdState(id);
  }, []);

  const getInvoice = useCallback(
    (id: string) => invoices.find((i) => i.id === id),
    [invoices]
  );

  const updateInvoice = useCallback(
    (id: string, updater: (inv: Invoice) => Invoice) => {
      setInvoices((prev) =>
        prev.map((inv) => (inv.id === id ? updater(inv) : inv))
      );
    },
    []
  );

  const resetData = useCallback(() => {
    setInvoices(INVOICES);
  }, []);

  const value = useMemo<StoreCtx>(
    () => ({
      persona: PERSONAS.find((p) => p.id === personaId) ?? PERSONAS[0],
      setPersonaId,
      personas: PERSONAS,
      invoices,
      getInvoice,
      updateInvoice,
      resetData,
    }),
    [personaId, invoices, setPersonaId, getInvoice, updateInvoice, resetData]
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useStore must be used inside StoreProvider");
  return v;
}
