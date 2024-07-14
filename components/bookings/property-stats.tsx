import { DollarSign, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  differenceInDays,
  endOfDay,
  startOfDay,
  startOfMonth,
  startOfYear,
  subDays,
  subMonths,
  subYears,
  format,
  addDays,
  addMonths,
  min,
  max,
  addYears,
} from 'date-fns';
import { Booking } from './types';

export function PropertyStats() {
  const bookings = useSelector(
    (state: RootState) => state.booking.bookings,
  ) as Booking[];
  const propertyId = useSelector(
    (state: RootState) => state.property.selectedPropertyId,
  ) as number;

  const [thisMonth, setThisMonth] = useState<number>(0);
  const [lastMonth, setLastMonth] = useState<number>(0);
  const [thisYear, setThisYear] = useState<number>(0);
  const [lastYear, setLastYear] = useState<number>(0);
  const [selectedMonth, setSelectedMonth] = useState<Date>(new Date());
  const [selectedMonthRevenue, setSelectedMonthRevenue] = useState<number>(0);
  const [previousMonthRevenue, setPreviousMonthRevenue] = useState<number>(0);
  const [guestsThisMonth, setGuestsThisMonth] = useState<number>(0);

  useEffect(() => {
    if (propertyId && bookings.length > 0) {
      const now = new Date();

      const startOfThisMonth = startOfMonth(now);
      const endOfThisMonth = endOfDay(
        addDays(startOfMonth(addMonths(now, 1)), -1),
      );
      const startOfLastMonth = startOfMonth(subMonths(now, 1));
      const endOfLastMonth = endOfDay(subDays(startOfThisMonth, 1));
      const startOfThisYear = startOfYear(now);
      const endOfThisYear = endOfDay(
        addDays(startOfYear(addYears(now, 1)), -1),
      );
      const startOfLastYear = startOfYear(subYears(now, 1));
      const endOfLastYear = endOfDay(subDays(startOfThisYear, 1));

      const thisMonthRevenue = calculateRevenue(
        startOfThisMonth,
        endOfThisMonth,
        propertyId,
        bookings,
      );
      const lastMonthRevenue = calculateRevenue(
        startOfLastMonth,
        endOfLastMonth,
        propertyId,
        bookings,
      );
      const thisYearRevenue = calculateRevenue(
        startOfThisYear,
        endOfThisYear,
        propertyId,
        bookings,
      );
      const lastYearRevenue = calculateRevenue(
        startOfLastYear,
        endOfLastYear,
        propertyId,
        bookings,
      );
      const selectedMonthStart = startOfMonth(selectedMonth);
      const selectedMonthEnd = endOfDay(
        addDays(startOfMonth(addMonths(selectedMonth, 1)), -1),
      );
      const selectedMonthRevenue = calculateRevenue(
        selectedMonthStart,
        selectedMonthEnd,
        propertyId,
        bookings,
      );

      const previousMonthStart = startOfMonth(subMonths(selectedMonth, 1));
      const previousMonthEnd = endOfDay(
        addDays(startOfMonth(selectedMonth), -1),
      );
      const previousMonthRevenue = calculateRevenue(
        previousMonthStart,
        previousMonthEnd,
        propertyId,
        bookings,
      );

      const guestsThisMonth = calculateGuestsThisMonth(
        startOfThisMonth,
        endOfThisMonth,
        propertyId,
        bookings,
      );

      setThisMonth(thisMonthRevenue);
      setLastMonth(lastMonthRevenue);
      setThisYear(thisYearRevenue);
      setLastYear(lastYearRevenue);
      setSelectedMonthRevenue(selectedMonthRevenue);
      setPreviousMonthRevenue(previousMonthRevenue);
      setGuestsThisMonth(guestsThisMonth);
    }
  }, [propertyId, bookings, selectedMonth]);

  const calculateRevenue = (
    startDate: Date,
    endDate: Date,
    propertyId: number,
    bookings: Booking[],
  ): number => {
    return bookings
      .filter(
        (booking) =>
          booking.propertyId === propertyId &&
          startOfDay(new Date(booking.startDate)) <= endDate &&
          endOfDay(new Date(booking.endDate)) >= startDate,
      )
      .reduce((total, booking) => {
        const bookingStart = max([
          startOfDay(new Date(booking.startDate)),
          startDate,
        ]);
        const bookingEnd = min([endOfDay(new Date(booking.endDate)), endDate]);
        const daysWithinRange = differenceInDays(bookingEnd, bookingStart) + 1;
        return total + daysWithinRange * Number(booking.pricePerDay);
      }, 0);
  };

  const calculateGuestsThisMonth = (
    startDate: Date,
    endDate: Date,
    propertyId: number,
    bookings: Booking[],
  ): number => {
    const guests = new Set(
      bookings.filter(
        (booking) =>
          booking.propertyId === propertyId &&
          startOfDay(new Date(booking.startDate)) <= endDate &&
          endOfDay(new Date(booking.endDate)) >= startDate,
      ),
    );
    return guests.size;
  };

  const handlePreviousMonth = () => {
    setSelectedMonth((prev) => subMonths(prev, 1));
  };

  const handleNextMonth = () => {
    setSelectedMonth((prev) => addMonths(prev, 1));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (current: number, previous: number) => {
    if (current === 0 && previous === 0) {
      return '0%';
    }
    if (previous === 0) {
      return '100%';
    }
    return `${(((current - previous) / previous) * 100).toFixed(2)}%`;
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 pt-6">
      <Card className="rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Guests This Month
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{guestsThisMonth}</div>
        </CardContent>
      </Card>
      <Card className="rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Month</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(thisMonth)}</div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(thisMonth, lastMonth)} from last month
          </p>
        </CardContent>
      </Card>
      <Card className="rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">This Year</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(thisYear)}</div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(thisYear, lastYear)} from last year
          </p>
        </CardContent>
      </Card>
      <Card className="rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex">
            <button onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="min-w-[110px] text-center">
              {format(selectedMonth, 'MMMM yyyy')}
            </div>
            <button onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </button>
          </CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(selectedMonthRevenue)}
          </div>
          <p className="text-xs text-muted-foreground">
            {formatPercentage(selectedMonthRevenue, previousMonthRevenue)} from
            last month
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
