import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios'; // Login pakai axios biasa saja (belum punya token)
import Swal from 'sweetalert2'; 
import { UserCircle, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';

// Import Layout & Header (Sesuaikan path jika beda)
import AuthLayout from '../../layouts/AuthLayout';
import AuthHeader from '../../components/AuthHeader';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(''); 
    setIsLoading(true);

    try {
      // 1. Request ke Backend
      const response = await axios.post('http://localhost:5000/api/login', {
        nama_pengguna: username,
        kata_sandi: password
      });

      // 2. Ambil data dari response backend
      // Backend mengirim: { message, user, token }
      // JANGAN PAKAI 'userData', tapi pakai 'user' sesuai dari backend
      const { user, token } = response.data; 

      // 3. Simpan ke LocalStorage
      localStorage.setItem('user', JSON.stringify(user));
      localStorage.setItem('token', token); // <--- Token Wajib Disimpan

      // 4. Tampilkan Alert Sukses
      await Swal.fire({
        icon: 'success',
        title: 'Login Berhasil!',
        // Perhatikan disini: kita pakai variabel 'user', BUKAN 'userData'
        text: `Selamat datang kembali, ${user.nama_lengkap || user.nama_pengguna}`,
        showConfirmButton: false,
        timer: 1500
      });

      // 5. Redirect ke Dashboard
      navigate('/dashboard'); 

    } catch (err) {
      console.error("Login Error:", err);
      
      // Handle Error Response
      const msg = err.response?.data?.message || "Terjadi kesalahan sistem";
      setError(msg);

      // Opsional: Jika mau popup error juga
      /*
      Swal.fire({
        icon: 'error',
        title: 'Gagal Masuk',
        text: msg
      });
      */

    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout>
      <AuthHeader />

      {/* Alert Error (Kotak Merah) */}
      {error && (
        <div className="mx-8 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600 text-sm animate-pulse">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Form Input */}
      <form onSubmit={handleLogin} className="px-8 pb-10 space-y-5">
        
        {/* Input Nama Pengguna */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700 ml-1">Nama Pengguna</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <UserCircle size={20} />
            </div>
            <input 
              type="text" 
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Masukkan username" 
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all outline-none text-gray-700 bg-gray-50 focus:bg-white placeholder-gray-400"
            />
          </div>
        </div>

        {/* Input Kata Sandi */}
        <div className="space-y-1.5">
          <label className="text-sm font-bold text-gray-700 ml-1">Kata Sandi</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <Lock size={20} />
            </div>
            <input 
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Masukkan kata sandi" 
              className="w-full pl-10 pr-12 py-3 rounded-lg border border-gray-300 focus:border-green-600 focus:ring-2 focus:ring-green-100 transition-all outline-none text-gray-700 bg-gray-50 focus:bg-white placeholder-gray-400"
            />
            <button 
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer focus:outline-none"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Tombol Masuk */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 text-white font-bold py-3.5 rounded-xl shadow-lg hover:shadow-green-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
              <span>Memproses...</span>
            </div>
          ) : (
            "Masuk"
          )}
        </button>

        {/* Link Bantuan */}
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            Lupa Kata Sandi? <a href="#" className="font-semibold text-green-600 hover:underline hover:text-green-700 decoration-2 underline-offset-2 transition-colors">Hubungi Admin</a>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;