const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'pemprov_sumsel'
});

db.connect((err) => {
    if (err) {
        console.error('Error Koneksi Database:', err);
    } else {
        console.log('Database Terkoneksi (Config)!');
    }
});

module.exports = db;