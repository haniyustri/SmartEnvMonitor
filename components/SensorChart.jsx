import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width - 64;

export default function SensorChart({ data, label, color, unit }) {
  const chartData = {
    labels: data.map((_, i) => {
      const now = new Date();
      now.setMinutes(now.getMinutes() - (data.length - 1 - i) * 15);
      return `${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    }),
    datasets: [{ data: data, strokeWidth: 2 }],
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>{label} ({unit})</Text>
      <LineChart
        data={chartData}
        width={screenWidth}
        height={160}
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#f0faf4',
          decimalPlaces: 1,
          color: (opacity = 1) => color + Math.round(opacity * 255).toString(16).padStart(2, '0'),
          labelColor: () => '#6c8f7a',
          propsForDots: {
            r: '4',
            strokeWidth: '2',
            stroke: color,
          },
          propsForBackgroundLines: {
            stroke: '#e8f5ee',
          },
        }}
        bezier
        style={styles.chart}
        withInnerLines={true}
        withOuterLines={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
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
  title: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#2d5a3d',
    marginBottom: 10,
  },
  chart: {
    borderRadius: 12,
    marginLeft: -16,
  },
});