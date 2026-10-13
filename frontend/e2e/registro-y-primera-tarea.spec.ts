import { randomUUID } from 'node:crypto'
import { expect, test } from '@playwright/test'

// El único recorrido de extremo a extremo, y a propósito: atraviesa de verdad
// el formulario de registro, la sesión, la pantalla de tareas y el backend.
// Lo que se puede provocar fijando las entradas de una sola pieza (cada estado
// de un componente, un filtro, un cambio de estado) se comprueba en su historia,
// no aquí.

const PASSWORD = 'e2e-password-1234'

test('una persona sin cuenta se registra, escribe una tarea y la ve en el listado', async ({
  page,
}) => {
  // Distinto en cada ejecución: el correo no puede repetirse entre cuentas, y el
  // título identifica nuestra tarea entre las demás del equipo, que comparten lista.
  const id = randomUUID()
  const email = `e2e-${id}@example.com`
  const titulo = `Tarea e2e ${id}`

  await page.goto('/register')
  await page.getByLabel('Email', { exact: true }).fill(email)
  await page.getByLabel('Contraseña', { exact: true }).fill(PASSWORD)
  await page.getByLabel('Repite la contraseña').fill(PASSWORD)
  await page.getByRole('button', { name: 'Crear cuenta' }).click()

  await expect(
    page.getByRole('heading', { name: 'Tareas del equipo' }),
  ).toBeVisible()

  await page.getByLabel('Título de la tarea').fill(titulo)
  await page.getByRole('button', { name: 'Crear tarea' }).click()

  await expect(
    page.getByRole('list').getByRole('link', { name: titulo }),
  ).toBeVisible()
})
