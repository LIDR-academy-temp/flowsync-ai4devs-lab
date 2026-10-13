import { UserIcon } from 'lucide-react'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

type AssigneeAvatarProps = {
  assignee: { fullName: string | null; initials: string } | null
  className?: string
}

/**
 * El círculo con las iniciales del responsable de una tarea. La etiqueta
 * accesible es el contrato: «Sin asignar», «Sin nombre» o el nombre completo.
 * Sin responsable no hay texto, solo un glifo decorativo.
 */
export function AssigneeAvatar({ assignee, className }: AssigneeAvatarProps) {
  const label =
    assignee === null ? 'Sin asignar' : (assignee.fullName ?? 'Sin nombre')

  return (
    <Avatar role="img" aria-label={label} className={className}>
      <AvatarFallback className="text-xs font-medium">
        {assignee === null ? (
          <UserIcon className="size-4" aria-hidden="true" />
        ) : (
          assignee.initials
        )}
      </AvatarFallback>
    </Avatar>
  )
}
