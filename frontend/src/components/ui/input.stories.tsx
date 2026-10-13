import type { Meta, StoryObj } from '@storybook/react-vite'

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
