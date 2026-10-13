import type { TaskStatus } from '#models/task'
import { BaseTransformer } from '@adonisjs/core/transformers'

/**
 * Cuántas tareas hay en cada estado. No es un modelo: es el resultado de una
 * consulta agrupada, un objeto plano con un entero por estado. `BaseTransformer`
 * es genérico en su recurso y no exige un modelo de Lucid, así que se le da este
 * tipo propio en vez de forzar un modelo que no existe.
 */
export type TaskSummaryCounts = Record<TaskStatus, number>

/**
 * El resumen tal y como viaja: un entero por estado, en camelCase como el resto de
 * la API, y el total ya sumado. Solo números, ninguna tarea.
 *
 * `total` es la suma de los tres estados y no un recuento aparte: una fila con un
 * estado fuera de los tres no cuenta en ninguna parte, y así el total siempre
 * cuadra con lo que se muestra.
 */
export default class TaskSummaryTransformer extends BaseTransformer<TaskSummaryCounts> {
  toObject() {
    const { pending, in_progress: inProgress, done } = this.resource

    return { pending, inProgress, done, total: pending + inProgress + done }
  }
}
