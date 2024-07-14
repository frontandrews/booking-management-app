import { Property } from '@/components/bookings/types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

interface PropertyState {
  properties: Property[];
  selectedPropertyId: number | null;
  selectedProperty: Property | null;
  loading: boolean;
  error: string | null;
}

const initialState: PropertyState = {
  properties: [],
  selectedPropertyId: null,
  selectedProperty: null,
  loading: false,
  error: null,
};

export const fetchProperties = createAsyncThunk(
  'property/fetchProperties',
  async () => {
    const response = await axios.get('/api/properties');
    return response.data;
  },
);

export const fetchPropertyById = createAsyncThunk(
  'property/fetchPropertyById',
  async (propertyId: number) => {
    const response = await axios.get(`/api/properties/${propertyId}`);
    return response.data;
  },
);

export const createProperty = createAsyncThunk(
  'property/createProperty',
  async (data: Property) => {
    const response = await axios.post('/api/properties', data);
    return response.data;
  },
);

export const updateProperty = createAsyncThunk(
  'property/updateProperty',
  async ({ propertyId, data }: { propertyId: number; data: Property }) => {
    const response = await axios.put(`/api/properties/${propertyId}`, data);
    return response.data;
  },
);

export const deleteProperty = createAsyncThunk(
  'property/deleteProperty',
  async (propertyId: number, { dispatch }) => {
    await axios.delete(`/api/properties/${propertyId}`);
    dispatch(fetchProperties());
  },
);

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    setSelectedPropertyId: (state, action) => {
      state.selectedPropertyId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProperties.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProperties.fulfilled, (state, action) => {
        state.loading = false;
        state.properties = action.payload;
      })
      .addCase(fetchProperties.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch properties';
      })
      .addCase(fetchPropertyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPropertyById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProperty = action.payload;
      })
      .addCase(fetchPropertyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch property';
      })
      .addCase(createProperty.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateProperty.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProperty.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProperty.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteProperty.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to delete property';
      });
  },
});

export const { setSelectedPropertyId } = propertySlice.actions;
export default propertySlice.reducer;
