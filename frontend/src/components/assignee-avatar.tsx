import type { ComponentProps } from 'react'
import { UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type AssigneeAvatarProps = Omit<
  ComponentProps<typeof Avatar>,
  'children' | 'role' | 'aria-label'
> & {
  assignee: { fullName: string | null; initials: string } | null
}

/**
 * El avatar del responsable de una tarea: sus iniciales en un círculo, con su
 * nombre completo como etiqueta accesible, o «Sin asignar» si no hay nadie.
 *
 * Pieza propia y no el `Avatar` del catálogo tal cual porque lleva una regla
 * de negocio (de dónde sale el nombre accesible y qué se dibuja sin
 * responsable) que no cabe en el `Avatar` genérico sin editar `ui/` a mano.
 * Se compone con él: el círculo, el tamaño y el recorte son los suyos.
 */
export function AssigneeAvatar({
  assignee,
  className,
  ...props
}: AssigneeAvatarProps) {
  const label = assignee ? (assignee.fullName ?? 'Sin nombre') : 'Sin asignar'

  return (
    <Avatar {...props} className={className} role="img" aria-label={label}>
      <AvatarFallback className="text-xs font-medium">
        {assignee ? (
          assignee.initials
        ) : (
          <UserIcon className="size-4" aria-hidden="true" />
        )}
      </AvatarFallback>
    </Avatar>
  )
}
