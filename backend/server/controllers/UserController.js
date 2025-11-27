const User = require('../models/UserModel');
const bcrypt = require('bcryptjs');

// 1. Controller Lihat Semua User
const getUsers = (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) {
            res.send(err);
        } else {
            res.json(results);
        }
    });
}

// 2. Controller Ambil User Berdasarkan ID (BARU: Untuk Halaman Edit)
const getUserByIdController = (req, res) => {
    const userId = req.params.id; // Ambil ID dari URL parameter

    User.getUserById(userId, (err, result) => {
        if (err) {
            res.status(500).send(err);
        } else if (!result) {
            res.status(404).json({ message: "User tidak ditemukan." });
        } else {
            res.json(result);
        }
    });
}


// 2. Controller Register
const registerUser = (req, res) => {
    const data = req.body;

    // 1. Validasi Input (Pastikan hak_akses juga dicek jika wajib)
    if (!data.email || !data.nama_pengguna || !data.kata_sandi || !data.hak_akses) {
        return res.status(400).json({ message: "Data tidak lengkap (termasuk hak akses)" });
    }

    // 2. Hash Password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.kata_sandi, salt);
    
    // 3. Siapkan object data agar aman (Sanitasi manual)
    // Jangan langsung pakai req.body mentah untuk menghindari data sampah masuk
    const safeData = {
        nama_lengkap: data.nama_lengkap,
        alamat: data.alamat,
        telepon_wa: data.telepon_wa,
        email: data.email,
        hak_akses: data.hak_akses, // <--- TAMBAHAN PENTING
        instansi: data.instansi,
        nama_pengguna: data.nama_pengguna,
        kata_sandi: hash,
        created_by: data.created_by || 'Self Register'
    };

    User.insertUser(safeData, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else {
            res.json({
                message: "Registrasi Berhasil",
                userId: results
            });
        }
    });
}

// 4. Controller Update User (BARU: Untuk Halaman Edit)
const updateUser = (req, res) => {
    const userId = req.params.id;
    const data = req.body;
    let dataToUpdate = { ...data }; // Salin data body

    // 1. Cek dan Hash Password jika ada di payload
    if (dataToUpdate.kata_sandi) {
        if (dataToUpdate.kata_sandi.length < 6) {
             return res.status(400).json({ message: "Kata sandi minimal 6 karakter." });
        }
        const salt = bcrypt.genSaltSync(10);
        dataToUpdate.kata_sandi = bcrypt.hashSync(dataToUpdate.kata_sandi, salt);
    } 
    
    // 2. Validasi input penting (email, nama_lengkap, hak_akses, dll)
    if (!dataToUpdate.email || !dataToUpdate.nama_lengkap || !dataToUpdate.hak_akses) {
         return res.status(400).json({ message: "Nama lengkap, Email, dan Hak Akses wajib diisi." });
    }

    // 3. Eksekusi Update
    User.updateUser(userId, dataToUpdate, (err, results) => {
        if (err) {
            // Error 500 jika ada masalah DB (misal: duplicate email saat update)
            res.status(500).json({ message: "Gagal memperbarui data user." });
        } else if (results.affectedRows === 0) {
            // Jika ID tidak ditemukan
            res.status(404).json({ message: "User tidak ditemukan untuk diperbarui." });
        }
         else {
            res.json({ message: "Data user berhasil diperbarui" });
        }
    });
}


// Controller Delete User
const deleteUser = (req, res) => {
    const userId = req.params.id; // Ambil ID dari URL parameter

    User.deleteUser(userId, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else if (results.affectedRows === 0) {
            // Jika tidak ada baris yang terpengaruh, berarti ID tidak ditemukan
            res.status(404).json({ message: "User tidak ditemukan untuk dihapus." });
        } else {
            res.json({ message: "User berhasil dihapus" }); // Respon sukses 200 OK
        }
    });
}

// 3. Controller Login
const loginUser = (req, res) => {
    const { nama_pengguna, kata_sandi } = req.body;

    User.getUserByUsername(nama_pengguna, (err, user) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        const isPasswordValid = bcrypt.compareSync(kata_sandi, user.kata_sandi);
        if (!isPasswordValid) return res.status(401).json({ message: "Password Salah!" });

        const { kata_sandi: pass, ...userInfo } = user;
        
        // Response sekarang mengandung hak_akses
        res.json({
            message: "Login Berhasil",
            user: userInfo // Pastikan di database field 'hak_akses' ter-select
        });
    });
}

module.exports = {
    getUsers,
    getUserByIdController,
    registerUser,
    updateUser,
    loginUser,
    deleteUser
};