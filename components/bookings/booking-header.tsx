import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns';
import { BookingDialog } from './booking-dialog';

interface BookingHeaderProps {
  currentMonth: Date;
  onPreviousMonth: () => void;
  onNextMonth: () => void;
  onToday: () => void;
}

export const BookingHeader = ({
  currentMonth,
  onPreviousMonth,
  onNextMonth,
  onToday,
}: BookingHeaderProps) => {
  return (
    <header className="flex flex-col items-center justify-between border-b border-gray-200 py-4 lg:flex-row lg:flex-none">
      <h1 className="text-2xl font-semibold leading-6 text-gray-900 mb-4 lg:mb-0">
        <time dateTime={format(currentMonth, 'yyyy-MM')}>
          {format(currentMonth, 'MMMM yyyy')}
        </time>
      </h1>
      <div className="flex flex-col items-center lg:flex-row lg:space-x-4">
        <div className="relative flex items-center rounded-md bg-white shadow-sm mb-4 lg:mb-0 md:items-stretch">
          <button
            type="button"
            className="flex h-9 w-12 items-center justify-center rounded-l-md border-y border-l border-gray-300 pr-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pr-0 md:hover:bg-gray-50"
            onClick={onPreviousMonth}
          >
            <span className="sr-only">Previous month</span>
            <ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
          </button>
          <button
            type="button"
            className="border-x flex h-9 items-center justify-center border-y border-gray-300 px-3.5 text-sm font-semibold text-gray-900 hover:bg-gray-50 focus:relative md:block"
            onClick={onToday}
          >
            Today
          </button>
          <span className="relative -mx-px h-9 w-px bg-gray-300 md:hidden" />
          <button
            type="button"
            className="flex h-9 w-12 items-center justify-center rounded-r-md border-y border-r border-gray-300 pl-1 text-gray-400 hover:text-gray-500 focus:relative md:w-9 md:pl-0 md:hover:bg-gray-50"
            onClick={onNextMonth}
          >
            <span className="sr-only">Next month</span>
            <ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        <BookingDialog />
      </div>
    </header>
  );
};
