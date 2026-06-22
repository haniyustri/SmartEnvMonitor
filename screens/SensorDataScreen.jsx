import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SensorChart from '../components/SensorChart';
import useWebSocket from '../hooks/useWebSocket';
import { saveSensorData } from '../services/firebaseService';

const WS_URL = 'ws://10.98.160.155:81';

export default function SensorDataScreen() {
  const { sensorData, wsStatus } = useWebSocket(WS_URL);

  // Inisialisasi history dengan angka 0
  const [tempHistory, setTempHistory] = useState(Array(8).fill(0));
  const [humidHistory, setHumidHistory] = useState(Array(8).fill(0));

  // Efek ini berjalan KETIKA data dari ESP32 masuk
  useEffect(() => {
    if (sensorData.suhu && sensorData.suhu !== 0) {
      // Update History
      setTempHistory(prev => [...prev.slice(1), sensorData.suhu]);
      setHumidHistory(prev => [...prev.slice(1), sensorData.kelembaban]);

      // Simpan ke Firebase (opsional)
      saveSensorData({
        suhu: sensorData.suhu,
        kelembaban: sensorData.kelembaban,
        kondisi: 'normal',
        statusKoneksi: wsStatus
      }).catch(err => console.error("Firebase Error:", err));
    }
  }, [sensorData]); // <--- Inilah kunci "real-time" nya

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.connectionCard}>
        <View>
          <Text style={styles.connectionTitle}>📡 ESP32 Monitoring</Text>
          <Text style={styles.connectionSub}>WebSocket · {WS_URL}</Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: sensorData.status === 'connected' ? '#d4f5e2' : '#ffe0e0' }]}>
          <Text style={[styles.statusText, { color: sensorData.status === 'connected' ? '#1a7a45' : '#cc3333' }]}>
            {wsStatus}
          </Text>
        </View>
      </View>

      <View style={styles.realtimeRow}>
        <View style={[styles.realtimeCard, { borderColor: '#e8805a' }]}>
          <Text style={styles.realtimeIcon}>🌡️</Text>
          <Text style={styles.realtimeLabel}>Suhu</Text>
          <Text style={[styles.realtimeValue, { color: '#e8805a' }]}>{sensorData.suhu}°C</Text>
        </View>
        <View style={[styles.realtimeCard, { borderColor: '#2d9e6b' }]}>
          <Text style={styles.realtimeIcon}>💧</Text>
          <Text style={styles.realtimeLabel}>Kelembaban</Text>
          <Text style={[styles.realtimeValue, { color: '#2d9e6b' }]}>{sensorData.kelembaban}%</Text>
        </View>
      </View>

      <Text style={styles.sectionTitle}>📈 Grafik Realtime</Text>
      <SensorChart data={tempHistory} label="🌡️ Suhu" color="#e8805a" unit="°C" />
      <SensorChart data={humidHistory} label="💧 Kelembaban" color="#2d9e6b" unit="%" />
    </ScrollView>
  );
}
// (Styles tetap sama seperti milik Anda)

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0faf4', padding: 16 },
  connectionCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', elevation: 3 },
  realtimeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  realtimeCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 16, padding: 16, alignItems: 'center', marginHorizontal: 4, borderWidth: 2, elevation: 3 },
  realtimeValue: { fontSize: 42, fontWeight: 'bold' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#2d5a3d', marginBottom: 10 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: 'bold' },
  connectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#1a5c3a' },
  connectionSub: { fontSize: 10, color: '#94a3b8' },
  realtimeIcon: { fontSize: 30, marginBottom: 6 },
  realtimeLabel: { fontSize: 12, color: '#6c8f7a', marginBottom: 8 }
});