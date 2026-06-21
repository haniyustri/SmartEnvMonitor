import { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, ScrollView
} from 'react-native';

const generateHourlyData = (baseTemp, baseHumid, date) => {
  const data = [];
  for (let hour = 0; hour < 24; hour++) {
    const tempVariation = Math.sin(hour / 24 * Math.PI * 2) * 3;
    const humidVariation = Math.cos(hour / 24 * Math.PI * 2) * 8;
    data.push({
      id: `${date}-${hour}`,
      hour: `${String(hour).padStart(2, '0')}:00`,
      temperature: parseFloat((baseTemp + tempVariation + (Math.random() * 0.5)).toFixed(1)),
      humidity: parseFloat((baseHumid + humidVariation + (Math.random() * 1)).toFixed(1)),
    });
  }
  return data;
};

const days = [
  { label: 'Senin', date: '2026-06-16', baseTemp: 28.5, baseHumid: 65 },
  { label: 'Selasa', date: '2026-06-17', baseTemp: 29.1, baseHumid: 63 },
  { label: 'Rabu', date: '2026-06-18', baseTemp: 27.8, baseHumid: 67 },
  { label: 'Kamis', date: '2026-06-19', baseTemp: 30.2, baseHumid: 61 },
  { label: 'Jumat', date: '2026-06-20', baseTemp: 28.9, baseHumid: 64 },
  { label: 'Sabtu', date: '2026-06-21', baseTemp: 27.5, baseHumid: 68 },
];

export default function HistoryScreen() {
  const [selectedDay, setSelectedDay] = useState(days[days.length - 1]);
  const historyData = generateHourlyData(
    selectedDay.baseTemp,
    selectedDay.baseHumid,
    selectedDay.date
  );

  const avgTemp = (historyData.reduce((a, b) => a + b.temperature, 0) / historyData.length).toFixed(1);
  const avgHumid = (historyData.reduce((a, b) => a + b.humidity, 0) / historyData.length).toFixed(1);
  const maxTemp = Math.max(...historyData.map(d => d.temperature)).toFixed(1);
  const minTemp = Math.min(...historyData.map(d => d.temperature)).toFixed(1);

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
      {/* Pilih Hari */}
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
              styles.dayBtnText,
              selectedDay.date === day.date && styles.dayBtnTextActive
            ]}>
              {day.label}
            </Text>
            <Text style={[
              styles.dayBtnDate,
              selectedDay.date === day.date && { color: '#fff' }
            ]}>
              {day.date.slice(8)}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Summary Card */}
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>
          📊 Ringkasan {selectedDay.label}, {selectedDay.date}
        </Text>
        <View style={styles.summaryRow}>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Rata-rata Suhu</Text>
            <Text style={[styles.summaryValue, { color: '#e8805a' }]}>{avgTemp}°C</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Rata-rata Lembab</Text>
            <Text style={[styles.summaryValue, { color: '#2d9e6b' }]}>{avgHumid}%</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Suhu Max</Text>
            <Text style={[styles.summaryValue, { color: '#cc3333' }]}>{maxTemp}°C</Text>
          </View>
          <View style={styles.summaryItem}>
            <Text style={styles.summaryLabel}>Suhu Min</Text>
            <Text style={[styles.summaryValue, { color: '#38a0f5' }]}>{minTemp}°C</Text>
          </View>
        </View>
      </View>

      {/* List per jam */}
      <FlatList
        data={historyData}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0faf4',
    padding: 16,
  },
  daySelector: {
    marginBottom: 12,
    marginTop: 4,
    minHeight: 70,
  },
  daySelectorContent: {
    paddingRight: 8,
  },
  dayBtn: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginRight: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayBtnActive: {
    backgroundColor: '#2d9e6b',
  },
  dayBtnText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2d5a3d',
  },
  dayBtnTextActive: {
    color: '#ffffff',
  },
  dayBtnDate: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  summaryCard: {
    backgroundColor: '#2d9e6b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#2d9e6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 10,
    padding: 8,
    marginHorizontal: 2,
  },
  summaryLabel: {
    color: '#c8f0dc',
    fontSize: 9,
    textAlign: 'center',
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  timeCol: {
    width: 50,
    alignItems: 'center',
  },
  time: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#1a5c3a',
  },
  dividerCol: {
    width: 1,
    height: 30,
    backgroundColor: '#e8f5ee',
    marginHorizontal: 12,
  },
  dataCol: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dataChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff5f0',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipIcon: {
    fontSize: 14,
    marginRight: 4,
  },
  chipValue: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#e8805a',
  },
});