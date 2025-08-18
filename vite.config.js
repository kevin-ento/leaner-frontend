import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
  },
  preview: {
    host: "0.0.0.0",
    port: Number(process.env.PORT) || 4173,
    allowedHosts: [
      "localhost",
      "127.0.0.1",
      "leaner-frontend.onrender.com",
      "leaner-frontend.vercel.app",
    ],
  },
  css: {
    postcss: "./postcss.config.js",
  },
});
