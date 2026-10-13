import Task, { TASK_STATUSES } from '#models/task'
import type { HttpContext } from '@adonisjs/core/http'
import TaskSummaryTransformer, {
  type TaskSummaryCounts,
} from '#transformers/task_summary_transformer'
import { ApiBearerAuth, ApiOperation, ApiResponse } from '@foadonis/openapi/decorators'
import { ErrorResponse, TaskSummaryResponse } from '#openapi/schemas'

@ApiBearerAuth()
export default class TaskSummaryController {
  /**
   * Cuántas tareas hay en cada estado y cuántas en total, para cualquier miembro del
   * espacio: el mismo número para todos, igual que la lista. Solo números; ninguna
   * tarea, así que no es una vía para sacar las hechas mezcladas con el resto.
   *
   * No admite parámetros. En particular `status`, el de la lista, se ignora: no hay
   * validador y no hay 422, el resumen cuenta siempre todo el espacio.
   *
   * Una sola consulta agrupada por estado. La papelera se excluye a mano con
   * `whereNull('tasks.deleted_at')` y no se fía del hook `hideTrashed` del modelo: es
   * una consulta agregada, que devuelve filas planas (`pojo()`) y no instancias, y el
   * hook solo se ejecuta cuando se leen modelos.
   *
   * Los estados sin filas salen a 0, y una fila con un estado fuera de los tres (la
   * columna es un `varchar` sin restricción) no cuenta en nada.
   */
  @ApiOperation({
    summary: 'Resumen de tareas por estado',
    description:
      'Devuelve cuántas tareas hay pendientes, en curso y hechas, y el total (la suma de las tres), contando todo el espacio salvo la papelera. Es la misma para cualquier cuenta con sesión, de solo lectura y no devuelve tareas, solo números. No admite parámetros: un `status` en la dirección se ignora, a diferencia de la lista.',
  })
  @ApiResponse({
    status: 200,
    description:
      'El recuento. En un espacio sin tareas los cuatro valores son `0`, no un error ni una respuesta vacía.',
    type: () => TaskSummaryResponse,
  })
  @ApiResponse({
    status: 401,
    description: 'Falta el token o no es válido. No se devuelve ningún recuento.',
    type: () => ErrorResponse,
  })
  async show({ serialize }: HttpContext) {
    const rows = await Task.query()
      .whereNull('tasks.deleted_at')
      .select('status')
      .count('* as total')
      .groupBy('status')
      .pojo<{ status: string; total: string | number }>()

    // Todos los estados arrancan a 0; `count` llega como texto desde PostgreSQL (es un
    // `bigint`), por eso el `Number`.
    const counts = Object.fromEntries(
      TASK_STATUSES.map((status) => [status, 0])
    ) as TaskSummaryCounts

    for (const row of rows) {
      if ((TASK_STATUSES as readonly string[]).includes(row.status)) {
        counts[row.status as keyof TaskSummaryCounts] = Number(row.total)
      }
    }

    return serialize(TaskSummaryTransformer.transform(counts))
  }
}
