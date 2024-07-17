import React from 'react';
import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import { BookingHeader } from '@/components/bookings/booking-header';
import { format } from 'date-fns';

describe('BookingHeader Component', () => {
  const mockOnPreviousMonth = jest.fn();
  const mockOnNextMonth = jest.fn();
  const mockOnToday = jest.fn();
  const currentMonth = new Date(2024, 6, 15); // July 2024

  beforeEach(() => {
    render(
      <BookingHeader
        currentMonth={currentMonth}
        onPreviousMonth={mockOnPreviousMonth}
        onNextMonth={mockOnNextMonth}
        onToday={mockOnToday}
      />,
    );
  });

  it('renders the current month', () => {
    const formattedMonth = format(currentMonth, 'MMMM yyyy');
    expect(screen.getByText(formattedMonth)).toBeInTheDocument();

    const { container } = render(
      <BookingHeader
        currentMonth={currentMonth}
        onPreviousMonth={mockOnPreviousMonth}
        onNextMonth={mockOnNextMonth}
        onToday={mockOnToday}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('calls onPreviousMonth when the Previous month button is clicked', () => {
    const previousButton = screen.getByRole('button', {
      name: /Previous month/i,
    });
    fireEvent.click(previousButton);
    expect(mockOnPreviousMonth).toHaveBeenCalledTimes(1);

    const { container } = render(
      <BookingHeader
        currentMonth={currentMonth}
        onPreviousMonth={mockOnPreviousMonth}
        onNextMonth={mockOnNextMonth}
        onToday={mockOnToday}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('calls onNextMonth when the Next month button is clicked', () => {
    const nextButton = screen.getByRole('button', { name: /Next month/i });
    fireEvent.click(nextButton);
    expect(mockOnNextMonth).toHaveBeenCalledTimes(1);

    const { container } = render(
      <BookingHeader
        currentMonth={currentMonth}
        onPreviousMonth={mockOnPreviousMonth}
        onNextMonth={mockOnNextMonth}
        onToday={mockOnToday}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('calls onToday when the Today button is clicked', () => {
    const todayButton = screen.getByRole('button', { name: /Today/i });
    fireEvent.click(todayButton);
    expect(mockOnToday).toHaveBeenCalledTimes(1);

    const { container } = render(
      <BookingHeader
        currentMonth={currentMonth}
        onPreviousMonth={mockOnPreviousMonth}
        onNextMonth={mockOnNextMonth}
        onToday={mockOnToday}
      />,
    );
    expect(container).toMatchSnapshot();
  });

  it('renders the BookingDialog component', () => {
    expect(screen.getByTestId('booking-dialog')).toBeInTheDocument();

    const { container } = render(
      <BookingHeader
        currentMonth={currentMonth}
        onPreviousMonth={mockOnPreviousMonth}
        onNextMonth={mockOnNextMonth}
        onToday={mockOnToday}
      />,
    );
    expect(container).toMatchSnapshot();
  });
});
