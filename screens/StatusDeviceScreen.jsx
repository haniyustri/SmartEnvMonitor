import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import useWebSocket from '../hooks/useWebSocket';
import { fetchDashboardLogs } from '../services/firebaseService';

const WS_URL = 'ws://10.98.160.155:81';

export default function StatusDeviceScreen() {
  // 1. Ambil data suhu & kelembaban asli dari ESP32
  const { sensorData } = useWebSocket(WS_URL);
  
  const [alarmLog, setAlarmLog] = useState([]);
  const [loading, setLoading] = useState(true);

  // 2. Ambil riwayat alarm asli dari database Firebase
  useEffect(() => {
    const loadLogs = async () => {
      const logs = await fetchDashboardLogs(6); // Ambil 6 data terakhir
      const formatted = logs.map((log) => ({
        id: log.id,
        status: log.suhu > 32 ? 'Terlalu Panas' : log.suhu < 24 ? 'Terlalu Dingin' : 'Suhu Normal',
        color: log.suhu > 32 ? '#cc3333' : log.suhu < 24 ? '#38a0f5' : '#2d9e6b',
        temp: log.suhu,
        humid: log.kelembaban,
        time: log.waktu ? log.waktu.toDate().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '--:--',
        date: log.waktu ? log.waktu.toDate().toLocaleDateString('id-ID', { day: '2-digit', month: 'short' }) : '',
      }));
      setAlarmLog(formatted);
      setLoading(false);
    };
    loadLogs();
  }, [sensorData]); // Otomatis refresh log jika ada data baru

  // 3. LOGIKA ALARM LED (Berdasarkan Suhu ESP32)
  const getLEDStatus = () => {
    const temp = sensorData.suhu || 0;
    
    if (temp > 32) {
      return { led: 'Merah', color: '#cc3333', icon: '🔴', label: '🥵 Terlalu Panas' };
    } 
    if (temp < 24) {
      return { led: 'Biru', color: '#38a0f5', icon: '🔵', label: '🥶 Terlalu Dingin' };
    }
    return { led: 'Hijau', color: '#2d9e6b', icon: '🟢', label: '🌿 Kondisi Normal' };
  };

  const ledStatus = getLEDStatus();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* Status LED Sekarang */}
      <View style={[styles.ledCard, { borderColor: ledStatus.color }]}>
        <Text style={styles.ledTitle}>💡 Status LED Sekarang</Text>
        <View style={styles.ledIndicatorRow}>
          {/* LED Merah */}
          <View style={styles.ledItem}>
            <View style={[
              styles.ledCircle,
              { backgroundColor: ledStatus.led === 'Merah' ? '#cc3333' : '#f5c6c6' }
            ]}>
              <Text style={styles.ledCircleText}>M</Text>
            </View>
            <Text style={styles.ledItemLabel}>LED Merah</Text>
            <Text style={[styles.ledItemStatus, { color: ledStatus.led === 'Merah' ? '#cc3333' : '#94a3b8' }]}>
              {ledStatus.led === 'Merah' ? '● NYALA' : '○ MATI'}
            </Text>
          </View>

          {/* LED Hijau */}
          <View style={styles.ledItem}>
            <View style={[
              styles.ledCircle,
              { backgroundColor: ledStatus.led === 'Hijau' ? '#2d9e6b' : '#c8e6d4' }
            ]}>
              <Text style={styles.ledCircleText}>H</Text>
            </View>
            <Text style={styles.ledItemLabel}>LED Hijau</Text>
            <Text style={[styles.ledItemStatus, { color: ledStatus.led === 'Hijau' ? '#2d9e6b' : '#94a3b8' }]}>
              {ledStatus.led === 'Hijau' ? '● NYALA' : '○ MATI'}
            </Text>
          </View>

          {/* LED Biru */}
          <View style={styles.ledItem}>
            <View style={[
              styles.ledCircle,
              { backgroundColor: ledStatus.led === 'Biru' ? '#38a0f5' : '#c8dff5' }
            ]}>
              <Text style={styles.ledCircleText}>B</Text>
            </View>
            <Text style={styles.ledItemLabel}>LED Biru</Text>
            <Text style={[styles.ledItemStatus, { color: ledStatus.led === 'Biru' ? '#38a0f5' : '#94a3b8' }]}>
              {ledStatus.led === 'Biru' ? '● NYALA' : '○ MATI'}
            </Text>
          </View>
        </View>

        {/* Kondisi */}
        <View style={[styles.conditionBadge, { backgroundColor: ledStatus.color + '22' }]}>
          <Text style={[styles.conditionText, { color: ledStatus.color }]}>
            {ledStatus.label}
          </Text>
        </View>
      </View>

      {/* Data Sensor Saat Ini */}
      <View style={styles.sensorRow}>
        <View style={styles.sensorCard}>
          <Text style={styles.sensorIcon}>🌡️</Text>
          <Text style={styles.sensorLabel}>Suhu</Text>
          <Text style={[styles.sensorValue, { color: '#e8805a' }]}>{sensorData.suhu || 0}°C</Text>
        </View>
        <View style={styles.sensorCard}>
          <Text style={styles.sensorIcon}>💧</Text>
          <Text style={styles.sensorLabel}>Kelembaban</Text>
          <Text style={[styles.sensorValue, { color: '#2d9e6b' }]}>{sensorData.kelembaban || 0}%</Text>
        </View>
      </View>

      {/* Threshold Info */}
      <View style={styles.thresholdCard}>
        <Text style={styles.thresholdTitle}>⚙️ Batas Kondisi</Text>
        <View style={styles.thresholdRow}>
          <View style={styles.thresholdItem}>
            <Text style={styles.thresholdIcon}>🔴</Text>
            <Text style={styles.thresholdLabel}>Panas</Text>
            <Text style={[styles.thresholdValue, { color: '#cc3333' }]}>{'>'}32°C</Text>
          </View>
          <View style={styles.thresholdDivider} />
          <View style={styles.thresholdItem}>
            <Text style={styles.thresholdIcon}>🟢</Text>
            <Text style={styles.thresholdLabel}>Normal</Text>
            <Text style={[styles.thresholdValue, { color: '#2d9e6b' }]}>24-32°C</Text>
          </View>
          <View style={styles.thresholdDivider} />
          <View style={styles.thresholdItem}>
            <Text style={styles.thresholdIcon}>🔵</Text>
            <Text style={styles.thresholdLabel}>Dingin</Text>
            <Text style={[styles.thresholdValue, { color: '#38a0f5' }]}>{'<'}24°C</Text>
          </View>
        </View>
      </View>

      {/* Log Alarm */}
      <Text style={styles.sectionTitle}>🔔 Riwayat Alarm</Text>
      {loading ? (
        <ActivityIndicator color="#2d9e6b" style={{ marginTop: 10 }} />
      ) : (
        alarmLog.map((log) => (
          <View key={log.id} style={styles.logItem}>
            <View style={[styles.logDot, { backgroundColor: log.color }]} />
            <View style={styles.logContent}>
              <Text style={styles.logStatus}>{log.status}</Text>
              <Text style={styles.logTemp}>🌡️ {log.temp}°C · 💧 {log.humid}%</Text>
            </View>
            <View style={styles.logTime}>
              <Text style={styles.logTimeText}>{log.time}</Text>
              <Text style={styles.logDateText}>{log.date}</Text>
            </View>
          </View>
        ))
      )}

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

// ... styles tetap persis sama seperti desain Anda ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0faf4', padding: 16 },
  ledCard: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 12, borderWidth: 2, elevation: 3 },
  ledTitle: { fontSize: 14, fontWeight: 'bold', color: '#1a5c3a', marginBottom: 16 },
  ledIndicatorRow: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 16 },
  ledItem: { alignItems: 'center' },
  ledCircle: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginBottom: 8, elevation: 3 },
  ledCircleText: { color: '#ffffff', fontWeight: 'bold', fontSize: 20 },
  ledItemLabel: { fontSize: 12, color: '#6c8f7a', marginBottom: 4 },
  ledItemStatus: { fontSize: 11, fontWeight: 'bold' },
  conditionBadge: { borderRadius: 20, padding: 10, alignItems: 'center' },
  conditionText: { fontSize: 14, fontWeight: 'bold' },
  sensorRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  sensorCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 14, padding: 14, alignItems: 'center', marginHorizontal: 4, elevation: 3 },
  sensorIcon: { fontSize: 24, marginBottom: 6 },
  sensorLabel: { fontSize: 12, color: '#6c8f7a', marginBottom: 4 },
  sensorValue: { fontSize: 22, fontWeight: 'bold' },
  thresholdCard: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, marginBottom: 16, elevation: 3 },
  thresholdTitle: { fontSize: 13, fontWeight: 'bold', color: '#1a5c3a', marginBottom: 12 },
  thresholdRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center' },
  thresholdItem: { alignItems: 'center', flex: 1 },
  thresholdIcon: { fontSize: 20, marginBottom: 4 },
  thresholdLabel: { fontSize: 11, color: '#6c8f7a', marginBottom: 4 },
  thresholdValue: { fontSize: 13, fontWeight: 'bold' },
  thresholdDivider: { width: 1, height: 40, backgroundColor: '#e8f5ee' },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: '#2d5a3d', marginBottom: 10 },
  logItem: { backgroundColor: '#ffffff', borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  logDot: { width: 12, height: 12, borderRadius: 6, marginRight: 12 },
  logContent: { flex: 1 },
  logStatus: { fontSize: 13, fontWeight: 'bold', color: '#1a5c3a', marginBottom: 2 },
  logTemp: { fontSize: 11, color: '#6c8f7a' },
  logTime: { alignItems: 'flex-end' },
  logTimeText: { fontSize: 12, fontWeight: 'bold', color: '#2d5a3d' },
  logDateText: { fontSize: 10, color: '#94a3b8' },
});