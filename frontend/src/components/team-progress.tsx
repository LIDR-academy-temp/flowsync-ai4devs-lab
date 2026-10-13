import { Progress } from '@/components/ui/progress'
import { donePercent } from '@/lib/progress'

type TeamProgressProps = {
  /** `null` mientras no hay una cifra fiable: cargando o sin poder calcularla. */
  progress: { done: number; total: number } | null
}

/**
 * Cuánto del trabajo del equipo está hecho, sea cual sea el filtro de la
 * lista: el recuento, el porcentaje y una barra. Sin tareas en el espacio no
 * hay nada que medir y no se pinta nada, que además deja el sitio libre al
 * mensaje de «Aquí todavía no hay nada».
 */
export function TeamProgress({ progress }: TeamProgressProps) {
  if (!progress || progress.total === 0) return null

  const { done, total } = progress
  const percent = donePercent(done, total)

  return (
    <div className="mb-4 grid gap-2" role="status">
      <div className="flex items-baseline justify-between gap-4 text-sm">
        <p className="text-muted-foreground">
          <span className="text-foreground font-medium tabular-nums">
            {done} de {total}
          </span>{' '}
          {total === 1 ? 'tarea hecha' : 'tareas hechas'}
        </p>
        <p className="font-medium tabular-nums">{percent} %</p>
      </div>
      <Progress value={percent} aria-label="Avance del equipo" />
    </div>
  )
}
