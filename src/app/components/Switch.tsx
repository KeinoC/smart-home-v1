'use client';
import { useState, useEffect } from 'react';

export interface Device {
  name: string;
  ip: string;
}

interface ErrorResponse {
  error: string;
}

interface SuccessResponse {
  message: string;
}

export default function Switch() {
  const [message, setMessage] = useState('');
  const [devices, setDevices] = useState<Device[]>([
    { name: 'Device 1', ip: '' }, // IP will be fetched dynamically
    { name: 'Device 2', ip: '192.168.1.23' },
    { name: 'Device 3', ip: '192.168.1.61' },
    { name: 'Device 4', ip: '192.168.1.23' }
  ]);

  useEffect(() => {
    const fetchDeviceIP = async () => {
      try {
        console.log('Fetching device IP from /ip endpoint...');
        const response = await fetch(`http://192.168.1.184/ip`); // Known static IP to fetch device IP
        if (!response.ok) {
          throw new Error(`Failed to fetch device IP with status ${response.status}`);
        }
        const ip = await response.text();
        console.log('Device IP fetched:', ip);
        setDevices(prevDevices => prevDevices.map(device => 
          device.name === 'Device 1' ? { ...device, ip } : device
        ));
      } catch (error) {
        console.error('Error fetching device IP:', error);
        setMessage(`Error fetching device IP: ${(error as Error).message}`);
      }
    };

    fetchDeviceIP();
  }, []);

  const handleRelayAction = async (deviceIp: string, action: string) => {
    console.log(`Sending request to ${deviceIp} to turn ${action}`);
    try {
      const response = await fetch(`http://${deviceIp}/relay/${action}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      });
      if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
      }
      const data = await response.text();
      console.log(`Success response from ${deviceIp}:`, data);
      setMessage(`Success: ${data}`);
    } catch (error) {
      console.error(`Error fetching ${action} from ${deviceIp}:`, error);
      setMessage(`Error turning ${action === 'on' ? 'on' : 'off'} relay on ${deviceIp}`);
    }
  };

  return (
    <div className='gap-4 flex flex-col'>
      <h1>Relay Control</h1>
      {devices.map((device, index) => (
        <div key={index} className='flex gap-4 items-center'>
          <h3>{device.name}</h3>
          <button
            className='bg-purple-700 text-white p-2 rounded-md'
            onClick={() => handleRelayAction(device.ip, 'on')}
            disabled={!device.ip} // Disable button if IP is not yet fetched
          >
            Turn Relay ON {device.ip}
          </button>
          <button
            className='bg-purple-700 text-white p-2 rounded-md'
            onClick={() => handleRelayAction(device.ip, 'off')}
            disabled={!device.ip} // Disable button if IP is not yet fetched
          >
            Turn Relay OFF
          </button>
        </div>
      ))}
      <p>{message}</p>
    </div>
  );
}
