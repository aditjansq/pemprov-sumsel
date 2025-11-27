import axios from 'axios';

// 1. Buat Instance Axios
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Sesuaikan port backend kamu
});

// 2. Pasang "Interceptor Request" (Otomatis tempel Token)
// Setiap kali aplikasi mau request ke backend, fungsi ini jalan duluan
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Tempel token di Header Authorization
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 3. Pasang "Interceptor Response" (Otomatis Logout jika Token Kadaluarsa)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika backend balas 401 (Unauthorized) atau 403 (Forbidden)
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      // Hapus data lokal karena token sudah tidak valid
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      
      // Paksa reload halaman agar mental ke Login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;