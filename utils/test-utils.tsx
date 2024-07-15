// utils/test-utils.ts
import {
  configureStore,
  EnhancedStore,
  PreloadedState,
} from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, RenderResult } from '@testing-library/react';
import { ReactElement, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import authReducer from '@/redux/features/auth/slice';
import propertyReducer from '@/redux/features/property/slice';
import bookingReducer from '@/redux/features/booking/slice';
import { RootState } from '@/redux/store';

interface CreateTestStoreOptions {
  preloadedState?: PreloadedState<RootState>;
}

const initialPropertyState = {
  properties: [],
  selectedPropertyId: null,
  loading: false,
  error: null,
};

export function createTestStore({
  preloadedState,
}: CreateTestStoreOptions = {}): EnhancedStore<RootState> {
  return configureStore({
    reducer: {
      auth: authReducer,
      property: propertyReducer,
      booking: bookingReducer,
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
    preloadedState: {
      property: initialPropertyState,
      ...preloadedState,
    },
  });
}

interface RenderWithProvidersOptions {
  store?: EnhancedStore<RootState>;
}

const AllProviders: React.FC<
  PropsWithChildren<{ store: EnhancedStore<RootState> }>
> = ({ children, store }) => {
  const methods = useForm();

  return (
    <Provider store={store}>
      <FormProvider {...methods}>{children}</FormProvider>
    </Provider>
  );
};

export function renderWithProviders(
  ui: ReactElement,
  { store }: RenderWithProvidersOptions = {},
): RenderResult {
  if (!store) {
    store = createTestStore();
  }
  return render(<AllProviders store={store}>{ui}</AllProviders>);
}
