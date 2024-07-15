import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { PropertyStats } from '@/components/bookings/property-stats';

const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      booking: () => initialState.booking,
      property: () => initialState.property,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

describe('PropertyStats Component', () => {
  let store;

  const initialBookingState = {
    bookings: [
      {
        id: 1,
        propertyId: 1,
        startDate: '2023-06-01',
        endDate: '2023-06-10',
        pricePerDay: '100',
      },
      {
        id: 2,
        propertyId: 1,
        startDate: '2023-06-15',
        endDate: '2023-06-20',
        pricePerDay: '150',
      },
      {
        id: 3,
        propertyId: 1,
        startDate: '2023-07-01',
        endDate: '2023-07-05',
        pricePerDay: '200',
      },
    ],
  };

  const initialPropertyState = {
    properties: [
      { id: 1, name: 'Property One', location: 'Location One' },
      { id: 2, name: 'Property Two', location: 'Location Two' },
    ],
    selectedPropertyId: 1,
    loading: false,
    error: null,
  };

  const initialState = {
    booking: initialBookingState,
    property: initialPropertyState,
  };

  beforeEach(() => {
    store = createMockStore(initialState);
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <PropertyStats />
      </Provider>,
    );

  test('renders correctly and displays the initial stats', () => {
    renderComponent();

    expect(screen.getByText('Guests This Month')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();
    expect(screen.getByText('This Year')).toBeInTheDocument();
  });
});
