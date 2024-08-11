'use client';
import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

// Define the types for pin status history
type PinStatusHistory = {
  [pin: string]: number[];
};

const PinStatusTimeSeriesChart: React.FC = () => {
  const [digitalStatusHistory, setDigitalStatusHistory] = useState<PinStatusHistory>({});
  const [analogStatusHistory, setAnalogStatusHistory] = useState<PinStatusHistory>({});
  const [soilMoistureHistory, setSoilMoistureHistory] = useState<number[]>([]);
  const [timestamps, setTimestamps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Define a color map for consistent pin colors
  const pinColorMap: { [pin: string]: string } = {
    '0': '#FF6384',
    '1': '#36A2EB',
    '2': '#FFCE56',
    '3': '#4BC0C0',
    '4': '#9966FF',
    '5': '#FF9F40',
    '12': '#FF6384',
    '13': '#36A2EB',
    '14': '#FFCE56',
    '15': '#4BC0C0',
    '16': '#9966FF',
    '17': '#FF9F40',
    '18': '#FF6384',
    '19': '#36A2EB',
    '21': '#FFCE56',
    '22': '#4BC0C0',
    '23': '#9966FF',
    '25': '#FF9F40',
    '26': '#FF6384',
    '27': '#36A2EB',
    '32': '#FFCE56',
    '33': '#4BC0C0',
    '34': '#9966FF',
    '35': '#FF9F40',
    '36': '#FF6384',
    '39': '#36A2EB',
  };

  const fetchStatus = async () => {
    try {
      const response = await fetch('http://192.168.1.217/status');
      if (!response.ok) {
        console.log('Network response was not ok');
        throw new Error('Network response was not ok');
      }
      const text = await response.text();
      console.log('Raw response:', text);
      const data = JSON.parse(text);

      const timestamp = new Date().toLocaleTimeString();

      setDigitalStatusHistory((prevHistory) => {
        const newHistory: PinStatusHistory = { ...prevHistory };
        Object.keys(data).forEach((pin) => {
          if (pin.startsWith('Digital Pin')) {
            if (!newHistory[pin]) {
              newHistory[pin] = [];
            }
            newHistory[pin].push(data[pin]);
          }
        });
        return newHistory;
      });

      setAnalogStatusHistory((prevHistory) => {
        const newHistory: PinStatusHistory = { ...prevHistory };
        Object.keys(data).forEach((pin) => {
          if (pin.startsWith('Analog Pin')) {
            if (!newHistory[pin]) {
              newHistory[pin] = [];
            }
            newHistory[pin].push(data[pin]);
          }
        });
        return newHistory;
      });

      setSoilMoistureHistory((prevHistory) => [...prevHistory, data['Soil Moisture']]);
      setTimestamps((prevTimestamps) => [...prevTimestamps, timestamp]);

    } catch (error) {
      setError((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const togglePin = async (pin: string, state: boolean) => {
    try {
      const response = await fetch(`http://192.168.1.217/pin/${pin}/${state ? 'on' : 'off'}`);
      if (!response.ok) {
        console.log('Network response was not ok');
        throw new Error('Network response was not ok');
      }
      fetchStatus();
    } catch (error) {
      console.error('Error toggling pin:', error);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchStatus();

    // Polling interval
    const intervalId = setInterval(fetchStatus, 1000); // Fetch every second

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const prepareDigitalChartData = (statusHistory: PinStatusHistory) => {
    const filteredHistory = Object.keys(statusHistory).reduce((acc, pin) => {
      if (statusHistory[pin].some(value => value === 1)) {
        acc[pin] = statusHistory[pin];
      }
      return acc;
    }, {} as PinStatusHistory);

    const datasets = Object.keys(filteredHistory).map((pin) => ({
      label: `Pin ${pin}`,
      data: filteredHistory[pin],
      fill: false,
      backgroundColor: pinColorMap[pin],
      borderColor: pinColorMap[pin],
    }));

    return {
      labels: timestamps,
      datasets,
    };
  };

  const prepareAnalogChartData = (statusHistory: PinStatusHistory) => {
    const datasets = Object.keys(statusHistory).map((pin) => ({
      label: `Pin ${pin}`,
      data: statusHistory[pin],
      fill: false,
      backgroundColor: pinColorMap[pin],
      borderColor: pinColorMap[pin],
    }));

    return {
      labels: timestamps,
      datasets,
    };
  };

  const prepareSoilMoistureChartData = () => {
    return {
      labels: timestamps,
      datasets: [
        {
          label: 'Soil Moisture',
          data: soilMoistureHistory,
          fill: false,
          backgroundColor: '#4BC0C0',
          borderColor: '#4BC0C0',
        },
      ],
    };
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className='w-full flex flex-col'>
      <h1>Pin Status Time Series Chart</h1>
      <h2>Digital Pins</h2>
      <Line data={prepareDigitalChartData(digitalStatusHistory)} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 1 }, x: { type: 'category' } } }} />
      <h2>Analog Pins</h2>
      <Line data={prepareAnalogChartData(analogStatusHistory)} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 4095 }, x: { type: 'category' } } }} />
      <h2>Soil Moisture</h2>
      <Line data={prepareSoilMoistureChartData()} options={{ responsive: true, scales: { y: { beginAtZero: true, max: 4095 }, x: { type: 'category' } } }} />

      <h2>Pin Control</h2>
      {Object.keys(digitalStatusHistory).map((pin) => (
        <div key={pin} className="flex items-center my-2">
          <span>{pin}</span>
          <button
            onClick={() => togglePin(pin.replace('Digital Pin ', ''), true)}
            className="ml-2 px-4 py-2 bg-green-500 text-white rounded"
          >
            On
          </button>
          <button
            onClick={() => togglePin(pin.replace('Digital Pin ', ''), false)}
            className="ml-2 px-4 py-2 bg-red-500 text-white rounded"
          >
            Off
          </button>
        </div>
      ))}
    </div>
  );
};

export default PinStatusTimeSeriesChart;
