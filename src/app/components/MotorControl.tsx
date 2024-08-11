'use client';
import { useState } from 'react';

export default function MotorControl() {
  const [direction, setDirection] = useState<string | null>(null);
  const [speed, setSpeed] = useState<number>(255);

  const moveMotors = async (command: 'forward' | 'backward' | 'left' | 'right' | 'stop') => {
    setDirection(command);

    try {
      const esp32IpAddress = process.env.NEXT_PUBLIC_KEINO_BOT_IP;

      const response = await fetch(`${esp32IpAddress}/move`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ direction: command }),
      });

      if (!response.ok) {
        throw new Error('Failed to send motor command');
      }
    } catch (error) {
      console.error('Error connecting to ESP32:', error);
    }
  };

  const setMotorSpeed = async (newSpeed: number) => {
    setSpeed(newSpeed);

    try {
      const esp32IpAddress = process.env.NEXT_PUBLIC_KEINO_BOT_IP;

      const response = await fetch(`${esp32IpAddress}/speed`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ speed: newSpeed }),
      });

      if (!response.ok) {
        throw new Error('Failed to set motor speed');
      }
    } catch (error) {
      console.error('Error connecting to ESP32:', error);
    }
  };

  const handleMouseDown = (command: 'forward' | 'backward' | 'left' | 'right') => {
    moveMotors(command);
  };

  const handleMouseUp = () => {
    moveMotors('stop');
  };

  return (
    <div className="flex flex-col items-center p-6 w-full h-full text-4xl bg-gray-100/50 rounded-lg shadow-md space-y-6">
      <h1 className="text-2xl font-bold">Motor Control</h1>
      {/* Speed Slider */}
      <div className="flex flex-col items-center mb-4 w-full">
        <label className="text-lg font-semibold mb-2">Speed: {speed}</label>
        <input
          type="range"
          min="0"
          max="255"
          value={speed}
          onChange={(e) => setMotorSpeed(Number(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
      </div>

      {/* Directional Buttons */}
      <div className="grid grid-cols-3 gap-4 ">
        <div></div>
        <button
          onMouseDown={() => handleMouseDown('forward')}
          onMouseUp={handleMouseUp}
          onTouchStart={() => handleMouseDown('forward')}
          onTouchEnd={handleMouseUp}
          className={`px-4 py-2 rounded-lg font-semibold ${
            direction === 'forward' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          ↑
        </button>
        <div></div>

        <button
          onMouseDown={() => handleMouseDown('left')}
          onMouseUp={handleMouseUp}
          onTouchStart={() => handleMouseDown('left')}
          onTouchEnd={handleMouseUp}
          className={`px-4 py-2 rounded-lg font-semibold ${
            direction === 'left' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          ←
        </button>
        <div></div>
        <button
          onMouseDown={() => handleMouseDown('right')}
          onMouseUp={handleMouseUp}
          onTouchStart={() => handleMouseDown('right')}
          onTouchEnd={handleMouseUp}
          className={`px-4 py-2 rounded-lg font-semibold ${
            direction === 'right' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          →
        </button>

        <div></div>
        <button
          onMouseDown={() => handleMouseDown('backward')}
          onMouseUp={handleMouseUp}
          onTouchStart={() => handleMouseDown('backward')}
          onTouchEnd={handleMouseUp}
          className={`px-4 py-2 rounded-lg font-semibold ${
            direction === 'backward' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'
          }`}
        >
          ↓
        </button>
        <div></div>
      </div>
    </div>
  );
}
