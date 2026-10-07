import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tells Vite to understand React (JSX) files.
export default defineConfig({
  plugins: [react()],
});
