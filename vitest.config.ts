import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./__tests__/setup.ts"],
    include: ["__tests__/**/*.test.{ts,tsx}"],
    exclude: ["__tests__/e2e/**", "node_modules"],
    coverage: {
      provider: "v8",
      reporter: ["text", "text-summary", "lcov"],
      include: [
        "app/lib/**/*.ts",
        "app/stores/**/*.ts",
        "app/api/functions/**/*.ts",
        "app/api/maniadb/**/*.ts",
        "app/api/naver/**/*.ts",
        "app/api/auth/**/*.ts",
        "app/util/supabase/**/*.ts",
        "app/ui/**/*.tsx",
      ],
      exclude: [
        "**/*.d.ts",
        "**/*.test.{ts,tsx}",
        "**/node_modules/**",
        "app/lib/interfaces/**",
        "app/lib/enums/**",
      ],
    },
  },
});
