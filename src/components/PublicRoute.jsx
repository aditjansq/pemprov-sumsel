import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicRoute = () => {
  // 1. Cek apakah ada data user di LocalStorage
  const user = localStorage.getItem('user');

  // 2. Jika user SUDAH LOGIN (user ada)
  if (user) {
    // Redirect otomatis ke dashboard, mereka tidak boleh akses halaman login lagi
    return <Navigate to="/dashboard" replace />;
  }

  // 3. Jika BELUM LOGIN (user kosong), izinkan akses (render Outlet/Halaman Login)
  return <Outlet />;
};

export default PublicRoute;