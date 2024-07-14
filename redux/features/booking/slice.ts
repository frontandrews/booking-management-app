import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { Booking } from '@/components/bookings/types';

interface BookingState {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

const initialState: BookingState = {
  bookings: [],
  loading: false,
  error: null,
};

export const fetchBookings = createAsyncThunk(
  'booking/fetchBookings',
  async (propertyId: number) => {
    const response = await axios.get('/api/bookings');
    const bookings = response.data.filter(
      (booking: Booking) => booking.propertyId === propertyId,
    );
    return bookings;
  },
);

export const fetchBookingById = createAsyncThunk(
  'booking/fetchBooking',
  async (id: number) => {
    const response = await axios.get(`/api/bookings/${id}`);
    return response.data;
  },
);

export const createBooking = createAsyncThunk(
  'booking/createBooking',
  async (data: Booking) => {
    const response = await axios.post('/api/bookings', data);
    return response.data;
  },
);

export const updateBooking = createAsyncThunk(
  'booking/updateBooking',
  async ({ bookingId, data }: { bookingId: number; data: Booking }) => {
    const response = await axios.put(`/api/bookings/${bookingId}`, data);
    return response.data;
  },
);

export const deleteBooking = createAsyncThunk(
  'booking/deleteBooking',
  async (bookingId: number, { dispatch }) => {
    await axios.delete(`/api/bookings/${bookingId}`);
    dispatch(fetchBookings(bookingId));
  },
);

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBookings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookings.fulfilled, (state, action) => {
        state.loading = false;
        state.bookings = action.payload;
      })
      .addCase(fetchBookings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch bookings';
      })
      .addCase(fetchBookingById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBookingById.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        } else {
          state.bookings.push(action.payload);
        }
      })
      .addCase(fetchBookingById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch booking';
      })
      .addCase(createBooking.fulfilled, (state, action) => {
        state.bookings.push(action.payload);
      })
      .addCase(updateBooking.fulfilled, (state, action) => {
        const index = state.bookings.findIndex(
          (booking) => booking.id === action.payload.id,
        );
        if (index !== -1) {
          state.bookings[index] = action.payload;
        }
      })
      .addCase(deleteBooking.fulfilled, (state, action) => {
        state.bookings = state.bookings.filter(
          (booking) => booking.id !== action.meta.arg,
        );
      });
  },
});

export default bookingSlice.reducer;
