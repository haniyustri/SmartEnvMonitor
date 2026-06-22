// ✅ IMPORT db DAN auth LANGSUNG DARI CONFIG YANG SAMA
import { db, auth } from './firebaseConfig'; 
import { 
  collection, 
  addDoc, 
  serverTimestamp, 
  query, 
  orderBy, 
  limit, 
  getDocs, 
  where, 
  and, 
  Timestamp 
} from 'firebase/firestore';

// ✅ Hanya import fungsi utility signOut saja dari library
import { signOut } from 'firebase/auth';

const COLLECTION_NAME = 'dashboard_logs';

export const saveLoginLog = async (data) => {
  try {
    const dataLengkap = {
      ...data,
      waktuLogin: serverTimestamp(),
    };
    await addDoc(collection(db, "login_logs"), dataLengkap);
    console.log('[Firebase] Log login berhasil disimpan!');
  } catch (error) {
    console.error('[Firebase] Gagal simpan log login:', error);
  }
};

export const saveSensorData = async ({ suhu, kelembaban, kondisi, statusKoneksi }) => {
  try {
    await addDoc(collection(db, COLLECTION_NAME), {
      suhu,
      kelembaban,
      kondisi,
      statusKoneksi,
      waktu: serverTimestamp(),
    });
    console.log('[Firebase] Berhasil disimpan!');
  } catch (err) {
    console.error('[Firebase] Gagal simpan data:', err.message);
  }
};

export const fetchDashboardLogs = async (n = 10) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      orderBy('waktu', 'desc'),
      limit(n)
    );
    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[Firebase] Gagal mengambil log:', error);
    return [];
  }
};

export const fetchLogsByDate = async (dateStr) => {
  try {
    const start = new Date(dateStr + "T00:00:00");
    const end = new Date(dateStr + "T23:59:59");

    const q = query(
      collection(db, COLLECTION_NAME),
      and(
        where('waktu', '>=', Timestamp.fromDate(start)),
        where('waktu', '<=', Timestamp.fromDate(end))
      ),
      orderBy('waktu', 'desc')
    );

    const snap = await getDocs(q);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
  } catch (error) {
    console.error('[Firebase] Gagal ambil riwayat:', error);
    return [];
  }
};

// ==========================================
// ✅ FUNGSI AUTH DENGAN INSTANCE YANG BENAR
// ==========================================
export const logoutUser = async () => {
  try {
    // Menggunakan instance auth dari config
    await signOut(auth);
    console.log('[Firebase Auth] Berhasil logout!');
  } catch (error) {
    console.error('[Firebase Auth] Gagal logout:', error);
    throw error; 
  }
};