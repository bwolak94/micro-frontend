import { Badge } from './Badge';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Badge> = {
  component: Badge,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['default', 'success', 'warning', 'error', 'info'] },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

export const Default: Story = { args: { children: 'Default' } };
export const Success: Story = { args: { variant: 'success', children: 'Success' } };
export const Warning: Story = { args: { variant: 'warning', children: 'Warning' } };
export const Error: Story = { args: { variant: 'error', children: 'Error' } };
export const Info: Story = { args: { variant: 'info', children: 'Info' } };

export const AllVariants: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <Badge>Default</Badge>
      <Badge variant="success">Success</Badge>
      <Badge variant="warning">Warning</Badge>
      <Badge variant="error">Error</Badge>
      <Badge variant="info">Info</Badge>
    </div>
  ),
};
