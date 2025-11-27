require('dotenv').config(); // Wajib paling atas untuk baca .env

const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); // <--- 1. Security Headers
const rateLimit = require('express-rate-limit'); // <--- 2. Anti Spam/DDoS

const UserRoute = require('./routes/UserRoute');

const app = express();
// Gunakan PORT dari .env, jika tidak ada pakai 5000
const PORT = process.env.PORT || 5000; 

// ==========================================
// MIDDLEWARE KEAMANAN (WAJIB UNTUK PEMERINTAH)
// ==========================================

// 1. Helmet: Menyembunyikan info server & mengamankan header HTTP
// (Supaya hacker tidak tahu kamu pakai ExpressJS)
app.use(helmet());

// 2. Rate Limiting: Mencegah Brute Force / Spam
// Membatasi 1 IP hanya boleh request 100x dalam 15 menit
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 menit
    max: 100, // Limit setiap IP ke 100 request per windowMs
    standardHeaders: true, // Return rate limit info di header `RateLimit-*`
    legacyHeaders: false, // Disable header `X-RateLimit-*`
    message: {
        message: "Terlalu banyak permintaan dari IP ini, silakan coba lagi setelah 15 menit."
    }
});

// Terapkan limiter hanya ke jalur API
app.use('/api', limiter);

// ==========================================
// MIDDLEWARE STANDAR
// ==========================================

app.use(cors()); // Mengizinkan Frontend mengakses Backend
app.use(express.json()); // Supaya bisa baca JSON dari body request

// ==========================================
// ROUTES
// ==========================================

// Prefix '/api' agar URL menjadi: http://localhost:5000/api/pengguna
app.use('/api', UserRoute); 

// ==========================================
// JALANKAN SERVER
// ==========================================

app.listen(PORT, () => {
    console.log(`SERVER RUNNING on PORT ${PORT}`);
});