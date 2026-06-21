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
  { dayNum: 1, label: 'Sen', date: '2026-06-16', shortDate: '16 Jun', baseTemp: 28.5, baseHumid: 65 },
  { dayNum: 2, label: 'Sel', date: '2026-06-17', shortDate: '17 Jun', baseTemp: 29.1, baseHumid: 63 },
  { dayNum: 3, label: 'Rab', date: '2026-06-18', shortDate: '18 Jun', baseTemp: 27.8, baseHumid: 67 },
  { dayNum: 4, label: 'Kam', date: '2026-06-19', shortDate: '19 Jun', baseTemp: 30.2, baseHumid: 61 },
  { dayNum: 5, label: 'Jum', date: '2026-06-20', shortDate: '20 Jun', baseTemp: 28.9, baseHumid: 64 },
  { dayNum: 6, label: 'Sab', date: '2026-06-21', shortDate: '21 Jun', baseTemp: 27.5, baseHumid: 68 },
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

      {/* Summary Card */}
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
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginRight: 8,
    alignItems: 'center',
    minWidth: 90,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  dayBtnActive: {
    backgroundColor: '#2d9e6b',
  },
  dayBtnNum: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#2d5a3d',
    marginBottom: 2,
  },
  dayBtnLabel: {
    fontSize: 10,
    color: '#94a3b8',
  },
  dayBtnTextActive: {
    color: '#ffffff',
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