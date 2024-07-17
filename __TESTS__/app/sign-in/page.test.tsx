import React from 'react';
import { screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { renderWithProviders } from '@/utils/test-utils';
import SignIn from '@/app/sign-in/page';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

const mockRouterPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockRouterPush,
  }),
}));

describe('SignIn Component', () => {
  beforeEach(() => {
    mockedAxios.post.mockReset();
    mockRouterPush.mockReset();
  });

  test('renders SignIn component correctly', () => {
    renderWithProviders(<SignIn />);

    expect(
      screen.getByRole('heading', { level: 2, name: 'Sign In' }),
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Email address')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(
      screen.getByText(
        "Don't have an account yet? Just log in with your email and password and we'll create a new account for you.",
      ),
    ).toBeInTheDocument();
  });

  test('shows error message for short password', async () => {
    renderWithProviders(<SignIn />);

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.input(passwordInput, { target: { value: 'short' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText((content, element: any) => {
        return (
          element.tagName.toLowerCase() === 'p' &&
          content.includes('Password must be at least 6 characters')
        );
      });
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('displays form error message on incorrect password', async () => {
    mockedAxios.post.mockRejectedValueOnce({
      response: { status: 401, data: { message: 'Incorrect password' } },
    });

    renderWithProviders(<SignIn />);

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.input(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      const errorMessage = screen.queryByText((content, element: any) => {
        return (
          element.tagName.toLowerCase() === 'p' &&
          content.includes('Incorrect password. Please try again.')
        );
      });
      expect(errorMessage).toBeInTheDocument();
    });
  });

  test('redirects to /bookings on successful sign-in', async () => {
    mockedAxios.post.mockResolvedValueOnce({
      status: 200,
      data: {
        accessToken: 'fake-token',
        user: { id: '1', email: 'test@example.com' },
      },
    });

    renderWithProviders(<SignIn />);

    const emailInput = screen.getByLabelText('Email address');
    const passwordInput = screen.getByLabelText('Password');
    const submitButton = screen.getByRole('button', { name: 'Sign In' });

    fireEvent.input(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.input(passwordInput, { target: { value: 'correctpassword' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockRouterPush).toHaveBeenCalledWith('/bookings');
    });
  });
});
