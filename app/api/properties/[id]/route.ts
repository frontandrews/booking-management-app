import axios from 'axios';
import { API_URL } from '@/constants';
import { NextRequest, NextResponse } from 'next/server';
import { handleAxiosError, validateId } from '@/utils';

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  const { id } = params;

  const { valid, message } = validateId(id);
  if (!valid) {
    return NextResponse.json({ message }, { status: 400 });
  }

  try {
    const response = await axios.get(`${API_URL}/properties/${id}`);
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
    const { name, location } = await req.json();

    if (!id || !name || !location) {
      return NextResponse.json(
        { message: 'ID, name, and location are required' },
        { status: 400 },
      );
    }

    const response = await axios.put(`${API_URL}/properties/${id}`, {
      name,
      location,
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

  const { valid, message } = validateId(id);
  if (!valid) {
    return NextResponse.json({ message }, { status: 400 });
  }

  try {
    const currentBookingsResponse = await axios.get(`${API_URL}/bookings`);
    const bookingsWithProperty = currentBookingsResponse.data.filter(
      (booking: any) => booking.propertyId === Number(id),
    );

    // Delete all bookings associated with the property
    await Promise.all(
      bookingsWithProperty.map((booking: any) =>
        axios.delete(`${API_URL}/bookings/${booking.id}`),
      ),
    );

    const response = await axios.delete(`${API_URL}/properties/${id}`);
    return NextResponse.json(response.data, { status: 200 });
  } catch (error: any) {
    return handleAxiosError(error);
  }
}
