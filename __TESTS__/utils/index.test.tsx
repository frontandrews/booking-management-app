import { NextResponse } from 'next/server';
import {
  cn,
  getErrorMessage,
  isBrowser,
  generateColorPalette,
  getColorForGuest,
  handleAxiosError,
  validateId,
} from '@/utils';

jest.mock('next/server', () => ({
  NextResponse: {
    json: jest.fn(),
  },
}));

describe('Utility Functions', () => {
  test('cn function merges class names correctly', () => {
    expect(cn('class1', 'class2')).toBe('class1 class2');
    expect(cn('class1', false && 'class2', 'class3')).toBe('class1 class3');
    expect(cn('class1', undefined && 'class2', 'class3')).toBe('class1 class3');
  });

  test('getErrorMessage function returns error message', () => {
    const error = { message: 'An error occurred' };
    expect(getErrorMessage(error)).toBe('An error occurred');
    expect(getErrorMessage(null)).toBe(null);
    expect(getErrorMessage({})).toBe(null);
  });

  test('isBrowser function detects browser environment', () => {
    expect(isBrowser()).toBe(typeof window !== 'undefined');
  });

  test('generateColorPalette function generates correct colors', () => {
    const colors = generateColorPalette(3);
    expect(colors).toEqual([
      'hsl(0, 70%, 80%)',
      'hsl(120, 70%, 80%)',
      'hsl(240, 70%, 80%)',
    ]);
  });

  test('getColorForGuest function assigns colors to guests correctly', () => {
    const colorPalette = generateColorPalette(3);
    const guestColorMap = {};

    expect(getColorForGuest('Guest1', guestColorMap, colorPalette)).toBe(
      'hsl(0, 70%, 80%)',
    );
    expect(getColorForGuest('Guest2', guestColorMap, colorPalette)).toBe(
      'hsl(120, 70%, 80%)',
    );
    expect(getColorForGuest('Guest1', guestColorMap, colorPalette)).toBe(
      'hsl(0, 70%, 80%)',
    );
  });

  test('handleAxiosError function handles error correctly', () => {
    const error = {
      response: {
        data: 'Not Found',
        status: 404,
      },
    };
    const response = handleAxiosError(error);
    expect(response).toEqual(
      NextResponse.json({ message: 'Not Found' }, { status: 404 }),
    );

    const errorWithoutResponse = {};
    const defaultResponse = handleAxiosError(errorWithoutResponse);
    expect(defaultResponse).toEqual(
      NextResponse.json({ message: 'Internal server error' }, { status: 500 }),
    );
  });

  test('validateId function validates ID correctly', () => {
    expect(validateId('123')).toEqual({ valid: true, message: '' });
    expect(validateId(undefined)).toEqual({
      valid: false,
      message: 'ID is required',
    });
  });
});
