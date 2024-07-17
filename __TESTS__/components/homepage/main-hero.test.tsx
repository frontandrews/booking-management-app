import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainHero from '@/components/homepage/main-hero';

jest.mock('next/link', () => {
  const Link = ({ children, ...rest }: any) => <a {...rest}>{children}</a>;

  return Link;
});

describe('MainHero Component', () => {
  test('renders the main hero component correctly', () => {
    const { container } = render(<MainHero />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Vacation Rental Software',
    );

    expect(screen.getByText(/Do less & earn more!/i)).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /get started/i });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', '/sign-in');

    expect(container).toMatchSnapshot();
  });

  test('applies correct classes to elements', () => {
    const { container } = render(<MainHero />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveClass(
      'text-4xl font-bold tracking-tight text-white sm:text-6xl',
    );

    expect(screen.getByText(/Do less & earn more!/i)).toHaveClass(
      'mt-6 text-lg leading-8 text-gray-300',
    );

    expect(container).toMatchSnapshot();
  });
});
