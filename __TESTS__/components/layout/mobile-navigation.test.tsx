import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MobileNavigation } from '@/components/layout/mobile-navigation';

jest.mock('@/components/layout/navigation-item', () => ({
  NavigationItem: ({ name, href }: { name: string; href: string }) => (
    <a href={href} data-testid={`nav-item-${name}`}>
      {name}
    </a>
  ),
}));

describe('MobileNavigation Component', () => {
  const handleLogout = jest.fn();
  const setMobileMenuOpen = jest.fn();

  const renderComponent = (mobileMenuOpen: boolean, isAuthenticated: boolean) =>
    render(
      <MobileNavigation
        mobileMenuOpen={mobileMenuOpen}
        setMobileMenuOpen={setMobileMenuOpen}
        isAuthenticated={isAuthenticated}
        handleLogout={handleLogout}
      />,
    );

  test('renders navigation items correctly', () => {
    renderComponent(true, false);

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
  });

  test('renders HostSoft link correctly', () => {
    renderComponent(true, false);

    const hostSoftLink = screen.getByText('HostSoft');
    expect(hostSoftLink).toBeInTheDocument();
    expect(hostSoftLink).toHaveAttribute('href', '/');
  });

  test('renders login link when not authenticated', () => {
    renderComponent(true, false);

    const loginLink = screen.getByText('Log in');
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute('href', '/sign-in');
  });

  test('renders logout button when authenticated', () => {
    renderComponent(true, true);

    const logoutButton = screen.getByText('Logout');
    expect(logoutButton).toBeInTheDocument();
    fireEvent.click(logoutButton);
    expect(handleLogout).toHaveBeenCalledTimes(1);
  });

  test('closes menu when close button is clicked', () => {
    renderComponent(true, false);

    const closeButton = screen.getByRole('button', { name: 'Close menu' });
    expect(closeButton).toBeInTheDocument();
    fireEvent.click(closeButton);
    expect(setMobileMenuOpen).toHaveBeenCalledWith(false);
  });

  test('does not render navigation when menu is closed', () => {
    renderComponent(false, false);

    expect(screen.queryByTestId('nav-item-Linkedin')).not.toBeInTheDocument();
    expect(screen.queryByTestId('nav-item-Github')).not.toBeInTheDocument();
    expect(screen.queryByText('HostSoft')).not.toBeInTheDocument();
  });
});
