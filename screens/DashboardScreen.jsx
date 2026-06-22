import { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import SensorCard from '../components/SensorCard';
import WeatherCard from '../components/WeatherCard';
import useWebSocket from '../hooks/useWebSocket';

const WS_URL = 'ws://10.98.160.155:81';

export default function DashboardScreen() {
  const { sensorData, wsStatus } = useWebSocket(WS_URL);
  
  // Menggunakan data asli dari WebSocket, bukan lagi dummy
  const currentTemp = sensorData.suhu || 0;
  const currentHumid = sensorData.kelembaban || 0;
  
  const [lastUpdated, setLastUpdated] = useState('--:--:--');

  // Update waktu setiap kali ada data baru dari ESP32
  useEffect(() => {
    if (sensorData.suhu) {
      setLastUpdated(new Date().toLocaleTimeString('id-ID'));
    }
  }, [sensorData]);

  const getCondition = () => {
    if (currentTemp > 32) return { label: '🥵 Terlalu Panas', color: '#e8805a', bg: '#fff5f0' };
    if (currentTemp < 24) return { label: '🥶 Terlalu Dingin', color: '#38a0f5', bg: '#f0f8ff' };
    if (currentHumid > 80) return { label: '💦 Terlalu Lembab', color: '#2d9e6b', bg: '#f0faf4' };
    if (currentHumid < 40) return { label: '🌵 Terlalu Kering', color: '#e8c05a', bg: '#fffbf0' };
    return { label: '🌿 Kondisi Normal', color: '#2d9e6b', bg: '#f0faf4' };
  };

  const condition = getCondition();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Header Card (Tidak ada perubahan bentuk) */}
      <View style={styles.headerCard}>
        <View>
          <Text style={styles.greeting}>Halo, Hani 👋</Text>
          <Text style={styles.headerSub}>Monitor lingkunganmu hari ini</Text>
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

      {/* Kondisi Lingkungan (Data asli) */}
      <View style={[styles.conditionCard, { backgroundColor: condition.bg, borderColor: condition.color }]}>
        <Text style={[styles.conditionLabel, { color: condition.color }]}>{condition.label}</Text>
        <Text style={styles.conditionTime}>Diperbarui: {lastUpdated}</Text>
      </View>

      {/* Sensor Cards (Data asli) */}
      <Text style={styles.sectionTitle}>📡 Data Sensor ESP32</Text>
      <View style={styles.cardRow}>
        <SensorCard
          icon="🌡️"
          label="Suhu"
          value={String(currentTemp)}
          unit="°C"
          color="#e8805a"
          bg="#fff5f0"
        />
        <SensorCard
          icon="💧"
          label="Kelembaban"
          value={String(currentHumid)}
          unit="%"
          color="#2d9e6b"
          bg="#f0faf4"
        />
      </View>

      {/* Quick Stats (Data asli) */}
      <View style={styles.quickStatsCard}>
        <Text style={styles.quickStatsTitle}>⚡ Ringkasan Hari Ini</Text>
        <View style={styles.quickStatsRow}>
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatIcon}>🌡️</Text>
            <Text style={styles.quickStatLabel}>Suhu Sekarang</Text>
            <Text style={[styles.quickStatValue, { color: '#e8805a' }]}>{currentTemp}°C</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatIcon}>💧</Text>
            <Text style={styles.quickStatLabel}>Kelembaban</Text>
            <Text style={[styles.quickStatValue, { color: '#2d9e6b' }]}>{currentHumid}%</Text>
          </View>
          <View style={styles.quickStatDivider} />
          <View style={styles.quickStatItem}>
            <Text style={styles.quickStatIcon}>📡</Text>
            <Text style={styles.quickStatLabel}>Status</Text>
            <Text style={[styles.quickStatValue, { color: sensorData.status === 'connected' ? '#2d9e6b' : '#cc3333', fontSize: 11 }]}>
              {sensorData.status === 'connected' ? 'Online' : 'Offline'}
            </Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>🌤️ Cuaca Luar (Surabaya)</Text>
      <WeatherCard />

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}
// (Styles tetap sama seperti milik Anda sebelumnya)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0faf4',
    padding: 16,
  },
  headerCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    marginTop: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  greeting: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a5c3a',
  },
  headerSub: {
    fontSize: 12,
    color: '#6c8f7a',
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
  conditionCard: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 16,
    borderWidth: 1.5,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conditionLabel: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  conditionTime: {
    fontSize: 11,
    color: '#94a3b8',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#2d5a3d',
    marginBottom: 10,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  quickStatsCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  quickStatsTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1a5c3a',
    marginBottom: 12,
  },
  quickStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  quickStatItem: {
    alignItems: 'center',
    flex: 1,
  },
  quickStatIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  quickStatLabel: {
    fontSize: 10,
    color: '#6c8f7a',
    marginBottom: 4,
    textAlign: 'center',
  },
  quickStatValue: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  quickStatDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e8f5ee',
  },
});