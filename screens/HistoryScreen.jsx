import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ScrollView, ActivityIndicator,
  RefreshControl // 1. Tambahkan import RefreshControl
} from 'react-native';
import { fetchLogsByDate } from '../services/firebaseService';

const days = [
  { dayNum: 1, label: 'Sen', date: '2026-06-16', shortDate: '16 Jun' },
  { dayNum: 2, label: 'Sel', date: '2026-06-17', shortDate: '17 Jun' },
  { dayNum: 3, label: 'Rab', date: '2026-06-18', shortDate: '18 Jun' },
  { dayNum: 4, label: 'Kam', date: '2026-06-19', shortDate: '19 Jun' },
  { dayNum: 5, label: 'Jum', date: '2026-06-20', shortDate: '20 Jun' },
  { dayNum: 6, label: 'Sab', date: '2026-06-21', shortDate: '21 Jun' },
  { dayNum: 7, label: 'Min', date: '2026-06-22', shortDate: '22 Jun' },
];

export default function HistoryScreen() {
  const [selectedDay, setSelectedDay] = useState(days[days.length - 1]);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false); // 2. State untuk animasi refresh

  // Pisahkan logika ambil data agar bisa dipanggil ulang saat di-refresh
  const fetchRiwayatData = async (isRefreshing = false) => {
    if (!isRefreshing) setLoading(true); // Tampilkan loading besar cuma di awal
    
    const data = await fetchLogsByDate(selectedDay.date);
    
    if (data && data.length > 0) {
      const formatted = data.map(item => {
        const dateObj = item.waktu ? item.waktu.toDate() : new Date();
        return {
          id: item.id,
          hour: dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
          temperature: parseFloat(item.suhu).toFixed(1),
          humidity: parseFloat(item.kelembaban).toFixed(1),
        };
      });
      setHistoryData(formatted);
    } else {
      setHistoryData([]);
    }
    
    if (!isRefreshing) setLoading(false);
  };

  // Panggil data pertama kali dan saat tanggal berubah
  useEffect(() => {
    fetchRiwayatData(false);
  }, [selectedDay]);

  // 3. Fungsi ketika layar ditarik ke bawah
  const onRefresh = useCallback(async () => {
    setRefreshing(true); // Munculkan spinner refresh
    await fetchRiwayatData(true); // Ambil data lagi
    setRefreshing(false); // Matikan spinner refresh
  }, [selectedDay]);

  const avgTemp = historyData.length > 0 ? (historyData.reduce((a, b) => a + parseFloat(b.temperature), 0) / historyData.length).toFixed(1) : '--';
  const avgHumid = historyData.length > 0 ? (historyData.reduce((a, b) => a + parseFloat(b.humidity), 0) / historyData.length).toFixed(1) : '--';
  const maxTemp = historyData.length > 0 ? Math.max(...historyData.map(d => parseFloat(d.temperature))).toFixed(1) : '--';
  const minTemp = historyData.length > 0 ? Math.min(...historyData.map(d => parseFloat(d.temperature))).toFixed(1) : '--';

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.timeCol}>
        <Text style={styles.time}>{item.hour}</Text>
      </View>
      <View style={styles.dividerCol} />
      <View style={styles.dataCol}>
        <View style={styles.dataChip}>
          <Text style={styles.chipIcon}>🌡️</Text>
          <Text style={styles.chipValue}>{item.temperature}°C</Text>
        </View>
        <View style={[styles.dataChip, { backgroundColor: '#f0faf4' }]}>
          <Text style={styles.chipIcon}>💧</Text>
          <Text style={[styles.chipValue, { color: '#2d9e6b' }]}>{item.humidity}%</Text>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.daySelector}
        contentContainerStyle={styles.daySelectorContent}
      >
        {days.map((day) => (
          <TouchableOpacity
            key={day.date}
            style={[
              styles.dayBtn,
              selectedDay.date === day.date && styles.dayBtnActive
            ]}
            onPress={() => setSelectedDay(day)}
          >
            <Text style={[
              styles.dayBtnNum,
              selectedDay.date === day.date && styles.dayBtnTextActive
            ]}>
              Hari ke-{day.dayNum}
            </Text>
            <Text style={[
              styles.dayBtnLabel,
              selectedDay.date === day.date && styles.dayBtnTextActive
            ]}>
              {day.label}, {day.shortDate}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          📊 Hari ke-{selectedDay.dayNum} — {selectedDay.label}, {selectedDay.shortDate}
        </Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Rata-rata Suhu</Text>
            <Text style={[styles.summaryValue, { color: '#e8805a' }]}>{avgTemp}°C</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Rata-rata Lembab</Text>
            <Text style={[styles.summaryValue, { color: '#ffffff' }]}>{avgHumid}%</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Suhu Max</Text>
            <Text style={[styles.summaryValue, { color: '#ffcccc' }]}>{maxTemp}°C</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Suhu Min</Text>
            <Text style={[styles.summaryValue, { color: '#c8f0ff' }]}>{minTemp}°C</Text>
          </View>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2d9e6b" style={{ marginTop: 20 }} />
      ) : historyData.length === 0 ? (
        <ScrollView 
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center' }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={["#2d9e6b"]} />
          }
        >
          <Text style={{ textAlign: 'center', marginTop: 20, color: '#6c8f7a' }}>
            Belum ada data sensor pada tanggal ini. Tarik ke bawah untuk refresh.
          </Text>
        </ScrollView>
      ) : (
        <FlatList
          data={historyData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          // 4. Tambahkan RefreshControl di sini
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh} 
              colors={["#2d9e6b"]} // Warna spinner refresh
            />
          }
        />
      )}
    </View>
  );
}

// ... styles tetap persis sama ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0faf4', padding: 16 },
  daySelector: { marginBottom: 12, marginTop: 4, minHeight: 70 },
  daySelectorContent: { paddingRight: 8 },
  dayBtn: { backgroundColor: '#ffffff', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 10, marginRight: 8, alignItems: 'center', minWidth: 90, elevation: 2 },
  dayBtnActive: { backgroundColor: '#2d9e6b' },
  dayBtnNum: { fontSize: 12, fontWeight: 'bold', color: '#2d5a3d', marginBottom: 2 },
  dayBtnLabel: { fontSize: 10, color: '#94a3b8' },
  dayBtnTextActive: { color: '#ffffff' },
  summaryCard: { backgroundColor: '#2d9e6b', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 4 },
  summaryTitle: { color: '#ffffff', fontSize: 13, fontWeight: 'bold', marginBottom: 12 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between' },
  summaryItem: { alignItems: 'center', flex: 1, backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: 8, marginHorizontal: 2 },
  summaryLabel: { color: '#c8f0dc', fontSize: 9, textAlign: 'center', marginBottom: 4 },
  summaryValue: { fontSize: 14, fontWeight: 'bold' },
  item: { backgroundColor: '#ffffff', borderRadius: 12, padding: 12, marginBottom: 6, flexDirection: 'row', alignItems: 'center', elevation: 2 },
  timeCol: { width: 50, alignItems: 'center' },
  time: { fontSize: 13, fontWeight: 'bold', color: '#1a5c3a' },
  dividerCol: { width: 1, height: 30, backgroundColor: '#e8f5ee', marginHorizontal: 12 },
  dataCol: { flex: 1, flexDirection: 'row', justifyContent: 'space-around' },
  dataChip: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff5f0', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  chipIcon: { fontSize: 14, marginRight: 4 },
  chipValue: { fontSize: 13, fontWeight: 'bold', color: '#e8805a' },
});