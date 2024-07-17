import React, { useState, useEffect } from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
} from 'date-fns';
import { BookingHeader } from './booking-header';
import { Calendar } from './calendar';
import { Day, BookingViewProps } from './types';

const BookingView = ({ bookings = [] }: BookingViewProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [days, setDays] = useState<Day[]>([]);

  useEffect(() => {
    const generateDays = (date: Date): Day[] => {
      const startDate = startOfWeek(startOfMonth(date));
      const endDate = endOfWeek(endOfMonth(date));
      const days: Day[] = [];
      let day = startDate;

      while (day <= endDate) {
        days.push(day);
        day = addDays(day, 1);
      }
      return days;
    };
    setDays(generateDays(currentMonth));
  }, [currentMonth]);

  const handlePreviousMonth = () => {
    setCurrentMonth(subMonths(currentMonth, 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(addMonths(currentMonth, 1));
  };

  const handleToday = () => {
    setCurrentMonth(new Date());
  };

  return (
    <div className="lg:flex lg:h-full lg:flex-col px-4 pb-4 border">
      <BookingHeader
        currentMonth={currentMonth}
        onPreviousMonth={handlePreviousMonth}
        onNextMonth={handleNextMonth}
        onToday={handleToday}
      />
      <Calendar days={days} currentMonth={currentMonth} bookings={bookings} />
    </div>
  );
};

export default BookingView;
