import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { store } from '@/redux/store';
import { ReduxProvider } from '@/redux/provider';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

const SampleComponent = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.user.isAuthenticated,
  );
  return <div>{isAuthenticated ? 'Authenticated' : 'Not Authenticated'}</div>;
};

describe('ReduxProvider Component', () => {
  const renderWithReduxProvider = (ui: React.ReactNode) =>
    render(<ReduxProvider>{ui}</ReduxProvider>);

  test('provides the Redux store to child components', () => {
    renderWithReduxProvider(<SampleComponent />);

    const initialState = store.getState();

    if (initialState.auth.user.isAuthenticated) {
      expect(screen.getByText('Authenticated')).toBeInTheDocument();
    } else {
      expect(screen.getByText('Not Authenticated')).toBeInTheDocument();
    }
  });

  test('renders children correctly', () => {
    renderWithReduxProvider(<div>Test Child</div>);

    expect(screen.getByText('Test Child')).toBeInTheDocument();
  });
});
