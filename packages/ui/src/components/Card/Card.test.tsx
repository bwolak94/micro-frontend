import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { Card, CardContent, CardFooter, CardHeader } from './Card';

describe('Card', () => {
  it('renders children', () => {
    render(<Card>card content</Card>);
    expect(screen.getByText('card content')).toBeInTheDocument();
  });

  it('renders CardHeader with children', () => {
    render(
      <Card>
        <CardHeader>Header text</CardHeader>
      </Card>,
    );
    expect(screen.getByText('Header text')).toBeInTheDocument();
  });

  it('renders CardContent with children', () => {
    render(
      <Card>
        <CardContent>Body text</CardContent>
      </Card>,
    );
    expect(screen.getByText('Body text')).toBeInTheDocument();
  });

  it('renders CardFooter with children', () => {
    render(
      <Card>
        <CardFooter>Footer text</CardFooter>
      </Card>,
    );
    expect(screen.getByText('Footer text')).toBeInTheDocument();
  });

  it('composes all sub-components together', () => {
    render(
      <Card>
        <CardHeader>Title</CardHeader>
        <CardContent>Content</CardContent>
        <CardFooter>Actions</CardFooter>
      </Card>,
    );
    expect(screen.getByText('Title')).toBeInTheDocument();
    expect(screen.getByText('Content')).toBeInTheDocument();
    expect(screen.getByText('Actions')).toBeInTheDocument();
  });

  it('accepts custom className', () => {
    render(<Card className="custom-class">text</Card>);
    expect(screen.getByText('text')).toHaveClass('custom-class');
  });
});
