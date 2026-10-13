import User from '#models/user'
import Task from '#models/task'
import { test } from '@japa/runner'
import testUtils from '@adonisjs/core/services/test_utils'

/**
 * Requirement «Resumen de tareas por estado» (change `progreso-de-tareas-hechas`,
 * `specs/tasks/spec.md`): `GET /api/v1/tasks/summary` devuelve cuántas tareas hay en
 * cada estado y el total, contando todo el espacio salvo la papelera. Es solo lectura y
 * solo números. Un test por Scenario:
 *
 *   Recuento por estado              Espacio sin tareas
 *   La papelera no cuenta            El filtro de la lista no influye
 *   Cuenta lo que cambia             Pedir el resumen no cambia nada
 *   Resumen sin haber entrado
 *
 * Los otros tres Requirements del change son de interfaz y no se prueban aquí.
 *
 * Una ruta que aún no existe responde 404, así que ningún test se conforma con un error:
 * todos exigen el 200 con los números, y el de «sin haber entrado» lo exige también con
 * token antes de esperar el 401.
 */
test.group('Tasks | resumen por estado', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  async function persona(client: any, email: string, fullName: string) {
    const user = await User.create({ fullName, email, password: 'secreto123' })
    const login = await client.post('/api/v1/auth/login').json({ email, password: 'secreto123' })

    return { user, token: login.body().data.token as string }
  }

  const con = (token: string) => ({ Authorization: `Bearer ${token}` })

  function tareaDe(user: User, status: 'pending' | 'in_progress' | 'done'): Promise<Task> {
    return Task.create({ title: 'Revisar el informe', status, assigneeId: user.id })
  }

  /** Crea `n` tareas de ese estado. */
  async function variasDe(user: User, status: 'pending' | 'in_progress' | 'done', n: number) {
    const tareas: Task[] = []
    for (let i = 0; i < n; i++) tareas.push(await tareaDe(user, status))
    return tareas
  }

  /** Pide el resumen y exige el 200: devuelve el cuerpo entero, con su `data`. */
  async function resumen(client: any, token: string, status?: string) {
    const request = client.get('/api/v1/tasks/summary').headers(con(token))
    if (status !== undefined) request.qs({ status })
    const response = await request
    response.assertStatus(200)
    return response.body()
  }

  const cuenta = (pending: number, inProgress: number, done: number) => ({
    data: { pending, inProgress, done, total: pending + inProgress + done },
  })

  const borrar = (client: any, token: string, id: number) =>
    client.delete(`/api/v1/tasks/${id}`).headers(con(token))

  const cambiarEstado = (client: any, token: string, id: number, status: string) =>
    client.patch(`/api/v1/tasks/${id}/status`).headers(con(token)).json({ status })

  test('Recuento por estado', async ({ client, assert }) => {
    const ada = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const grace = await persona(client, 'grace@example.com', 'Grace Hopper')
    await variasDe(ada.user, 'pending', 2)
    await variasDe(grace.user, 'in_progress', 1)
    await variasDe(ada.user, 'done', 3)

    const response = await client.get('/api/v1/tasks/summary').headers(con(ada.token))

    response.assertStatus(200)
    // El cuerpo entero y nada más, con enteros JSON (no cadenas) y el total ya sumado.
    assert.deepEqual(response.body(), cuenta(2, 1, 3))
    assert.deepEqual(response.body(), { data: { pending: 2, inProgress: 1, done: 3, total: 6 } })
    for (const valor of Object.values(response.body().data)) {
      assert.isTrue(Number.isInteger(valor))
    }

    // Comprobación extra, sale del texto del Requirement («la misma para cualquier cuenta
    // con sesión»): otra persona, con tareas distintas a su nombre, ve exactamente lo mismo.
    assert.deepEqual(await resumen(client, grace.token), cuenta(2, 1, 3))
  })

  test('Espacio sin tareas', async ({ client, assert }) => {
    const { token } = await persona(client, 'ada@example.com', 'Ada Lovelace')

    const response = await client.get('/api/v1/tasks/summary').headers(con(token))

    // Ni error ni respuesta vacía: los cuatro valores existen y son el número 0.
    response.assertStatus(200)
    assert.deepEqual(response.body(), { data: { pending: 0, inProgress: 0, done: 0, total: 0 } })
  })

  test('La papelera no cuenta', async ({ client, assert }) => {
    const { user, token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    await tareaDe(user, 'pending')
    await tareaDe(user, 'in_progress')
    const hechas = await variasDe(user, 'done', 2)

    // Control positivo: antes de borrar, la hecha que se va a mandar a la papelera cuenta.
    assert.deepEqual(await resumen(client, token), cuenta(1, 1, 2))

    const borrada = await borrar(client, token, hechas[0].id)
    borrada.assertStatus(200)

    // Después: ni en `done` ni en `total`, y el resto sigue igual.
    assert.deepEqual(await resumen(client, token), cuenta(1, 1, 1))
  })

  test('El filtro de la lista no influye', async ({ client, assert }) => {
    const { user, token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    await variasDe(user, 'pending', 2)
    await variasDe(user, 'in_progress', 1)
    await variasDe(user, 'done', 3)

    const sinParametro = await resumen(client, token)
    const conHecho = await resumen(client, token, 'done')
    const conInventado = await resumen(client, token, 'inventado')

    // Un espacio con los tres estados, para que un filtro que sí actuara se notase.
    assert.deepEqual(sinParametro, cuenta(2, 1, 3))
    // Con un estado válido y con uno que no existe (que no es un 422): lo mismo.
    assert.deepEqual(conHecho, sinParametro)
    assert.deepEqual(conInventado, sinParametro)
  })

  test('Cuenta lo que cambia', async ({ client, assert }) => {
    const { user, token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    await tareaDe(user, 'pending')
    const [enCurso] = await variasDe(user, 'in_progress', 2)
    await tareaDe(user, 'done')

    assert.deepEqual(await resumen(client, token), cuenta(1, 2, 1))

    const cambio = await cambiarEstado(client, token, enCurso.id, 'done')
    cambio.assertStatus(200)

    // `inProgress` baja uno, `done` sube uno y `total` no se mueve.
    assert.deepEqual(await resumen(client, token), cuenta(1, 1, 2))
  })

  test('Pedir el resumen no cambia nada', async ({ client, assert }) => {
    const ada = await persona(client, 'ada@example.com', 'Ada Lovelace')
    const grace = await persona(client, 'grace@example.com', 'Grace Hopper')
    await tareaDe(ada.user, 'pending')
    await tareaDe(grace.user, 'in_progress')
    await tareaDe(ada.user, 'done')
    await Task.create({
      title: 'Con vencimiento',
      status: 'pending',
      assigneeId: grace.user.id,
      dueDate: '2026-12-01',
    })

    // Estado, responsable, fecha de vencimiento y marcas de tiempo de cada tarea.
    const instantanea = async () => {
      const tareas = await Task.query().orderBy('id')
      return tareas.map((tarea) => tarea.serialize())
    }

    const antes = await instantanea()
    assert.lengthOf(antes, 4)

    // Varias veces, y con y sin parámetro: cada una responde con los números reales
    // (si la ruta no existe, esto ya falla) y ninguna deja huella.
    for (let i = 0; i < 3; i++) {
      assert.deepEqual(await resumen(client, ada.token), cuenta(2, 1, 1))
    }
    assert.deepEqual(await resumen(client, grace.token, 'done'), cuenta(2, 1, 1))

    assert.deepEqual(await instantanea(), antes)
  })

  test('Resumen sin haber entrado', async ({ client, assert }) => {
    const { user, token } = await persona(client, 'ada@example.com', 'Ada Lovelace')
    await tareaDe(user, 'pending')
    await tareaDe(user, 'done')

    // Control positivo: la misma ruta, con token, sí responde con el recuento.
    assert.deepEqual(await resumen(client, token), cuenta(1, 0, 1))

    const sinToken = await client.get('/api/v1/tasks/summary')
    const inventado = await client
      .get('/api/v1/tasks/summary')
      .header('Authorization', 'Bearer oat_1.esto-no-es-un-token')

    sinToken.assertStatus(401)
    inventado.assertStatus(401)
    // Y ningún recuento en el cuerpo.
    assert.notProperty(sinToken.body(), 'data')
    assert.notProperty(inventado.body(), 'data')
  })
})
