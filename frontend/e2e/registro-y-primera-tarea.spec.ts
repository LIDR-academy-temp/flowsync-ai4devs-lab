import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'

// El único recorrido de extremo a extremo: alguien sin cuenta se registra,
// llega a la pantalla de tareas, escribe una y la ve en el listado. Cada estado
// de un componente (filtros, cambio de estado, errores de campo) se comprueba
// en su historia, no aquí.
test('una persona nueva se registra y ve aparecer su primera tarea', async ({
  page,
}) => {
  // Distinto en cada ejecución: la base conserva las cuentas, y un correo
  // repetido chocaría con el registro de la ejecución anterior.
  const id = randomUUID().slice(0, 8)
  const email = `e2e-${id}@example.com`
  const titulo = `Revisar el informe ${id}`

  await page.goto('/register')
  await page.getByLabel('Email').fill(email)
  await page.getByLabel('Contraseña', { exact: true }).fill('clave-e2e-1234')
  await page
    .getByLabel('Repite la contraseña', { exact: true })
    .fill('clave-e2e-1234')
  await page.getByRole('button', { name: 'Crear cuenta' }).click()

  await expect(
    page.getByRole('heading', { name: 'Tareas del equipo' }),
  ).toBeVisible()

  await page.getByLabel('Título de la tarea').fill(titulo)
  await page.getByRole('button', { name: 'Crear tarea' }).click()

  await expect(page.getByRole('link', { name: titulo })).toBeVisible()
})
