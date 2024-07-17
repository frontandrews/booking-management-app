import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DesktopNavigation } from '@/components/layout/desktop-navigation';

jest.mock('@/components/layout/navigation-item', () => ({
  NavigationItem: ({ name, href }: { name: string; href: string }) => (
    <a href={href} data-testid={`nav-item-${name}`}>
      {name}
    </a>
  ),
}));

describe('DesktopNavigation Component', () => {
  test('renders the navigation items correctly', () => {
    const { container } = render(<DesktopNavigation />);

    const linkedinItem = screen.getByTestId('nav-item-Linkedin');
    expect(linkedinItem).toBeInTheDocument();
    expect(linkedinItem).toHaveTextContent('Linkedin');
    expect(linkedinItem).toHaveAttribute(
      'href',
      'https://www.linkedin.com/in/andrewsgomes/',
    );

    const githubItem = screen.getByTestId('nav-item-Github');
    expect(githubItem).toBeInTheDocument();
    expect(githubItem).toHaveTextContent('Github');
    expect(githubItem).toHaveAttribute(
      'href',
      'https://github.com/frontandrews',
    );

    expect(container).toMatchSnapshot();
  });

  test('applies correct classes to the navigation container', () => {
    const { container } = render(<DesktopNavigation />);

    const navigationContainer = screen.getByTestId('desktop-navigation');
    expect(navigationContainer).toHaveClass('hidden lg:flex lg:gap-x-12');

    expect(container).toMatchSnapshot();
  });
});
