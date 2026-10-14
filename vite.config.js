import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// base "./" lets the built site be hosted from any folder or subpath.
export default defineConfig({
  base: "./",
  plugins: [react()],
});
