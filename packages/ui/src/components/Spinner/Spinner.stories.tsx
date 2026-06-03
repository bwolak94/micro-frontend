import { Spinner } from './Spinner';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Spinner> = {
  component: Spinner,
  tags: ['autodocs'],
  argTypes: {
    size: { control: 'select', options: ['sm', 'md', 'lg', 'xl'] },
  },
};

export default meta;
type Story = StoryObj<typeof Spinner>;

export const Default: Story = { args: { size: 'md' } };
export const Small: Story = { args: { size: 'sm', label: 'Loading...' } };
export const Large: Story = { args: { size: 'lg', label: 'Loading...' } };
export const ExtraLarge: Story = { args: { size: 'xl', label: 'Processing request...' } };
export const CustomLabel: Story = { args: { label: 'Fetching products...' } };
