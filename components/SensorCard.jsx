import { View, Text, StyleSheet } from 'react-native';

export default function SensorCard({ icon, label, value, unit, color, bg }) {
  return (
    <View style={[styles.card, { backgroundColor: bg || '#fff' }]}>
      <View style={[styles.iconCircle, { backgroundColor: color + '22' }]}>
        <Text style={styles.icon}>{icon}</Text>
      </View>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color }]}>{value}</Text>
        <Text style={[styles.unit, { color }]}>{unit}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 4,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  icon: {
    fontSize: 26,
  },
  label: {
    fontSize: 12,
    color: '#6c8f7a',
    fontWeight: '600',
    marginBottom: 8,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  value: {
    fontSize: 32,
    fontWeight: 'bold',
  },
  unit: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    marginLeft: 2,
  },
});