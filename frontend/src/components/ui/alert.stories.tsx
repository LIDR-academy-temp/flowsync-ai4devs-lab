import type { Meta, StoryObj } from '@storybook/react-vite'
import { AlertCircleIcon, InfoIcon } from 'lucide-react'

import { Alert, AlertDescription, AlertTitle } from './alert'

// Un ancho de columna de formulario, no el del lienzo: con el lienzo entero
// ningún texto razonable se parte en dos líneas y el caso largo no se vería.
const meta = {
  component: Alert,
  decorators: [
    (Story) => (
      <div className="max-w-md">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Alert>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    variant: 'default',
    children: (
      <>
        <InfoIcon />
        <AlertTitle>Cambio guardado</AlertTitle>
        <AlertDescription>
          «Preparar la demo» ha pasado a «Hecho» y ya no aparece en esta vista.
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
        <AlertTitle>No se ha podido cambiar el estado</AlertTitle>
        <AlertDescription>Inténtalo de nuevo.</AlertDescription>
      </>
    ),
  },
}

export const TextoLargo: Story = {
  args: {
    variant: 'destructive',
    children: (
      <>
        <AlertCircleIcon />
        <AlertTitle>No hemos podido cargar las tareas del equipo</AlertTitle>
        <AlertDescription>
          La conexión con el servidor se ha cortado a mitad de la respuesta, así
          que la lista puede estar incompleta. No se ha perdido ninguna tarea:
          vuelve a cargar la pantalla en unos segundos y, si el problema sigue,
          avisa a quien administre el espacio del equipo.
        </AlertDescription>
      </>
    ),
  },
}
