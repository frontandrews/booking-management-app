import { NextResponse } from 'next/server';
import axios from 'axios';
import { API_URL } from '@/constants';
import { handleAxiosError } from '@/utils';

export async function POST(request: Request) {
  try {
    const { name, location } = await request.json();

    if (!name || !location) {
      return NextResponse.json(
        { message: 'Name and location are required' },
        { status: 400 },
      );
    }

    const response = await axios.post(`${API_URL}/properties`, {
      name,
      location,
    });
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return handleAxiosError(error);
  }
}
export async function GET() {
  try {
    const response = await axios.get(`${API_URL}/properties`);
    const sortedData = response.data.sort((a: any, b: any) => {
      return a.name.localeCompare(b.name);
    });
    return NextResponse.json(sortedData, { status: 200 });
  } catch (error: any) {
    return handleAxiosError(error);
  }
}