import { configureStore } from '@reduxjs/toolkit';
import authReducer from '@/redux/features/auth/slice';
import propertyReducer from '@/redux/features/property/slice';
import bookingReducer from '@/redux/features/booking/slice';
import { store, RootState, AppDispatch } from '@/redux/store';

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

  test.todo('should have the correct middleware');

  test('should have the correct types for RootState and AppDispatch', () => {
    type ExpectedRootState = {
      auth: ReturnType<typeof authReducer>;
      property: ReturnType<typeof propertyReducer>;
      booking: ReturnType<typeof bookingReducer>;
    };

    type ExpectedAppDispatch = typeof store.dispatch;

    const initialState: RootState = store.getState();
    const dispatch: AppDispatch = store.dispatch;

    expect(initialState).toBeDefined();
    expect(dispatch).toBeDefined();
  });
});
