'use client';

import React, { useState } from 'react';
import axios from 'axios';

const ESP32_IP = 'http://192.168.1.195'; // Replace with your ESP32's IP address

interface RelayState {
  status: 'ON' | 'OFF';
  loading: boolean;
  error: string | null;
}

const relayNames = ['relay1', 'relay2', 'relay3', 'relay4'];

const RelayControl: React.FC = () => {
  const [relays, setRelays] = useState<Record<string, RelayState>>(
    relayNames.reduce(
      (acc, relay) => ({
        ...acc,
        [relay]: { status: 'OFF', loading: false, error: null },
      }),
      {}
    )
  );

  const sendRequest = async (relay: string, action: 'on' | 'off') => {
    setRelays((prev) => ({
      ...prev,
      [relay]: { ...prev[relay], loading: true, error: null },
    }));

    try {
      const response = await axios.get(`${ESP32_IP}/${relay}/${action}`);
      const newStatus = action === 'on' ? 'ON' : 'OFF';
      setRelays((prev) => ({
        ...prev,
        [relay]: { status: newStatus, loading: false, error: null },
      }));
      console.log(`Relay ${relay} turned ${newStatus}`);
    } catch (error) {
      setRelays((prev) => ({
        ...prev,
        [relay]: { ...prev[relay], loading: false, error: 'Failed to toggle relay' },
      }));
      console.error(`Failed to toggle ${relay}:`, error);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-6 p-6">
      <h1 className="text-3xl font-bold">ESP32 Relay Control</h1>
      <div className="grid grid-cols-2 gap-6">
        {relayNames.map((relay) => (
          <div
            key={relay}
            className="flex flex-col items-center p-4 border rounded-lg shadow-md w-64"
          >
            <h2 className="text-xl font-semibold mb-2">{relay.toUpperCase()}</h2>
            <div className="flex space-x-2">
              <button
                className={`w-full py-2 rounded bg-green-500 text-white font-semibold`}
                onClick={() => sendRequest(relay, 'on')}
                disabled={relays[relay].status === 'ON' || relays[relay].loading}
              >
                {relays[relay].loading && relays[relay].status === 'OFF' ? 'Turning ON...' : 'Turn ON'}
              </button>
              <button
                className={`w-full py-2 rounded bg-red-500 text-white font-semibold`}
                onClick={() => sendRequest(relay, 'off')}
                disabled={relays[relay].status === 'OFF' || relays[relay].loading}
              >
                {relays[relay].loading && relays[relay].status === 'ON' ? 'Turning OFF...' : 'Turn OFF'}
              </button>
            </div>
            {relays[relay].error && (
              <p className="text-red-500 mt-2">{relays[relay].error}</p>
            )}
            <p className="mt-2">
              Status:{' '}
              <span
                className={`font-semibold ${
                  relays[relay].status === 'ON' ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {relays[relay].status}
              </span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RelayControl;
