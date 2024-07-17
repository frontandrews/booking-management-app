import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import NotFound from '@/app/not-found';

jest.mock('next/link', () => {
  return ({ children }: { children: React.ReactNode }) => {
    return children;
  };
});

describe('NotFound Component', () => {
  test('renders NotFound component correctly', () => {
    render(<NotFound />);

    expect(screen.getByText('404')).toBeInTheDocument();
    expect(screen.getByText('Page not found')).toBeInTheDocument();
    expect(
      screen.getByText('Sorry, we couldn’t find the page you’re looking for.'),
    ).toBeInTheDocument();
    expect(screen.getByText('Go back')).toBeInTheDocument();
  });

  test('matches snapshot', () => {
    const { asFragment } = render(<NotFound />);
    expect(asFragment()).toMatchSnapshot();
  });
});
