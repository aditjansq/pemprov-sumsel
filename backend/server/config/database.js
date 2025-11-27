const mysql = require('mysql2');

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    
    // --- BAGIAN INI YANG PENTING ---
    // Kode ini akan mencari variable 'DB_PORT' di Vercel (yang isinya 13781)
    // Jika tidak ketemu (misal di laptop), dia pakai 3306
    port: process.env.DB_PORT || 3306, 
    
    // Wajib tambah ini untuk Aiven (SSL)
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error('Error Koneksi Database:', err);
    } else {
        console.log('Database Terkoneksi!');
    }
});

module.exports = db;