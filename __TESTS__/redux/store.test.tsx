import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/features/auth/slice';
import propertyReducer from '@/redux/features/property/slice';
import bookingReducer from '@/redux/features/booking/slice';

describe('Redux Store Configuration', () => {
  test('should configure the store with the correct reducers', () => {
    const testStore = configureStore({
      reducer: {
        auth: authReducer,
        property: propertyReducer,
        booking: bookingReducer,
      },
      middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
      devTools: process.env.NODE_ENV !== 'production',
    });

    expect(testStore.getState().auth).toBeDefined();
    expect(testStore.getState().property).toBeDefined();
    expect(testStore.getState().booking).toBeDefined();
  });
});
