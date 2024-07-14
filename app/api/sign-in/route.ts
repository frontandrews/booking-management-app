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

    const response = await axios.post(`${API_URL}/login`, { email, password });

    if (response.status !== 200) {
      return NextResponse.json(
        { message: 'Failed to login' },
        { status: response.status },
      );
    }

    const { accessToken, user } = response.data;
    return NextResponse.json({ accessToken, user }, { status: 200 });
  } catch (error: any) {
    return handleAxiosError(error);
  }
}
