import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";

// Multi-page setup:
//   index.html      -> existing SIS site (main.jsx -> App.jsx)
//   megamenu.html   -> Mega Menu demo (megamenu-demo/main.tsx)
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        megamenu: resolve(__dirname, "megamenu.html"),
      },
    },
  },
});
