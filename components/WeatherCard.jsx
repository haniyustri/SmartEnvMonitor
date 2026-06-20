import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';

export default function WeatherCard({ weatherData, loading }) {
  if (loading) {
    return (
      <View style={styles.card}>
        <ActivityIndicator color="#2d9e6b" />
      </View>
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View>
          <Text style={styles.city}>📍 Surabaya, ID</Text>
          <Text style={styles.desc}>
            {weatherData?.description || 'Cerah Berawan'}
          </Text>
        </View>
        <Text style={styles.bigIcon}>⛅</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.dataRow}>
        <View style={styles.dataItem}>
          <Text style={styles.dataIcon}>🌡️</Text>
          <Text style={styles.dataValue}>
            {weatherData?.temperature || '31'}°C
          </Text>
          <Text style={styles.dataLabel}>Suhu Luar</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.dataItem}>
          <Text style={styles.dataIcon}>💧</Text>
          <Text style={styles.dataValue}>
            {weatherData?.humidity || '72'}%
          </Text>
          <Text style={styles.dataLabel}>Kelembaban</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.dataItem}>
          <Text style={styles.dataIcon}>💨</Text>
          <Text style={styles.dataValue}>
            {weatherData?.wind || '12'} km/h
          </Text>
          <Text style={styles.dataLabel}>Angin</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 18,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  city: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#1a5c3a',
    marginBottom: 4,
  },
  desc: {
    fontSize: 13,
    color: '#6c8f7a',
    textTransform: 'capitalize',
  },
  bigIcon: {
    fontSize: 44,
  },
  divider: {
    height: 1,
    backgroundColor: '#e8f5ee',
    marginBottom: 14,
  },
  dataRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  dataItem: {
    alignItems: 'center',
    flex: 1,
  },
  dataIcon: {
    fontSize: 20,
    marginBottom: 4,
  },
  dataValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a5c3a',
    marginBottom: 2,
  },
  dataLabel: {
    fontSize: 11,
    color: '#6c8f7a',
  },
  separator: {
    width: 1,
    backgroundColor: '#e8f5ee',
  },
});