import { NextResponse } from 'next/server';
import axios from 'axios';
import { API_URL } from '@/constants';
import { handleAxiosError } from '@/utils';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: 'Email and password are required' },
        { status: 400 },
      );
    }

    const response = await axios.post(`${API_URL}/signup`, { email, password });
    return NextResponse.json(response.data, { status: 201 });
  } catch (error: any) {
    return handleAxiosError(error);
  }
}
