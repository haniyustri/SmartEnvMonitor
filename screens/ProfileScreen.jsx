import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';

// ✅ Import auth langsung dari config untuk dipasang listener-nya
import { auth } from '../services/firebaseConfig'; // Sesuaikan folder path ini dengan strukturmu
import { logoutUser } from '../services/firebaseService';

export default function ProfileScreen({ navigation }) {
  const [userData, setUserData] = useState({
    name: 'Memuat...',
    email: 'Memuat...',
    initial: '-'
  });

  useEffect(() => {
    // ✅ MENGGUNAKAN LISTENER AGAR SELALU UPDATE SAAT STATE AUTH SIAP
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const displayName = user.displayName || user.email.split('@')[0];
        setUserData({
          name: displayName,
          email: user.email,
          initial: displayName.charAt(0).toUpperCase()
        });
      } else {
        // Jika tidak terdeteksi login, langsung tendang ke halaman Login
        navigation.replace('Login');
      }
    });

    // Bersihkan listener saat komponen tidak dipakai agar aplikasi tidak berat
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await logoutUser();
      navigation.replace('Login');
    } catch (error) {
      Alert.alert('Gagal Keluar', 'Terjadi kesalahan saat mencoba keluar dari akun.');
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Avatar Header */}
      <View style={styles.headerCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>{userData.initial}</Text>
        </View>
        <Text style={styles.name}>{userData.name}</Text>
        <Text style={styles.email}>{userData.email}</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>🎓 Mahasiswa PPNS</Text>
        </View>
      </View>

      {/* Info Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Informasi Akun</Text>
        {[
          { label: '🏫 Institusi', value: 'Politeknik Perkapalan Negeri Surabaya' },
          { label: '📚 Program Studi', value: 'D4 Teknik Otomasi' },
          { label: '📱 Aplikasi', value: 'SmartEnv Monitor' },
          { label: '📡 Protokol', value: 'WebSocket (WiFi)' },
        ].map((item, index, arr) => (
          <View key={index}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>{item.label}</Text>
              <Text style={styles.infoValue}>{item.value}</Text>
            </View>
            {index < arr.length - 1 && <View style={styles.divider} />}
          </View>
        ))}
      </View>

      {/* Device Card */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Perangkat Terhubung</Text>
        <View style={styles.deviceRow}>
          <View style={styles.deviceIcon}>
            <Text style={{ fontSize: 24 }}>🔌</Text>
          </View>
          <View>
            <Text style={styles.deviceName}>ESP32 + DHT22</Text>
            <Text style={styles.deviceStatus}>● Menunggu koneksi...</Text>
          </View>
        </View>
      </View>

      {/* Logout */}
      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Text style={styles.logoutText}>🚪 Keluar dari Akun</Text>
      </TouchableOpacity>

      <View style={{ height: 24 }} />
    </ScrollView>
  );
}

// ... Sisa kode styles kamu biarkan tetap sama seperti awal ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f0faf4', padding: 16 },
  headerCard: { backgroundColor: '#2d9e6b', borderRadius: 20, padding: 24, alignItems: 'center', marginBottom: 16, shadowColor: '#2d9e6b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 6 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 6, elevation: 3 },
  avatarText: { fontSize: 36, fontWeight: 'bold', color: '#2d9e6b' },
  name: { color: '#ffffff', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  email: { color: '#c8f0dc', fontSize: 13, marginBottom: 10 },
  badge: { backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 4 },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  card: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8, elevation: 3 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1a5c3a', marginBottom: 14 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  infoLabel: { color: '#6c8f7a', fontSize: 13, flex: 1 },
  infoValue: { color: '#1a5c3a', fontSize: 13, fontWeight: '600', flex: 1.5, textAlign: 'right' },
  divider: { height: 1, backgroundColor: '#f0faf4' },
  deviceRow: { flexDirection: 'row', alignItems: 'center' },
  deviceIcon: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#f0faf4', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  deviceName: { color: '#1a5c3a', fontWeight: 'bold', fontSize: 14, marginBottom: 4 },
  deviceStatus: { color: '#e8805a', fontSize: 12 },
  logoutBtn: { backgroundColor: '#fff', borderRadius: 14, padding: 16, alignItems: 'center', borderWidth: 1.5, borderColor: '#ffcccc', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  logoutText: { color: '#cc3333', fontWeight: 'bold', fontSize: 15 },
});