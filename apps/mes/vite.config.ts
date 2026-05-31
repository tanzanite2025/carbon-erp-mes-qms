import { applyDotenvToProcessEnv } from "@carbon/dev/vite";
import { reactRouter } from "@react-router/dev/vite";
import { lingui } from "@lingui/vite-plugin";
import tailwindcss from "@tailwindcss/vite";
import path from "node:path";
import { defineConfig, PluginOption } from "vite";
import babelMacros from "vite-plugin-babel-macros";

export default defineConfig(({ mode, isSsrBuild }) => {
  applyDotenvToProcessEnv(mode, __dirname);

  return {
    // 共享缓存目录，加速预构建
    cacheDir: "../../node_modules/.vite/mes",
    
    // 优化依赖预构建
    optimizeDeps: {
      force: false,  // 不强制重新预构建
      include: [
        // 明确列出常用依赖，加速预构建
        "react",
        "react-dom",
        "@remix-run/react",
        "@tanstack/react-query",
        "zod",
        "zustand",
        "react-hook-form",
        "date-fns",
        "lucide-react"
      ]
    },
    
    build: {
      minify: true,
      rolldownOptions: {
        onwarn(warning, defaultHandler) {
          if (warning.code === "SOURCEMAP_ERROR") {
            return;
          }

          defaultHandler(warning);
        },
        ...(isSsrBuild && { input: "./server/app.ts" }),
      },
    },
    define: {
      global: "globalThis",
    },
    ssr: {
      noExternal: [
        "react-dropzone",
        "react-icons",
        "react-phone-number-input",
        "tailwind-merge",
      ],
    },
    server: {
      port: 3001,
      strictPort: true,
      allowedHosts: [".ngrok-free.app", ".w.modal.host", ".w.modal.dev", ".dev", ".localhost"],
      watch: {
        // 减少文件监听，提升性能
        ignored: [
          "**/node_modules/**",
          "**/.git/**",
          "**/dist/**",
          "**/build/**",
          "**/.turbo/**",
          "**/.cache/**"
        ]
      }
    },
    plugins: [
      tailwindcss(),
      babelMacros(),
      lingui(),
      reactRouter(),
    ] as PluginOption[],
    resolve: {
      tsconfigPaths: true,
      alias: {
        "@carbon/utils": path.resolve(
          __dirname,
          "../../packages/utils/src/index.ts"
        ),
        "@carbon/form": path.resolve(
          __dirname,
          "../../packages/form/src/index.tsx"
        ),
      },
    },
  };
});
