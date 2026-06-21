import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SensorChart from '../components/SensorChart';
import useWebSocket from '../hooks/useWebSocket';

const WS_URL = 'ws://192.168.1.100:81';

const generateDummy = (base, range) =>
  Array.from({ length: 8 }, () =>
    parseFloat((base + (Math.random() * range - range / 2)).toFixed(1))
  );

export default function SensorDataScreen() {
  const { sensorData, wsStatus } = useWebSocket(WS_URL);

  const [tempHistory, setTempHistory] = useState(generateDummy(28.5, 3));
  const [humidHistory, setHumidHistory] = useState(generateDummy(65, 10));
  const [lastUpdated, setLastUpdated] = useState('--:--:--');

  useEffect(() => {
    const now = new Date();
    setLastUpdated(now.toLocaleTimeString('id-ID'));

    const interval = setInterval(() => {
      const now = new Date();
      setLastUpdated(now.toLocaleTimeString('id-ID'));

      setTempHistory(prev => {
        const last = prev[prev.length - 1];
        const newVal = parseFloat((last + (Math.random() * 0.6 - 0.3)).toFixed(1));
        return [...prev.slice(1), newVal];
      });

      setHumidHistory(prev => {
        const last = prev[prev.length - 1];
        const newVal = parseFloat((last + (Math.random() * 1.5 - 0.75)).toFixed(1));
        return [...prev.slice(1), newVal];
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const currentTemp = tempHistory[tempHistory.length - 1];
  const currentHumid = humidHistory[humidHistory.length - 1];
  const maxTemp = Math.max(...tempHistory).toFixed(1);
  const minTemp = Math.min(...tempHistory).toFixed(1);
  const avgTemp = (tempHistory.reduce((a, b) => a + b, 0) / tempHistory.length).toFixed(1);
  const maxHumid = Math.max(...humidHistory).toFixed(1);
  const minHumid = Math.min(...humidHistory).toFixed(1);
  const avgHumid = (humidHistory.reduce((a, b) => a + b, 0) / humidHistory.length).toFixed(1);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Status Koneksi */}
      <View style={styles.connectionCard}>
        <View style={styles.connectionLeft}>
          <Text style={styles.connectionTitle}>📡 ESP32 + DHT22</Text>
          <Text style={styles.connectionSub}>WebSocket · {WS_URL}</Text>
          <Text style={styles.connectionSub}>🕐 Update: {lastUpdated}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: sensorData.status === 'connected' ? '#d4f5e2' : '#ffe0e0' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: sensorData.status === 'connected' ? '#1a7a45' : '#cc3333' }
          ]}>
            {wsStatus}
          </Text>
        </View>
      </View>

      {/* Nilai Realtime Besar */}
      <View style={styles.realtimeRow}>
        <View style={[styles.realtimeCard, { borderColor: '#e8805a' }]}>
          <Text style={styles.realtimeIcon}>🌡️</Text>
          <Text style={styles.realtimeLabel}>Suhu</Text>
          <Text style={[styles.realtimeValue, { color: '#e8805a' }]}>{currentTemp}</Text>
          <Text style={[styles.realtimeUnit, { color: '#e8805a' }]}>°C</Text>
        </View>
        <View style={[styles.realtimeCard, { borderColor: '#2d9e6b' }]}>
          <Text style={styles.realtimeIcon}>💧</Text>
          <Text style={styles.realtimeLabel}>Kelembaban</Text>
          <Text style={[styles.realtimeValue, { color: '#2d9e6b' }]}>{currentHumid}</Text>
          <Text style={[styles.realtimeUnit, { color: '#2d9e6b' }]}>%</Text>
        </View>
      </View>

      {/* Statistik Suhu */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Statistik Suhu (Sesi Ini)</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Tertinggi</Text>
            <Text style={[styles.statsValue, { color: '#cc3333' }]}>{maxTemp}°C</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Rata-rata</Text>
            <Text style={[styles.statsValue, { color: '#e8805a' }]}>{avgTemp}°C</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Terendah</Text>
            <Text style={[styles.statsValue, { color: '#38a0f5' }]}>{minTemp}°C</Text>
          </View>
        </View>
      </View>

      {/* Statistik Kelembaban */}
      <View style={styles.statsCard}>
        <Text style={styles.statsTitle}>📊 Statistik Kelembaban (Sesi Ini)</Text>
        <View style={styles.statsRow}>
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Tertinggi</Text>
            <Text style={[styles.statsValue, { color: '#2d9e6b' }]}>{maxHumid}%</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Rata-rata</Text>
            <Text style={[styles.statsValue, { color: '#2d9e6b' }]}>{avgHumid}%</Text>
          </View>
          <View style={styles.statsDivider} />
          <View style={styles.statsItem}>
            <Text style={styles.statsLabel}>Terendah</Text>
            <Text style={[styles.statsValue, { color: '#38a0f5' }]}>{minHumid}%</Text>
          </View>
        </View>
      </View>

      {/* Grafik */}
      <Text style={styles.sectionTitle}>📈 Grafik Realtime</Text>
      <SensorChart
        data={tempHistory}
        label="🌡️ Suhu"
        color="#e8805a"
        unit="°C"
      />
      <SensorChart
        data={humidHistory}
        label="💧 Kelembaban"
        color="#2d9e6b"
        unit="%"
      />

      {/* Info Sensor */}
      <View style={styles.infoCard}>
        <Text style={styles.infoTitle}>ℹ️ Informasi Sensor</Text>
        {[
          { label: 'Tipe Sensor', value: 'DHT22' },
          { label: 'Mikrokontroler', value: 'ESP32' },
          { label: 'Protokol', value: 'WebSocket (WiFi)' },
          { label: 'Interval Kirim', value: 'Setiap 5 detik' },
          { label: 'Format Data', value: 'JSON String' },
          { label: 'Range Suhu', value: '-40°C ~ 80°C' },
          { label: 'Range Kelembaban', value: '0% ~ 100%' },
        ].map((item, index, arr) => (
          <View key={index}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
            {index < arr.length - 1 && <View style={styles.infoDivider} />}
          </View>
        ))}
      </View>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0faf4',
    padding: 16,
  },
  connectionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  connectionLeft: {
    flex: 1,
  },
  connectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a5c3a',
    marginBottom: 2,
  },
  connectionSub: {
    fontSize: 10,
    color: '#94a3b8',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  realtimeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  realtimeCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    marginHorizontal: 4,
    borderWidth: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  realtimeIcon: {
    fontSize: 30,
    marginBottom: 6,
  },
  realtimeLabel: {
    fontSize: 12,
    color: '#6c8f7a',
    marginBottom: 8,
  },
  realtimeValue: {
    fontSize: 42,
    fontWeight: 'bold',
  },
  realtimeUnit: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1a5c3a',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statsItem: {
    alignItems: 'center',
    flex: 1,
  },
  statsLabel: {
    fontSize: 11,
    color: '#6c8f7a',
    marginBottom: 4,
  },
  statsValue: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e8f5ee',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d5a3d',
    marginBottom: 10,
  },
  infoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1a5c3a',
    marginBottom: 12,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  infoLabel: {
    fontSize: 13,
    color: '#6c8f7a',
  },
  infoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1a5c3a',
  },
  infoDivider: {
    height: 1,
    backgroundColor: '#f0faf4',
  },
});