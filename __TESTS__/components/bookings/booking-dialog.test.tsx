import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BookingDialog } from '@/components/bookings/booking-dialog';
import { Button } from '@/components/ui/button';
import { renderWithProviders, createTestStore } from '@/utils/test-utils';

describe('BookingDialog Component', () => {
  let store: any;

  beforeEach(() => {
    store = createTestStore();
  });

  test('renders the default button and opens the dialog', () => {
    renderWithProviders(<BookingDialog />, { store });

    const button = screen.getByRole('button', { name: /reservation/i });
    expect(button).toBeInTheDocument();

    fireEvent.click(button);

    const dialogTitle = screen.getByText(/new reservation/i);
    expect(dialogTitle).toBeInTheDocument();
  });

  test('renders children as the trigger and opens the dialog', () => {
    renderWithProviders(
      <BookingDialog>
        <Button>Open Dialog</Button>
      </BookingDialog>,
      { store },
    );

    const triggerButton = screen.getByRole('button', { name: /open dialog/i });
    expect(triggerButton).toBeInTheDocument();

    fireEvent.click(triggerButton);

    const dialogTitle = screen.getByText(/new reservation/i);
    expect(dialogTitle).toBeInTheDocument();
  });

  test('displays Edit Reservation when bookingId is provided', () => {
    renderWithProviders(<BookingDialog bookingId={1} />, { store });

    const button = screen.getByRole('button', { name: /reservation/i });
    fireEvent.click(button);

    const dialogTitle = screen.getByText(/edit reservation/i);
    expect(dialogTitle).toBeInTheDocument();
  });

  test('closes the dialog when BookingForm calls onClose', () => {
    renderWithProviders(<BookingDialog />, { store });

    const button = screen.getByRole('button', { name: /reservation/i });
    fireEvent.click(button);

    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    expect(screen.queryByText(/new reservation/i)).not.toBeInTheDocument();
  });
});
