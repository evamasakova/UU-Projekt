import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const hostUrl = "https://convicted-consumer-product-accordingly.trycloudflare.com"
export default defineConfig({

  plugins: [react()],
  server: {
    proxy: {
      "/authentication": {
        target: hostUrl, 
        changeOrigin: true,
      },
      "/users": {
        target: hostUrl, 
        changeOrigin: true,
      },
      "/project": {
        target: hostUrl,
        changeOrigin: true,
      },
      "/categories": {
        target: hostUrl,
        changeOrigin: true,
      }
    }
  }
});