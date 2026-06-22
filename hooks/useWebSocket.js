import { useState, useEffect, useRef } from 'react';

export default function useWebSocket(url) {
  const [sensorData, setSensorData] = useState({ suhu: 0, kelembaban: 0, status: 'disconnected' });
  const [wsStatus, setWsStatus] = useState('Menghubungkan...');
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(url);
    ws.current.onopen = () => setWsStatus('Terhubung ✅');
    ws.current.onmessage = (e) => {
      const data = JSON.parse(e.data);
      setSensorData({ suhu: data.suhu, kelembaban: data.kelembaban, status: 'connected' });
    };
    ws.current.onclose = () => setWsStatus('Terputus 🔴');
    return () => ws.current?.close();
  }, [url]);

  return { sensorData, wsStatus };
}