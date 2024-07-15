import { configureStore } from '@reduxjs/toolkit';
import authReducer, {
  logInAsync,
  logOut,
  initialState,
} from '@/redux/features/auth/slice';
import axios from 'axios';
import { isBrowser } from '@/utils';

jest.mock('axios');
jest.mock('@/utils', () => ({
  isBrowser: jest.fn(),
}));

const mockAxios = axios as jest.Mocked<typeof axios>;

describe('auth slice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        auth: authReducer,
      },
    });
    jest.spyOn(Storage.prototype, 'setItem');
    jest.spyOn(Storage.prototype, 'getItem');
    jest.spyOn(Storage.prototype, 'removeItem');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the initial state', () => {
    const state = store.getState().auth;
    expect(state).toEqual(initialState);
  });

  test('should handle logOut', () => {
    store.dispatch(logOut());
    const state = store.getState().auth;
    expect(state).toEqual(initialState);
    expect(localStorage.removeItem).toHaveBeenCalledWith('auth');
  });

  test('should handle logInAsync.fulfilled', async () => {
    const mockResponse = {
      data: {
        accessToken: 'mockToken',
        user: { id: '1', email: 'test@example.com' },
      },
      status: 200,
    };
    mockAxios.post.mockResolvedValueOnce(mockResponse);

    await store.dispatch(
      logInAsync({ email: 'test@example.com', password: 'password' }),
    );

    const state = store.getState().auth;
    expect(state.user.isAuthenticated).toBe(true);
    expect(state.user.id).toBe('1');
    expect(state.user.email).toBe('test@example.com');
    expect(state.user.token).toBe('mockToken');
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'auth',
      JSON.stringify({
        user: {
          isAuthenticated: true,
          id: '1',
          email: 'test@example.com',
          token: 'mockToken',
        },
      }),
    );
  });

  test('should handle logInAsync.rejected with status code', async () => {
    mockAxios.post.mockRejectedValueOnce({
      response: { data: { message: 'Invalid credentials' }, status: 400 },
    });

    const result = await store.dispatch(
      logInAsync({ email: 'test@example.com', password: 'wrong-password' }),
    );

    expect(result.payload).toBe('Invalid credentials');
    expect(result.type).toBe('auth/logIn/rejected');
  });

  test('should handle logInAsync.rejected with unexpected error', async () => {
    mockAxios.post.mockRejectedValueOnce(new Error('Network Error'));

    const result = await store.dispatch(
      logInAsync({ email: 'test@example.com', password: 'password' }),
    );

    expect(result.payload).toBe('An unexpected error occurred');
    expect(result.type).toBe('auth/logIn/rejected');
  });

  test('should load state from localStorage', () => {
    (isBrowser as jest.Mock).mockReturnValue(true);
    const storedState = {
      user: {
        isAuthenticated: true,
        id: '1',
        email: 'test@example.com',
        token: 'mockToken',
      },
    };
    (localStorage.getItem as jest.Mock).mockReturnValue(
      JSON.stringify(storedState),
    );

    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: { auth: storedState },
    });

    const loadedState = store.getState().auth;
    expect(loadedState).toEqual(storedState);
  });

  test('should return initial state if localStorage is empty or fails to parse', () => {
    (isBrowser as jest.Mock).mockReturnValue(true);
    (localStorage.getItem as jest.Mock).mockReturnValue(null);

    store = configureStore({
      reducer: {
        auth: authReducer,
      },
      preloadedState: { auth: initialState },
    });

    const loadedState = store.getState().auth;
    expect(loadedState).toEqual(initialState);

    (localStorage.getItem as jest.Mock).mockReturnValue('invalid json');
    const loadedStateWithError = store.getState().auth;
    expect(loadedStateWithError).toEqual(initialState);
  });
});
