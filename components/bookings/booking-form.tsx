'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, FormProvider } from 'react-hook-form';
import { z } from 'zod';
import { useToast } from '@/components/ui/use-toast';
import {
  createBooking,
  updateBooking,
  deleteBooking,
  fetchBookings,
  fetchBookingById,
} from '@/redux/features/booking/slice';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { getErrorMessage } from '@/utils';
import { parseISO, startOfDay, format } from 'date-fns';
import { DatePickerWithRange } from '@/components/ui/date-picker-with-range';
import { ThreeDots } from 'react-loader-spinner';
import { TrashIcon } from 'lucide-react';
import FormField from '@/components/ui/form-field';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  propertyId: z.number().min(1, 'Property ID is required'),
  dateRange: z
    .object({
      from: z.date().nullable(),
      to: z.date().nullable(),
    })
    .refine(
      (data) => data.from && data.to,
      'Both start and end dates are required',
    ),
  pricePerDay: z.string().min(1, 'Price per day is required'),
});

interface BookingFormProps {
  bookingId?: number;
  onClose: () => void;
}

export default function BookingForm({ bookingId, onClose }: BookingFormProps) {
  const { toast } = useToast();
  const [formError, setFormError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [totalPrice, setTotalPrice] = useState<number>(0);
  const dispatch = useAppDispatch();
  const bookings = useAppSelector((state) => state.booking.bookings);
  const loading = useAppSelector((state) => state.booking.loading);
  const propertyId = useAppSelector(
    (state) => state.property.selectedPropertyId,
  );

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      propertyId,
      pricePerDay: '',
      name: '',
      dateRange: { from: null, to: null },
    },
  });
  const {
    reset,
    watch,
    handleSubmit,
    formState: { errors },
  } = methods;

  useEffect(() => {
    if (bookingId) {
      dispatch(fetchBookingById(bookingId)).then((response) => {
        const bookingData = response.payload;
        if (bookingData) {
          const formattedData = {
            ...bookingData,
            dateRange: {
              from: parseISO(bookingData.startDate),
              to: parseISO(bookingData.endDate),
            },
          };
          reset(formattedData);
        } else {
          setFormError('Failed to fetch booking data');
        }
      });
    }
  }, [bookingId, dispatch, reset]);

  const calculateTotalPrice = (
    startDate: Date,
    endDate: Date,
    pricePerDay: string,
  ) => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
    return diffDays * Number(pricePerDay);
  };

  useEffect(() => {
    const subscription = watch(({ dateRange, pricePerDay }) => {
      if (dateRange && dateRange.from && dateRange.to && pricePerDay) {
        setTotalPrice(
          calculateTotalPrice(dateRange.from, dateRange.to, pricePerDay),
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [watch]);

  const isDateOverlap = (newStartDate: Date, newEndDate: Date) => {
    return bookings.some((booking) => {
      if (booking.propertyId !== propertyId) return false;
      if (bookingId && booking.id === bookingId) return false;

      const existingStartDate = format(
        startOfDay(parseISO(booking.startDate)),
        'yyyy-MM-dd',
      );
      const existingEndDate = format(
        startOfDay(parseISO(booking.endDate)),
        'yyyy-MM-dd',
      );
      const newStart = format(startOfDay(newStartDate), 'yyyy-MM-dd');
      const newEnd = format(startOfDay(newEndDate), 'yyyy-MM-dd');

      return (
        (newStart >= existingStartDate && newStart <= existingEndDate) ||
        (newEnd >= existingStartDate && newEnd <= existingEndDate) ||
        (existingStartDate >= newStart && existingStartDate <= newEnd)
      );
    });
  };

  const onSubmit = async (data: any) => {
    setIsLoading(true);
    const { dateRange, ...rest } = data;
    const newStartDate = startOfDay(dateRange.from);
    const newEndDate = startOfDay(dateRange.to);

    if (isDateOverlap(newStartDate, newEndDate)) {
      setFormError('The selected dates overlap with an existing booking.');
      setIsLoading(false);
      return;
    }

    const formattedStartDate = format(newStartDate, 'yyyy-MM-dd');
    const formattedEndDate = format(newEndDate, 'yyyy-MM-dd');

    const formattedData = {
      ...rest,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
    };

    try {
      if (bookingId) {
        await dispatch(
          updateBooking({ bookingId, data: formattedData }),
        ).unwrap();
        toast({
          title: 'Booking updated successfully',
        });
      } else {
        await dispatch(createBooking(formattedData)).unwrap();
        toast({
          title: 'Booking created successfully',
        });
      }
      dispatch(fetchBookings(propertyId!));
      onClose();
    } catch (error: any) {
      setFormError(error.message || 'An error occurred');
      console.error('Error saving booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onDelete = async () => {
    setIsLoading(true);
    try {
      await dispatch(deleteBooking(bookingId!)).unwrap();
      toast({
        title: 'Booking deleted successfully',
      });
      dispatch(fetchBookings(propertyId!));
      onClose();
    } catch (error: any) {
      setFormError(error.message || 'An error occurred');
      console.error('Error deleting booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="h-[376px] content-center pb-12">
        <div className="flex justify-center">
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="black"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center">
      <div className="sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="px-6">
          <FormProvider {...methods}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                id="name"
                label="Guest Name"
                type="text"
                register={methods.register}
                errors={errors}
              />
              <div>
                <label
                  htmlFor="dateRange"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Date Range
                </label>
                <div className="mt-2">
                  <DatePickerWithRange
                    name="dateRange"
                    currentBookingId={bookingId}
                  />
                  {errors.dateRange && (
                    <p className="text-red-500 text-sm mt-1">
                      {getErrorMessage(errors.dateRange)}
                    </p>
                  )}
                </div>
              </div>
              <FormField
                id="pricePerDay"
                label="Price per Day"
                type="number"
                register={methods.register}
                errors={errors}
              />
              <div>
                <div className="block text-sm font-medium leading-6 text-gray-900">
                  Total Price: {totalPrice.toFixed(2)}
                </div>
              </div>
              <div>
                {formError.length > 0 && (
                  <p className="text-red-500 text-sm mt-1">{formError}</p>
                )}
              </div>
              <div className="flex justify-between">
                {bookingId && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="mr-3"
                    disabled={isLoading}
                    onClick={onDelete}
                  >
                    <TrashIcon className="h-5 w-5 text-white" />
                  </Button>
                )}
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {bookingId ? 'Save Changes' : 'Create Booking'}
                </Button>
              </div>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
