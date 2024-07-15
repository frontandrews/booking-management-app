import { configureStore } from '@reduxjs/toolkit';
import bookingReducer, {
  fetchBookings,
  fetchBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  initialState,
} from '@/redux/features/booking/slice';
import axios from 'axios';
import { Booking } from '@/components/bookings/types';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('booking slice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        booking: bookingReducer,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the initial state', () => {
    const state = store.getState().booking;
    expect(state).toEqual(initialState);
  });

  test.todo('should handle fetchBookings.pending');

  test('should handle fetchBookings.fulfilled', async () => {
    const mockBookings: Booking[] = [
      { id: 1, propertyId: 1, startDate: '2023-06-01', endDate: '2023-06-10', pricePerDay: '100', name: 'John Doe' },
      { id: 2, propertyId: 1, startDate: '2023-07-01', endDate: '2023-07-10', pricePerDay: '150', name: 'Jane Doe' },
    ];

    mockAxios.get.mockResolvedValueOnce({ data: mockBookings });

    await store.dispatch(fetchBookings(1));

    const state = store.getState().booking;
    expect(state.loading).toBe(false);
    expect(state.bookings).toEqual(mockBookings);
  });

  test('should handle fetchBookings.rejected', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    await store.dispatch(fetchBookings(1));

    const state = store.getState().booking;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });

  test('should handle fetchBookingById.fulfilled', async () => {
    const mockBooking: Booking = { id: 1, propertyId: 1, startDate: '2023-06-01', endDate: '2023-06-10', pricePerDay: '100', name: 'John Doe' };

    mockAxios.get.mockResolvedValueOnce({ data: mockBooking });

    await store.dispatch(fetchBookingById(1));

    const state = store.getState().booking;
    expect(state.loading).toBe(false);
    expect(state.bookings).toContainEqual(mockBooking);
  });

  test('should handle createBooking.fulfilled', async () => {
    const newBooking: Booking = { id: 3, propertyId: 1, startDate: '2023-08-01', endDate: '2023-08-10', pricePerDay: '200', name: 'John Doe' };

    mockAxios.post.mockResolvedValueOnce({ data: newBooking });

    await store.dispatch(createBooking(newBooking));

    const state = store.getState().booking;
    expect(state.bookings).toContainEqual(newBooking);
  });

  test.todo('should handle updateBooking.fulfilled');

  test('should handle deleteBooking.fulfilled', async () => {
    const bookingId = 1;
    mockAxios.delete.mockResolvedValueOnce({});

    await store.dispatch(deleteBooking(bookingId));

    const state = store.getState().booking;
    expect(state.bookings.find((booking: Booking) => booking.id === bookingId)).toBeUndefined();
  });
});
