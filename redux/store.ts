import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/auth/slice';
import propertyReducer from './features/property/slice';
import bookingReducer from './features/booking/slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    property: propertyReducer,
    booking: bookingReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
