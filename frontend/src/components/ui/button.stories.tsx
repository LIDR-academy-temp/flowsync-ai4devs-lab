import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlusIcon } from 'lucide-react'

import { Button } from './button'

// Una historia por cada combinación de `variant` y `size` que declara
// `buttonVariants`: 6 variantes × 8 tamaños. Los tamaños `icon*` son cuadrados
// y no llevan texto, así que su contenido es un icono con nombre accesible.
const meta = {
  component: Button,
  args: {
    children: 'Crear tarea',
  },
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const DefaultDefault: Story = {
  args: { variant: 'default', size: 'default' },
}

export const DefaultXs: Story = {
  args: { variant: 'default', size: 'xs' },
}

export const DefaultSm: Story = {
  args: { variant: 'default', size: 'sm' },
}

export const DefaultLg: Story = {
  args: { variant: 'default', size: 'lg' },
}

export const DefaultIcon: Story = {
  args: {
    variant: 'default',
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const DefaultIconXs: Story = {
  args: {
    variant: 'default',
    size: 'icon-xs',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const DefaultIconSm: Story = {
  args: {
    variant: 'default',
    size: 'icon-sm',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const DefaultIconLg: Story = {
  args: {
    variant: 'default',
    size: 'icon-lg',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const DestructiveDefault: Story = {
  args: { variant: 'destructive', size: 'default' },
}

export const DestructiveXs: Story = {
  args: { variant: 'destructive', size: 'xs' },
}

export const DestructiveSm: Story = {
  args: { variant: 'destructive', size: 'sm' },
}

export const DestructiveLg: Story = {
  args: { variant: 'destructive', size: 'lg' },
}

export const DestructiveIcon: Story = {
  args: {
    variant: 'destructive',
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const DestructiveIconXs: Story = {
  args: {
    variant: 'destructive',
    size: 'icon-xs',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const DestructiveIconSm: Story = {
  args: {
    variant: 'destructive',
    size: 'icon-sm',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const DestructiveIconLg: Story = {
  args: {
    variant: 'destructive',
    size: 'icon-lg',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const OutlineDefault: Story = {
  args: { variant: 'outline', size: 'default' },
}

export const OutlineXs: Story = {
  args: { variant: 'outline', size: 'xs' },
}

export const OutlineSm: Story = {
  args: { variant: 'outline', size: 'sm' },
}

export const OutlineLg: Story = {
  args: { variant: 'outline', size: 'lg' },
}

export const OutlineIcon: Story = {
  args: {
    variant: 'outline',
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const OutlineIconXs: Story = {
  args: {
    variant: 'outline',
    size: 'icon-xs',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const OutlineIconSm: Story = {
  args: {
    variant: 'outline',
    size: 'icon-sm',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const OutlineIconLg: Story = {
  args: {
    variant: 'outline',
    size: 'icon-lg',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const SecondaryDefault: Story = {
  args: { variant: 'secondary', size: 'default' },
}

export const SecondaryXs: Story = {
  args: { variant: 'secondary', size: 'xs' },
}

export const SecondarySm: Story = {
  args: { variant: 'secondary', size: 'sm' },
}

export const SecondaryLg: Story = {
  args: { variant: 'secondary', size: 'lg' },
}

export const SecondaryIcon: Story = {
  args: {
    variant: 'secondary',
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const SecondaryIconXs: Story = {
  args: {
    variant: 'secondary',
    size: 'icon-xs',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const SecondaryIconSm: Story = {
  args: {
    variant: 'secondary',
    size: 'icon-sm',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const SecondaryIconLg: Story = {
  args: {
    variant: 'secondary',
    size: 'icon-lg',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const GhostDefault: Story = {
  args: { variant: 'ghost', size: 'default' },
}

export const GhostXs: Story = {
  args: { variant: 'ghost', size: 'xs' },
}

export const GhostSm: Story = {
  args: { variant: 'ghost', size: 'sm' },
}

export const GhostLg: Story = {
  args: { variant: 'ghost', size: 'lg' },
}

export const GhostIcon: Story = {
  args: {
    variant: 'ghost',
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const GhostIconXs: Story = {
  args: {
    variant: 'ghost',
    size: 'icon-xs',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const GhostIconSm: Story = {
  args: {
    variant: 'ghost',
    size: 'icon-sm',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const GhostIconLg: Story = {
  args: {
    variant: 'ghost',
    size: 'icon-lg',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const LinkDefault: Story = {
  args: { variant: 'link', size: 'default' },
}

export const LinkXs: Story = {
  args: { variant: 'link', size: 'xs' },
}

export const LinkSm: Story = {
  args: { variant: 'link', size: 'sm' },
}

export const LinkLg: Story = {
  args: { variant: 'link', size: 'lg' },
}

export const LinkIcon: Story = {
  args: {
    variant: 'link',
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const LinkIconXs: Story = {
  args: {
    variant: 'link',
    size: 'icon-xs',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const LinkIconSm: Story = {
  args: {
    variant: 'link',
    size: 'icon-sm',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}

export const LinkIconLg: Story = {
  args: {
    variant: 'link',
    size: 'icon-lg',
    children: <PlusIcon />,
    'aria-label': 'Añadir tarea',
  },
}
