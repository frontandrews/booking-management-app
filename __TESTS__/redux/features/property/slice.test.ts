import { configureStore } from '@reduxjs/toolkit';
import propertyReducer, {
  fetchProperties,
  fetchPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  setSelectedPropertyId,
  initialState,
} from '@/redux/features/property/slice';
import axios from 'axios';
import { Property } from '@/components/bookings/types';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<typeof axios>;

describe('property slice', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        property: propertyReducer,
      },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should return the initial state', () => {
    const state = store.getState().property;
    expect(state).toEqual(initialState);
  });

  test('should handle setSelectedPropertyId', () => {
    store.dispatch(setSelectedPropertyId(1));
    const state = store.getState().property;
    expect(state.selectedPropertyId).toBe(1);
  });

  test('should handle fetchProperties.fulfilled', async () => {
    const mockProperties: Property[] = [
      { id: 1, name: 'Property One', location: 'Location One' },
      { id: 2, name: 'Property Two', location: 'Location Two' },
    ];

    mockAxios.get.mockResolvedValueOnce({ data: mockProperties });

    await store.dispatch(fetchProperties());

    const state = store.getState().property;
    expect(state.loading).toBe(false);
    expect(state.properties).toEqual(mockProperties);
  });

  test('should handle fetchProperties.rejected', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    await store.dispatch(fetchProperties());

    const state = store.getState().property;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });

  test('should handle fetchPropertyById.fulfilled', async () => {
    const mockProperty: Property = {
      id: 1,
      name: 'Property One',
      location: 'Location One',
    };

    mockAxios.get.mockResolvedValueOnce({ data: mockProperty });

    await store.dispatch(fetchPropertyById(1));

    const state = store.getState().property;
    expect(state.loading).toBe(false);
    expect(state.selectedProperty).toEqual(mockProperty);
  });

  test('should handle fetchPropertyById.rejected', async () => {
    mockAxios.get.mockRejectedValueOnce(new Error('Failed to fetch'));

    await store.dispatch(fetchPropertyById(1));

    const state = store.getState().property;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to fetch');
  });

  test('should handle createProperty.fulfilled', async () => {
    const newProperty: Property = {
      id: 3,
      name: 'Property Three',
      location: 'Location Three',
    };

    mockAxios.post.mockResolvedValueOnce({ data: newProperty });

    await store.dispatch(createProperty(newProperty));

    const state = store.getState().property;
    expect(state.loading).toBe(false);
  });

  test('should handle updateProperty.fulfilled', async () => {
    const updatedProperty: Property = {
      id: 1,
      name: 'Updated Property',
      location: 'Updated Location',
    };

    mockAxios.put.mockResolvedValueOnce({ data: updatedProperty });

    await store.dispatch(
      updateProperty({ propertyId: 1, data: updatedProperty }),
    );

    const state = store.getState().property;
    expect(state.loading).toBe(false);
  });

  test('should handle deleteProperty.fulfilled', async () => {
    mockAxios.delete.mockResolvedValueOnce({});

    await store.dispatch(deleteProperty(1));

    const state = store.getState().property;
    expect(state.loading).toBe(false);
  });

  test('should handle deleteProperty.rejected', async () => {
    mockAxios.delete.mockRejectedValueOnce(new Error('Failed to delete'));

    await store.dispatch(deleteProperty(1));

    const state = store.getState().property;
    expect(state.loading).toBe(false);
    expect(state.error).toBe('Failed to delete');
  });
});
