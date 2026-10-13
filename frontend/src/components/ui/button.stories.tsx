import type { Meta, StoryObj } from '@storybook/react-vite'
import { PlusIcon } from 'lucide-react'

import { Button } from '@/components/ui/button'

/**
 * Una historia por cada combinación de variante y tamaño que declara
 * `buttonVariants`: 6 variantes × 8 tamaños = 48. Los tamaños `icon*` llevan un
 * icono y un nombre accesible en lugar de texto.
 */
const meta = {
  title: 'ui/Button',
  component: Button,
} satisfies Meta<typeof Button>

export default meta

type Story = StoryObj<typeof meta>

export const DefaultDefault: Story = {
  name: 'default · default',
  args: { variant: 'default', size: 'default', children: 'Guardar' },
}

export const DefaultXs: Story = {
  name: 'default · xs',
  args: { variant: 'default', size: 'xs', children: 'Guardar' },
}

export const DefaultSm: Story = {
  name: 'default · sm',
  args: { variant: 'default', size: 'sm', children: 'Guardar' },
}

export const DefaultLg: Story = {
  name: 'default · lg',
  args: { variant: 'default', size: 'lg', children: 'Guardar' },
}

export const DefaultIcon: Story = {
  name: 'default · icon',
  args: {
    variant: 'default',
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const DefaultIconXs: Story = {
  name: 'default · icon-xs',
  args: {
    variant: 'default',
    size: 'icon-xs',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const DefaultIconSm: Story = {
  name: 'default · icon-sm',
  args: {
    variant: 'default',
    size: 'icon-sm',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const DefaultIconLg: Story = {
  name: 'default · icon-lg',
  args: {
    variant: 'default',
    size: 'icon-lg',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const DestructiveDefault: Story = {
  name: 'destructive · default',
  args: { variant: 'destructive', size: 'default', children: 'Guardar' },
}

export const DestructiveXs: Story = {
  name: 'destructive · xs',
  args: { variant: 'destructive', size: 'xs', children: 'Guardar' },
}

export const DestructiveSm: Story = {
  name: 'destructive · sm',
  args: { variant: 'destructive', size: 'sm', children: 'Guardar' },
}

export const DestructiveLg: Story = {
  name: 'destructive · lg',
  args: { variant: 'destructive', size: 'lg', children: 'Guardar' },
}

export const DestructiveIcon: Story = {
  name: 'destructive · icon',
  args: {
    variant: 'destructive',
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const DestructiveIconXs: Story = {
  name: 'destructive · icon-xs',
  args: {
    variant: 'destructive',
    size: 'icon-xs',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const DestructiveIconSm: Story = {
  name: 'destructive · icon-sm',
  args: {
    variant: 'destructive',
    size: 'icon-sm',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const DestructiveIconLg: Story = {
  name: 'destructive · icon-lg',
  args: {
    variant: 'destructive',
    size: 'icon-lg',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const OutlineDefault: Story = {
  name: 'outline · default',
  args: { variant: 'outline', size: 'default', children: 'Guardar' },
}

export const OutlineXs: Story = {
  name: 'outline · xs',
  args: { variant: 'outline', size: 'xs', children: 'Guardar' },
}

export const OutlineSm: Story = {
  name: 'outline · sm',
  args: { variant: 'outline', size: 'sm', children: 'Guardar' },
}

export const OutlineLg: Story = {
  name: 'outline · lg',
  args: { variant: 'outline', size: 'lg', children: 'Guardar' },
}

export const OutlineIcon: Story = {
  name: 'outline · icon',
  args: {
    variant: 'outline',
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const OutlineIconXs: Story = {
  name: 'outline · icon-xs',
  args: {
    variant: 'outline',
    size: 'icon-xs',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const OutlineIconSm: Story = {
  name: 'outline · icon-sm',
  args: {
    variant: 'outline',
    size: 'icon-sm',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const OutlineIconLg: Story = {
  name: 'outline · icon-lg',
  args: {
    variant: 'outline',
    size: 'icon-lg',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const SecondaryDefault: Story = {
  name: 'secondary · default',
  args: { variant: 'secondary', size: 'default', children: 'Guardar' },
}

export const SecondaryXs: Story = {
  name: 'secondary · xs',
  args: { variant: 'secondary', size: 'xs', children: 'Guardar' },
}

export const SecondarySm: Story = {
  name: 'secondary · sm',
  args: { variant: 'secondary', size: 'sm', children: 'Guardar' },
}

export const SecondaryLg: Story = {
  name: 'secondary · lg',
  args: { variant: 'secondary', size: 'lg', children: 'Guardar' },
}

export const SecondaryIcon: Story = {
  name: 'secondary · icon',
  args: {
    variant: 'secondary',
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const SecondaryIconXs: Story = {
  name: 'secondary · icon-xs',
  args: {
    variant: 'secondary',
    size: 'icon-xs',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const SecondaryIconSm: Story = {
  name: 'secondary · icon-sm',
  args: {
    variant: 'secondary',
    size: 'icon-sm',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const SecondaryIconLg: Story = {
  name: 'secondary · icon-lg',
  args: {
    variant: 'secondary',
    size: 'icon-lg',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const GhostDefault: Story = {
  name: 'ghost · default',
  args: { variant: 'ghost', size: 'default', children: 'Guardar' },
}

export const GhostXs: Story = {
  name: 'ghost · xs',
  args: { variant: 'ghost', size: 'xs', children: 'Guardar' },
}

export const GhostSm: Story = {
  name: 'ghost · sm',
  args: { variant: 'ghost', size: 'sm', children: 'Guardar' },
}

export const GhostLg: Story = {
  name: 'ghost · lg',
  args: { variant: 'ghost', size: 'lg', children: 'Guardar' },
}

export const GhostIcon: Story = {
  name: 'ghost · icon',
  args: {
    variant: 'ghost',
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const GhostIconXs: Story = {
  name: 'ghost · icon-xs',
  args: {
    variant: 'ghost',
    size: 'icon-xs',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const GhostIconSm: Story = {
  name: 'ghost · icon-sm',
  args: {
    variant: 'ghost',
    size: 'icon-sm',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const GhostIconLg: Story = {
  name: 'ghost · icon-lg',
  args: {
    variant: 'ghost',
    size: 'icon-lg',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const LinkDefault: Story = {
  name: 'link · default',
  args: { variant: 'link', size: 'default', children: 'Guardar' },
}

export const LinkXs: Story = {
  name: 'link · xs',
  args: { variant: 'link', size: 'xs', children: 'Guardar' },
}

export const LinkSm: Story = {
  name: 'link · sm',
  args: { variant: 'link', size: 'sm', children: 'Guardar' },
}

export const LinkLg: Story = {
  name: 'link · lg',
  args: { variant: 'link', size: 'lg', children: 'Guardar' },
}

export const LinkIcon: Story = {
  name: 'link · icon',
  args: {
    variant: 'link',
    size: 'icon',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const LinkIconXs: Story = {
  name: 'link · icon-xs',
  args: {
    variant: 'link',
    size: 'icon-xs',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const LinkIconSm: Story = {
  name: 'link · icon-sm',
  args: {
    variant: 'link',
    size: 'icon-sm',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}

export const LinkIconLg: Story = {
  name: 'link · icon-lg',
  args: {
    variant: 'link',
    size: 'icon-lg',
    children: <PlusIcon />,
    'aria-label': 'Añadir',
  },
}
