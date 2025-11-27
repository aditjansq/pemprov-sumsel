import React from 'react';
import { Wheat } from 'lucide-react';
// import logoSumsel from '../../assets/logo-sumsel.png'; // Sesuaikan path

const AuthHeader = () => {
  return (
    <div className="pt-12 pb-6 px-8 flex flex-col items-center text-center">
      <div className="w-24 h-auto mb-4 flex items-center justify-center relative">
        <img 
          src="/src/assets/logo-sumsel.png" // Pastikan path asset benar
          alt="Logo Sumsel" 
          onError={(e) => {
             e.target.style.display='none'; 
             if (e.target.nextSibling) e.target.nextSibling.style.display='block';
          }}
          className="w-full h-full object-contain hover:scale-105 transition-transform duration-300" 
        />
        {/* Fallback Icon */}
        <Wheat size={64} className="text-green-600 hidden animate-pulse" style={{display: 'none'}} />
      </div>

      <h1 className="text-xl md:text-1xl font-extrabold text-gray-800 leading-snug uppercase tracking-wide">
        Telusur Komoditas Unggul
        <span className="block text-green-600 mt-1">Sumatera Selatan</span>
      </h1>
      
      <p className="mt-2 text-sm text-gray-500 font-medium">Silakan masuk untuk melanjutkan</p>
    </div>
  );
};

export default AuthHeader;