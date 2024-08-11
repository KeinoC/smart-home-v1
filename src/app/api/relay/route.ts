import { NextRequest, NextResponse } from 'next/server';
import fetch from 'node-fetch';

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  message: string;
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const deviceIp = searchParams.get('deviceIp');
  const action = searchParams.get('action');

  if (!deviceIp || !action) {
    return NextResponse.json({ error: 'Invalid query parameters.' }, { status: 400 });
  }

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      controller.abort();
    }, 10000); // 10 seconds timeout

    const response = await fetch(`http://${deviceIp}/relay/${action}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.text();
    return NextResponse.json({ message: data }, { status: 200 });
  } catch (error) {
    console.error(`Error fetching ${action} from ${deviceIp}:`, error);

    let errorMessage = 'Failed to communicate with the device.';
    if (error instanceof Error) {
      errorMessage = error.name === 'AbortError' ? 'Request timed out.' : error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
