import { defineConfig } from '@playwright/test'

// La dirección de la app sale de aquí y no de los tests. Por defecto es el
// servidor de desarrollo (`make start`); para apuntar a otro, `E2E_BASE_URL`.
export default defineConfig({
  testDir: './e2e',
  use: {
    baseURL: process.env.E2E_BASE_URL ?? 'http://localhost:5173',
  },
})
