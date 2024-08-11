import type { NextApiRequest, NextApiResponse } from 'next';

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  message: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<SuccessResponse | ErrorResponse>) {
  console.log('api called----')
  const { deviceIp, action } = req.query;

  if (typeof deviceIp !== 'string' || typeof action !== 'string') {
    return res.status(400).json({ error: 'Invalid query parameters.' });
  }

  try {
    const response = await fetch(`http://${deviceIp}/relay/${action}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.text();
    res.status(200).json({ message: data });
  } catch (error) {
    console.error(`Error fetching ${action} from ${deviceIp}:`, error);
    res.status(500).json({ error: 'Failed to communicate with the device.' });
  }
}
