import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { config as loadEnv } from 'dotenv';
import { resolve } from 'path';
loadEnv({ path: resolve(__dirname, 'frontend.env') });
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  },
  resolve: {
    
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  }
})
