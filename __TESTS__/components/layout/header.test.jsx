import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { useRouter, usePathname } from 'next/navigation';
import Header from '@/components/layout/header';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  usePathname: jest.fn(),
}));

jest.mock('@/redux/features/auth/slice', () => ({
  logOut: jest.fn(),
}));

jest.mock('@/components/layout/desktop-navigation', () => ({
  DesktopNavigation: () => (
    <div data-testid="desktop-navigation">DesktopNavigation</div>
  ),
}));

jest.mock('@/components/layout/mobile-navigation', () => ({
  MobileNavigation: ({ mobileMenuOpen, setMobileMenuOpen }) => (
    <div
      data-testid="mobile-navigation"
      onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
    >
      MobileNavigation {mobileMenuOpen ? 'Open' : 'Closed'}
    </div>
  ),
}));

const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      auth: () => initialState.auth,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

describe('Header Component', () => {
  let store;
  const mockPush = jest.fn();
  const mockPathname = '/';

  const initialState = {
    auth: {
      user: {
        isAuthenticated: false,
      },
    },
  };

  beforeEach(() => {
    store = createMockStore(initialState);
    useRouter.mockReturnValue({ push: mockPush });
    usePathname.mockReturnValue(mockPathname);
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <Header />
      </Provider>,
    );

  test('renders Header correctly', () => {
    renderComponent();

    expect(screen.getByText('HostSoft')).toBeInTheDocument();
    expect(screen.getByTestId('desktop-navigation')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /open main menu/i }),
    ).toBeInTheDocument();
  });

  test('renders login link when not authenticated', () => {
    renderComponent();

    expect(screen.getByText('Log in')).toBeInTheDocument();
  });

  test('renders logout link when authenticated', () => {
    store = createMockStore({
      auth: {
        user: {
          isAuthenticated: true,
        },
      },
    });

    renderComponent();

    expect(screen.getByText('Logout')).toBeInTheDocument();
  });

  test.todo('handles logout click');

  test('handles mobile menu toggle', () => {
    renderComponent();

    const openMenuButton = screen.getByRole('button', {
      name: /open main menu/i,
    });
    fireEvent.click(openMenuButton);

    expect(screen.getByTestId('mobile-navigation')).toHaveTextContent(
      'MobileNavigation Open',
    );

    const mobileNavigation = screen.getByTestId('mobile-navigation');
    fireEvent.click(mobileNavigation);

    expect(screen.getByTestId('mobile-navigation')).toHaveTextContent(
      'MobileNavigation Closed',
    );
  });
});
