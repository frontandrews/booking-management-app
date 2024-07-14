import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { isBrowser } from '@/utils';

interface LogInParams {
  email: string;
  password: string;
}

const loadState = () => {
  try {
    const serializedState = isBrowser() && localStorage.getItem('auth');
    if (!serializedState) return initialState;
    return JSON.parse(serializedState);
  } catch (e) {
    console.error('Could not load state', e);
    return initialState;
  }
};

export const initialState = {
  user: {
    isAuthenticated: false,
    id: '',
    email: '',
    token: '',
  },
};

export const logInAsync = createAsyncThunk(
  'auth/logIn',
  async ({ email, password }: LogInParams, { rejectWithValue }) => {
    try {
      const response = await axios.post('/api/sign-in', { email, password });

      if (response.status !== 200) {
        return rejectWithValue(
          `Failed to login with status code ${response.status}`,
        );
      }

      const { accessToken, user } = response.data;
      return {
        id: user.id,
        email: user.email,
        token: accessToken,
      };
    } catch (error: any) {
      console.error('Error signing in: ', error);
      if (error.response && error.response.data) {
        return rejectWithValue(error.response.data.message);
      }
      return rejectWithValue('An unexpected error occurred');
    }
  },
);

export const auth = createSlice({
  name: 'auth',
  initialState: loadState(),
  reducers: {
    logOut() {
      localStorage.removeItem('auth');
      return initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logInAsync.fulfilled, (state, action) => {
      const newState = {
        ...state,
        user: {
          isAuthenticated: true,
          ...action.payload,
        },
      };
      localStorage.setItem('auth', JSON.stringify(newState));
      return newState;
    });
  },
});

export const { logOut } = auth.actions;
export default auth.reducer;
