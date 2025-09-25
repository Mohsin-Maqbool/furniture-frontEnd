import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default ({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return defineConfig({
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"), // 👈 yahan alias fix
      },
    },
    server: {
      proxy: {
        "/api": {
          target: "http://localhost:4500",
          changeOrigin: true,
          secure: false,
        },
      },
    },
  });
};
