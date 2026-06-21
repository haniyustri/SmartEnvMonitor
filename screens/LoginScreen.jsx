import { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, KeyboardAvoidingView,
  Platform, ScrollView
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Email dan password wajib diisi!');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      navigation.replace('Main');
    }, 1000);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Logo Area */}
        <View style={styles.logoArea}>
          <View style={styles.logoCircle}>
            <Text style={styles.logoEmoji}>🌿</Text>
          </View>
          <Text style={styles.appName}>SmartEnv Monitor</Text>
          <Text style={styles.tagline}>Pantau lingkunganmu secara realtime</Text>
        </View>

        {/* Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Selamat Datang 👋</Text>
          <Text style={styles.cardSubtitle}>Masuk untuk melanjutkan</Text>

          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>⚠️ {error}</Text>
            </View>
          ) : null}

          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="contoh@email.com"
            placeholderTextColor="#adb5bd"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholder="Masukkan password"
            placeholderTextColor="#adb5bd"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" />
              : <Text style={styles.buttonText}>Masuk</Text>
            }
          </TouchableOpacity>
        </View>

        <Text style={styles.footer}>Smart Environment Monitor © 2026</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0faf4',
  },
  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
  },
  logoArea: {
    alignItems: 'center',
    marginBottom: 32,
  },
  logoCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#2d9e6b',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#2d9e6b',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  logoEmoji: {
    fontSize: 40,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a5c3a',
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    color: '#6c8f7a',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 5,
    marginBottom: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a5c3a',
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: '#6c8f7a',
    marginBottom: 24,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#2d5a3d',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#f8fffe',
    borderWidth: 1.5,
    borderColor: '#c8e6d4',
    borderRadius: 12,
    padding: 14,
    fontSize: 14,
    color: '#1a5c3a',
    marginBottom: 16,
  },
  button: {
    backgroundColor: '#2d9e6b',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2d9e6b',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorBox: {
    backgroundColor: '#fff0f0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ffcccc',
  },
  errorText: {
    color: '#cc3333',
    fontSize: 13,
  },
  footer: {
    textAlign: 'center',
    color: '#adb5bd',
    fontSize: 12,
  },
});