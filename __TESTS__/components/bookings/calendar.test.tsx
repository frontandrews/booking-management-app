import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { format, addDays } from 'date-fns';
import { Calendar } from '@/components/bookings/calendar';
import { Booking, Day } from '@/components/bookings/types';

jest.mock('@/components/bookings/booking-dialog', () => ({
  BookingDialog: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

const mockBookings: Booking[] = [
  {
    id: 1,
    name: 'Andrews Ribeiro',
    startDate: '2023-07-10',
    endDate: '2023-07-12',
    propertyId: 1,
    pricePerDay: '100',
  },
  {
    id: 2,
    name: 'Rebeca Ribeiro',
    startDate: '2023-07-15',
    endDate: '2023-07-18',
    propertyId: 1,
    pricePerDay: '120',
  },
];

const mockDays: Day[] = Array.from({ length: 31 }, (_, i) =>
  addDays(new Date(2023, 6, 1), i),
);

describe('Calendar Component', () => {
  test('renders Calendar component with days and bookings', () => {
    render(
      <Calendar
        days={mockDays}
        currentMonth={new Date(2023, 6, 1)}
        bookings={mockBookings}
      />,
    );

    expect(screen.getAllByText('Andrews Ribeiro')).toHaveLength(6);
    expect(screen.getAllByText('Rebeca Ribeiro')).toHaveLength(8);
  });

  test('displays correct number of days', () => {
    render(
      <Calendar
        days={mockDays}
        currentMonth={new Date(2023, 6, 1)}
        bookings={mockBookings}
      />,
    );

    mockDays.forEach((day) => {
      expect(screen.getByText(format(day, 'd'))).toBeInTheDocument();
    });
  });

  test('renders "No bookings found for this month" message in mobile view when no bookings exist', () => {
    render(
      <Calendar
        days={mockDays}
        currentMonth={new Date(2023, 6, 1)}
        bookings={[]}
      />,
    );

    expect(
      screen.getByText('No bookings found for this month'),
    ).toBeInTheDocument();
  });
});
