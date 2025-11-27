const User = require('../models/UserModel');
const Log = require('../models/LogModel'); // Pastikan LogModel ada
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

// 2. Controller Ambil User Berdasarkan ID
const getUserByIdController = (req, res) => {
    const userId = req.params.id;

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

// 3. Controller Register
const registerUser = (req, res) => {
    const data = req.body;

    // Validasi Input
    if (!data.email || !data.nama_pengguna || !data.kata_sandi || !data.hak_akses) {
        return res.status(400).json({ message: "Data tidak lengkap (termasuk hak akses)" });
    }

    // Hash Password
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(data.kata_sandi, salt);
    
    // Siapkan object data
    const safeData = {
        nama_lengkap: data.nama_lengkap,
        alamat: data.alamat,
        telepon_wa: data.telepon_wa,
        email: data.email,
        hak_akses: data.hak_akses,
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

// 4. Controller Update User
const updateUser = (req, res) => {
    const userId = req.params.id;
    const data = req.body;
    let dataToUpdate = { ...data };

    // Cek dan Hash Password jika ada di payload
    if (dataToUpdate.kata_sandi) {
        if (dataToUpdate.kata_sandi.length < 6) {
             return res.status(400).json({ message: "Kata sandi minimal 6 karakter." });
        }
        const salt = bcrypt.genSaltSync(10);
        dataToUpdate.kata_sandi = bcrypt.hashSync(dataToUpdate.kata_sandi, salt);
    } 
    
    // Validasi input penting
    if (!dataToUpdate.email || !dataToUpdate.nama_lengkap || !dataToUpdate.hak_akses) {
         return res.status(400).json({ message: "Nama lengkap, Email, dan Hak Akses wajib diisi." });
    }

    // Eksekusi Update
    User.updateUser(userId, dataToUpdate, (err, results) => {
        if (err) {
            res.status(500).json({ message: "Gagal memperbarui data user." });
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: "User tidak ditemukan untuk diperbarui." });
        } else {
            res.json({ message: "Data user berhasil diperbarui" });
        }
    });
}


// 5. Controller Delete User (DIPERBAIKI)
const deleteUser = (req, res) => {
    const userId = req.params.id;

    // --- PERBAIKAN: DEFINISIKAN VARIABLE INI DULU ---
    // Mengambil ID user yang login dari token (req.user diset oleh middleware verifyToken)
    const actorId = req.user ? req.user.id : null; 
    const ipAddress = req.ip || req.connection.remoteAddress;

    User.deleteUser(userId, (err, results) => {
        if (err) {
            res.status(500).send(err);
        } else if (results.affectedRows === 0) {
            res.status(404).json({ message: "User tidak ditemukan untuk dihapus." });
        } else {
            // Panggil Log Model
            Log.insertLog({
                user_id: actorId,      // Sekarang actorId sudah dikenali
                action: 'DELETE',
                description: `Menghapus Pengguna dengan ID ${userId}`,
                ip_address: ipAddress  // Sekarang ipAddress sudah dikenali
            });
            res.json({ message: "User berhasil dihapus" });
        }
    });
}

// 6. Controller Login
const loginUser = (req, res) => {
    const { nama_pengguna, kata_sandi } = req.body;

    User.getUserByUsername(nama_pengguna, (err, user) => {
        if (err) return res.status(500).send(err);
        if (!user) return res.status(404).json({ message: "User tidak ditemukan" });

        const isPasswordValid = bcrypt.compareSync(kata_sandi, user.kata_sandi);
        if (!isPasswordValid) return res.status(401).json({ message: "Password Salah!" });

        const { kata_sandi: pass, ...userInfo } = user;
        
        const tokenSecret = process.env.JWT_SECRET || 'kunci_cadangan_jika_env_gagal';
        
        const token = jwt.sign(
            { 
                id: user.id, 
                username: user.nama_pengguna, 
                role: user.hak_akses 
            }, 
            tokenSecret, 
            { expiresIn: '24h' }
        );

        res.json({
            message: "Login Berhasil",
            user: userInfo,
            token: token
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