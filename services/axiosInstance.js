/**
 * axiosInstance.js
 * Konfigurasi utama Axios untuk SmartEnvMonitor
 * Letakkan di: services/axiosInstance.js
 */

import axios from 'axios';

// =============================================
// BASE CONFIGURATION
// =============================================
const BASE_URL = 'https://api.openweathermap.org/data/2.5';
const TIMEOUT  = 10000; // 10 detik

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept':       'application/json',
  },
});

// =============================================
// REQUEST INTERCEPTOR
// Dijalankan SEBELUM request dikirim
// =============================================
axiosInstance.interceptors.request.use(
  (config) => {
    // Log request (hanya di development)
    if (__DEV__) {
      console.log(`[API REQUEST] ${config.method?.toUpperCase()} → ${config.baseURL}${config.url}`);
      console.log('[API PARAMS]', config.params);
    }
    return config;
  },
  (error) => {
    console.error('[API REQUEST ERROR]', error);
    return Promise.reject(error);
  }
);

// =============================================
// RESPONSE INTERCEPTOR
// Dijalankan SETELAH response diterima
// =============================================
axiosInstance.interceptors.response.use(
  (response) => {
    // Response sukses (status 2xx)
    if (__DEV__) {
      console.log(`[API RESPONSE] Status: ${response.status}`);
    }
    return response;
  },
  (error) => {
    // Response gagal → parsing error
    const parsedError = parseAxiosError(error);
    console.error('[API ERROR]', parsedError.message);
    return Promise.reject(parsedError);
  }
);

// =============================================
// FUNGSI PARSING ERROR
// Mengubah error Axios menjadi pesan yang mudah dipahami
// =============================================
export const parseAxiosError = (error) => {
  // 1. Tidak ada response sama sekali (network error / timeout)
  if (!error.response) {
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      return {
        type:       'TIMEOUT',
        message:    'Koneksi timeout. Periksa jaringan internetmu.',
        statusCode: null,
        original:   error,
      };
    }
    return {
      type:       'NETWORK_ERROR',
      message:    'Tidak dapat terhubung ke server. Periksa koneksi internet.',
      statusCode: null,
      original:   error,
    };
  }

  // 2. Ada response dari server dengan status error
  const { status, data } = error.response;
  const serverMessage    = data?.message || data?.error || null;

  const errorMap = {
    400: { type: 'BAD_REQUEST',       message: serverMessage || 'Permintaan tidak valid.' },
    401: { type: 'UNAUTHORIZED',      message: 'API Key tidak valid atau tidak ditemukan.' },
    403: { type: 'FORBIDDEN',         message: 'Akses ditolak. Periksa izin API Key.' },
    404: { type: 'NOT_FOUND',         message: serverMessage || 'Data tidak ditemukan.' },
    429: { type: 'RATE_LIMITED',      message: 'Terlalu banyak permintaan. Coba lagi sebentar.' },
    500: { type: 'SERVER_ERROR',      message: 'Server sedang bermasalah. Coba lagi nanti.' },
    503: { type: 'SERVICE_UNAVAIL',   message: 'Layanan tidak tersedia sementara.' },
  };

  const mapped = errorMap[status] || {
    type:    'UNKNOWN_ERROR',
    message: serverMessage || `Terjadi kesalahan (${status}).`,
  };

  return { ...mapped, statusCode: status, original: error };
};

export default axiosInstance;