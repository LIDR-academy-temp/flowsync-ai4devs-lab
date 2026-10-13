/**
 * Porcentaje de tareas hechas, entero y sin mentir en los extremos: 0 solo si
 * no hay ninguna hecha y 100 solo si están todas. Un redondeo normal diría
 * «100 %» con 299 de 300 y «0 %» con 1 de 300, y en un indicador de avance eso
 * es dar por cerrado lo que no lo está, o por parado lo que ya se mueve.
 */
export function donePercent(done: number, total: number): number {
  if (total <= 0 || done <= 0) return 0
  if (done >= total) return 100

  return Math.min(99, Math.max(1, Math.round((done / total) * 100)))
}
