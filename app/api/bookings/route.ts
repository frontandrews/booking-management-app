import { NextResponse, NextRequest } from 'next/server';
import axios from 'axios';
import { API_URL } from '@/constants';
import { isValid, parseISO } from 'date-fns';
import { handleAxiosError } from '@/utils';

export async function POST(request: NextRequest) {
  try {
    const { name, propertyId, startDate, endDate, pricePerDay } =
      await request.json();

    if (!name || !propertyId || !startDate || !endDate || !pricePerDay) {
      return NextResponse.json(
        {
          message:
            'name, propertyId, startDate, endDate, and pricePerDay are required',
        },
        { status: 400 },
      );
    }

    if (!isValid(parseISO(startDate)) || !isValid(parseISO(endDate))) {
      return NextResponse.json(
        { message: 'Invalid date format' },
        { status: 400 },
      );
    }

    const response = await axios.post(`${API_URL}/bookings`, {
      name,
      propertyId,
      startDate,
      endDate,
      pricePerDay,
    });
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return handleAxiosError(error);
  }
}

export async function GET() {
  try {
    const response = await axios.get(`${API_URL}/bookings`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return handleAxiosError(error);
  }
}
