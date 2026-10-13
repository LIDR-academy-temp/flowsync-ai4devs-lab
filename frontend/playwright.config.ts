import { defineConfig, devices } from '@playwright/test'

// El recorrido necesita la aplicación entera en marcha (`make start`: base de
// datos, backend y frontend). No la arranca: la dirección sale de aquí, y se
// puede apuntar a otra con E2E_BASE_URL.
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
})
