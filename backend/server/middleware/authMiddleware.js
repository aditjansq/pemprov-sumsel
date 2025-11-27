const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    // 1. Cek Header Authorization
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Ambil token setelah 'Bearer'

    if (!token) {
        return res.status(401).json({ message: "Akses Ditolak! Token tidak ditemukan." });
    }

    // 2. Verifikasi Token menggunakan process.env.JWT_SECRET
    // Pastikan file .env kamu sudah ada isinya
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: "Token tidak valid atau sudah kadaluarsa." });
        }

        req.user = user;
        next(); 
    });
};

// PERBAIKAN DISINI: Hapus JWT_SECRET dari exports
module.exports = { verifyToken };