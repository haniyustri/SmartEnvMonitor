import { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import SensorCard from '../components/SensorCard';
import WeatherCard from '../components/WeatherCard';
import SensorChart from '../components/SensorChart';
import useWebSocket from '../hooks/useWebSocket';

const WS_URL = 'ws://192.168.1.100:81';

// Generate dummy data awal
const generateDummy = (base, range) =>
  Array.from({ length: 8 }, () =>
    parseFloat((base + (Math.random() * range - range / 2)).toFixed(1))
  );

export default function DashboardScreen({ navigation }) {
  const { sensorData, wsStatus } = useWebSocket(WS_URL);

  const [tempHistory, setTempHistory] = useState(generateDummy(28.5, 3));
  const [humidHistory, setHumidHistory] = useState(generateDummy(65, 10));
  const [lastUpdated, setLastUpdated] = useState('--:--:--');

  // Simulasi data bergerak tiap 5 detik
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

  const getCondition = () => {
    if (currentTemp > 32) return { label: '🥵 Terlalu Panas', color: '#e8805a' };
    if (currentTemp < 24) return { label: '🥶 Terlalu Dingin', color: '#38a0f5' };
    if (currentHumid > 80) return { label: '💦 Terlalu Lembab', color: '#2d9e6b' };
    if (currentHumid < 40) return { label: '🌵 Terlalu Kering', color: '#e8c05a' };
    return { label: '🌿 Kondisi Normal', color: '#2d9e6b' };
  };

  const condition = getCondition();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
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

      {/* Kondisi & Last Updated */}
      <View style={styles.conditionRow}>
        <View style={[styles.conditionBadge, { backgroundColor: condition.color + '22' }]}>
          <Text style={[styles.conditionText, { color: condition.color }]}>
            {condition.label}
          </Text>
        </View>
        <Text style={styles.lastUpdated}>🕐 {lastUpdated}</Text>
      </View>

      {/* Sensor Cards */}
      <Text style={styles.sectionTitle}>📡 Data Sensor (ESP32)</Text>
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

      {/* Cuaca Luar */}
      <Text style={styles.sectionTitle}>🌤️ Cuaca Luar (Surabaya)</Text>
      <WeatherCard />

      {/* Menu */}
      <Text style={styles.sectionTitle}>🔗 Menu</Text>
      <View style={styles.menuGrid}>
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('History')}
        >
          <Text style={styles.menuIcon}>📋</Text>
          <Text style={styles.menuLabel}>Riwayat Data</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.menuCard}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.menuIcon}>👤</Text>
          <Text style={styles.menuLabel}>Profil Saya</Text>
        </TouchableOpacity>
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
  header: {
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
  conditionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  conditionBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  conditionText: {
    fontSize: 13,
    fontWeight: 'bold',
  },
  lastUpdated: {
    fontSize: 12,
    color: '#6c8f7a',
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
  menuGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  menuCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginHorizontal: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  menuIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  menuLabel: {
    color: '#2d5a3d',
    fontWeight: '600',
    fontSize: 13,
  },
});