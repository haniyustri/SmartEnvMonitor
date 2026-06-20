import { useState, useEffect, useRef } from 'react';

export default function useWebSocket(url) {
  const [sensorData, setSensorData] = useState({
    temperature: '--',
    humidity: '--',
    status: 'disconnected',
  });
  const [wsStatus, setWsStatus] = useState('Menghubungkan...');
  const ws = useRef(null);

  const connect = () => {
    ws.current = new WebSocket(url);

    ws.current.onopen = () => {
      setWsStatus('Terhubung ✅');
    };

    ws.current.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        setSensorData({
          temperature: data.temperature,
          humidity: data.humidity,
          status: 'connected',
        });
      } catch (e) {
        console.log('Error parsing data:', e);
      }
    };

    ws.current.onerror = () => {
      setWsStatus('Error koneksi ❌');
    };

    ws.current.onclose = () => {
      setWsStatus('Terputus 🔴');
      setSensorData(prev => ({ ...prev, status: 'disconnected' }));
      // Auto reconnect setelah 3 detik
      setTimeout(() => connect(), 3000);
    };
  };

  useEffect(() => {
    connect();
    return () => {
      if (ws.current) ws.current.close();
    };
  }, [url]);

  return { sensorData, wsStatus };
}