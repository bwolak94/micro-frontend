import { Input } from './Input';

import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof Input> = {
  component: Input,
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Input>;

export const Default: Story = {
  args: { id: 'default', label: 'Label', placeholder: 'Enter value...' },
};

export const WithHelperText: Story = {
  args: {
    id: 'helper',
    label: 'Email',
    type: 'email',
    helperText: 'We will never share your email.',
  },
};

export const WithError: Story = {
  args: {
    id: 'error',
    label: 'Email',
    type: 'email',
    error: 'Please enter a valid email address.',
  },
};

export const Disabled: Story = {
  args: { id: 'disabled', label: 'Disabled field', disabled: true, value: 'Cannot edit' },
};
