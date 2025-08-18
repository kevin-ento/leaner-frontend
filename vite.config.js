import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    // Proxy not required anymore since we call the Render URL directly by default
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      // Render hostname(s)
      "leaner-frontend.onrender.com",
    ],
  },
  css: {
    postcss: "./postcss.config.js",
  },
});
