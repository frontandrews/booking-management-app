import { type ClassValue, clsx } from 'clsx';
import { NextResponse } from 'next/server';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const getErrorMessage = (error: any) => {
  if (error && typeof error.message === 'string') {
    return error.message;
  }
  return null;
};

export const isBrowser: () => boolean = () => typeof window !== 'undefined';

export const generateColorPalette = (numberOfColors: number) => {
  const colors = [];
  const hueStep = 360 / numberOfColors;

  for (let i = 0; i < numberOfColors; i++) {
    const hue = i * hueStep;
    colors.push(`hsl(${hue}, 70%, 80%)`);
  }

  return colors;
};

export const getColorForGuest = (
  guestName: string,
  guestColorMap: { [key: string]: string },
  colorPalette: string[],
) => {
  if (!guestColorMap[guestName]) {
    guestColorMap[guestName] =
      colorPalette[Object.keys(guestColorMap).length % colorPalette.length];
  }
  return guestColorMap[guestName];
};

export const handleAxiosError = (error: any) => {
  console.log('Server Error: ', error.response?.data);
  const message = error.response?.data || 'Internal server error';
  return NextResponse.json(
    { message },
    { status: error.response?.status || 500 },
  );
};

export const validateId = (id: string | undefined) => {
  if (!id) {
    return { valid: false, message: 'ID is required' };
  }
  return { valid: true, message: '' };
};

export const formatCurrency = (value: string) => {
  const numberValue = parseFloat(value.replace(/[^0-9.-]+/g, ''));
  if (isNaN(numberValue)) {
    return '';
  }
  return numberValue.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
};
