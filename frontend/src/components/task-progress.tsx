import { Progress } from '@/components/ui/progress'

type TaskProgressProps = {
  done: number
  total: number
}

/**
 * Cuánto del trabajo del equipo está hecho: «3 de 12 hechas · 25 %» y la barra
 * con el mismo porcentaje. Cuenta sobre todo el espacio, no sobre las filas que
 * la lista tiene a la vista —por eso recibe los números ya hechos y no las
 * tareas—.
 *
 * El porcentaje se redondea hacia abajo, en el texto y en la barra a la vez
 * para que no se contradigan: con `Math.round`, 299 de 300 diría «100 %» cuando
 * aún queda una por hacer.
 */
export function TaskProgress({ done, total }: TaskProgressProps) {
  const percent = Math.floor((done * 100) / total)

  return (
    <div className="mb-3 grid gap-2">
      <p className="text-muted-foreground text-sm">
        {done} de {total} {total === 1 ? 'hecha' : 'hechas'} · {percent} %
      </p>
      {/* El azul es un color escrito a pelo, por petición expresa y solo en esta
          barra: se aplica al relleno desde fuera para no tocar `ui/progress.tsx`. */}
      <Progress
        value={percent}
        aria-label="Tareas hechas"
        className="[&>[data-slot=progress-indicator]]:bg-blue-600"
      />
    </div>
  )
}
