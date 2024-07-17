import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { render, RenderResult } from '@testing-library/react';
import { ReactElement, PropsWithChildren } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import authReducer from '@/redux/features/auth/slice';
import propertyReducer from '@/redux/features/property/slice';
import bookingReducer from '@/redux/features/booking/slice';
import { RootState } from '@/redux/store';

interface CreateTestStoreOptions {
  preloadedState?: Partial<RootState>;
}

export function createTestStore({
  preloadedState,
}: CreateTestStoreOptions = {}): EnhancedStore<RootState> {
  return configureStore({
    reducer: {
      auth: authReducer,
      // @ts-ignore
      property: propertyReducer,
      // @ts-ignore
      booking: bookingReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  });
}

interface RenderWithProvidersOptions {
  store?: EnhancedStore<RootState>;
  preloadedState?: Partial<RootState>;
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
  { store, preloadedState }: RenderWithProvidersOptions = {},
): { store: EnhancedStore<RootState> } & RenderResult {
  if (!store) {
    store = createTestStore({ preloadedState });
  }
  const result = render(<AllProviders store={store}>{ui}</AllProviders>);
  return { store, ...result };
}
