import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    // 1. Background Halaman (Abu-abu muda)
    // Gunanya supaya Card Putih di tengah terlihat 'pop-out' / kontras
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans text-gray-800">
      
      {/* 2. SATU CARD UTAMA (Wrapper) */}
      {/* Semua konten (Logo, Form, dll) akan masuk ke dalam kotak ini */}
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden relative z-10">
        
        {/* Tempat konten (Login.jsx) dirender */}
        {children || <Outlet />} 
        
      </div>

      {/* Footer Copyright (Tetap di luar card agar desain tidak kaku) */}
      <div className="absolute bottom-6 text-center w-full text-gray-400 text-xs">
        &copy; 2025 Pemerintah Provinsi Sumatera Selatan.
      </div>
    </div>
  );
};

export default AuthLayout;