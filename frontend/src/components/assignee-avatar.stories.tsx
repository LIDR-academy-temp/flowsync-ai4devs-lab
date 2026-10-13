// Estados del avatar del responsable: con nombre, sin nombre y sin responsable.
// La pieza no se pulsa ni se escribe en ella: las tres historias solo afirman
// lo que se ve y, sobre todo, el nombre accesible, que no se ve en el lienzo.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { AssigneeAvatar } from './assignee-avatar'

const meta = {
  component: AssigneeAvatar,
} satisfies Meta<typeof AssigneeAvatar>

export default meta

type Story = StoryObj<typeof meta>

export const ConNombre: Story = {
  args: {
    assignee: { fullName: 'Lucía Fernández', initials: 'LF' },
  },
  play: async ({ canvas }) => {
    const avatar = canvas.getByRole('img', { name: 'Lucía Fernández' })

    await expect(avatar).toBeVisible()
    await expect(avatar).toHaveTextContent('LF')
  },
}

export const SinNombre: Story = {
  args: {
    assignee: { fullName: null, initials: 'P5' },
  },
  play: async ({ canvas }) => {
    const avatar = canvas.getByRole('img', { name: 'Sin nombre' })

    await expect(avatar).toBeVisible()
    await expect(avatar).toHaveTextContent('P5')
  },
}

export const SinAsignar: Story = {
  args: {
    assignee: null,
  },
  play: async ({ canvas }) => {
    const avatar = canvas.getByRole('img', { name: 'Sin asignar' })

    await expect(avatar).toBeVisible()
    // El icono de persona es decorativo y no aporta texto: ni iniciales ni nada.
    // Se compara el texto exacto porque `toHaveTextContent('')` casa con todo.
    await expect(avatar.textContent).toBe('')
  },
}
