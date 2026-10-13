import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { Input } from '@/components/ui/input'

const meta = {
  title: 'ui/Input',
  component: Input,
  args: {
    placeholder: '¿Qué hay que hacer?',
    'aria-label': 'Título de la tarea',
  },
} satisfies Meta<typeof Input>

export default meta

type Story = StoryObj<typeof meta>

export const Normal: Story = {}

export const Disabled: Story = {
  name: 'deshabilitado',
  args: { disabled: true },
}

export const Invalid: Story = {
  name: 'inválido',
  args: { 'aria-invalid': true },
}

export const EscribirYBorrar: Story = {
  name: 'escribir y borrar',
  play: async ({ canvas, userEvent }) => {
    const campo = canvas.getByRole('textbox', { name: 'Título de la tarea' })

    await userEvent.type(campo, 'Revisar el informe')
    await expect(campo).toHaveValue('Revisar el informe')

    await userEvent.clear(campo)
    await expect(campo).toHaveValue('')
  },
}
