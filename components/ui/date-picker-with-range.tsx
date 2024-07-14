'use client';

import * as React from 'react';
import { CalendarIcon } from '@radix-ui/react-icons';
import {
  format,
  isBefore,
  startOfToday,
  startOfDay,
  isWithinInterval,
  parseISO,
  eachDayOfInterval,
} from 'date-fns';
import { DateRange } from 'react-day-picker';
import { cn } from '@/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { useController, useFormContext } from 'react-hook-form';
import { useSelector } from 'react-redux';
import { useToast } from '@/components/ui/use-toast';
import { RootState } from '@/redux/store';

interface DatePickerWithRangeProps {
  name: string;
  className?: string;
  currentBookingId?: number;
}

export function DatePickerWithRange({
  name,
  className,
  currentBookingId,
}: DatePickerWithRangeProps) {
  const { control } = useFormContext();
  const {
    field: { value, onChange },
  } = useController({
    name,
    control,
  });

  const { toast } = useToast();
  const [date, setDate] = React.useState<DateRange | undefined>(undefined);
  const [isPopoverOpen, setIsPopoverOpen] = React.useState(false);

  React.useEffect(() => {
    if (value) {
      setDate(value);
    }
  }, [value]);

  const today = startOfToday();
  const bookings = useSelector((state: RootState) => state.booking.bookings);

  const isDayDisabled = (day: Date) => {
    const normalizedDay = startOfDay(day);

    if (isBefore(normalizedDay, today)) {
      return true;
    }

    for (const booking of bookings) {
      if (currentBookingId && booking.id === currentBookingId) {
        continue;
      }
      const startDate = startOfDay(parseISO(booking.startDate));
      const endDate = startOfDay(parseISO(booking.endDate));

      if (isWithinInterval(normalizedDay, { start: startDate, end: endDate })) {
        return true;
      }
    }

    return false;
  };

  const handleDateChange = (newDate: DateRange | undefined) => {
    if (newDate?.from && newDate?.to) {
      const range = eachDayOfInterval({
        start: startOfDay(newDate.from),
        end: startOfDay(newDate.to),
      });

      const conflictingDays = range.filter((day) => isDayDisabled(day));

      if (conflictingDays.length > 0) {
        const formattedConflictingDays = conflictingDays
          .map((day) => format(day, 'LLL dd, y'))
          .join(', ');

        toast({
          title: 'Date range has conflict with existing bookings.',
          description: `The following dates are unavailable: ${formattedConflictingDays}. Please choose different dates.`,
        });
        return;
      }

      setDate(newDate);
      onChange(newDate);
      setIsPopoverOpen(false);
    } else {
      setDate(newDate);
      onChange(newDate);
    }
  };

  const handleClearSelection = () => {
    setDate(undefined);
    onChange(undefined);
  };

  const handleClosePopover = () => {
    setIsPopoverOpen(false);
  };

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'w-[300px] justify-start text-left font-normal w-full',
              !date && 'text-muted-foreground',
            )}
            onClick={() => setIsPopoverOpen(!isPopoverOpen)}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
            disabled={isDayDisabled}
          />
          <div className="flex space-x-6 px-4 pb-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClearSelection}
            >
              Clear Selection
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={handleClosePopover}
            >
              Close
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
