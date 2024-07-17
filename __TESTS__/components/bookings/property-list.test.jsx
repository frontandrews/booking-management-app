import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import PropertyList from '@/components/bookings/property-list';

jest.mock('@/components/bookings/property-dialog', () => ({
  PropertyDialog: () => <div data-testid="property-dialog">PropertyDialog</div>,
}));

jest.mock('@/redux/features/property/slice', () => ({
  setSelectedPropertyId: jest.fn(),
}));

jest.mock('@/redux/features/booking/slice', () => ({
  fetchBookings: jest.fn(),
}));

const createMockStore = (initialState) => {
  return configureStore({
    reducer: {
      property: () => initialState.property,
      booking: () => initialState.booking,
    },
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
};

describe('PropertyList Component', () => {
  let store;

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
    property: initialPropertyState,
    booking: {},
  };

  beforeEach(() => {
    store = createMockStore(initialState);
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <PropertyList />
      </Provider>,
    );

  test('renders all properties and displays correct count', () => {
    const { container } = renderComponent();

    expect(screen.getByTestId('property-header').textContent).toMatch(
      /Properties\s+\(2\/2\)/,
    );
    expect(screen.getByText('Property One')).toBeInTheDocument();
    expect(screen.getByText('Location One')).toBeInTheDocument();
    expect(screen.getByText('Property Two')).toBeInTheDocument();
    expect(screen.getByText('Location Two')).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test('filters properties based on search term', () => {
    const { container } = renderComponent();

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'One' } });

    const propertyCount = screen.getByTestId('property-count');
    expect(propertyCount).toHaveTextContent('(1/2)');
    expect(screen.getByText('Property One')).toBeInTheDocument();
    expect(screen.queryByText('Property Two')).not.toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test('displays no results message when search term does not match any property', () => {
    const { container } = renderComponent();

    const searchInput = screen.getByPlaceholderText('Search');
    fireEvent.change(searchInput, { target: { value: 'Three' } });

    expect(
      screen.getByText('No results found for the search criteria.'),
    ).toBeInTheDocument();

    expect(container).toMatchSnapshot();
  });

  test('renders PropertyDialog component for each property', () => {
    const { container } = renderComponent();

    const propertyDialogs = screen.getAllByTestId('property-dialog');
    expect(propertyDialogs.length).toBe(3);

    expect(container).toMatchSnapshot();
  });

  test.todo('handles property click and dispatches actions');
});
