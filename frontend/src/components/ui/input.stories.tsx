import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Input } from './input'

// El campo no lleva etiqueta propia (la pone `Label` al usarlo): el nombre
// accesible va en `aria-label` para que la historia sea completa por sí sola.
const meta = {
  component: Input,
  args: {
    type: 'text',
    placeholder: '¿Qué hay que hacer?',
    'aria-label': 'Título de la tarea',
  },
  decorators: [
    (Story) => (
      <div className="max-w-sm">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Normal: Story = {}

export const Deshabilitado: Story = {
  args: { disabled: true },
}

export const Invalido: Story = {
  args: { 'aria-invalid': true },
}

// A diferencia de las anteriores, esta no solo se ve: se usa. El campo se busca
// por su rol y su nombre accesible, que es lo que ve quien lo usa, y cada paso
// espera a que la interacción termine, sin pausas fijas.
export const EscribirYBorrar: Story = {
  play: async ({ canvas, userEvent }) => {
    const campo = canvas.getByRole('textbox', { name: 'Título de la tarea' })

    await userEvent.type(campo, 'Revisar el informe')
    await expect(campo).toHaveValue('Revisar el informe')

    await userEvent.clear(campo)
    await expect(campo).toHaveValue('')
  },
}
