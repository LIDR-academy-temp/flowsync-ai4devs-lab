import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertCircleIcon, InfoIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'

const meta = {
  title: 'ui/Alert',
  component: Alert,
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <InfoIcon />
        <AlertTitle>Tarea creada</AlertTitle>
        <AlertDescription>
          Se ha creado como pendiente, así que no aparece en esta vista.
        </AlertDescription>
      </>
    ),
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <AlertCircleIcon />
        <AlertTitle>No hemos podido cargar las tareas</AlertTitle>
        <AlertDescription>
          Comprueba tu conexión e inténtalo de nuevo.
        </AlertDescription>
      </>
    ),
  },
}

export const LongText: Story = {
  name: 'texto largo',
  args: {
    variant: 'default',
    children: (
      <>
        <InfoIcon />
        <AlertTitle>El filtro pedido no existe</AlertTitle>
        <AlertDescription>
          Por eso no ves ninguna tarea: no es que el equipo no tenga trabajo en
          ese estado, es que el estado que se ha pedido no es ninguno de los
          tres que existen. Vuelve a la vista por defecto para ver las tareas
          pendientes y en curso, o elige uno de los estados del filtro para ver
          solo las que están en él.
        </AlertDescription>
      </>
    ),
  },
}
