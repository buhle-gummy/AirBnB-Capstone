import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// During local development, API calls use the Vite proxy so the frontend can
// reach the backend without requiring a checked-in .env file or browser CORS.
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/api": {
        target: process.env.VITE_API_PROXY_TARGET || "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
