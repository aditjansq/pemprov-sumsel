import React, { useState } from 'react';
import { UserCircle, Lock, Eye, EyeOff, AlertCircle, Wheat } from 'lucide-react';

// --- DATA SEED (Simulasi Database) ---
const SEED_ACCOUNT = {
  username: 'admin',
  email: 'admin@sumsel.go.id',
  password: '123'
};

export default function App() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setError(''); 
    setIsLoading(true);

    // Simulasi request network (delay 800ms)
    setTimeout(() => {
      if (username === SEED_ACCOUNT.username && password === SEED_ACCOUNT.password) {
        setIsLoading(false);
        // Di sini Anda bisa menambahkan logika redirect atau simpan token
        alert(`Login Berhasil!\nSelamat datang, ${username}`);
      } else {
        setIsLoading(false);
        setError('Username atau kata sandi salah!');
      }
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4 font-sans text-gray-800">
      
      {/* Container Utama */}
      <div className="relative z-10 w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* Header: Logo & Judul */}
        <div className="pt-12 pb-6 px-8 flex flex-col items-center text-center">
          <div className="w-24 h-auto mb-4 flex items-center justify-center relative">
            {/* Logo Image dengan Fallback Icon */}
            <img 
              src="src/assets/logo-sumsel.png" 
              alt="Logo Sumsel" 
              onError={(e) => {
                e.target.style.display='none'; 
                // Tampilkan icon fallback jika gambar error/tidak ditemukan
                if (e.target.nextSibling) e.target.nextSibling.style.display='block';
              }}
              className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
            />
            {/* Fallback Icon (Hidden by default, shown via JS on error) */}
            <Wheat size={64} className="text-green-600 hidden animate-pulse" style={{display: 'none'}} />
            {/* Jika tidak ada gambar sama sekali di preview, kita paksa tampilkan icon */}
             <Wheat size={64} className="text-green-600 absolute inset-0 m-auto -z-10 opacity-20" /> 
          </div>

          <h1 className="text-xl md:text-1xl font-extrabold text-gray-800 leading-snug uppercase tracking-wide">
            Telusur Komoditas Unggul
            <span className="block text-green-600 mt-1">Sumatera Selatan</span>
          </h1>
          
          <p className="mt-2 text-sm text-gray-500 font-medium">Silakan masuk untuk melanjutkan</p>
        </div>

        {/* Alert Error */}
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
                tabIndex="-1"
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
      </div>

      {/* Footer Copyright */}
      <div className="absolute bottom-6 text-center w-full text-gray-400 text-xs">
        &copy; 2025 Pemerintah Provinsi Sumatera Selatan. Hak Cipta Dilindungi.
      </div>
    </div>
  );
}