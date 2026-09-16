import { defineConfig, devices } from "@playwright/test";

/**
 * Config Playwright E2E pour RestoConnect.
 * Lance le backend (uvicorn) + frontend (next dev) automatiquement via webServer.
 * Le backend utilise RESET_DB_ON_BOOT=false pour préserver la DB seedée.
 */
export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: [
    ["list"],
    ["json", { outputFile: "test-results/report.json" }],
    ["html", { outputFolder: "test-results/html", open: "never" }],
  ],
  use: {
    baseURL: "http://localhost:3000",
    trace: "on-first-retry",
    headless: true,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: [
    {
      command: "../backend/venv/bin/uvicorn app.main:app --host 127.0.0.1 --port 8000",
      cwd: "../backend",
      url: "http://127.0.0.1:8000/",
      timeout: 60_000,
      reuseExistingServer: true,
      env: {
        // Préserve la DB seedée pendant les tests E2E
        RESET_DB_ON_BOOT: "false",
      },
    },
    {
      command: "npx next dev --webpack --hostname 127.0.0.1 --port 3000",
      url: "http://127.0.0.1:3000/",
      timeout: 60_000,
      reuseExistingServer: true,
    },
  ],
});