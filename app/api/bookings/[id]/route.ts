import axios from 'axios';
import { API_URL } from '@/constants';
import { NextResponse, NextRequest } from 'next/server';
import { isValid, parseISO } from 'date-fns';
import { handleAxiosError } from '@/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ message: 'ID is required' }, { status: 400 });
  }

  try {
    const response = await axios.get(`${API_URL}/bookings/${id}`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return handleAxiosError(error);
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    const { name, propertyId, startDate, endDate, pricePerDay } =
      await req.json();

    if (!id || !name || !propertyId || !startDate || !endDate || !pricePerDay) {
      return NextResponse.json(
        {
          message:
            'ID, name, propertyId, startDate, endDate, and pricePerDay are required',
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

    const response = await axios.put(`${API_URL}/bookings/${id}`, {
      name,
      propertyId,
      startDate,
      endDate,
      pricePerDay,
    });
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return handleAxiosError(error);
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  try {
    if (!id) {
      return NextResponse.json({ message: 'ID is required' }, { status: 400 });
    }

    const response = await axios.delete(`${API_URL}/bookings/${id}`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return handleAxiosError(error);
  }
}
