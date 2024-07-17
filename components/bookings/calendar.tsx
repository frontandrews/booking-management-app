import React from 'react';
import {
  format,
  isSameMonth,
  isSameDay,
  isWithinInterval,
  addDays,
} from 'date-fns';
import { cn, generateColorPalette, getColorForGuest } from '@/utils';
import { Booking, Day } from './types';
import { BookingDialog } from './booking-dialog';

interface CalendarProps {
  days: Day[];
  currentMonth: Date;
  bookings: Booking[];
}

interface BookingListItemProps {
  booking: Booking;
  guestColorMap: Record<string, string>;
  colorPalette: string[];
}

interface DayCellProps {
  day: Day;
  currentMonth: Date;
  bookings: Booking[];
  guestColorMap: Record<string, string>;
  colorPalette: string[];
}

interface MobileBookingListProps {
  days: Day[];
  bookings: Booking[];
}

const BookingListItem = ({
  booking,
  guestColorMap,
  colorPalette,
}: BookingListItemProps) => {
  return (
    <li
      key={booking.id}
      style={{
        backgroundColor: getColorForGuest(
          booking.name,
          guestColorMap,
          colorPalette,
        ),
      }}
      className="p-1 rounded-md cursor-pointer"
      data-testid={`booking-${booking.id}`}
    >
      <BookingDialog
        bookingId={booking.id}
        buttonClassName="flex-auto truncate font-medium text-gray-900 group-hover:text-indigo-600"
      >
        {booking.name}
      </BookingDialog>
    </li>
  );
};

const DayCell = ({
  day,
  currentMonth,
  bookings,
  guestColorMap,
  colorPalette,
}: DayCellProps) => {
  const filteredBookings = bookings.filter((booking) =>
    isWithinInterval(day, {
      start: new Date(booking.startDate),
      end: addDays(new Date(booking.endDate), 1),
    }),
  );

  return (
    <div
      key={day.toString()}
      className={cn(
        isSameMonth(day, currentMonth)
          ? 'bg-white'
          : 'bg-gray-50 text-gray-500',
        'relative px-3 py-2 min-h-[80px]',
      )}
    >
      <time
        dateTime={format(day, 'yyyy-MM-dd')}
        className={
          isSameDay(day, new Date())
            ? 'flex h-6 w-6 items-center justify-center rounded-full bg-blue-400 font-semibold text-white'
            : undefined
        }
      >
        {format(day, 'd')}
      </time>
      {bookings.length > 0 && (
        <ol className="mt-2">
          {filteredBookings.map((booking) => (
            <BookingListItem
              key={booking.id}
              booking={booking}
              guestColorMap={guestColorMap}
              colorPalette={colorPalette}
            />
          ))}
          {filteredBookings.length > 2 && (
            <li className="text-gray-500">
              + {filteredBookings.length - 2} more
            </li>
          )}
        </ol>
      )}
    </div>
  );
};

const MobileBookingList = ({ days, bookings }: MobileBookingListProps) => {
  const hasBookings = days.some((day) =>
    bookings.some((booking) =>
      isWithinInterval(day, {
        start: new Date(booking.startDate),
        end: addDays(new Date(booking.endDate), 1),
      }),
    ),
  );

  if (!hasBookings) {
    return (
      <div className="bg-white px-4 py-2 border-b border-gray-200 text-center">
        No bookings found for this month
      </div>
    );
  }

  return (
    <>
      {days
        .filter((day) =>
          bookings.some((booking) =>
            isWithinInterval(day, {
              start: new Date(booking.startDate),
              end: addDays(new Date(booking.endDate), 1),
            }),
          ),
        )
        .map((day) => (
          <div
            key={day.toString()}
            className="bg-white px-4 py-2 border-b border-gray-200"
            data-testid={`day-${format(day, 'yyyy-MM-dd')}`}
          >
            <div className="flex justify-between items-center">
              <time
                dateTime={format(day, 'yyyy-MM-dd')}
                className="text-gray-500"
              >
                {format(day, 'MMMM d, yyyy')}
              </time>
              <span className="text-gray-900">{format(day, 'EEEE')}</span>
            </div>
            <ul className="mt-2">
              {bookings
                .filter((booking) =>
                  isWithinInterval(day, {
                    start: new Date(booking.startDate),
                    end: addDays(new Date(booking.endDate), 1),
                  }),
                )
                .map((booking) => (
                  <BookingListItem
                    key={booking.id}
                    booking={booking}
                    guestColorMap={{}}
                    colorPalette={generateColorPalette(10)}
                  />
                ))}
            </ul>
          </div>
        ))}
    </>
  );
};

export const Calendar = ({ days, currentMonth, bookings }: CalendarProps) => {
  const colorPalette = generateColorPalette(10);
  const guestColorMap: { [key: string]: string } = {};

  return (
    <div>
      <div className="flex bg-gray-100 text-xs leading-6 text-gray-700 lg:flex-auto border">
        <div className="hidden lg:block w-full lg:grid lg:grid-cols-7 lg:grid-rows-6 lg:gap-px">
          {days.map((day) => (
            <DayCell
              key={day.toString()}
              day={day}
              currentMonth={currentMonth}
              bookings={bookings}
              guestColorMap={guestColorMap}
              colorPalette={colorPalette}
            />
          ))}
        </div>
        <div className="block lg:hidden w-full">
          <MobileBookingList days={days} bookings={bookings} />
        </div>
      </div>
    </div>
  );
};
