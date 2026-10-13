// Historias de AssigneeAvatar: el avatar del responsable de una tarea.
// La etiqueta accesible es el contrato: «Sin asignar», «Sin nombre» o el nombre completo.
import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'

import { AssigneeAvatar } from '@/components/assignee-avatar'

const meta = {
  title: 'components/AssigneeAvatar',
  component: AssigneeAvatar,
  args: {
    assignee: { fullName: 'Ada Lovelace', initials: 'AL' },
  },
} satisfies Meta<typeof AssigneeAvatar>

export default meta

type Story = StoryObj<typeof meta>

export const ConNombre: Story = {
  name: 'con nombre',
  args: { assignee: { fullName: 'Ada Lovelace', initials: 'AL' } },
  play: async ({ canvas }) => {
    const avatar = canvas.getByRole('img', { name: 'Ada Lovelace' })

    await expect(avatar).toBeVisible()
    await expect(avatar).toHaveTextContent('AL')
  },
}

export const SinNombre: Story = {
  name: 'responsable sin nombre',
  args: { assignee: { fullName: null, initials: 'MO' } },
  play: async ({ canvas }) => {
    const avatar = canvas.getByRole('img', { name: 'Sin nombre' })

    await expect(avatar).toBeVisible()
    await expect(avatar).toHaveTextContent('MO')
  },
}

export const SinAsignar: Story = {
  name: 'sin responsable',
  args: { assignee: null },
  play: async ({ canvas }) => {
    const avatar = canvas.getByRole('img', { name: 'Sin asignar' })

    await expect(avatar).toBeVisible()
    await expect(avatar.textContent).toBe('')
  },
}
