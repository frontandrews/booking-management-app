import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { NavigationItem } from '@/components/layout/navigation-item';

jest.mock('next/link', () => {
  const Link = ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => <a href={href}>{children}</a>;

  return Link;
});

jest.mock('@/components/ui/button', () => ({
  buttonVariants: jest
    .fn()
    .mockImplementation(({ variant, className }) => `${variant} ${className}`),
}));

describe('NavigationItem Component', () => {
  test('renders external link correctly', () => {
    const { container } = render(
      <NavigationItem name="External Link" href="https://www.example.com" />,
    );

    const externalLink = screen.getByText('External Link');
    expect(externalLink).toBeInTheDocument();
    expect(externalLink).toHaveAttribute('href', 'https://www.example.com');
    expect(externalLink).toHaveAttribute('target', '_blank');
    expect(externalLink).toHaveAttribute('rel', 'noopener noreferrer');
    expect(externalLink).toHaveClass('ghost text-white');

    expect(container).toMatchSnapshot();
  });

  test('renders internal link correctly', () => {
    const { container } = render(
      <NavigationItem name="Internal Link" href="/internal" />,
    );

    const internalLink = screen.getByText('Internal Link');
    expect(internalLink).toBeInTheDocument();
    expect(internalLink).toHaveAttribute('href', '/internal');
    expect(internalLink).not.toHaveAttribute('target');
    expect(internalLink).not.toHaveAttribute('rel');

    expect(container).toMatchSnapshot();
  });
});
