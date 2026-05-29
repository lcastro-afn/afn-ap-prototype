import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
// `base` is set so the bundle loads correctly when served under
// https://<user>.github.io/<repo>/ on GitHub Pages.
// Override via VITE_BASE env var if deploying somewhere else.
export default defineConfig(() => ({
  base: process.env.VITE_BASE ?? "/afn-ap-prototype/",
  plugins: [react()],
}));
