import { renderHook, act } from '@testing-library/react-hooks';
import { usePropertyForm } from '@/hooks/use-property-form';

describe('usePropertyForm', () => {
  test('should initialize correctly', () => {
    const { result } = renderHook(() => usePropertyForm());

    expect(result.current.formError).toBe('');
    expect(result.current.isLoading).toBe(false);
    expect(result.current.errors).toEqual({});
  });

  test('should update formError', () => {
    const { result } = renderHook(() => usePropertyForm());

    act(() => {
      result.current.setFormError('An error occurred');
    });

    expect(result.current.formError).toBe('An error occurred');
  });

  test('should update isLoading', () => {
    const { result } = renderHook(() => usePropertyForm());

    act(() => {
      result.current.setIsLoading(true);
    });

    expect(result.current.isLoading).toBe(true);
  });

  test('should validate form fields', async () => {
    const { result } = renderHook(() => usePropertyForm());

    let submitResult: any;
    const onSubmit = jest.fn((data) => {
      submitResult = data;
    });

    await act(async () => {
      await result.current.handleSubmit(onSubmit)();
    });

    expect(onSubmit).not.toHaveBeenCalled();
    expect(result.current.errors.name?.message).toBe('Required');
    expect(result.current.errors.location?.message).toBe('Required');
  });

  test('should reset form', async () => {
    const { result } = renderHook(() => usePropertyForm());

    act(() => {
      result.current.reset({
        name: 'Test Name',
        location: 'Test Location',
      });
    });

    expect(result.current.errors).toEqual({});
  });
});
