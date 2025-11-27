const db = require('../config/database');

// Fungsi ambil semua user
const getAllUsers = (result) => {
    db.query("SELECT id, nama_lengkap, email, instansi, nama_pengguna, alamat, telepon_wa, hak_akses FROM pengguna", (err, results) => {
        if(err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results);
        }
    });
}

// Fungsi cari user by username (untuk login)
const getUserByUsername = (username, result) => {
    db.query("SELECT * FROM pengguna WHERE nama_pengguna = ?", [username], (err, results) => {
        if(err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results[0]); // Mengembalikan 1 data saja
        }
    });
}

// Fungsi tambah user baru
const insertUser = (data, result) => {
    const query = `INSERT INTO pengguna SET ?`; // Cara singkat insert object
    db.query(query, data, (err, results) => {
        if(err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results.insertId);
        }
    });
}

// Fungsi ambil user berdasarkan ID (Dibutuhkan oleh EditPengguna.jsx untuk memuat data lama)
const getUserById = (id, result) => {
    db.query("SELECT id, nama_lengkap, email, instansi, nama_pengguna, alamat, telepon_wa, hak_akses FROM pengguna WHERE id = ?", [id], (err, results) => {
        if(err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results[0]); // Mengembalikan 1 data saja
        }
    });
}


// Fungsi update user berdasarkan ID (Dibutuhkan oleh EditPengguna.jsx saat submit)
const updateUser = (id, data, result) => {
    // MySQL query menggunakan SET ? WHERE id = ?
    // Ini mengasumsikan data yang dikirimkan sudah difilter di frontend (misal: password kosong dihapus)
    db.query("UPDATE pengguna SET ? WHERE id = ?", [data, id], (err, results) => {
        if(err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results);
        }
    });
}

// Fungsi Hapus user berdasarkan ID
const deleteUser = (id, result) => {
    db.query("DELETE FROM pengguna WHERE id = ?", [id], (err, results) => {
        if(err) {
            console.log(err);
            result(err, null);
        } else {
            result(null, results);
        }
    });
}

module.exports = {
    getAllUsers,
    getUserByUsername,
    insertUser,
    getUserById,
    updateUser,
    deleteUser
};