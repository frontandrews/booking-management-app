import React from 'react';
import { screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { createTestStore, renderWithProviders } from '@/utils/test-utils';
import { useAppSelector } from '@/redux/hooks';

const SampleComponent: React.FC = () => {
  const isAuthenticated = useAppSelector(
    (state) => state.auth.user.isAuthenticated,
  );
  return <div>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>;
};

describe('StoreProvider Component', () => {
  test('provides the Redux store to child components', () => {
    const { store } = renderWithProviders(<SampleComponent />);

    const initialState = store.getState();
    const authText = initialState.auth.user.isAuthenticated
      ? 'Authenticated'
      : 'Not Authenticated';

    expect(screen.getByText(authText)).toBeInTheDocument();
  });

  test('renders children correctly', () => {
    renderWithProviders(<div>Test Child</div>);

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });

  test('renders with preloaded state', () => {
    const preloadedState = {
      auth: {
        user: {
          isAuthenticated: true,
        },
      },
    };

    renderWithProviders(<SampleComponent />, { preloadedState });

    expect(screen.getByText('Authenticated')).toBeInTheDocument();
  });

  test('renders with custom store', () => {
    const customStore = createTestStore({
      preloadedState: {
        auth: {
          user: {
            isAuthenticated: true,
          },
        },
      },
    });

    renderWithProviders(<SampleComponent />, { store: customStore });

    expect(screen.getByText('Authenticated')).toBeInTheDocument();
  });
});
