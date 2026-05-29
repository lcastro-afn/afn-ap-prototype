import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { HashRouter, Route, Routes, Navigate } from "react-router-dom";
import "./index.css";
import { Layout } from "./components/Layout";
import { StoreProvider } from "./lib/store";
import { HomePage } from "./pages/Home";
import { IntakePage } from "./pages/Intake";
import { InvoiceDetailPage } from "./pages/InvoiceDetail";
import { ClerkQueuePage } from "./pages/ClerkQueue";
import { ApprovalsPage } from "./pages/Approvals";
import { DashboardPage } from "./pages/Dashboard";
import { RulesPage } from "./pages/Rules";
import { SettingsPage } from "./pages/Settings";
import { AuditPage } from "./pages/Audit";
import { LoginPage } from "./pages/Login";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <StoreProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/intake" element={<IntakePage />} />
            <Route path="/invoice/:id" element={<InvoiceDetailPage />} />
            <Route path="/queue" element={<ClerkQueuePage />} />
            <Route path="/approvals" element={<ApprovalsPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="/audit" element={<AuditPage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </HashRouter>
    </StoreProvider>
  </StrictMode>
);
