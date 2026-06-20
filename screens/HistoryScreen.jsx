import { View, Text, StyleSheet, FlatList } from 'react-native';

const dummyHistory = [
  { id: '1', temperature: '28.5', humidity: '65.2', time: '13:00', date: 'Hari ini' },
  { id: '2', temperature: '29.1', humidity: '63.8', time: '12:45', date: 'Hari ini' },
  { id: '3', temperature: '27.8', humidity: '67.1', time: '12:30', date: 'Hari ini' },
  { id: '4', temperature: '28.0', humidity: '66.5', time: '12:15', date: 'Hari ini' },
  { id: '5', temperature: '29.3', humidity: '62.9', time: '12:00', date: 'Hari ini' },
];

export default function HistoryScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View style={styles.timeCol}>
        <Text style={styles.time}>{item.time}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
      <View style={styles.divider} />
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
      <View style={styles.headerCard}>
        <Text style={styles.headerTitle}>📋 Riwayat Data Sensor</Text>
        <Text style={styles.headerSub}>Data tersimpan dari ESP32</Text>
      </View>

      <FlatList
        data={dummyHistory}
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
  headerCard: {
    backgroundColor: '#2d9e6b',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#2d9e6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  headerSub: {
    color: '#c8f0dc',
    fontSize: 12,
  },
  item: {
    backgroundColor: '#ffffff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  timeCol: {
    alignItems: 'center',
    width: 60,
  },
  time: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a5c3a',
  },
  date: {
    fontSize: 10,
    color: '#6c8f7a',
    marginTop: 2,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: '#e8f5ee',
    marginHorizontal: 14,
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
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  chipIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  chipValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#e8805a',
  },
});