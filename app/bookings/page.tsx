'use client';

import { useEffect, useRef, useState } from 'react';
import { PropertyDialog } from '@/components/bookings/property-dialog';
import PropertyList from '@/components/bookings/property-list';
import SectionHeading from '@/components/ui/section-heading';
import BookingView from '@/components/bookings/bookings-view';
import {
  fetchProperties,
  setSelectedPropertyId,
} from '@/redux/features/property/slice';
import EmptyState from '@/components/ui/empty-state';
import { ThreeDots } from 'react-loader-spinner';
import { fetchBookings } from '@/redux/features/booking/slice';
import { PropertyStats } from '@/components/bookings/property-stats';
import { useAppDispatch, useAppSelector } from '@/redux/hooks';

export default function BookingsPage() {
  const dispatch = useAppDispatch();
  const selectedPropertyId = useAppSelector(
    (state) => state.property.selectedPropertyId,
  );
  const bookings = useAppSelector((state) => state.booking.bookings);
  const properties = useAppSelector((state) => state.property.properties);
  const loading = useAppSelector((state) => state.property.loading);

  const [initialLoading, setInitialLoading] = useState(true);
  const hasAutoSelected = useRef(false);

  useEffect(() => {
    if (properties.length === 0) {
      dispatch(fetchProperties()).then(() => setInitialLoading(false));
    } else {
      setInitialLoading(false);
    }
  }, [properties.length, dispatch]);

  // Auto select first property
  useEffect(() => {
    if (!hasAutoSelected.current && properties.length > 0) {
      const id = properties[0].id;
      if (id) {
        if (id !== selectedPropertyId) {
          dispatch(setSelectedPropertyId(id));
        }
        dispatch(fetchBookings(id));
      }
      hasAutoSelected.current = true;
    }
  }, [properties, selectedPropertyId, dispatch]);

  return (
    <div className="container mx-auto">
      <SectionHeading title="Dashboard" />

      {initialLoading || loading ? (
        <div className="flex justify-center py-10">
          <ThreeDots
            visible={true}
            height="80"
            width="80"
            color="black"
            radius="9"
            ariaLabel="three-dots-loading"
          />
        </div>
      ) : properties.length === 0 ? (
        <EmptyState
          title="No properties found"
          description="Create a new property to get started."
        >
          <PropertyDialog />
        </EmptyState>
      ) : (
        <>
          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12 lg:col-span-4">
              <PropertyList />
            </div>
            <div className="col-span-12 lg:col-span-8">
              <BookingView bookings={bookings} />
            </div>
          </div>
          <PropertyStats />
        </>
      )}
    </div>
  );
}
